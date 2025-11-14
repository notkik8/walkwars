from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.group import Group
from ..schemas.group import GroupCreate, GroupResponse
from ..core.security import get_current_user

router = APIRouter(prefix="/groups", tags=["groups"])


@router.post("/", response_model=GroupResponse)
async def create_group(group: GroupCreate, db: Session = Depends(get_db),
                       current_user: dict = Depends(get_current_user)):
    db_group = Group(name=group.name, group_type=group.group_type, created_by=current_user["id"])
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


@router.get("/", response_model=list[GroupResponse])
async def list_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).all()
    return groups


@router.post("/{group_id}/join")
async def join_group(group_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    user = db.query(User).filter(User.username == current_user["username"]).first()
    if user in group.members:
        raise HTTPException(status_code=400, detail="Already in group")

    group.members.append(user)
    db.commit()
    return {"message": "Joined group"}
