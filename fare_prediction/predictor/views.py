from django.shortcuts import render

# Create your views here.
import json
import pickle
import pandas as pd
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import ExtraTreesRegressor

# Load the model and scaler globally (avoid reloading per request)
try:
    with open('predictor/models/Extra_Trees.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('predictor/models/scaler_standard.pkl', 'rb') as f:
        scaler = pickle.load(f)
    print("Model and scaler loaded successfully")
except Exception as e:
    print(f"Error loading model/scaler: {e}")
    model, scaler = None, None

# Expected one-hot encoded feature order (from training)
FEATURE_ORDER = [
    'passenger_count', 'hour', 'day', 'month', 'weekday', 'year',
    'jfk_dist', 'ewr_dist', 'lga_dist', 'sol_dist', 'nyc_dist',
    'distance', 'bearing',
    'traffic_Congested Traffic', 'traffic_Dense Traffic', 'traffic_Flow Traffic',
    'car_Bad', 'car_Excellent', 'car_Good', 'car_Very Good',
    'weather_cloudy', 'weather_rainy', 'weather_stormy', 'weather_sunny', 'weather_windy'
]

@csrf_exempt  # Disable CSRF for simplicity (use tokens in production)
def predict_fare(request):
    if request.method == 'OPTIONS':
        return JsonResponse({'status': 'OK'}, status=200)
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are supported'}, status=405)

    try:
        # Parse JSON input
        data = json.loads(request.body)

        # Rename frontend fields to match backend expectations
        data = dict(data)  # Convert to mutable dict
        if 'traffic_condition' in data:
            data['Traffic Condition'] = data.pop('traffic_condition')
        if 'car_condition' in data:
            data['Car Condition'] = data.pop('car_condition')
        
        # Validate required fields
        required_fields = ['passenger_count', 'pickup_datetime',
                          'jfk_dist', 'ewr_dist', 'lga_dist', 'sol_dist', 'nyc_dist', 
                          'distance', 'bearing', 
                          'Traffic Condition', 'Car Condition', 'Weather']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return JsonResponse({'error': f'Missing fields: {missing_fields}'}, status=400)

        # Extract and validate input
        passenger_count = int(data['passenger_count'])
        if passenger_count < 0:
            return JsonResponse({'error': 'passenger_count must be non-negative'}, status=400)

        pickup_datetime = data['pickup_datetime']  # e.g., "2023-03-09 14:30:00"
        try:
            dt = datetime.strptime(pickup_datetime, '%Y-%m-%d %H:%M:%S')
            hour = dt.hour
            day = dt.day
            month = dt.month
            weekday = dt.weekday()
            year = dt.year
        except ValueError:
            return JsonResponse({'error': 'Invalid pickup_datetime format (use YYYY-MM-DD HH:MM:SS)'}, status=400)
        
        jfk_dist = float(data['jfk_dist'])
        ewr_dist = float(data['ewr_dist'])
        lga_dist = float(data['lga_dist'])
        sol_dist = float(data['sol_dist'])
        nyc_dist = float(data['nyc_dist'])
        if jfk_dist < 0 or ewr_dist < 0 or lga_dist < 0 or sol_dist < 0 or nyc_dist < 0:
            return JsonResponse({'error': 'jfk,ewr,lga,sol,nyc dist must be non-negative'}, status=400)
        
        distance = float(data['distance'])
        if distance < 0:
            return JsonResponse({'error': 'distance must be non-negative'}, status=400)

        bearing = float(data['bearing'])

        # Validate categorical inputs
        traffic_vals = ['Congested Traffic', 'Dense Traffic', 'Flow Traffic']
        car_vals = ['Bad', 'Excellent', 'Good', 'Very Good']
        weather_vals = ['cloudy', 'rainy', 'stormy', 'sunny', 'windy']
        
        traffic_condition = data['Traffic Condition']
        if traffic_condition not in traffic_vals:
            return JsonResponse({'error': f'traffic_condition must be one of {traffic_vals}'}, status=400)

        car_condition = data['Car Condition']
        if car_condition not in car_vals:
            return JsonResponse({'error': f'car_condition must be one of {car_vals}'}, status=400)

        weather_condition = data['Weather']
        if weather_condition not in weather_vals:
            return JsonResponse({'error': f'weather_condition must be one of {weather_vals}'}, status=400)

        # Preprocessing: Create a DataFrame
        input_data = {
            'passenger_count': passenger_count,
            'hour': hour,
            'day': day,
            'month': month,
            'weekday': weekday,
            'year': year,
            'jfk_dist': jfk_dist,
            'ewr_dist': ewr_dist,
            'lga_dist': lga_dist,
            'sol_dist': sol_dist,
            'nyc_dist': nyc_dist,
            'distance': distance,
            'bearing': bearing
        }

        # One-hot encoding
        for prefix, value, vals in [
            ('traffic', traffic_condition, traffic_vals),
            ('car', car_condition, car_vals),
            ('weather', weather_condition, weather_vals)
        ]:
            for val in vals:
                input_data[f"{prefix}_{val}"] = 1 if val == value else 0

        # Ensure all features are present in the correct order
        df = pd.DataFrame([input_data])
        for feature in FEATURE_ORDER:
            if feature not in df.columns:
                df[feature] = 0  # Fill missing one-hot encoded features with 0

        df = df[FEATURE_ORDER]  # Reorder columns to match training

        df.columns = df.columns.str.strip()
        
        # Scaling
        try:
            scaled_data = scaler.transform(df)
        except Exception as e:
            return JsonResponse({'error': f'Scaling error: {e}'}, status=500)

        # Prediction
        try:
            prediction = model.predict(scaled_data)[0]
            return JsonResponse({'predicted_fare': prediction}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Prediction error: {e}'}, status=500)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Unexpected error: {e}'}, status=500)
