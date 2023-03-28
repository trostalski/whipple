from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


from app.db.base import Base


class BaseStructureDefinition(Base):
    __tablename__ = "base_structure_definitions"
    id = Column(Integer, primary_key=True, index=True)
    raw = Column(JSONB, nullable=False)
    resource_type = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    elements = relationship(
        "Element",
        back_populates="base_structure_definition",
        cascade="all, delete-orphan",
    )
