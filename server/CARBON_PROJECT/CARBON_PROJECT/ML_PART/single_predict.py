from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import sys
import os

# Enable path to RECOMENDATION_SYSTEM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from RECOMENDATION_SYSTEM.recommend_engine import generate_recommendations

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "carbon_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "model", "encoder.pkl")

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

@app.route('/calculate/ai', methods=['POST'])
def calculate_ai():
    try:
        data = request.get_json()
        user_input = {
            'Body Type': data.get('body_type'),
            'Sex': data.get('sex'),
            'Diet': data.get('diet'),
            'How Often Shower': data.get('how_often_shower'),
            'Heating Energy Source': data.get('heating_energy_source'),
            'Transport': data.get('transport'),
            'Vehicle Type': data.get('vehicle_type'),
            'Social Activity': data.get('social_activity'),
            'Monthly Grocery Bill': float(data.get('monthly_grocery_bill', 0)),
            'Frequency of Traveling by Air': data.get('frequency_of_traveling_by_air'),
            'Vehicle Monthly Distance Km': float(data.get('vehicle_monthly_distance_km', 0)),
            'Waste Bag Size': data.get('waste_bag_size'),
            'Waste Bag Weekly Count': int(data.get('waste_bag_weekly_count', 0)),
            'How Long TV PC Daily Hour': int(data.get('how_long_tv_pc_daily_hour', 0)),
            'How Many New Clothes Monthly': int(data.get('how_many_new_clothes_monthly', 0)),
            'How Long Internet Daily Hour': int(data.get('how_long_internet_daily_hour', 0)),
            'Energy efficiency': data.get('energy_efficiency'),
            'Recycling': data.get('recycling'),
            'Cooking_With': data.get('cooking_with')
        }

        input_df = pd.DataFrame([user_input])
        X_encoded = encoder.transform(input_df)
        prediction = model.predict(X_encoded)[0]

        return jsonify({'ai_result': float(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/calculate/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        print("📦 Flask received input:", data)

        # Re-map frontend keys to expected ML input format
        user_input = {
            'Body Type': data.get('body_type'),
            'Sex': data.get('sex'),
            'Diet': data.get('diet'),
            'How Often Shower': data.get('how_often_shower'),
            'Heating Energy Source': data.get('heating_energy_source'),
            'Transport': data.get('transport'),
            'Vehicle Type': data.get('vehicle_type'),
            'Social Activity': data.get('social_activity'),
            'Monthly Grocery Bill': float(data.get('monthly_grocery_bill', 0)),
            'Frequency of Traveling by Air': data.get('frequency_of_traveling_by_air'),
            'Vehicle Monthly Distance Km': float(data.get('vehicle_monthly_distance_km', 0)),
            'Waste Bag Size': data.get('waste_bag_size'),
            'Waste Bag Weekly Count': int(data.get('waste_bag_weekly_count', 0)),
            'How Long TV PC Daily Hour': int(data.get('how_long_tv_pc_daily_hour', 0)),
            'How Many New Clothes Monthly': int(data.get('how_many_new_clothes_monthly', 0)),
            'How Long Internet Daily Hour': int(data.get('how_long_internet_daily_hour', 0)),
            'Energy efficiency': data.get('energy_efficiency'),
            'Recycling': data.get('recycling'),
            'Cooking_With': data.get('cooking_with')
        }

        result = generate_recommendations(user_input)
        print("✅ Recommendation generated successfully.")
        return jsonify(result)
    except Exception as e:
        print("❌ Flask error:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
CORS(app)