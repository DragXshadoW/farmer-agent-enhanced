import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = {
        current: {
          temperature: Math.floor(Math.random() * 30) + 15,
          humidity: Math.floor(Math.random() * 40) + 30,
          windSpeed: Math.floor(Math.random() * 20) + 5,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
          visibility: Math.floor(Math.random() * 10) + 5,
          pressure: Math.floor(Math.random() * 50) + 1000
        },
        forecast: [
          { day: 'Today', temp: Math.floor(Math.random() * 30) + 15, condition: 'Sunny', humidity: 65 },
          { day: 'Tomorrow', temp: Math.floor(Math.random() * 30) + 15, condition: 'Cloudy', humidity: 70 },
          { day: 'Day 3', temp: Math.floor(Math.random() * 30) + 15, condition: 'Rainy', humidity: 85 },
          { day: 'Day 4', temp: Math.floor(Math.random() * 30) + 15, condition: 'Partly Cloudy', humidity: 60 },
          { day: 'Day 5', temp: Math.floor(Math.random() * 30) + 15, condition: 'Sunny', humidity: 55 }
        ],
        alerts: [
          { type: 'warning', message: 'Heavy rainfall expected in next 24 hours', icon: CloudRain },
          { type: 'info', message: 'Optimal conditions for crop growth', icon: CheckCircle }
        ]
      };
      
      setWeatherData(mockData);
      toast.success('Weather data updated!');
    } catch (error) {
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'partly cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getFarmingRecommendations = (weather) => {
    const recommendations = [];
    
    if (weather.current.temperature > 30) {
      recommendations.push('Increase irrigation frequency due to high temperatures');
    }
    
    if (weather.current.humidity > 80) {
      recommendations.push('Monitor for fungal diseases in high humidity');
    }
    
    if (weather.current.windSpeed > 15) {
      recommendations.push('Protect crops from strong winds');
    }
    
    if (weather.forecast.some(day => day.condition === 'Rainy')) {
      recommendations.push('Prepare for rainfall - avoid spraying pesticides');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Weather conditions are optimal for farming activities');
    }
    
    return recommendations;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">{t('weather.title')}</h1>
        </div>
        <p className="text-gray-600 text-lg">{t('weather.sub')}</p>
      </motion.div>

      {/* Location Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('weather.inputPlaceholder')}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchWeatherData}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-700 transition-all duration-300"
          >
            {t('weather.update')}
          </motion.button>
        </div>
      </motion.div>

      {weatherData && (
        <>
          {/* Current Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('weather.current')} {location}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {getWeatherIcon(weatherData.current.condition)}
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {weatherData.current.temperature}°C
                </h3>
                <p className="text-gray-600">{weatherData.current.condition}</p>
              </div>
              
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{t('weather.humidity')}</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{weatherData.current.humidity}%</p>
              </div>
              
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Wind className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{t('weather.wind')}</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{weatherData.current.windSpeed} km/h</p>
              </div>
              
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">{t('weather.visibility')}</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{weatherData.current.visibility} km</p>
              </div>
            </div>
          </motion.div>

          {/* 5-Day Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-500" />
              {t('weather.forecastTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/50 rounded-xl p-4 text-center card-hover"
                >
                  <p className="font-medium text-gray-800 mb-2">{day.day}</p>
                  <div className="flex justify-center mb-3">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <p className="text-xl font-bold text-gray-800 mb-1">{day.temp}°C</p>
                  <p className="text-sm text-gray-600 mb-2">{day.condition}</p>
                  <p className="text-xs text-gray-500">Humidity: {day.humidity}%</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Weather Alerts */}
          {weatherData.alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
                {t('weather.alerts')}
              </h2>
              <div className="space-y-4">
                {weatherData.alerts.map((alert, index) => {
                  const Icon = alert.icon;
                  return (
                    <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl ${
                      alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        alert.type === 'warning' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <p className="text-gray-800">{alert.message}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Farming Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
              {t('weather.recommendations')}
            </h2>
            <div className="space-y-3">
              {getFarmingRecommendations(weatherData).map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Weather;
