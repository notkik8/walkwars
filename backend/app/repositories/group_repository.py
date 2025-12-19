from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.group import Group
from ..models.user import User
from ..schemas.group import GroupCreate
from datetime import datetime, date

class GroupRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Group]:
        return self.db.query(Group).all()

    def get_by_id(self, id: int) -> Optional[Group]:
        return self.db.query(Group).filter(Group.id == id).first()

    def get_by_name(self, name: str) -> Optional[Group]:
        return self.db.query(Group).filter(Group.name == name).first()

    def create_group(self, group_data: GroupCreate) -> Group:
        db_group = Group(**group_data.model_dump())
        self.db.add(db_group)
        self.db.commit()
        self.db.refresh(db_group)
        return db_group

    def delete(self, id: int) -> Optional[Group]:
        group = self.get_by_id(id)
        if group is None:
            return False
        self.db.delete(group)
        self.db.commit()
        return group

    def is_user_in_group(self, group_id: int, user_id: int) -> bool:
        group = self.get_by_id(group_id)
        if not group:
            return False
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        return user in group.members

    def add_user_to_group(self, group_id: int, user_id: int) -> bool:
        group = self.get_by_id(group_id)
        if not group:
            return False
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        if user in group.members:
            return False  # Уже в группе
        group.members.append(user)
        self.db.commit()
        return True

    def get_user_groups(self, user_id: int) -> List[Group]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        return user.groups

    def remove_user_from_group(self, group_id: int, user_id: int) -> bool:
        """Удаляет пользователя из группы. Возвращает True если успешно."""
        group = self.get_by_id(group_id)
        if not group:
            return False
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        if user not in group.members:
            return False  # Пользователь не в группе
        group.members.remove(user)
        self.db.commit()
        return True
