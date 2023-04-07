from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    dashboard_cards,
    users,
    workspaces,
    datasets,
    resources,
)

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["workspaces"])
api_router.include_router(
    datasets.router, prefix="/workspaces/{workspace_id}/datasets", tags=["datasets"]
)
api_router.include_router(
    resources.router, prefix="/workspaces/{workspace_id}/resources", tags=["resources"]
)
api_router.include_router(
    dashboard_cards.router,
    prefix="/workspaces/{workspace_id}/dashboard_cards",
    tags=["dashboard_cards"],
)
