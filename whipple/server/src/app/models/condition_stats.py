from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class ConditionStats(Base):
    __tablename__ = "condition_stats"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(
        String,
        index=True,
        nullable=False,
        unique=True,
    )
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    patient_count = Column(Integer, nullable=False, default=0)
    total_count = Column(Integer, nullable=False, default=0)
