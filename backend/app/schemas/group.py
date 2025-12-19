from pydantic import BaseModel, Field
from datetime import datetime

from sqlalchemy import Column, DateTime
from typing import List

from ..schemas.user import UserCreate, UserResponse


class GroupBase(BaseModel):
    name: str = Field(..., title="Group Name", description="Group Name")
    group_type: str = Field(..., title="Group Type", description="Group Type")


class GroupCreate(GroupBase):
    pass


class GroupResponse(GroupBase):
    id: int = Field(..., title="Group ID", description="Group ID")
    created_at: datetime
    members: List[UserResponse]
    is_member: bool = Field(default=False, title="Is Member", description="Whether current user is a member")

    class Config:
        from_attributes = True
