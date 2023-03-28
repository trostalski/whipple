import json
import logging
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, select
from sqlalchemy.exc import IntegrityError
from fhir.resources.bundle import Bundle
from fhir.resources.observation import Observation
from fhir.resources.condition import Condition

from app.logic import dataset
from app.schemas.dataset import DatasetIn
from app.models.resource import Resource
from app.models.reference import Reference
from app.models.condition_stats import ConditionStats
from app.models.condition_data import ConditionData
from app.models.observation_data import ObservationData
from app.models.observation_stats import ObservationStats

from .fhir_helper import (
    gather_references,
    get_value_and_unit_for_observation,
    get_date_for_resource,
    parse_patient_id,
)

logger = logging.getLogger(__name__)


def get_resource_by_id(
    db: Session, resource_id: int, workspace_id: int, raw: bool = False
):
    resource = (
        db.query(Resource)
        .filter(Resource.resource_id == resource_id)
        .filter(Resource.workspace_id == workspace_id)
        .first()
    )
    if resource and raw:
        resource = resource.raw
    return resource


def get_resources(
    db: Session,
    workspace_id: int,
    raw: bool = False,
    resource_types: list[str] = None,
    dataset_id: int = None,
    skip: int = 0,
    limit: int = 100,
):
    resources = db.query(Resource).order_by(Resource.resource_id.desc())
    if resource_types:
        resources = resources.filter(Resource.workspace_id == workspace_id).filter(
            Resource.resource_type.in_(resource_types)
        )
    if dataset_id:
        resources = resources.filter(Resource.workspace_id == workspace_id).filter(
            Resource.dataset_id == dataset_id
        )
    resources = resources.offset(skip).limit(limit).all()
    if resources and raw:
        resources = [resource.raw for resource in resources]
    return resources


def get_resources_by_dataset_id(db: Session, dataset_id: int):
    return db.query(Resource).filter(Resource.dataset_id == dataset_id).all()


def delete_resource(db: Session, resource: Resource) -> None:
    db.query(Reference).filter(
        and_(
            Reference.source_id == resource.resource_id,
            Reference.workspace_id == resource.workspace_id,
        )
    ).delete()
    db.delete(resource)
    db.commit()
    return resource


def update_condition_stats(
    db: Session, condition: dict, dataset_id: int, workspace_id: int
):
    condition = Condition(**condition)
    try:
        patient_id = condition.subject.reference
    except Exception as e:
        logging.error(e)
        return
    patient_id = parse_patient_id(patient_id)
    display = condition.code.coding[0].display
    code = condition.code.coding[0].code
    date = get_date_for_resource(condition.dict())
    db.add(
        ConditionData(
            workspace_id=workspace_id,
            dataset_id=dataset_id,
            display=display,
            code=code,
            patient_id=patient_id,
            date=date,
        )
    )
    db.commit()


def update_observation_stats(
    db: Session, observation: dict, dataset_id: int, workspace_id: int
):
    if "issued" in observation:
        del observation["issued"]  # TODO: problem with issued date
    observation = Observation(**observation)
    try:
        patient_id = observation.subject.reference
    except Exception as e:
        logging.error(e)
        return
    patient_id = parse_patient_id(patient_id)
    display = observation.code.coding[0].display
    code = observation.code.coding[0].code
    date = get_date_for_resource(observation.dict())
    value, unit = get_value_and_unit_for_observation(observation)
    if not value:
        return
    db.add(
        ObservationData(
            workspace_id=workspace_id,
            dataset_id=dataset_id,
            display=display,
            code=code,
            date=date,
            value=value,
            unit=unit,
            patient_id=patient_id,
        )
    )
    db.commit()


def remove_error_prone_date_fields(resource: dict):
    if "issued" in resource:
        del resource["issued"]  # TODO: problem with issued date
    if "meta" in resource:
        if "lastUpdated" in resource["meta"]:
            del resource["meta"]["lastUpdated"]
    return resource


