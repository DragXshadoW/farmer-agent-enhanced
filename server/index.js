const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Farmer Agent API is running!' });
});

// Farmer Assistance API
app.post('/api/assistance', async (req, res) => {
  try {
    const { crop, soilType, weather, issue } = req.body;
    
    // Mock AI response - in real app, this would connect to AI service
    const recommendations = generateRecommendations(crop, soilType, weather, issue);
    
    res.json({
      success: true,
      recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Weather API
app.get('/api/weather/:location', async (req, res) => {
  try {
    const { location } = req.params;
    
    // Mock weather data - in real app, this would connect to weather API
    const weatherData = {
      location,
      temperature: Math.floor(Math.random() * 30) + 10,
      humidity: Math.floor(Math.random() * 40) + 30,
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      forecast: [
        { day: 'Today', temp: Math.floor(Math.random() * 30) + 10, condition: 'Sunny' },
        { day: 'Tomorrow', temp: Math.floor(Math.random() * 30) + 10, condition: 'Cloudy' },
        { day: 'Day 3', temp: Math.floor(Math.random() * 30) + 10, condition: 'Rainy' }
      ]
    };
    
    res.json({ success: true, data: weatherData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crop Database API
app.get('/api/crops', (req, res) => {
  const crops = [
    { id: 1, name: 'Wheat', season: 'Winter', duration: '120 days', waterNeeds: 'Medium' },
    { id: 2, name: 'Rice', season: 'Monsoon', duration: '150 days', waterNeeds: 'High' },
    { id: 3, name: 'Corn', season: 'Summer', duration: '90 days', waterNeeds: 'Medium' },
    { id: 4, name: 'Soybeans', season: 'Spring', duration: '100 days', waterNeeds: 'Low' },
    { id: 5, name: 'Cotton', season: 'Summer', duration: '180 days', waterNeeds: 'Medium' },
    { id: 6, name: 'Sugarcane', season: 'Year-round', duration: '365 days', waterNeeds: 'High' }
  ];
  
  res.json({ success: true, crops });
});

// Soil Analysis API
app.post('/api/soil-analysis', (req, res) => {
  try {
    const { soilType, ph, nitrogen, phosphorus, potassium } = req.body;
    
    const analysis = {
      soilType,
      ph: parseFloat(ph),
      nitrogen: parseFloat(nitrogen),
      phosphorus: parseFloat(phosphorus),
      potassium: parseFloat(potassium),
      recommendations: generateSoilRecommendations(ph, nitrogen, phosphorus, potassium)
    };
    
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper functions
function generateRecommendations(crop, soilType, weather, issue) {
  const recommendations = {
    irrigation: 'Maintain regular irrigation schedule based on weather conditions.',
    fertilization: 'Apply balanced fertilizer with NPK ratio 10:26:26.',
    pestControl: 'Monitor for common pests and apply organic pesticides if needed.',
    harvesting: 'Harvest when crop shows optimal maturity indicators.',
    storage: 'Store in cool, dry conditions to prevent spoilage.'
  };
  
  if (weather === 'dry') {
    recommendations.irrigation = 'Increase irrigation frequency. Consider drip irrigation for water efficiency.';
  }
  
  if (issue === 'pest') {
    recommendations.pestControl = 'Apply neem-based organic pesticide. Monitor daily for pest activity.';
  }
  
  return recommendations;
}

function generateSoilRecommendations(ph, nitrogen, phosphorus, potassium) {
  const recommendations = [];
  
  if (ph < 6.0) {
    recommendations.push('Add lime to increase soil pH');
  } else if (ph > 7.5) {
    recommendations.push('Add sulfur to decrease soil pH');
  }
  
  if (nitrogen < 50) {
    recommendations.push('Apply nitrogen-rich fertilizer');
  }
  
  if (phosphorus < 30) {
    recommendations.push('Add phosphorus fertilizer');
  }
  
  if (potassium < 40) {
    recommendations.push('Apply potassium fertilizer');
  }
  
  return recommendations.length > 0 ? recommendations : ['Soil conditions are optimal for most crops'];
}

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Farmer Agent Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
});
