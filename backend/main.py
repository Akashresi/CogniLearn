from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import users_collection, behavior_logs_collection, cognitive_results_collection, reports_collection, learning_sessions_collection
from models import UserCreate, UserLogin, BehaviorLog, ChatRequest, ImageRequest
from auth import get_password_hash, verify_password, create_access_token, decode_access_token
from ai_service import ai_engine
import uuid
import datetime
import pandas as pd

app = FastAPI(title="CogniLearn Advanced Backend API")

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

@app.post("/chat")
def chat_with_bot(request: ChatRequest, current_user: dict = Depends(decode_access_token)):
    # Streamlit converted to backend API
    response = ai_engine.generate_chat_response(request.query)
    return {"reply": response}

@app.post("/generate-image")
def generate_educational_image(request: ImageRequest, current_user: dict = Depends(decode_access_token)):
    # Extracted from Streamlit project
    url = ai_engine.generate_image(request.prompt)
    return {"image_url": url}

@app.post("/behavior-log")
def log_behavior(log: BehaviorLog, current_user: dict = Depends(decode_access_token)):
    log_dict = log.dict()
    log_dict["id"] = str(uuid.uuid4())
    log_dict["timestamp"] = datetime.datetime.utcnow()
    behavior_logs_collection.insert_one(log_dict)
    
    # Live ML Analysis & Recommendations
    analysis = ai_engine.analyze_behavior(
        response_time=log.response_time,
        retry_count=log.retry_count,
        mistakes=log.mistakes,
        focus_score=log.focus_score
    )
    
    # Store AI recommendations directly into cognitive_results
    curiosity = min(100, log.focus_score + (10 - log.mistakes) * 2) 
    
    cognitive_results_collection.update_one(
        {"user_id": log.user_id},
        {"$set": {
            "learning_type": analysis["learning_pattern"],
            "focus_score": log.focus_score,
            "curiosity_index": max(0, curiosity),
            "recommendations": analysis["recommendations"]
        }},
        upsert=True
    )
    
    return {"message": "Behavior logged + Analyzed smoothly", "log_id": log_dict["id"]}

@app.get("/dashboard/{user_id}")
def get_dashboard(user_id: str, current_user: dict = Depends(decode_access_token)):
    user = users_collection.find_one({"id": user_id})
    role = current_user.get("role", "student") # Use role from token for demo fallback
    
    if not user and user_id != "demo-id":
        raise HTTPException(status_code=404, detail="User not found")
        
    if user:
        role = user.get("role", "student")
    if role == "student":
        return {
            "study_time": 120,
            "focus_score": 85,
            "learning_progress": [10, 20, 30, 40, 50],
            "alerts": ["Great job focusing today! Keep up the good work!"]
        }
    elif role == "parent":
        return {
            "child_performance": "Good - Steady Improvement",
            "weekly_overview": "Completed 5 lessons, 85% average focus. Visual learning style preferred.",
            "alerts": ["Your child reached their goal today!"]
        }
    else:
        return {
            "class_overview": "30 students active, 25 improving continuously",
            "at_risk_students": ["Student A", "Student B - Suggested 1-on-1 Help"],
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
    logs = list(behavior_logs_collection.find({"user_id": user_id}))
    if not logs:
        # Dummy if no data yet
        return {"accuracy_trend": [60, 65, 70, 75, 80], "improvement_percentage": 15, "mistake_reduction": True}
    
    # Process with Pandas
    df = pd.DataFrame(logs)
    if 'mistakes' not in df.columns:
        return {"accuracy_trend": [60, 65, 70, 75, 80], "improvement_percentage": 15, "mistake_reduction": True}
    
    # Get last 5 recorded entries to mimic 5 days trend
    recent = df.tail(5)
    trend = [100 - (m * 5) for m in recent['mistakes']]
    
    improved = False
    if len(trend) > 1 and trend[-1] > trend[0]:
         improved = True

    # Calculate Engagement Score (simple heuristic)
    avg_focus = recent['focus_score'].mean() if 'focus_score' in recent.columns else 80
    engagement = min(100, (avg_focus * 0.7) + (len(recent) * 2))

    return {
        "accuracy_trend": trend,
        "improvement_percentage": 20 if improved else 5,
        "mistake_reduction": improved,
        "engagement_score": round(engagement, 2)
    }

@app.get("/monthly-report/{user_id}")
def get_monthly_report(user_id: str, current_user: dict = Depends(decode_access_token)):
    logs = list(behavior_logs_collection.find({"user_id": user_id}))
    if not logs:
        # Dummy if no data yet
        return {"accuracy_trend": [50, 60, 70, 85], "improvement_percentage": 35, "mistake_reduction": True}
    
    # Evaluate with Pandas
    df = pd.DataFrame(logs)
    if len(df) < 4:
         return {"accuracy_trend": [50, 60, 70, 85], "improvement_percentage": 35, "mistake_reduction": True}
    
    # Calculate mock weekly averages
    mock_weeks = [
         100 - df.iloc[len(df)//4 * 0]['mistakes'] * 5,
         100 - df.iloc[len(df)//4 * 1]['mistakes'] * 5,
         100 - df.iloc[len(df)//4 * 2]['mistakes'] * 5,
         100 - df.iloc[-1]['mistakes'] * 5
    ]
    
    improved = mock_weeks[-1] > mock_weeks[0]
    
    # Calculate Engagement Score
    avg_focus = df['focus_score'].mean() if 'focus_score' in df.columns else 75
    engagement = min(100, (avg_focus * 0.6) + (len(df) * 0.5))

    return {
        "accuracy_trend": mock_weeks,
        "improvement_percentage": 40 if improved else 0,
        "mistake_reduction": improved,
        "engagement_score": round(engagement, 2)
    }

@app.get("/report/{user_id}")
def get_combined_report(user_id: str, current_user: dict = Depends(decode_access_token)):
    weekly = get_weekly_report(user_id, current_user)
    monthly = get_monthly_report(user_id, current_user)
    return {
        "weekly": weekly,
        "monthly": monthly
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
