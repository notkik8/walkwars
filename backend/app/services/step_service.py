from sqlalchemy.orm import Session
from typing import List, Optional
from ..repositories.step_repository import StepRepository
from ..schemas.step import StepCreate, StepResponse
from fastapi import HTTPException

class StepService:
    def __init__(self, db: Session):
        self.repository = StepRepository(db)

    def get_all(self) -> List[StepResponse]:
        steps = self.repository.get_all()
        return [StepResponse.model_validate(i) for i in steps]

    def get_total_by_user(self, user_id: int) -> int:
        return self.repository.get_total_steps(user_id)

    def create(self, data: StepCreate, user_id: int, group_id: int) -> StepResponse:
        step_data = data.model_copy(update={"user_id": user_id, "group_id": group_id})
        db_step = self.repository.create(step_data)
        return StepResponse.model_validate(db_step)

    def delete(self, id: int) -> bool:
        if not self.repository.delete(id):
            raise HTTPException(status_code=404, detail="Step not found")
        return True
