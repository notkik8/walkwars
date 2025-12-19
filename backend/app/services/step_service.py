from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from ..repositories.step_repository import StepRepository
from ..repositories.group_repository import GroupRepository
from ..schemas.step import StepCreate, StepResponse
from fastapi import HTTPException, status

class StepService:
    def __init__(self, db: Session):
        self.repository = StepRepository(db)
        self.group_repository = GroupRepository(db)

    def get_all(self) -> List[StepResponse]:
        steps = self.repository.get_all()
        return [StepResponse.model_validate(i) for i in steps]

    def get_total_by_user(self, user_id: int, group_id: Optional[int] = None) -> int:
        return self.repository.get_total_steps(user_id, group_id)

    def create(self, data: StepCreate, user_id: int, group_id: int) -> StepResponse:
        # Проверяем, что группа существует
        group = self.group_repository.get_by_id(group_id)
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )

        # Проверяем, что пользователь состоит в группе
        if not self.group_repository.is_user_in_group(group_id, user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Вы должны быть участником группы, чтобы отправлять шаги"
            )

        # Валидация количества шагов
        if data.step_count > 500000:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail="Too many steps, куда ты газуешь братишь"
            )
        
        db_step = self.repository.create(data, user_id, group_id)
        return StepResponse.model_validate(db_step)

    def get_leaderboard(self, group_id: int) -> List[Dict]:
        return self.repository.get_leaderboard(group_id)

    def delete(self, id: int) -> bool:
        if not self.repository.delete(id):
            raise HTTPException(status_code=404, detail="Step not found")
        return True

    def delete_by_user_and_group(self, user_id: int, group_id: int) -> int:
        """Удаляет все шаги пользователя из группы. Возвращает количество удаленных записей."""
        return self.repository.delete_by_user_and_group(user_id, group_id)
