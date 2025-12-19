from sqlalchemy.orm import Session
from typing import List, Optional
from ..repositories.group_repository import GroupRepository
from ..repositories.user_repository import UserRepository
from ..schemas.group import GroupCreate, GroupResponse
from fastapi import HTTPException, status

class GroupService:
    def __init__(self, db: Session):
        self.repository = GroupRepository(db)
        self.user_repository = UserRepository(db)

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

    def create(self, data: GroupCreate, user_id: int) -> GroupResponse:
        # Проверяем, что у пользователя нет группы с таким именем
        user_groups = self.repository.get_user_groups(user_id)
        group_names = [g.name for g in user_groups]
        if data.name in group_names:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Группа уже эксизт братишь"
            )
        
        group = self.repository.create_group(data)
        return GroupResponse.model_validate(group)

    def join_group(self, group_id: int, user_id: int) -> dict:
        # Проверяем существование группы
        group = self.repository.get_by_id(group_id)
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )

        # Проверяем, не состоит ли уже пользователь в группе
        if self.repository.is_user_in_group(group_id, user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already in group"
            )

        # Добавляем пользователя в группу
        if not self.repository.add_user_to_group(group_id, user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to join group"
            )

        return {"message": "Joined group"}

    def leave_group(self, group_id: int, user_id: int) -> dict:
        """Выход пользователя из группы с удалением всех его шагов из этой группы."""
        # Проверяем существование группы
        group = self.repository.get_by_id(group_id)
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )

        # Проверяем, состоит ли пользователь в группе
        if not self.repository.is_user_in_group(group_id, user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not in this group"
            )

        # Удаляем пользователя из группы
        if not self.repository.remove_user_from_group(group_id, user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to leave group"
            )

        # Удаляем все шаги пользователя из этой группы
        from ..services.step_service import StepService
        step_service = StepService(self.repository.db)
        deleted_count = step_service.delete_by_user_and_group(user_id, group_id)

        return {
            "message": "Left group",
            "deleted_steps": deleted_count
        }

    def get_all_with_user_status(self, user_id: int) -> List[GroupResponse]:
        """Получает все группы с информацией о том, состоит ли пользователь в каждой группе."""
        groups = self.repository.get_all()
        user_groups = self.repository.get_user_groups(user_id)
        user_group_ids = {g.id for g in user_groups}
        
        result = []
        for group in groups:
            group_response = GroupResponse.model_validate(group)
            group_response.is_member = group.id in user_group_ids
            result.append(group_response)
        
        return result
