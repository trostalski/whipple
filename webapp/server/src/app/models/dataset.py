from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.resource import Resource


class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True, unique=True, default="")
    description = Column(String, nullable=True, default="")
    size = Column(Integer, nullable=True, default=0)
    created_at = Column(DateTime, server_default=func.now())
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    workspace = relationship("Workspace", back_populates="datasets")
    resources = relationship(
        "Resource", back_populates="dataset", cascade="all, delete-orphan"
    )


Index(
    "dataset_title_index",
    Dataset.title,
    Dataset.workspace_id,
    unique=True,
)
