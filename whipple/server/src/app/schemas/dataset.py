from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class DatasetIn(BaseModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    size: Optional[int] = 0


class DatasetUpgrade(BaseModel):
    title: Optional[str]
    description: Optional[str]


class DatasetOut(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime
    size: Optional[int] = 0

    class Config:
        orm_mode = True
