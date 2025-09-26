import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, MessageCircle, Mic, MicOff, Volume2, VolumeX, MapPin, Calendar, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n';

const Assistance = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI farming assistant. I can help you with crop advice, weather updates, pest control, soil analysis, and much more! What would you like to know about today?',
      timestamp: new Date(),
      suggestions: ['Check weather for my area', 'Help with pest control', 'Crop planting advice', 'Soil health tips']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState({
    location: null,
    crops: [],
    soilType: null,
    farmingExperience: null,
    lastWeatherCheck: null
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { t } = useI18n();
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition failed');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Speech synthesis
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Call enhanced AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          context: userContext,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        contextUpdate: data.contextUpdate || null,
        weatherData: data.weatherData || null,
        marketData: data.marketData || null
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update user context if provided
      if (data.contextUpdate) {
        setUserContext(prev => ({ ...prev, ...data.contextUpdate }));
      }

      // Speak the response if voice is enabled
      if (data.response && data.response.length < 200) {
        speakText(data.response);
      }

      toast.success('AI response received!');
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to local response generation
      const fallbackResponse = generateEnhancedAIResponse(currentInput, userContext, messages);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: fallbackResponse.content,
        timestamp: new Date(),
        suggestions: fallbackResponse.suggestions || []
      };

      setMessages(prev => [...prev, botMessage]);
      toast.error('Using offline mode');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced AI response generation with context awareness
  const generateEnhancedAIResponse = (query, context, conversationHistory) => {
    const lowerQuery = query.toLowerCase();
    
    // Extract intent and entities from query
    const intent = extractIntent(lowerQuery);
    const entities = extractEntities(lowerQuery);
    
    // Generate contextual response
    let response = generateContextualResponse(intent, entities, context, conversationHistory);
    
    // Add suggestions based on context and intent
    const suggestions = generateSuggestions(intent, entities, context);
    
    return {
      content: response,
      suggestions: suggestions
    };
  };

  const extractIntent = (query) => {
    const intents = {
      weather: ['weather', 'rain', 'temperature', 'forecast', 'climate'],
      pest: ['pest', 'insect', 'bug', 'aphid', 'caterpillar', 'disease'],
      soil: ['soil', 'fertilizer', 'nutrient', 'ph', 'compost'],
      crop: ['plant', 'seed', 'harvest', 'crop', 'variety'],
      irrigation: ['water', 'irrigation', 'drip', 'sprinkler'],
      market: ['price', 'market', 'sell', 'profit', 'cost'],
      advice: ['how', 'what', 'when', 'where', 'why', 'help']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => query.includes(keyword))) {
        return intent;
      }
    }
    return 'general';
  };

  const extractEntities = (query) => {
    const entities = {
      crops: ['tomato', 'wheat', 'rice', 'corn', 'potato', 'onion', 'cotton', 'sugarcane'],
      locations: ['field', 'farm', 'garden', 'greenhouse'],
      timeframes: ['today', 'tomorrow', 'week', 'month', 'season'],
      problems: ['yellow', 'brown', 'spots', 'wilting', 'dying', 'sick']
    };

    const foundEntities = {};
    for (const [type, values] of Object.entries(entities)) {
      const found = values.filter(value => query.includes(value));
      if (found.length > 0) {
        foundEntities[type] = found;
      }
    }
    return foundEntities;
  };

  const generateContextualResponse = (intent, entities, context, history) => {
    const responses = {
      weather: () => {
        if (context.location) {
          return `Based on your location, I can help you with weather information. For accurate forecasts, I'd need to know your specific area. Would you like me to check the weather for your region?`;
        }
        return `I can help you with weather-related farming advice. What's your location so I can provide accurate weather information?`;
      },
      
      pest: () => {
        const crop = entities.crops?.[0];
        if (crop) {
          return `For ${crop} pest control, I recommend integrated pest management. Start with monitoring, use beneficial insects, and apply organic treatments like neem oil. What specific pests are you seeing on your ${crop}?`;
        }
        return `I can help with pest control strategies. What crops are you growing and what pests are you dealing with?`;
      },
      
      soil: () => {
        if (context.soilType) {
          return `For your ${context.soilType} soil, I recommend regular testing and organic amendments. What specific soil issues are you facing?`;
        }
        return `Soil health is crucial for successful farming. I can help with soil testing, amendments, and fertility management. What's your current soil situation?`;
      },
      
      crop: () => {
        const crop = entities.crops?.[0];
        if (crop) {
          return `Great choice with ${crop}! I can provide specific advice on planting, care, and harvesting. What stage is your ${crop} at currently?`;
        }
        return `I can help you choose the right crops for your conditions and provide growing advice. What are you planning to grow?`;
      },
      
      irrigation: () => {
        return `Efficient irrigation is key to water conservation and plant health. I can help you choose the right irrigation system and schedule. What's your current watering setup?`;
      },
      
      market: () => {
        return `I can help with market analysis and pricing strategies. What crops are you looking to sell and in what market?`;
      },
      
      general: () => {
        return `I'm here to help with all aspects of farming! I can assist with crop planning, pest control, soil management, weather monitoring, and market strategies. What would you like to focus on today?`;
      }
    };

    return responses[intent] ? responses[intent]() : responses.general();
  };

  const generateSuggestions = (intent, entities, context) => {
    const suggestionMap = {
      weather: ['Check weather forecast', 'Weather impact on crops', 'Seasonal planning'],
      pest: ['Natural pest control', 'Pest identification', 'Prevention strategies'],
      soil: ['Soil testing', 'Organic amendments', 'Fertilizer recommendations'],
      crop: ['Planting schedule', 'Crop care tips', 'Harvest timing'],
      irrigation: ['Water efficiency', 'Irrigation systems', 'Watering schedule'],
      market: ['Market prices', 'Selling strategies', 'Profit optimization'],
      general: ['Weather check', 'Pest control help', 'Soil health tips', 'Crop advice']
    };

    return suggestionMap[intent] || suggestionMap.general;
  };

  const quickQuestions = [
    'Check weather for my area',
    'Help with pest control',
    'Crop planting advice',
    'Soil health tips',
    'Market prices today',
    'Irrigation recommendations',
    'Harvest timing guide',
    'Organic farming tips'
  ];

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">{t('assistance.title')}</h1>
        </div>
        <p className="text-gray-600 text-lg">{t('assistance.sub')}</p>
      </motion.div>

      {/* Quick Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-green-500" />
          {t('assistance.quick')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInputValue(question)}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm font-medium transition-colors"
            >
              {question}
            </motion.button>
          ))}
        </div>
        
        {/* User Context Display */}
        {userContext.location || userContext.crops.length > 0 ? (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Your Farming Context:</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {userContext.location && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {userContext.location}
                </span>
              )}
              {userContext.crops.map((crop, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  {crop}
                </span>
              ))}
              {userContext.soilType && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                  {userContext.soilType} soil
                </span>
              )}
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
            {t('assistance.chat')}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">{t('assistance.online')}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                      : 'bg-gradient-to-br from-green-400 to-emerald-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Show additional data for bot messages */}
                    {message.type === 'bot' && (
                      <div className="mt-3 space-y-2">
                        {/* Weather Data */}
                        {message.weatherData && (
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="flex items-center text-xs text-blue-700">
                              <Calendar className="w-3 h-3 mr-1" />
                              Weather: {message.weatherData.temperature}°C, {message.weatherData.condition}
                            </div>
                          </div>
                        )}
                        
                        {/* Market Data */}
                        {message.marketData && (
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-green-700">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span className="font-medium">Indian Market Price</span>
                              </div>
                              <div className="text-sm text-green-800">
                                <span className="font-semibold">{message.marketData.crop}</span> - 
                                ₹{message.marketData.price}/{message.marketData.unit}
                              </div>
                              <div className="text-xs text-green-600">
                                {message.marketData.market} • {message.marketData.category}
                              </div>
                              <div className="flex items-center text-xs">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  message.marketData.trend === 'up' ? 'bg-red-100 text-red-700' :
                                  message.marketData.trend === 'down' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {message.marketData.trend === 'up' ? '↗ Rising' :
                                   message.marketData.trend === 'down' ? '↘ Falling' : '→ Stable'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                    <span className="text-sm text-gray-600">{t('assistance.thinking')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('assistance.inputPlaceholder')}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent form-input"
              disabled={isLoading}
            />
            {/* Voice Input Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-xl font-medium hover:from-green-500 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{t('assistance.send')}</span>
          </motion.button>
          
          {/* Voice Output Toggle */}
          <button
            onClick={() => setIsSpeaking(!isSpeaking)}
            className={`px-3 py-3 rounded-xl transition-colors ${
              isSpeaking 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            disabled={isLoading}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Voice Status */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            {isListening && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Listening...</span>
              </>
            )}
            {isSpeaking && (
              <>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Speaking...</span>
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">{t('assistance.featureSmart')}</h3>
          <p className="text-gray-600 text-sm">{t('assistance.featureSmartSub')}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">{t('assistance.featureSupport')}</h3>
          <p className="text-gray-600 text-sm">{t('assistance.featureSupportSub')}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">{t('assistance.featureAI')}</h3>
          <p className="text-gray-600 text-sm">{t('assistance.featureAISub')}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Assistance;
