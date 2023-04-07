from sqlalchemy.orm import Session

from app.schemas.user import UserIn
from app.models.user import User


def create_user(db: Session, user: UserIn):
    db_user = User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_id(db: Session, user_id: int):
    return db.get(User, user_id)


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def update_user(db: Session, db_user: User, user_in: UserIn):
    db_user.username = user_in.username
    db.commit()
    return db_user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()
    return user


def verify_password(plain_password, hashed_password):
    return plain_password == hashed_password
