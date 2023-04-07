from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True, default="New Workspace")
    datasets = relationship(
        "Dataset", back_populates="workspace", cascade="all, delete-orphan"
    )
    resources = relationship(
        "Resource", back_populates="workspace", cascade="all, delete-orphan"
    )
    dashboard_cards = relationship(
        "DashboardCard", back_populates="workspace", cascade="all, delete-orphan"
    )
    created_at = Column(DateTime, server_default=func.now())
