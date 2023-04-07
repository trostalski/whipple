from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class WorkspaceIn(BaseModel):
    title: Optional[str] = None


class WorkspaceOut(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        orm_mode = True
