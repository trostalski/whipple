from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app import schemas, logic
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.dataset.DatasetOut])
def read_datasets(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve datasets.
    """
    datasets = logic.dataset.get_datasets(
        db, workspace_id=workspace_id, skip=skip, limit=limit
    )
    return datasets


@router.post("/", response_model=schemas.dataset.DatasetOut)
def create_dataset(
    *,
    db: Session = Depends(deps.get_db),
    input_dataset: schemas.dataset.DatasetIn,
    workspace_id: int,
) -> Any:
    """
    Create new dataset.
    """
    dataset, _ = logic.dataset.create_dataset(
        db, dataset_in=input_dataset, workspace_id=workspace_id
    )
    return dataset


@router.get("/{dataset_id}", response_model=schemas.dataset.DatasetOut)
def read_dataset(
    *,
    db: Session = Depends(deps.get_db),
    dataset_id: int,
) -> Any:
    """
    Get dataset by ID.
    """
    dataset = logic.dataset.get_dataset_by_id(db, dataset_id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    return dataset


@router.put("/{dataset_id}", response_model=schemas.dataset.DatasetOut)
def update_dataset(
    *,
    db: Session = Depends(deps.get_db),
    dataset_id: int,
    dataset_in: schemas.dataset.DatasetUpgrade,
) -> Any:
    """
    Update an dataset.
    """
    dataset = logic.dataset.get_dataset_by_id(db, dataset_id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    dataset = logic.dataset.update_dataset(
        db, db_dataset=dataset, dataset_in=dataset_in
    )
    return dataset


@router.delete("/{dataset_id}", response_model=schemas.dataset.DatasetOut)
def delete_dataset(
    *,
    db: Session = Depends(deps.get_db),
    dataset_id: int,
) -> Any:
    """
    Delete an dataset.
    """
    db_dataset = logic.dataset.get_dataset_by_id(db, dataset_id=dataset_id)
    if not db_dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    db_dataset = logic.dataset.delete_dataset(db, db_dataset=db_dataset)
    return db_dataset


@router.get("/{dataset_id}/resourceids")
def get_resource_ids(
    *,
    db: Session = Depends(deps.get_db),
    dataset_id: int,
    limit: int = 100,
    resourcetype: str = None,
) -> List[str]:
    """
    Get resource IDs of a dataset.
    """
    dataset = logic.dataset.get_dataset_by_id(db, dataset_id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    resource_ids = logic.dataset.get_resource_ids_by_dataset_id(
        db, dataset_id=dataset_id, limit=limit, resource_type=resourcetype
    )
    return resource_ids


@router.get("/{dataset_id}/distinct-observations")
def get_distinct_observations(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
    dataset_id: int,
) -> List[str]:
    """
    Get distinct observation displays for a dataset.
    """
    if dataset_id == -1:
        result = logic.dataset.get_distinct_observations_for_workspace(
            db, workspace_id=workspace_id
        )
    else:
        dataset = logic.dataset.get_dataset_by_id(db, dataset_id=dataset_id)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found.")
        result = logic.dataset.get_distinct_observations_for_dataset(
            db, dataset_id=dataset_id
        )
    return result
