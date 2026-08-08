import uvicorn
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.seed import seed_database

if __name__ == "__main__":
    print("Initializing database and seeding demo data...")
    try:
        seed_database()
    except Exception as e:
        print(f"Warning during seed: {e}")
    
    print("Starting FastAPI Server on http://127.0.0.1:8000...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
