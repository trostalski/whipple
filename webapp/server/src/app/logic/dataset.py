from sqlalchemy.orm import Session
from sqlalchemy import and_
from retry import retry
from psycopg2.errors import UniqueViolation

from app.models.condition_data import ConditionData
from app.models.observation_data import ObservationData
from app.schemas.dataset import DatasetIn, DatasetOut
from app.models.dataset import Dataset
from app.models.reference import Reference
from app.models.resource import Resource


@retry(UniqueViolation, tries=10, delay=1)
def create_dataset(db: Session, dataset_in: DatasetIn, workspace_id: int):
    db_dataset = (
        db.query(Dataset)
        .filter(
            and_(
                Dataset.title == dataset_in.title,
                Dataset.workspace_id == workspace_id,
            )
        )
        .first()
    )
    if db_dataset:
        return db_dataset
    else:
        db_dataset = Dataset(
            title=dataset_in.title,
            description=dataset_in.description,
            workspace_id=workspace_id,
        )
        db.add(db_dataset)
        db.commit()
        db.refresh(db_dataset)
        return db_dataset


def get_dataset_by_id(db: Session, dataset_id: int):
    return db.get(Dataset, dataset_id)


def get_datasets(db: Session, workspace_id: int, skip: int = 0, limit: int = 100):
    datasets = (
        db.query(Dataset)
        .filter(Dataset.workspace_id == workspace_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return datasets


def update_dataset(db: Session, db_dataset: Dataset, dataset_in: DatasetIn):
    for key, value in dataset_in:
        if value is not None:
            setattr(db_dataset, key, value)
    db.add(db_dataset)
    db.commit()
    return db_dataset


def delete_dataset(db: Session, db_dataset: Dataset) -> None:
    db.delete(db_dataset)
    db.query(Reference).filter(Reference.dataset_id == db_dataset.id).delete()
    db.commit()
    return db_dataset


def get_resource_ids_by_dataset_id(
    db: Session, dataset_id: int, limit: int, resource_type: str = None
):
    if resource_type:
        resource_ids = (
            db.query(Resource.resource_id)
            .filter(Resource.dataset_id == dataset_id)
            .filter(Resource.resource_type == resource_type)
            .limit(limit)
            .all()
        )
    else:
        resource_ids = (
            db.query(Resource.resource_id)
            .filter(Resource.dataset_id == dataset_id)
            .limit(limit)
            .all()
        )
    resource_ids = [resource_id[0] for resource_id in resource_ids]
    return resource_ids


def get_distinct_observations_for_dataset(db: Session, dataset_id):
    result = (
        db.query(ObservationData.display)
        .filter(ObservationData.dataset_id == dataset_id)
        .distinct()
        .order_by(ObservationData.display)
        .all()
    )
    result = list(set([observation[0] for observation in result]))
    return result
