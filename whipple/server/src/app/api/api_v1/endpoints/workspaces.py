from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, logic
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.workspace.WorkspaceOut)
def create_workspace(
    *,
    db: Session = Depends(deps.get_db),
    input_workspace: schemas.workspace.WorkspaceIn,
) -> Any:
    """
    Create new workspace.
    """
    workspace = logic.workspace.create_workspace(db, workspace=input_workspace)
    return workspace


@router.get("/", response_model=List[schemas.workspace.WorkspaceOut])
def read_workspaces(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve workspaces.
    """
    workspaces = logic.workspace.get_workspaces(db, skip=skip, limit=limit)
    return workspaces


@router.get("/{workspace_id}", response_model=schemas.workspace.WorkspaceOut)
def read_workspace(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
) -> Any:
    """
    Get workspace by ID.
    """
    workspace = logic.workspace.get_workspace_by_id(db, workspace_id=workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    return workspace


@router.get("/{workspace_id}/resourceids")
def get_resource_ids(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
    limit: int = 100,
    resourcetype: str = None,
) -> List[str]:
    """
    Get resource IDs of a dataset.
    """
    workspace = logic.workspace.get_workspace_by_id(db, workspace_id=workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    resource_ids = logic.workspace.get_resource_ids_by_workspace_id(
        db, workspace_id=workspace_id, limit=limit, resource_type=resourcetype
    )
    return resource_ids


@router.put("/{workspace_id}", response_model=schemas.workspace.WorkspaceOut)
def update_workspace(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
    workspace_in: schemas.workspace.WorkspaceIn,
) -> Any:
    """
    Update an workspace.
    """
    workspace = logic.workspace.get_workspace_by_id(db, workspace_id=workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    workspace = logic.workspace.update_workspace(
        db, db_workspace=workspace, workspace_in=workspace_in
    )
    return workspace


@router.delete("/{workspace_id}", response_model=schemas.workspace.WorkspaceOut)
def delete_workspace(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
) -> Any:
    """
    Delete an workspace.
    """
    db_workspace = logic.workspace.get_workspace_by_id(db, workspace_id=workspace_id)
    if not db_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    deleted_workspace = logic.workspace.delete_workspace(db, workspace=db_workspace)
    return deleted_workspace


@router.get("/{workspace_id}/distinct-observations")
def get_distinct_observations(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
) -> List[str]:
    """
    Get distinct observation displays for a dataset.
    """
    dataset = logic.workspace.get_workspace_by_id(db, workspace_id=workspace_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    result = logic.workspace.get_distinct_observations(db, workspace_id=workspace_id)
    return result
