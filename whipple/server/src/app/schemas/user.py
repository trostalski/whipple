from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class UserIn(BaseModel):
    username: str
    password: Optional[str]


class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        orm_mode = True
