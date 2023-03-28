from sqlalchemy.orm import Session

from app.models.reference import Reference
from app.schemas.reference import ReferenceIn


def create_references(db: Session, reference_in: ReferenceIn):
    db_reference = Reference(
        source_id=reference_in.source_id,
        target_id=reference_in.target_id,
    )
    db.add(db_reference)
    db.commit()
    db.refresh(db_reference)
    return db_reference
