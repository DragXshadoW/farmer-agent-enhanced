import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Assistance from './pages/Assistance';
import Weather from './pages/Weather';
import Crops from './pages/Crops';
import Illness from './pages/Illness';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assistance" element={<Assistance />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/illness" element={<Illness />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
