from sqlalchemy.orm import Session

from app.models.observation_data import ObservationData
from app.models.resource import Resource
from app.schemas.workspace import WorkspaceIn
from app.models.workspace import Workspace


def create_workspace(db: Session, workspace: WorkspaceIn):
    db_workspace = Workspace(title=workspace.title)
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace


def get_workspace_by_id(db: Session, workspace_id: int):
    return db.get(Workspace, workspace_id)


def get_workspaces(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Workspace).offset(skip).limit(limit).all()


def update_workspace(db: Session, db_workspace: Workspace, workspace_in: WorkspaceIn):
    db_workspace.title = workspace_in.title
    db.commit()
    return db_workspace


def delete_workspace(db: Session, workspace: Workspace) -> None:
    db.delete(workspace)
    db.commit()
    return workspace


def get_resource_ids_by_workspace_id(
    db: Session, workspace_id: int, limit: int, resource_type: str = None
):
    if resource_type:
        resource_ids = (
            db.query(Resource.resource_id)
            .filter(Resource.workspace_id == workspace_id)
            .filter(Resource.resource_type == resource_type)
            .limit(limit)
            .all()
        )
    else:
        resource_ids = (
            db.query(Resource.resource_id)
            .filter(Resource.workspace_id == workspace_id)
            .limit(limit)
            .all()
        )
    resource_ids = [resource_id[0] for resource_id in resource_ids]
    return resource_ids


def get_distinct_observations(db: Session, workspace_id: str):
    result = (
        db.query(ObservationData.display)
        .filter(ObservationData.workspace_id == workspace_id)
        .distinct()
        .order_by(ObservationData.display)
        .all()
    )
    result = list(set([observation[0] for observation in result]))
    if result is None:
        result = []
    return result
