from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["cognilearn"]

users_collection = db["users"]
behavior_logs_collection = db["behavior_logs"]
cognitive_results_collection = db["cognitive_results"]
reports_collection = db["reports"]
