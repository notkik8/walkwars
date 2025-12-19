from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from sqlalchemy import func
from ..models.step import Step
from ..models.user import User
from ..schemas.step import StepCreate
from datetime import datetime, date


class StepRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Step]:
        return self.db.query(Step).all()

    def get_by_id(self, id: int) -> Optional[Step]:
        return self.db.query(Step).filter(Step.id == id).first()

    def get_by_user(self, user_id: int) -> Optional[Step]:
        return self.db.query(Step).filter(Step.user_id == user_id).first()

    def get_by_group(self, group_id: int) -> List[Step]:
        return self.db.query(Step).filter(Step.group_id == group_id).all()

    def get_total_steps(self, user_id: int, group_id: Optional[int] = None) -> int:
        query = self.db.query(func.sum(Step.step_count)).filter(Step.user_id == user_id)
        if group_id:
            query = query.filter(Step.group_id == group_id)
        total = query.scalar()
        return total or 0

    def get_leaderboard(self, group_id: int) -> List[Dict]:
        results = (
            self.db.query(
                User.username,
                func.sum(Step.step_count).label("total_steps")
            )
            .join(Step)
            .filter(Step.group_id == group_id)
            .group_by(User.id)
            .order_by(func.sum(Step.step_count).desc())
            .all()
        )
        return [{"username": r[0], "total_steps": r[1]} for r in results]

    def create(self, step_data: StepCreate, user_id: int, group_id: int) -> Step:
        db_step = Step(
            user_id=user_id,
            group_id=group_id,
            step_count=step_data.step_count
        )
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

    def delete_by_user_and_group(self, user_id: int, group_id: int) -> int:
        """Удаляет все шаги пользователя из конкретной группы. Возвращает количество удаленных записей."""
        steps = self.db.query(Step).filter(
            Step.user_id == user_id,
            Step.group_id == group_id
        ).all()
        count = len(steps)
        for step in steps:
            self.db.delete(step)
        self.db.commit()
        return count
