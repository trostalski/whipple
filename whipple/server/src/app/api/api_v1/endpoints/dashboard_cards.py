from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

from app import schemas, logic
from app.api import deps


router = APIRouter()


@router.post("/", response_model=schemas.dashboard_card.DashboardCardOut)
def create_dashboard_cards(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
    input_dashboard_card: schemas.dashboard_card.DashboardCardIn,
) -> Any:
    logic.dashboard_card.create_dashboard_card(
        db=db,
        dashboard_card=input_dashboard_card,
        workspace_id=workspace_id,
    )
    return JSONResponse(
        status_code=201, content={"message": "Dashboard card created", "response": True}
    )


@router.get("/", response_model=List[schemas.dashboard_card.DashboardCardOut])
def read_dashboard_cards(
    *,
    db: Session = Depends(deps.get_db),
    workspace_id: int,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve dashboard cards.
    """
    dashboard_cards = logic.dashboard_card.get_dashboard_cards(
        db, workspace_id=workspace_id, skip=skip, limit=limit
    )
    return dashboard_cards


@router.get(
    "/{dashboard_card_id}/data", response_model=schemas.dashboard_card.ChartJSDatasets
)
def get_dashboard_card_data(
    *, db: Session = Depends(deps.get_db), workspace_id: int, dashboard_card_id: int
):
    """
    Get data for dashboard card.
    """
    dashboard_card = logic.dashboard_card.get_dashboard_card_by_id(
        db, dashboard_card_id=dashboard_card_id
    )
    if not dashboard_card:
        raise HTTPException(status_code=404, detail="Dashboard card not found.")
    result = logic.dashboard_card.get_dashboard_card_data(
        db, dashboard_card=dashboard_card
    )
    return result


@router.post(
    "/{dashboard_card_id}", response_model=schemas.dashboard_card.DashboardCardOut
)
def update_dashboard_card(
    *,
    db: Session = Depends(deps.get_db),
    dashboard_card_id: int,
    input_dashboard_card: schemas.dashboard_card.DashboardCardUpdate,
) -> Any:
    """
    Update dashboard card.
    """
    db_dashboard_card = logic.dashboard_card.get_dashboard_card_by_id(
        db, dashboard_card_id=dashboard_card_id
    )
    if not db_dashboard_card:
        raise HTTPException(status_code=404, detail="Dashboard card not found.")
    dashboard_card = logic.dashboard_card.update_dashboard_card(
        db=db,
        db_dashboard_card=db_dashboard_card,
        dashboard_card_in=input_dashboard_card,
    )
    return dashboard_card


@router.delete("/{dashboard_card_id}")
def delete_dashboard_card(
    *,
    db: Session = Depends(deps.get_db),
    dashboard_card_id: int,
    workspace_id: int,
) -> Any:
    """
    Delete dashboard card.
    """
    db_dashboard_card = logic.dashboard_card.get_dashboard_card_by_id(
        db, dashboard_card_id=dashboard_card_id
    )
    if not db_dashboard_card:
        raise HTTPException(status_code=404, detail="Dashboard card not found.")
    deleted_dashboard_card = logic.dashboard_card.delete_dashboard_card(
        db=db,
        dashboard_card=db_dashboard_card,
    )
    return deleted_dashboard_card
