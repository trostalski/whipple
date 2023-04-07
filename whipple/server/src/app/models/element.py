from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


from app.db.base import Base


class Element(Base):
    __tablename__ = "elements"
    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, index=True, nullable=False, unique=True)
    name = Column(String, nullable=False)
    short = Column(String, nullable=True)
    definition = Column(String, nullable=True)
    min = Column(Integer, nullable=True)
    max = Column(String, nullable=True)
    base_structure_definition_id = Column(
        Integer, ForeignKey("base_structure_definitions.id")
    )
    base_structure_definition = relationship(
        "BaseStructureDefinition", back_populates="elements"
    )
    created_at = Column(DateTime, server_default=func.now())
