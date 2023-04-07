from sqlalchemy import ARRAY, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class DashboardCard(Base):
    __tablename__ = "dashboard_cards"
    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )
    title = Column(String, nullable=False)
    info = Column(String, nullable=True, default="")
    subject = Column(String, nullable=False)
    targets = Column(ARRAY(String), nullable=False)
    content = Column(String, nullable=False)
    chart_type = Column(String, nullable=False)
    specimen = Column(String, nullable=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    workspace = relationship("Workspace", back_populates="dashboard_cards")
    created_at = Column(DateTime, server_default=func.now())
