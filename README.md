# NYC FareFinder Web App 🚖

NYC FareFinder is a web application designed to predict taxi fares in New York City using machine learning. Built with a modern tech stack, the app leverages an **Extra Trees Regressor** model (R² score of 0.94) to provide accurate fare predictions, helping users plan their trips efficiently.

## Screenshots
Below are some screenshots showcasing the NYC FareFinder interface:

| **Fare Prediction Form** | **Prediction Result** |
|--------------------------|-----------------------|
| ![Fare Prediction Form](screenshots/src1.png) | ![Prediction Result](screenshots/src2.png) |


## Features
- **Accurate Fare Prediction**: Predicts taxi fares using an Extra Trees Regressor (R² score: 0.94) based on factors like passenger count, traffic, weather conditions, pickup time, and distance.
- **Responsive Design**: Fully responsive layout using Tailwind CSS, with a glowing form border for user inputs.

## Tech Stack
- **Frontend**: Vite, React (TypeScript), Tailwind CSS
- **Backend**: Django (Python)

## Prerequisites
Before setting up the project, ensure you have the following installed:

- **Node.js**: `v22.14.0`
- **npm**: `11.2.0`
- **Python**: `3.11.9`

## Project Structure
The project is divided into two main directories:
- `fare-prediction-frontend/`: Contains the React frontend.
- `fare_prediction/`: Contains the Django backend and ML models.

## Setup Instructions

### Step 1: Clone the Repository
Clone the project repository to your local machine:
```bash
git clone https://github.com/mohababsa/nyc-farefinder.git
cd nyc-farefinder
