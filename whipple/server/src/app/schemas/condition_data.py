from typing import Optional
from pydantic import BaseModel


class ConditionData(BaseModel):
    value: str
    display: Optional[str] = None
    code: Optional[str] = None
    date: Optional[str] = None
    patient_id: str
    dataset_id: int

    class Config:
        orm_mode = True
