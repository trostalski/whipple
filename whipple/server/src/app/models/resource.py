from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Resource(Base):
    __tablename__ = "resources"
    resource_id = Column(String, primary_key=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), primary_key=True)
    resource_type = Column(String, nullable=False)
    id = Column(String, nullable=False)
    raw = Column(JSONB, nullable=False)
    fullurl = Column(String, nullable=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    workspace = relationship("Workspace", back_populates="resources")
    dataset = relationship("Dataset", back_populates="resources")
    created_at = Column(DateTime, server_default=func.now())


Index(
    "resource_id_index",
    Resource.resource_id,
    Resource.workspace_id,
    unique=True,
)
