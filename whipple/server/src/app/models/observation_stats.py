from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class ObservationStats(Base):
    __tablename__ = "observation_stats"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(
        String,
        index=True,
        nullable=False,
    )
    mean = Column(Integer, nullable=False)
    std = Column(Integer, nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
