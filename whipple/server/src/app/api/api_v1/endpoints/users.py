from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app import schemas, logic
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.user.UserOut])
def read_users(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve users.
    """
    users = logic.user.get_users(db, skip=skip, limit=limit)
    if not users:
        raise HTTPException(status_code=404, detail="No users found.")
    return users


@router.post("/login", response_model=schemas.user.UserOut)
def login_user(
    *, db: Session = Depends(deps.get_db), user_in: schemas.user.UserIn
) -> Any:
    """
    Login user.
    """
    if not user_in.username or not user_in.password:
        raise HTTPException(status_code=403, detail="Username and password required.")
    user = logic.user.get_user_by_username(db, username=user_in.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if not logic.user.verify_password(user_in.password, user.password):
        raise HTTPException(status_code=403, detail="Incorrect password.")
    return user


@router.post("/", response_model=schemas.user.UserOut)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    input_user: schemas.user.UserIn,
) -> Any:
    """
    Create new user.
    """
    if not input_user.password or not input_user.username:
        raise HTTPException(status_code=403, detail="Username and password required.")
    user = logic.user.get_user_by_username(db, username=input_user.username)
    if user:
        raise HTTPException(status_code=403, detail="Username already exists.")
    user = logic.user.create_user(db, user=input_user)
    return user


@router.get("/{user_id}", response_model=schemas.user.UserOut)
def read_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
) -> Any:
    """
    Get user by ID.
    """
    user = logic.user.get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.put("/{user_id}", response_model=schemas.user.UserOut)
def update_user(
    *, db: Session = Depends(deps.get_db), user_id: int, user_in: schemas.user.UserIn
) -> Any:
    """
    Update an user.
    """
    db_user = logic.user.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    username_taken = logic.user.get_user_by_username(db, username=user_in.username)
    if username_taken:
        raise HTTPException(status_code=403, detail="Username already exists.")
    updated_user = logic.user.update_user(db, db_user=db_user, user_in=user_in)
    return updated_user


@router.delete("/{user_id}", response_model=schemas.user.UserOut)
def delete_user(*, db: Session = Depends(deps.get_db), user_id: int) -> Any:
    """
    Delete an user.
    """
    db_user = logic.user.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    deleted_user = logic.user.delete_user(db, user=db_user)
    return deleted_user
