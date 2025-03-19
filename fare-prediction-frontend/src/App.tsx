import React from 'react';
import PredictionForm from './components/PredictionForm';
import './App.css'

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-white text-gray-100 relative overflow-hidden font-montserrat">
      {/* Navbar */}
      <nav className="bg-gray-900 bg-opacity-90 shadow-md px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <h1 className="text-2xl font-semibold text-yellow-400 animate-groq-fade-in-first">
                NYC
              </h1>
              <h1 className="text-2xl font-semibold text-gray-100 animate-groq-fade-in-second">
                FareFinder
              </h1>
            </div>
          </div>
          <ul className="flex space-x-6">
            <li><a href="#about" className="hover:text-yellow-400 transition">About</a></li>
            <li><a href="#predict" className="hover:text-yellow-400 transition">Prediction Form</a></li>
            <li><a href="#contact" className="hover:text-yellow-400 transition">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Section 1: About */}
          <section id="about" className="bg-transparent rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-semibold text-yellow-400 mb-4">About NYC FareFinder</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to <span className="font-semibold text-gray-100">NYC FareFinder</span>, your go-to tool for predicting taxi fares in New York City. Whether you’re planning a ride across Manhattan or heading to an airport, our app uses advanced machine learning to estimate your fare based on distance, traffic, weather, and more. Save time, plan smarter, and ride with confidence!
            </p>
          </section>

          {/* Section 2: Prediction Form */}
          <section id="predict" className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-white/80 shadow-lg rounded-lg p-8 border-2 border-yellow-400 animate-glow">
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">Predict Your NYC Taxi Fare</h2>
            <PredictionForm />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
          <p>Email: <a href="mailto:support@nycfarefinder.com" className="hover:text-yellow-400">support@nycfarefinder.com</a></p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Taxi Lane, New York, NY 10001</p>
          <p className="mt-2 text-sm">© 2025 NYC FareFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;