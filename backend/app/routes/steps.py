from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.step import StepCreate, StepResponse
from ..core.security import get_current_user
from ..services.step_service import StepService

router = APIRouter(prefix="/steps", tags=["steps"])


@router.post("/{group_id}", response_model=StepResponse)
async def submit_steps(
        group_id: int, steps: StepCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)):
    step_service = StepService(db)
    return step_service.create(steps, current_user.id, group_id)


@router.get("/leaderboard/{group_id}")
async def get_leaderboard(group_id: int, db: Session = Depends(get_db)):
    step_service = StepService(db)
    return step_service.get_leaderboard(group_id)
