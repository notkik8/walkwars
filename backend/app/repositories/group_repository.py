from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.group import Group
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