def create_bundle_with_dataset(
    db: Session,
    bundle_in: Bundle,
    dataset_in: DatasetIn,
    workspace_id: int,
):
    db_dataset = dataset.create_dataset(db, dataset_in, workspace_id)
    bundle_entry = bundle_in.entry
    for entry in bundle_entry:
        fullurl = entry.fullUrl if entry.fullUrl else None
        resource = entry.resource
        raw = json.dumps(resource.dict(), default=str)
        raw = json.loads(raw)
        raw = remove_error_prone_date_fields(raw)
        resource_type: str = resource.resource_type
        if resource_type == "Condition":
            update_condition_stats(
                db=db,
                condition=raw,
                dataset_id=db_dataset.id,
                workspace_id=workspace_id,
            )
        elif resource_type == "Observation":
            update_observation_stats(
                db=db,
                observation=raw,
                dataset_id=db_dataset.id,
                workspace_id=workspace_id,
            )
        resource_id = resource.resource_type + "/" + resource.id  # -> Patient/123
        db_resource = Resource(
            resource_id=resource_id,
            resource_type=resource_type,
            id=resource.id,
            fullurl=fullurl,
            raw=raw,
            dataset_id=db_dataset.id,
            workspace_id=db_dataset.workspace_id,
        )
        reference_list = gather_references(resource.dict())  # no type assumptions
        for reference in reference_list:
            db_reference = Reference(
                source_id=resource_id,
                target_id=reference.reference,
                display=reference.display,
                workspace_id=db_dataset.workspace_id,
                dataset_id=db_dataset.id,
            )
            db.add(db_reference)
        try:
            db.add(db_resource)
            db.commit()
        except IntegrityError:
            db.rollback()
    dataset_size = (
        db.query(Resource).filter(Resource.dataset_id == db_dataset.id).count()
    )
    dataset_in.size = dataset_size
    dataset.update_dataset(db, db_dataset=db_dataset, dataset_in=dataset_in)


def get_reference_ids(db: Session, resource: Resource, workspace_id: int):
    reference_ids = []
    stmt = select(Reference).filter(
        and_(
            Reference.workspace_id == workspace_id,
            or_(
                Reference.target_id == resource.resource_id,
                Reference.target_id == resource.id,
                Reference.source_id == resource.resource_id,
            ),
        )
    )
    db_references = db.scalars(stmt).all()
    for ref in db_references:
        if ref.source_id == resource.resource_id:
            reference_ids.append(ref.target_id)
        else:
            reference_ids.append(ref.source_id)
    return reference_ids


def filter_db_resource_by_type(db_resources: list[Resource], resource_types: list[str]):
    return [
        resource
        for resource in db_resources
        if resource.resource_type in resource_types
    ]


def get_connections(
    db: Session,
    resource: Resource,
    resource_types: list[str] = None,
    workspace_id: int = None,
    include_edges: bool = False,
):
    reference_ids = get_reference_ids(
        db=db, resource=resource, workspace_id=workspace_id
    )
    # if we get connection for patient, we know that its always the target_id
    for_resource_type = resource.resource_type
    if for_resource_type == "Patient":
        db_resources = (
            db.query(Resource)
            .filter(
                and_(
                    Resource.workspace_id == workspace_id,
                    Resource.resource_id.in_(reference_ids),
                )
            )
            .all()
        )
    else:
        db_resources = (
            db.query(Resource)
            .filter(
                and_(
                    Resource.workspace_id == workspace_id,
                    or_(
                        Resource.resource_id.in_(reference_ids),
                        Resource.id.in_(reference_ids),
                    ),
                )
            )
            .all()
        )
    if resource_types is not None:
        db_resources = filter_db_resource_by_type(
            db_resources=db_resources, resource_types=resource_types
        )

    if include_edges:
        edges = build_edges_between_ids(
            db=db, reference_ids=reference_ids, workspace_id=workspace_id
        )

    connections = [resource.raw for resource in db_resources]

    if include_edges:
        return connections, edges
    else:
        return connections


def build_edges_between_ids(db: Session, reference_ids: list[str], workspace_id: int):
    edges = []
    reference_ids_without_type = [id.split("/")[-1] for id in reference_ids]
    stmt = select(Reference).filter(
        and_(
            Reference.workspace_id == workspace_id,
            Reference.source_id.in_(reference_ids),
            or_(
                Reference.target_id.in_(reference_ids),
                Reference.target_id.in_(reference_ids_without_type),
            ),
        )
    )
    db_edges = db.scalars(stmt).all()
    for db_edge in db_edges:
        source = db_edge.source_id.split("/")[-1]
        target = db_edge.target_id.split("/")[-1]
        edge = (source, target)
        edges.append(edge)
    edges = list(set(edges))
    return edges
