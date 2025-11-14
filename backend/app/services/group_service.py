from sqlalchemy.orm import Session
from typing import List, Optional
from ..repositories.group_repository import GroupRepository
from ..schemas.group import GroupCreate, GroupResponse
from fastapi import HTTPException, status

class GroupService:
    def __init__(self, db: Session):
        self.repository = GroupRepository(db)

    def get_all(self) -> List[GroupResponse]:
        groups = self.repository.get_all()
        return [GroupResponse.model_validate(i) for i in groups]

    def get_by_name(self, name: str) -> Optional[GroupResponse]:
        group = self.repository.get_by_name(name)
        if not group:
            return None
        return GroupResponse.model_validate(group)

    def get_by_id(self, id: int) -> Optional[GroupResponse]:
        group = self.repository.get_by_id(id)
        if not group:
            return None
        return GroupResponse.model_validate(group)

    def create(self, data: GroupCreate) -> GroupResponse:
        group = self.repository.create(data)
        return GroupResponse.model_validate(group)
