import React, { useState } from 'react';
import {
    UserIcon, ClockIcon, MapPinIcon, ArrowPathIcon, CloudIcon,
  CurrencyDollarIcon, ArrowRightIcon, TruckIcon, WrenchIcon
  } from '@heroicons/react/24/outline';

interface FormData {
  passenger_count: number;
  pickup_datetime: string;
  jfk_dist: number;
  ewr_dist: number;
  lga_dist: number;
  sol_dist: number;
  nyc_dist: number;
  distance: number;
  bearing: number;
  traffic_condition: string;
  car_condition: string;
  Weather: string;
}

const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    passenger_count: 1,
    pickup_datetime: '',
    jfk_dist: 0,
    ewr_dist: 0,
    lga_dist: 0,
    sol_dist: 0,
    nyc_dist: 0,
    distance: 0,
    bearing: 0,
    traffic_condition: 'Flow Traffic',
    car_condition: 'Good',
    Weather: 'sunny',
  });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('dist') || name === 'bearing' || name === 'distance'
        ? parseFloat(value) || 0
        : name === 'passenger_count'
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/predict/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Prediction failed');
      setResult(`Predicted Fare: $${data.predicted_fare.toFixed(2)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-gray-300">
      {/* Row 1: Passenger Count & Pickup DateTime */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            How many people are you?
          </label>
          <div className="flex items-center">
            <UserIcon className="w-5 h-5 text-teal-400 absolute left-3" />
            <input
              type="number"
              name="passenger_count"
              value={formData.passenger_count}
              onChange={handleChange}
              min="0"
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 text-gray-300 bg-gray-800"
              required
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            When will your pickup be?
          </label>
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-teal-400 absolute left-3" />
            <input
              type="datetime-local"
              name="pickup_datetime"
              value={formData.pickup_datetime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pickup_datetime: e.target.value.replace('T', ' ') + ':00',
                }))
              }
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 text-gray-300 bg-gray-800"
              required
            />
          </div>
        </div>
      </div>

      {/* Row 2: Distance & Bearing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            How far is your trip in NYC?
          </label>
          <div className="flex items-center">
            <ArrowRightIcon className="w-5 h-5 text-teal-400 absolute left-3" />
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              step="0.1"
              min="0"
              placeholder="Trip Distance"
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 text-gray-300 bg-gray-800"
              required
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            What’s your travel direction (bearing)?
          </label>
          <div className="flex items-center">
            <ArrowPathIcon className="w-5 h-5 text-teal-400 absolute left-3" />
            <input
              type="number"
              name="bearing"
              value={formData.bearing}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="360"
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 text-gray-300 bg-gray-800"
              required
            />
          </div>
        </div>
      </div>

      {/* Row 3: Airport Distances */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          How far are you from NYC landmarks (JFK, EWR, LGA, SOL, and NYC, respectively)?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['jfk_dist', 'ewr_dist', 'lga_dist', 'sol_dist', 'nyc_dist'].map((field) => (
            <div key={field} className="relative">
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-teal-400 absolute left-3" />
                <input
                  type="number"
                  name={field}
                  value={formData[field as keyof FormData] as number}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  placeholder={field.split('_')[0].toUpperCase()}
                  className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 text-gray-300 bg-gray-800"
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Categorical Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            How’s the traffic today?
          </label>
          <div className="flex items-center">
            <TruckIcon className="w-5 h-5 text-teal-400 absolute left-3" />
            <select
              name="traffic_condition"
              value={formData.traffic_condition}
              onChange={handleChange}
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 text-gray-300 bg-gray-800 appearance-none"
            >
              <option value="Congested Traffic">Congested Traffic</option>
              <option value="Dense Traffic">Dense Traffic</option>
              <option value="Flow Traffic">Flow Traffic</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            How’s your taxi’s condition?
          </label>
          <div className="flex items-center">
            <WrenchIcon className="w-5 h-5 text-teal-400 absolute left-3" />
            <select
              name="car_condition"
              value={formData.car_condition}
              onChange={handleChange}
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 text-gray-300 bg-gray-800 appearance-none"
            >
              <option value="Bad">Bad</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            What’s the weather like?
          </label>
          <div className="flex items-center">
            <CloudIcon className="w-5 h-5 text-teal-400 absolute left-3" />
            <select
              name="weather_condition"
              value={formData.Weather}
              onChange={handleChange}
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 text-gray-300 bg-gray-800 appearance-none"
            >
              <option value="cloudy">Cloudy</option>
              <option value="rainy">Rainy</option>
              <option value="stormy">Stormy</option>
              <option value="sunny">Sunny</option>
              <option value="windy">Windy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg hover:bg-yellow-500 disabled:bg-yellow-300 transition flex items-center justify-center gap-2"
      >
        <CurrencyDollarIcon className="w-5 h-5 text-gray-900" />
        {loading ? 'Predicting...' : 'Predict NYC Fare'}
      </button>

      {/* Result/Error Display */}
      {result && (
        <div className="mt-4 p-4 bg-green-800 bg-opacity-80 text-gray-100 rounded-lg text-center font-semibold">
          {result}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-800 bg-opacity-80 text-gray-100 rounded-lg text-center font-semibold">
          {error}
        </div>
      )}
    </form>
  );
};

export default PredictionForm;