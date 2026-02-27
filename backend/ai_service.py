import joblib
import numpy as np
import os
import random

class CognitiveAI:
    def __init__(self):
        # Resolve models path dynamically since we are inside backend/
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        models_dir = os.path.join(base_dir, 'ai_module', 'models')
        
        try:
            self.rf_model = joblib.load(os.path.join(models_dir, 'rf_learning_pattern.pkl'))
            self.kmeans = joblib.load(os.path.join(models_dir, 'kmeans_learner_groups.pkl'))
            self.log_reg = joblib.load(os.path.join(models_dir, 'logreg_risk.pkl'))
            self.models_loaded = True
        except Exception as e:
            print(f"Warning: AI models could not be loaded. Please run train.py. Error: {e}")
            self.models_loaded = False
            
        self.pattern_map = {0: "Visual", 1: "Auditory", 2: "Kinesthetic"}
    
    def analyze_behavior(self, response_time, retry_count, mistakes, focus_score):
        if not self.models_loaded:
            # Fallback mock analysis if models not built yet
            return {
                "learning_pattern": "Visual",
                "learner_group": 1,
                "at_risk": False,
                "recommendations": ["Fallback recommendation: Practice more."]
            }
            
        features = np.array([[response_time, retry_count, mistakes, focus_score]])
        
        # 1. Learning Pattern Classification
        pattern_pred = self.rf_model.predict(features)[0]
        learning_pattern = self.pattern_map.get(pattern_pred, "Mixed")
        
        # 2. Grouping
        group = self.kmeans.predict(features)[0]
        
        # 3. Risk Prediction
        risk = self.log_reg.predict(features)[0]
        
        # 4. Recommendation System (Rule-based)
        recommendations = []
        if learning_pattern == "Visual":
            recommendations.append("Use more visual diagrams and infographics.")
        elif learning_pattern == "Auditory":
            recommendations.append("Listen to educational podcasts and audio instructions.")
        elif learning_pattern == "Kinesthetic":
            recommendations.append("Engage in hands-on activities and interactive tasks.")
            
        if risk == 1 or mistakes > 5:
            recommendations.append("Alert: Found learning difficulties. Suggest short, focused sessions and extra practice tasks.")
        
        if focus_score < 50:
            recommendations.append("Focus is dropping. Recommend short 10-minute study sessions with frequent breaks.")
            
        return {
            "learning_pattern": learning_pattern,
            "learner_group": int(group),
            "at_risk": bool(risk),
            "recommendations": recommendations
        }

    def generate_chat_response(self, query: str) -> str:
        # Mocking an AI chat response (To replace Streamlit behavior)
        responses = [
            """Here's a breakdown of the complex topic you asked about...""",
            """Based on your learning preferences, I suggest focusing on practical examples first.""",
            """That's an excellent question. To understand this, let's look at a real-world scenario..."""
        ]
        return random.choice(responses)

    def generate_image(self, prompt: str) -> str:
        # Mocking a generated image URL for the Streamlit conversion
        return "https://via.placeholder.com/400x300.png?text=Generated+Visual+Aid"

ai_engine = CognitiveAI()
