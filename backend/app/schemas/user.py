from pydantic import BaseModel, Field, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    username: str = Field(
        ...,
        title="User name",
        min_length=4,
        max_length=64,
        description="User's username",
    )
    email: EmailStr = Field(..., title="User's email", description="User's email")
    password: str


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int = Field(..., title="User ID", description="User ID")
    date_created: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str