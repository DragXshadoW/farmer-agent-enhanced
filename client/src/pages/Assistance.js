import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Assistance = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI farming assistant. How can I help you today? I can provide advice on crops, soil, weather, pest control, and more!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const botResponse = generateAIResponse(inputValue);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      toast.success('AI response received!');
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (query) => {
    const responses = {
      'pest': 'For pest control, I recommend using neem-based organic pesticides. Monitor your crops daily and apply treatment at the first sign of infestation. Consider companion planting with marigolds to naturally deter pests.',
      'fertilizer': 'Based on your soil type, I suggest using a balanced NPK fertilizer (10:26:26). Apply during the early growth stage and avoid over-fertilization. Consider organic options like compost or vermicompost for better soil health.',
      'irrigation': 'For optimal irrigation, water your crops early in the morning to reduce evaporation. Use drip irrigation for water efficiency. Monitor soil moisture levels and adjust frequency based on weather conditions.',
      'harvest': 'Harvest timing is crucial for quality and yield. Look for maturity indicators like color change, firmness, and size. Harvest in the morning when temperatures are cooler to maintain freshness.',
      'soil': 'Regular soil testing helps maintain optimal conditions. Test pH, nitrogen, phosphorus, and potassium levels every 3-6 months. Add organic matter to improve soil structure and fertility.',
      'weather': 'Monitor weather forecasts regularly and adjust farming practices accordingly. Protect crops during extreme weather events. Consider using weather-resistant crop varieties.',
      'crop': 'Choose crops based on your climate, soil type, and market demand. Practice crop rotation to prevent soil depletion and pest buildup. Consider intercropping for better resource utilization.',
      'disease': 'Prevent diseases through proper spacing, good air circulation, and regular monitoring. Use disease-resistant varieties when possible. Remove infected plants immediately to prevent spread.',
      'organic': 'Organic farming focuses on natural methods. Use compost, crop rotation, and biological pest control. Avoid synthetic chemicals and focus on soil health and biodiversity.',
      'profit': 'Maximize profits through proper planning, efficient resource use, and market research. Diversify crops, optimize input costs, and consider value-added products. Track expenses and yields carefully.'
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        return response;
      }
    }

    return 'I understand your question about farming. For the best advice, please provide more specific details about your crop type, soil conditions, or the specific issue you\'re facing. I\'m here to help with personalized recommendations!';
  };

  const quickQuestions = [
    'How to control pests naturally?',
    'Best fertilizer for my crops?',
    'When should I harvest?',
    'How to improve soil health?',
    'Weather impact on farming?'
  ];

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
          <h1 className="text-3xl font-bold gradient-text">AI Farming Assistant</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Get personalized farming advice powered by artificial intelligence
        </p>
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
          Quick Questions
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
            Chat with AI Assistant
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">AI Online</span>
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
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about farming..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent form-input"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-xl font-medium hover:from-green-500 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </motion.button>
        </div>
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
          <h3 className="font-semibold text-gray-800 mb-2">Smart Recommendations</h3>
          <p className="text-gray-600 text-sm">Get personalized advice based on your specific farming conditions</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
          <p className="text-gray-600 text-sm">Access farming expertise anytime, anywhere with instant responses</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">AI-Powered</h3>
          <p className="text-gray-600 text-sm">Advanced AI technology provides accurate and up-to-date farming insights</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Assistance;
