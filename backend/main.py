from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import users_collection, behavior_logs_collection, cognitive_results_collection, reports_collection
from models import UserCreate, UserLogin, BehaviorLog
from auth import get_password_hash, verify_password, create_access_token, decode_access_token
import uuid
import datetime

app = FastAPI(title="CogniLearn Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
def register(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user_dict["password"])
    user_dict["id"] = str(uuid.uuid4())
    user_dict["created_at"] = datetime.datetime.utcnow()
    
    users_collection.insert_one(user_dict)
    return {"message": "User created successfully", "id": user_dict["id"], "role": user_dict["role"]}

@app.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"id": db_user["id"], "role": db_user["role"]})
    return {"access_token": token, "role": db_user["role"], "id": db_user["id"], "email": db_user["email"]}

@app.post("/behavior-log")
def log_behavior(log: BehaviorLog, current_user: dict = Depends(decode_access_token)):
    log_dict = log.dict()
    log_dict["id"] = str(uuid.uuid4())
    log_dict["timestamp"] = datetime.datetime.utcnow()
    behavior_logs_collection.insert_one(log_dict)
    
    # In a real scenario, this would trigger the AI module asynchronously
    return {"message": "Behavior logged successfully", "log_id": log_dict["id"]}

@app.get("/dashboard/{user_id}")
def get_dashboard(user_id: str, current_user: dict = Depends(decode_access_token)):
    # Simple role-based mock
    user = users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    role = user.get("role", "student")
    if role == "student":
        return {
            "study_time": 120,
            "focus_score": 85,
            "learning_progress": [10, 20, 30, 40, 50],
            "alerts": ["Great job focusing today!", "Check out the new math lesson."]
        }
    elif role == "parent":
        return {
            "child_performance": "Good",
            "weekly_overview": "Completed 5 lessons, 85% average focus.",
            "alerts": ["Your child reached their goal today!"]
        }
    else:
        return {
            "class_overview": "30 students active",
            "at_risk_students": ["Student A", "Student B"],
            "alerts": []
        }

@app.get("/cognitive/{user_id}")
def get_cognitive(user_id: str, current_user: dict = Depends(decode_access_token)):
    result = cognitive_results_collection.find_one({"user_id": user_id}, {"_id": 0})
    if not result:
        return {
            "learning_type": "Visual",
            "focus_score": 85,
            "curiosity_index": 70,
            "recommendations": ["Watch video tutorials", "Try interactive games"]
        }
    return result

@app.get("/weekly-report/{user_id}")
def get_weekly_report(user_id: str, current_user: dict = Depends(decode_access_token)):
    report = reports_collection.find_one({"user_id": user_id, "type": "weekly"}, {"_id": 0})
    if not report:
        return {
            "accuracy_trend": [60, 65, 70, 75, 80],
            "improvement_percentage": 15,
            "mistake_reduction": True
        }
    return report

@app.get("/monthly-report/{user_id}")
def get_monthly_report(user_id: str, current_user: dict = Depends(decode_access_token)):
    report = reports_collection.find_one({"user_id": user_id, "type": "monthly"}, {"_id": 0})
    if not report:
        return {
            "accuracy_trend": [50, 60, 70, 85],
            "improvement_percentage": 35,
            "mistake_reduction": True
        }
    return report

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
