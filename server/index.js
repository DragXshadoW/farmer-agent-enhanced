const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();
// const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

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

// OpenAI Chat Proxy (removed by user request)

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

// AI Image Analysis API for Crop Disease Detection
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    // In a real implementation, this would:
    // 1. Process the uploaded image with AI/ML models
    // 2. Use computer vision to identify crop type
    // 3. Detect disease symptoms and patterns
    // 4. Return detailed analysis results
    
    // For now, we'll simulate AI analysis based on image characteristics
    const imageBuffer = req.file.buffer;
    const imageSize = imageBuffer.length;
    
    // Mock analysis - in reality, this would use actual AI models
    const mockAnalysis = {
      cropType: 'Tomato', // AI would detect this from image
      detectedSymptoms: ['Brown spots', 'Yellowing leaves'],
      confidence: 0.85,
      aiProcessed: true,
      imageSize: imageSize,
      timestamp: new Date().toISOString()
    };
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.json({ 
      success: true, 
      analysis: mockAnalysis 
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze image with AI' 
    });
  }
});

// Enhanced Chat API with Context Awareness
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Enhanced AI response generation
    const response = await generateEnhancedChatResponse(message, context, conversationHistory);
    
    res.json({
      success: true,
      response: response.content,
      suggestions: response.suggestions,
      contextUpdate: response.contextUpdate,
      weatherData: response.weatherData,
      marketData: response.marketData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat message' 
    });
  }
});

// Enhanced Chat Response Generation
async function generateEnhancedChatResponse(message, context, conversationHistory) {
  const lowerMessage = message.toLowerCase();
  
  // Extract intent and entities
  const intent = extractIntent(lowerMessage);
  const entities = extractEntities(lowerMessage);
  
  // Generate contextual response
  let response = await generateContextualResponse(intent, entities, context, conversationHistory);
  
  // Add suggestions based on context and intent
  const suggestions = generateSuggestions(intent, entities, context);
  
  // Check for weather data if relevant
  let weatherData = null;
  if (intent === 'weather' && context.location) {
    weatherData = await getWeatherData(context.location);
  }
  
  // Check for market data if relevant
  let marketData = null;
  if (intent === 'market' && entities.crops) {
    marketData = await getMarketData(entities.crops[0]);
  }
  
  // Update context if new information is provided
  let contextUpdate = null;
  if (entities.crops && entities.crops.length > 0) {
    contextUpdate = { crops: [...(context.crops || []), ...entities.crops] };
  }
  
  return {
    content: response,
    suggestions: suggestions,
    contextUpdate: contextUpdate,
    weatherData: weatherData,
    marketData: marketData
  };
}

function extractIntent(message) {
  const intents = {
    weather: ['weather', 'rain', 'temperature', 'forecast', 'climate', 'storm'],
    pest: ['pest', 'insect', 'bug', 'aphid', 'caterpillar', 'disease', 'infected'],
    soil: ['soil', 'fertilizer', 'nutrient', 'ph', 'compost', 'dirt'],
    crop: ['plant', 'seed', 'harvest', 'crop', 'variety', 'grow'],
    irrigation: ['water', 'irrigation', 'drip', 'sprinkler', 'watering'],
    market: ['price', 'market', 'sell', 'profit', 'cost', 'revenue'],
    advice: ['how', 'what', 'when', 'where', 'why', 'help', 'advice']
  };

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return intent;
    }
  }
  return 'general';
}

function extractEntities(message) {
  const entities = {
    crops: ['tomato', 'wheat', 'rice', 'corn', 'potato', 'onion', 'cotton', 'sugarcane', 'maize', 'brinjal', 'cabbage', 'cauliflower', 'bajra', 'jowar', 'dal', 'chana', 'moong', 'urad', 'turmeric', 'coriander', 'cumin', 'chili', 'mango', 'banana', 'apple', 'orange', 'tobacco'],
    locations: ['field', 'farm', 'garden', 'greenhouse', 'plot'],
    timeframes: ['today', 'tomorrow', 'week', 'month', 'season', 'spring', 'summer', 'fall', 'winter'],
    problems: ['yellow', 'brown', 'spots', 'wilting', 'dying', 'sick', 'rot', 'mold']
  };

  const foundEntities = {};
  for (const [type, values] of Object.entries(entities)) {
    const found = values.filter(value => message.includes(value));
    if (found.length > 0) {
      foundEntities[type] = found;
    }
  }
  return foundEntities;
}

