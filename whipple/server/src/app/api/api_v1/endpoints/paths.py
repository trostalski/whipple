from fastapi import APIRouter, Depends, HTTPException


router = APIRouter()

# @router.get("/")
# def read_paths(
#     *,
#     db: Session = Depends(deps.get_db),
#     skip: int = 0,
#     limit: int = 100,
# ) -> List[dict]:
#     """
#     Retrieve paths.
#     """
#     paths = logic.path.get_paths(db, raw=True, skip=skip, limit=limit)
#     if not paths:
#         raise HTTPException(status_code=404, detail="No paths found.")
#     return paths