from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class Step(Base):
    __tablename__ = "step_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("User.id"))
    group_id = Column(Integer, ForeignKey("Group.id"))
    step_count = Column(Integer, index=True)

    submitted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="steps")
    group = relationship("Group", back_populates="steps")
