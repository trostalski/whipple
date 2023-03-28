from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class ObservationData(Base):
    __tablename__ = "observation_data"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(
        String,
        index=True,
        nullable=False,
    )
    value = Column(String, nullable=False)
    display = Column(String, nullable=True)
    unit = Column(String, nullable=True)
    date = Column(String, nullable=True)
    patient_id = Column(String, nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"))
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"))
