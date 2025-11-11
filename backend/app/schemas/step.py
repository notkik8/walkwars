from pydantic import BaseModel, Field
from datetime import datetime


class StepCreate(BaseModel):
    step_count: int = Field(..., title="Step Count", description="Step Count")


class StepResponse(BaseModel):
    id: int
    user_id: int = Field(..., title="User ID", description="User ID")
    group_id: str = Field(..., title="Group ID", description="Group ID")
    steps_count: int = Field(..., title="Step Count", description="Step Count")
    submitted_at: datetime

    class Config:
        from_attributes = True
