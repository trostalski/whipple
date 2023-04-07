from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fhir.resources.bundle import Bundle

from app import schemas, logic
from app.api import deps

router = APIRouter()


@router.get("/")
def read_resources(
    *,
    db: Session = Depends(deps.get_db),
    resource_types: List[str] = Query(default=None),
    dataset_id: int = Query(default=None),
    workspace_id: int,
    skip: int = 0,
    limit: int = 100,
) -> List[dict]:
    """
    Retrieve resources.
    """
    resources = logic.resource.get_resources(
        db,
        raw=True,
        skip=skip,
        limit=limit,
        workspace_id=workspace_id,
        resource_types=resource_types,
        dataset_id=dataset_id,
    )
    return JSONResponse(status_code=200, content=resources)


@router.get("/{resource_type}/{resource_id}")
def read_resource(
    *,
    db: Session = Depends(deps.get_db),
    resource_type: str,
    resource_id: str,
    workspace_id: int,
) -> JSONResponse:
    """
    Get resource by ID.
    """
    resource_id = resource_type + "/" + resource_id
    resource = logic.resource.get_resource_by_id(
        db,
        resource_id=resource_id,
        workspace_id=workspace_id,
        raw=True,
    )
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found.")
    return JSONResponse(status_code=200, content=resource)


@router.get("/{resource_type}/{resource_id}/connections")
def get_connections(
    *,
    db: Session = Depends(deps.get_db),
    resource_type: str,
    resource_id: str,
    workspace_id: int,
    resource_types: List[str] = Query(default=None),
    include_edges: bool = Query(default=False),
) -> JSONResponse:
    """
    Get connceted resources through references.
    """
    resource_id = resource_type + "/" + resource_id
    resource = logic.resource.get_resource_by_id(
        db, resource_id=resource_id, workspace_id=workspace_id
    )

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found.")

    if include_edges:
        connections, edges = logic.resource.get_connections(
            db,
            resource=resource,
            workspace_id=workspace_id,
            resource_types=resource_types,
            include_edges=True,
        )
        return JSONResponse(
            status_code=200, content={"connections": connections, "edges": edges}
        )
    else:
        connections = logic.resource.get_connections(
            db,
            resource=resource,
            workspace_id=workspace_id,
            resource_types=resource_types,
        )
        return JSONResponse(status_code=200, content=connections)


@router.post("/bundle")
def create_bundle_with_dataset(
    *,
    db: Session = Depends(deps.get_db),
    bundle: dict,
    dataset: schemas.dataset.DatasetIn,
    workspace_id: int,
) -> JSONResponse:
    """
    Create new resource.
    """
    bundle = Bundle(**bundle)
    db_dataset = logic.dataset.try_create_dataset(
        db, dataset_in=dataset, workspace_id=workspace_id
    )
    if not db_dataset:
        raise HTTPException(
            status_code=404, detail="Error when trying to create the dataset."
        )
    logic.resource.create_bundle_with_dataset(
        db, bundle_in=bundle, dataset_in=dataset, workspace_id=workspace_id
    )
    return JSONResponse(status_code=201, content={"message": "Resources created."})


@router.delete("/{resource_type}/{resource_id}")
def delete_resource(
    *,
    db: Session = Depends(deps.get_db),
    resource_type: str,
    resource_id: str,
    workspace_id: int,
) -> JSONResponse:
    """
    Delete a resource.
    """
    resource_id = resource_type + "/" + resource_id
    db_resource = logic.resource.get_resource_by_id(
        db, resource_id=resource_id, workspace_id=workspace_id
    )
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found.")
    logic.resource.delete_resource(db, resource=db_resource)
    return JSONResponse(status_code=200, content={"message": "Resource deleted."})
