from sqlalchemy.orm import Session
from typing import Optional
from ..repositories.user_repository import UserRepository
from ..models.user import User
from ..schemas.user import UserCreate, UserResponse
from ..core.security import hash_password, verify_password, create_access_token
from fastapi import HTTPException, status


class AuthService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)
        self.db = db

    def register(self, user_data: UserCreate) -> UserResponse:
        # Проверяем, существует ли пользователь
        existing_user = self.repository.get_by_username(user_data.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        # Создаем пользователя с хешированным паролем
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hash_password(user_data.password)
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        return UserResponse.model_validate(db_user)

    def login(self, username: str, password: str) -> dict:
        user = self.repository.get_by_username(username)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}

