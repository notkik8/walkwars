from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.step import Step
from ..schemas.step import StepCreate
from datetime import datetime, date


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Step]:
        return self.db.query(Step).all()

    def get_by_user(self, user_id: int) -> Optional[Step]:
        return self.db.query(Step).filter(Step.user_id == user_id).first()

    def get_by_group(self, group_id: str) -> Optional[Step]:
        return self.db.query(Step).filter(Step.group_id == group_id).first()

    def get_total_steps(self, user_id: int, start_date: date, end_date: date) -> int:
        total = (
            self.db.query(Step)
            .filter(Step.user_id == user_id, Step.submitted_at >= start_date, Step.submitted_at <= end_date)
            .with_entities(Step.step_count)
            .all()
        )
        return sum(step[0] for step in total)

    def create(self, step_data: StepCreate) -> Step:
        db_step = Step(**step_data.model_dump())
        self.db.add(db_step)
        self.db.commit()
        self.db.refresh(db_step)
        return db_step

    def delete(self, id: int) -> bool:
        step = self.get_by_id(id)
        if step is None:
            return False
        self.db.delete(step)
        self.db.commit()
        return True
