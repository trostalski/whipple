from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class ConditionData(Base):
    __tablename__ = "condition_data"
    id = Column(Integer, primary_key=True, index=True)
    display = Column(String, nullable=True)
    code = Column(
        String,
        index=True,
        nullable=False,
    )
    patient_id = Column(String, nullable=False)
    date = Column(String, nullable=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"))
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"))
