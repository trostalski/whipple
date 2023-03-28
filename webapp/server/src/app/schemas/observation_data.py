from typing import Optional
from pydantic import BaseModel


class ObservationData(BaseModel):
    value: str
    display: Optional[str] = None
    unit: Optional[str] = None
    date: Optional[str] = None
    patient_id: str
    dataset_id: int

    class Config:
        orm_mode = True
