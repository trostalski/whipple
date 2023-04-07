from sqlalchemy import (
    Column,
    Integer,
    ForeignKeyConstraint,
    DateTime,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Reference(Base):
    __tablename__ = "references"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    display = Column(String, nullable=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"))
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=func.now())
    ForeignKeyConstraint(
        ["source_id", "workspace_id"],
        ["resources.resource_id", "resources.workspace_id"],
        ondelete="CASCADE",
    )
