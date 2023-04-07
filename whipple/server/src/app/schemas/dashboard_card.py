from typing import Any, Optional
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

from app.schemas.observation_data import ObservationData


class ChartTypes(str, Enum):
    bar = "bar"
    line = "line"
    pie = "pie"
    boxplot = "boxplot"


class ResourceTypes(str, Enum):
    observation = "Observation"
    condition = "Condition"


class DashboardCardBase(BaseModel):
    title: str
    info: Optional[str] = ""
    subject: str
    targets: list[str]
    content: str
    chart_type: ChartTypes
    specimen: Optional[str] = None  # when resource type is Observation


class DashboardCardIn(DashboardCardBase):
    class Config:
        use_enum_values = True


class DashboardCardUpdate(DashboardCardBase):
    id: int
    created_at: datetime

    class Config:
        use_enum_values = True


class DashboardCardOut(DashboardCardBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class ChartJSDatasets(BaseModel):
    labels: Optional[list[str]]
    datasets: Optional[list[dict[str, Any]]]
    unit: Optional[str] = None


class DashboardConditionData:
    pass


class DashboardObservationData(ObservationData):
    pass
