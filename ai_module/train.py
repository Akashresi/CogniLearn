import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.linear_model import LogisticRegression
import joblib
import os

def train_and_save_models():
    # Make sure models dir exists
    os.makedirs('models', exist_ok=True)
    
    # Generate dummy behavior dataset for training
    np.random.seed(42)
    n_samples = 1000
    data = {
        'response_time': np.random.uniform(5, 60, n_samples),
        'retry_count': np.random.randint(0, 5, n_samples),
        'mistakes': np.random.randint(0, 10, n_samples),
        'focus_score': np.random.uniform(40, 100, n_samples)
    }
    df = pd.DataFrame(data)
    
    # 1. Random Forest - Learning Pattern Classification
    # Target: Visual (0), Auditory (1), Kinesthetic (2)
    y_pattern = np.random.randint(0, 3, n_samples)
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(df, y_pattern)
    joblib.dump(rf_model, 'models/rf_learning_pattern.pkl')
    print("Saved Random Forest Learning Pattern Model.")
    
    # 2. K-Means - Grouping Similar Learners
    kmeans = KMeans(n_clusters=4, random_state=42)
    kmeans.fit(df)
    joblib.dump(kmeans, 'models/kmeans_learner_groups.pkl')
    print("Saved K-Means Learner Groups Model.")
    
    # 3. Logistic Regression - Risk Prediction
    # (At-Risk = 1 if mistakes > 7 and focus_score < 50, else 0)
    y_risk = np.where((df['mistakes'] > 7) & (df['focus_score'] < 50), 1, 0)
    log_reg = LogisticRegression(random_state=42)
    log_reg.fit(df, y_risk)
    joblib.dump(log_reg, 'models/logreg_risk.pkl')
    print("Saved Logistic Regression Risk Model.")

if __name__ == "__main__":
    train_and_save_models()
    print("All models trained and saved successfully!")
