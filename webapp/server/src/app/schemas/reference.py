from pydantic import BaseModel

class ReferenceIn(BaseModel):
    source_id: str
    target_id: str
