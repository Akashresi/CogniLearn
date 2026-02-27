import joblib
import numpy as np
import os

class CognitiveAI:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.rf_model = joblib.load(os.path.join(base_dir, 'models', 'rf_learning_pattern.pkl'))
        self.kmeans = joblib.load(os.path.join(base_dir, 'models', 'kmeans_learner_groups.pkl'))
        self.log_reg = joblib.load(os.path.join(base_dir, 'models', 'logreg_risk.pkl'))
        
        self.pattern_map = {0: "Visual", 1: "Auditory", 2: "Kinesthetic"}
    
    def analyze_behavior(self, response_time, retry_count, mistakes, focus_score):
        features = np.array([[response_time, retry_count, mistakes, focus_score]])
        
        # 1. Learning Pattern Classification
        pattern_pred = self.rf_model.predict(features)[0]
        learning_pattern = self.pattern_map[pattern_pred]
        
        # 2. Grouping
        group = self.kmeans.predict(features)[0]
        
        # 3. Risk Prediction
        risk = self.log_reg.predict(features)[0]
        
        # 4. Recommendation System (Rule-based)
        recommendations = []
        if learning_pattern == "Visual":
            recommendations.append("Use more diagrams and infographics.")
        elif learning_pattern == "Auditory":
            recommendations.append("Listen to educational podcasts.")
        else:
            recommendations.append("Engage in hands-on activities.")
            
        if risk == 1:
            recommendations.append("Alert: Found learning difficulties. Suggest 1-on-1 tutoring.")
            
        return {
            "learning_pattern": learning_pattern,
            "learner_group": int(group),
            "at_risk": bool(risk),
            "recommendations": recommendations
        }
