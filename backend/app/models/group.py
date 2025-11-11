from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


user_groups = Table(
    "user_groups",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("group_id", Integer, ForeignKey("groups.id")),
)


class Group(Base):
    __tablename__ = "Group"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    group_type = Column(String, index=True)  # Тип группы: duo, trio, squad, bigass

    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("User", secondary=user_groups, back_populates="groups")
    steps = relationship("StepsSubmitission", back_populates="groups")
