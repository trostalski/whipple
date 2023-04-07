from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import alembic.config
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError

from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import SessionLocal

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)


# initialize database
try:
    db = SessionLocal()
    db.execute(text("SELECT 1 FROM users"))
except (ProgrammingError ,Exception):
    alembic.config.main(argv=["revision", "--autogenerate", "-m", "'init'"])
    alembic.config.main(argv=["upgrade", "head"])
    db.execute(text("DELETE FROM alembic_version"))
    db.rollback()
    print("Database initialized")
    

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
