from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import alembic.config

from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import SessionLocal

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# create database tables if not exists
try:
    db = SessionLocal()
    db.execute("SELECT 1")
except Exception as e:
    print("Database tables not created yet, creating them now...")
    alembic.config.main(argv=["revision", "--autogenerate", "-m", "Initial migration"])
    alembic.config.main(argv=["upgrade", "head"])
    print("Database tables created")


# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
