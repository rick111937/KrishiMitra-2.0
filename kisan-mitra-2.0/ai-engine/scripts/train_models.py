import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
import joblib
import os

# Set seed for reproducibility
np.random.seed(42)

# Ensure models directory exists
models_dir = os.path.join(os.path.dirname(__file__), '../models')
os.makedirs(models_dir, exist_ok=True)


def train_rainfall_predictor():
    print("\n--- Training Rainfall Predictor ---")
    # Generate Synthetic Data (5 years daily)
    dates = pd.date_range(start='2020-01-01', periods=1800)
    month = dates.month

    # Seasonal effect (Monsoon in July-August)
    base_rain = np.sin((month - 1) * np.pi / 6) * 10
    base_rain = np.maximum(0, base_rain)  # No negative rain

    # Add random spikes
    is_monsoon = (month >= 6) & (month <= 9)
    rain = base_rain + np.random.exponential(scale=5, size=1800) * is_monsoon
    rain += np.random.normal(0, 1, 1800)
    rain = np.maximum(0, rain)

    df = pd.DataFrame({
        'day_of_year': dates.dayofyear,
        'month': month,
        'prev_day_rain': np.roll(rain, 1),
        'temp_avg': np.random.normal(25, 5, 1800) - (base_rain/2),
        'humidity': np.random.normal(60, 10, 1800) + (base_rain*2)
    })
    df['prev_day_rain'] = df['prev_day_rain'].fillna(0)
    df['humidity'] = np.clip(df['humidity'], 30, 100)

    X = df
    y = rain

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)
    print(f"Path: {os.path.join(models_dir, 'rainfall_predictor.pkl')}")
    print(f"RMSE: {rmse:.2f} mm")
    print(f"R² Score: {r2:.2f}")

    joblib.dump(model, os.path.join(models_dir, 'rainfall_predictor.pkl'))
    print("Saved rainfall_predictor.pkl")


def train_crop_damage_classifier():
    print("\n--- Training Crop Damage Classifier ---")
    # Generate Synthetic Data
    n_samples = 10000

    soil_moisture = np.random.uniform(10, 80, n_samples)
    forecast_rain = np.random.normal(10, 20, n_samples)
    forecast_rain = np.maximum(0, forecast_rain)
    growth_stage = np.random.choice(
        [1, 2, 3], n_samples)  # 1:Seed, 2:Veg, 3:Harvest

    # Logic for Risk
    # Low soil + high forecast = risk of shock?
    # High soil + high forecast = Flood Risk (High)
    # Low soil + low forecast = Drought Risk (High)
    risk_score = (forecast_rain / 50) + (80 - soil_moisture) / 20
    # Harvesting stage higher risk from rain
    risk_score += (growth_stage == 3) * 1.5

    risk_level = np.zeros(n_samples)
    risk_level[risk_score < 4] = 0  # Low
    risk_level[(risk_score >= 4) & (risk_score < 6)] = 1  # Medium
    risk_level[risk_score >= 6] = 2  # High

    df = pd.DataFrame({
        'soil_moisture': soil_moisture,
        'forecast_rain': forecast_rain,
        'growth_stage': growth_stage
    })

    X = df
    y = risk_level

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Accuracy: {acc*100:.1f}%")

    joblib.dump(model, os.path.join(models_dir, 'crop_damage_classifier.pkl'))
    print("Saved crop_damage_classifier.pkl")


def train_price_trend_model():
    print("\n--- Training Price Trend Model ---")
    n_samples = 1500

    current_price = np.random.normal(2000, 500, n_samples)
    rolling_7d_avg = current_price + np.random.normal(0, 50, n_samples)
    season = np.random.choice([1, 2, 3, 4], n_samples)  # 4 seasons
    demand_index = np.random.uniform(50, 150, n_samples)

    # Future price logic
    next_day_price = current_price * 0.9 + rolling_7d_avg * 0.1 + \
        (demand_index - 100) * 5 + np.random.normal(0, 20, n_samples)

    df = pd.DataFrame({
        'current_price': current_price,
        'rolling_7d_avg': rolling_7d_avg,
        'season': season,
        'demand_index': demand_index
    })

    X = df
    y = next_day_price

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)
    print(f"RMSE: {rmse:.2f} ₹")
    print(f"R² Score: {r2:.2f}")

    joblib.dump(model, os.path.join(models_dir, 'price_trend_model.pkl'))
    print("Saved price_trend_model.pkl")


if __name__ == "__main__":
    train_rainfall_predictor()
    train_crop_damage_classifier()
    train_price_trend_model()
    print("\nAll models trained and saved to:", models_dir)
