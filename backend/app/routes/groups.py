from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.group import GroupCreate, GroupResponse
from ..core.security import get_current_user
from ..services.group_service import GroupService

router = APIRouter(prefix="/groups", tags=["groups"])


# Create Group
@router.post("/", response_model=GroupResponse)
async def create_group(
        group: GroupCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)):
    group_service = GroupService(db)
    return group_service.create(group, current_user.id)


# List Groups
@router.get("/", response_model=list[GroupResponse])
async def list_groups(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)):
    group_service = GroupService(db)
    # Если пользователь авторизован, показываем статус участия
    return group_service.get_all_with_user_status(current_user.id)


# Join Group
@router.post("/{group_id}/join")
async def join_group(
        group_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)):
    group_service = GroupService(db)
    return group_service.join_group(group_id, current_user.id)


# Leave Group
@router.post("/{group_id}/leave")
async def leave_group(
        group_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)):
    group_service = GroupService(db)
    return group_service.leave_group(group_id, current_user.id)