async function generateContextualResponse(intent, entities, context, history) {
  const responses = {
    weather: () => {
      if (context.location) {
        return `I can help you with weather information for your area. Based on your location, I recommend checking the forecast regularly and adjusting your farming practices accordingly. Would you like me to get the current weather data for your region?`;
      }
      return `I can help you with weather-related farming advice. To provide accurate weather information, could you tell me your location? I can then give you specific forecasts and recommendations.`;
    },
    
    pest: () => {
      const crop = entities.crops?.[0];
      if (crop) {
        return `For ${crop} pest control, I recommend an integrated approach: 1) Regular monitoring and early detection, 2) Use beneficial insects like ladybugs, 3) Apply organic treatments like neem oil or insecticidal soap, 4) Practice crop rotation. What specific pests are you seeing on your ${crop}?`;
      }
      return `I can help with comprehensive pest control strategies. What crops are you growing and what pests or diseases are you dealing with? I'll provide specific solutions based on your situation.`;
    },
    
    soil: () => {
      if (context.soilType) {
        return `For your ${context.soilType} soil, I recommend regular testing every 3-6 months, adding organic matter like compost, and maintaining proper pH levels. What specific soil issues are you facing?`;
      }
      return `Soil health is the foundation of successful farming. I can help with soil testing, amendments, fertility management, and organic improvements. What's your current soil situation and what are you trying to achieve?`;
    },
    
    crop: () => {
      const crop = entities.crops?.[0];
      if (crop) {
        return `Excellent choice with ${crop}! I can provide specific advice on planting timing, spacing, care requirements, and harvesting. What stage is your ${crop} at currently, and what specific guidance do you need?`;
      }
      return `I can help you choose the right crops for your conditions and provide comprehensive growing advice. What are you planning to grow, and what's your farming environment like?`;
    },
    
    irrigation: () => {
      return `Efficient irrigation is crucial for water conservation and optimal plant health. I can help you choose the right irrigation system (drip, sprinkler, or flood), create watering schedules, and optimize water usage. What's your current irrigation setup and what challenges are you facing?`;
    },
    
    market: () => {
      return `I can help with Indian market analysis, APMC pricing strategies, and selling tips. I can provide current market prices from major Indian markets like Mumbai APMC, Delhi Azadpur, and others. I can suggest the best times to sell and help you maximize profits in the Indian agricultural market. What crops are you looking to sell?`;
    },
    
    general: () => {
      return `I'm your comprehensive farming assistant! I can help with crop planning, pest control, soil management, weather monitoring, irrigation, market strategies, and much more. What aspect of farming would you like to focus on today?`;
    }
  };

  return responses[intent] ? responses[intent]() : responses.general();
}

function generateSuggestions(intent, entities, context) {
  const suggestionMap = {
    weather: ['Check weather forecast', 'Weather impact on crops', 'Seasonal planning', 'Storm preparation'],
    pest: ['Natural pest control', 'Pest identification', 'Prevention strategies', 'Organic treatments'],
    soil: ['Soil testing', 'Organic amendments', 'Fertilizer recommendations', 'pH adjustment'],
    crop: ['Planting schedule', 'Crop care tips', 'Harvest timing', 'Variety selection'],
    irrigation: ['Water efficiency', 'Irrigation systems', 'Watering schedule', 'Drip irrigation setup'],
    market: ['Indian market prices', 'APMC selling strategies', 'Profit optimization', 'Best selling time', 'MSP rates'],
    general: ['Weather check', 'Pest control help', 'Soil health tips', 'Crop advice', 'Market analysis']
  };

  return suggestionMap[intent] || suggestionMap.general;
}

async function getWeatherData(location) {
  // Mock weather data - in real implementation, integrate with weather API
  return {
    temperature: Math.floor(Math.random() * 30) + 10,
    condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 40) + 30,
    location: location
  };
}

