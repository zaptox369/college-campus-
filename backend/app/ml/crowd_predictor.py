import random
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor

class CrowdPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.is_trained = False
        self._train_dummy_model()

    def _train_dummy_model(self):
        # Generate synthetic historical training data
        # Features: [hour_of_day, day_of_week, room_capacity, is_lab, is_library, is_cafe, current_occupancy_pct]
        X = []
        y = []
        for _ in range(500):
            hour = random.randint(8, 20)
            day = random.randint(0, 6) # Mon-Sun
            cap = random.choice([30, 40, 60, 100, 200])
            is_lab = random.choice([0, 1])
            is_library = random.choice([0, 1])
            is_cafe = random.choice([0, 1])
            curr_pct = random.uniform(0.0, 1.0)
            
            # Predict future occupancy delta
            base = curr_pct
            if 11 <= hour <= 14 and is_cafe:
                target_pct = min(1.0, base + random.uniform(0.1, 0.3))
            elif 9 <= hour <= 16 and (is_lab or not is_cafe):
                target_pct = min(1.0, max(0.0, base + random.uniform(-0.15, 0.15)))
            elif hour >= 18:
                target_pct = max(0.0, base - random.uniform(0.1, 0.4))
            else:
                target_pct = base

            X.append([hour, day, cap, is_lab, is_library, is_cafe, curr_pct])
            y.append(target_pct)

        self.model.fit(np.array(X), np.array(y))
        self.is_trained = True

    def predict_future_occupancy(self, room_type: str, capacity: int, current_occupancy: int, minutes_ahead: int = 30) -> dict:
        now = datetime.now()
        target_time = now + timedelta(minutes=minutes_ahead)
        
        hour = target_time.hour
        day = target_time.weekday()
        curr_pct = current_occupancy / max(1, capacity)
        
        is_lab = 1 if "lab" in room_type.lower() else 0
        is_library = 1 if "library" in room_type.lower() else 0
        is_cafe = 1 if ("cafe" in room_type.lower() or "dining" in room_type.lower()) else 0

        features = np.array([[hour, day, capacity, is_lab, is_library, is_cafe, curr_pct]])
        predicted_pct = float(self.model.predict(features)[0])
        predicted_pct = max(0.0, min(1.0, predicted_pct))
        
        predicted_count = int(round(predicted_pct * capacity))

        if predicted_pct < 0.4:
            crowd_level = "Low"
            recommendation = "Ideal time to visit or study."
        elif predicted_pct < 0.7:
            crowd_level = "Medium"
            recommendation = "Moderate activity expected."
        elif predicted_pct < 0.9:
            crowd_level = "High"
            recommendation = "High crowding expected. Consider alternative rooms."
        else:
            crowd_level = "Very High"
            recommendation = "Near peak capacity! Finding seats will be difficult."

        return {
            "predicted_occupancy": predicted_count,
            "capacity": capacity,
            "predicted_percentage": round(predicted_pct * 100, 1),
            "predicted_crowd_level": crowd_level,
            "minutes_ahead": minutes_ahead,
            "target_time": target_time.strftime("%I:%M %p"),
            "recommendation": recommendation
        }

crowd_predictor = CrowdPredictor()
