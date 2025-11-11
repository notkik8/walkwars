from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from ..database import Base


class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False)
    date_joined = Column(DateTime, nullable=False, index=True)

    group = relationship("Group", secondary="user_groups", back_populates="members")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"
