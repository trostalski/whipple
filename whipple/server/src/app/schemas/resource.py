from pydantic import BaseModel, Json
from datetime import datetime


class ResourceOut(BaseModel):
    resource_id: str
    resource_type: str
    created_at: datetime
    raw: dict

    class Config:
        orm_mode = True
