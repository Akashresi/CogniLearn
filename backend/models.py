from pydantic import BaseModel
from typing import Optional, List

class UserCreate(BaseModel):
    email: str
    password: str
    role: str
    parent_teacher_link: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class BehaviorLog(BaseModel):
    user_id: str
    action: str
    response_time: float
    retry_count: int
    mistakes: int
    lesson_id: str
    focus_score: float

class CognitiveResult(BaseModel):
    user_id: str
    learning_type: str
    focus_score: float
    curiosity_index: float
    recommendations: List[str]
