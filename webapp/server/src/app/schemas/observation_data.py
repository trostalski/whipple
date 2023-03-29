from typing import Optional
from pydantic import BaseModel
from enum import Enum


class ValueTypes(str, Enum):
    numeric = "numeric"
    categorical = "categorical"


class ObservationData(BaseModel):
    value: str
    display: Optional[str] = None
    unit: Optional[str] = None
    date: Optional[str] = None
    value_type: Optional[str] = None
    patient_id: str
    dataset_id: int

    class Config:
        orm_mode = True
        use_enum_values = True
