from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.step import Step
from ..schemas.step import StepCreate, StepResponse
from ..core.security import get_current_user
from sqlalchemy import func

router = APIRouter(prefix="/steps", tags=["steps"])


@router.post("/{group_id}", response_model=StepResponse)
async def submit_steps(group_id: int, steps: StepCreate, db: Session = Depends(get_db),
                       current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user["username"]).first()

    submission = Step(
        user_id=user.id,
        group_id=group_id,
        step_count=steps.step_count
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/leaderboard/{group_id}")
async def get_leaderboard(group_id: int, db: Session = Depends(get_db)):
    # Сумируем шаги по юзерам в группе
    results = db.query(
        User.username,
        func.sum(Step.step_count).label("total_steps")
    ).join(Step).filter(Step.group_id == group_id).group_by(User.id).order_by(
        func.sum(Step.step_count).desc()).all()

    leaderboard = [{"username": r[0], "total_steps": r[1]} for r in results]
    return leaderboard