async function getMarketData(crop) {
  // Indian market data in INR (Indian Rupees) - based on current market rates
  const indianPrices = {
    // Vegetables (per kg)
    tomato: { price: 45, unit: 'kg', category: 'Vegetable', market: 'Mumbai APMC' },
    potato: { price: 25, unit: 'kg', category: 'Vegetable', market: 'Delhi Azadpur' },
    onion: { price: 35, unit: 'kg', category: 'Vegetable', market: 'Nashik APMC' },
    brinjal: { price: 30, unit: 'kg', category: 'Vegetable', market: 'Bangalore APMC' },
    cabbage: { price: 20, unit: 'kg', category: 'Vegetable', market: 'Kolkata APMC' },
    cauliflower: { price: 40, unit: 'kg', category: 'Vegetable', market: 'Pune APMC' },
    
    // Cereals (per kg)
    wheat: { price: 28, unit: 'kg', category: 'Cereal', market: 'Karnal Mandi' },
    rice: { price: 35, unit: 'kg', category: 'Cereal', market: 'Chandigarh APMC' },
    corn: { price: 22, unit: 'kg', category: 'Cereal', market: 'Indore APMC' },
    bajra: { price: 18, unit: 'kg', category: 'Cereal', market: 'Rajasthan Mandi' },
    jowar: { price: 25, unit: 'kg', category: 'Cereal', market: 'Maharashtra APMC' },
    
    // Pulses (per kg)
    dal: { price: 120, unit: 'kg', category: 'Pulse', market: 'Delhi APMC' },
    chana: { price: 65, unit: 'kg', category: 'Pulse', market: 'Indore APMC' },
    moong: { price: 85, unit: 'kg', category: 'Pulse', market: 'Karnataka APMC' },
    urad: { price: 95, unit: 'kg', category: 'Pulse', market: 'Tamil Nadu APMC' },
    
    // Cash Crops
    cotton: { price: 6500, unit: 'quintal', category: 'Cash Crop', market: 'Gujarat APMC' },
    sugarcane: { price: 320, unit: 'quintal', category: 'Cash Crop', market: 'UP Mandi' },
    tobacco: { price: 180, unit: 'kg', category: 'Cash Crop', market: 'Andhra Pradesh' },
    
    // Spices (per kg)
    turmeric: { price: 180, unit: 'kg', category: 'Spice', market: 'Erode APMC' },
    coriander: { price: 85, unit: 'kg', category: 'Spice', market: 'Rajasthan Mandi' },
    cumin: { price: 250, unit: 'kg', category: 'Spice', market: 'Gujarat APMC' },
    chili: { price: 120, unit: 'kg', category: 'Spice', market: 'Guntur APMC' },
    
    // Fruits (per kg)
    mango: { price: 80, unit: 'kg', category: 'Fruit', market: 'UP Mandi' },
    banana: { price: 35, unit: 'kg', category: 'Fruit', market: 'Tamil Nadu APMC' },
    apple: { price: 150, unit: 'kg', category: 'Fruit', market: 'Himachal Pradesh' },
    orange: { price: 60, unit: 'kg', category: 'Fruit', market: 'Nagpur APMC' }
  };
  
  const cropData = indianPrices[crop.toLowerCase()] || { 
    price: 50, 
    unit: 'kg', 
    category: 'General', 
    market: 'Local APMC' 
  };
  
  // Generate realistic price trends based on season and market conditions
  const trends = ['up', 'down', 'stable'];
  const trend = trends[Math.floor(Math.random() * 3)];
  
  // Add some price variation based on trend
  let finalPrice = cropData.price;
  if (trend === 'up') {
    finalPrice = Math.round(cropData.price * (1 + Math.random() * 0.1));
  } else if (trend === 'down') {
    finalPrice = Math.round(cropData.price * (1 - Math.random() * 0.1));
  }
  
  return {
    crop: crop,
    price: finalPrice,
    unit: cropData.unit,
    category: cropData.category,
    market: cropData.market,
    currency: 'INR',
    trend: trend,
    lastUpdated: new Date().toISOString()
  };
}

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
