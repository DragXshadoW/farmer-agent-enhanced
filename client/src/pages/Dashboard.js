import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Cloud, 
  Droplets, 
  Thermometer, 
  Sun, 
  Wind,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '../i18n';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWeatherData({
        temperature: 28,
        humidity: 65,
        condition: 'Sunny',
        windSpeed: 12
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statsCards = [
    {
      title: 'Crop Health',
      value: '95%',
      change: '+2.5%',
      icon: TrendingUp,
      color: 'from-green-400 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Soil Moisture',
      value: '78%',
      change: '-1.2%',
      icon: Droplets,
      color: 'from-blue-400 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pest Alert',
      value: 'Low',
      change: 'Stable',
      icon: AlertTriangle,
      color: 'from-yellow-400 to-orange-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Harvest Ready',
      value: '15 days',
      change: 'On track',
      icon: Calendar,
      color: 'from-purple-400 to-indigo-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const quickActions = [
    {
      title: t('nav.assistance'),
      description: t('assistance.sub'),
      icon: '🤖',
      path: '/assistance',
      color: 'from-green-400 to-emerald-600'
    },
    {
      title: t('nav.weather'),
      description: t('weather.sub'),
      icon: '🌤️',
      path: '/weather',
      color: 'from-blue-400 to-cyan-600'
    },
    {
      title: t('nav.crops'),
      description: t('crops.sub'),
      icon: '🌾',
      path: '/crops',
      color: 'from-yellow-400 to-orange-600'
    },
    {
      title: t('nav.soil'),
      description: t('soil.sub'),
      icon: '🧪',
      path: '/soil-analysis',
      color: 'from-purple-400 to-indigo-600'
    }
  ];

  const chartData = [
    { name: 'Mon', yield: 65, moisture: 70, temp: 25 },
    { name: 'Tue', yield: 68, moisture: 72, temp: 26 },
    { name: 'Wed', yield: 72, moisture: 75, temp: 28 },
    { name: 'Thu', yield: 70, moisture: 73, temp: 27 },
    { name: 'Fri', yield: 75, moisture: 78, temp: 29 },
    { name: 'Sat', yield: 78, moisture: 80, temp: 30 },
    { name: 'Sun', yield: 82, moisture: 82, temp: 31 }
  ];

  const recentActivities = [
    { action: 'Irrigation completed', time: '2 hours ago', status: 'success' },
    { action: 'Fertilizer applied', time: '1 day ago', status: 'success' },
    { action: 'Pest monitoring', time: '2 days ago', status: 'warning' },
    { action: 'Soil test scheduled', time: '3 days ago', status: 'pending' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-gray-600 text-lg">
          {t('dashboard.sub')}
        </p>
      </motion.div>

      {/* Weather Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 card-hover"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('dashboard.currentWeather')}</h2>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5" />
                <span>{weatherData.temperature}°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5" />
                <span>{weatherData.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5" />
                <span>{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-1">🌤️</div>
            <div className="text-gray-600">{weatherData.condition}</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`${card.bgColor} rounded-2xl p-6 card-hover`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-500">{card.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={action.title} to={action.path}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white card-hover`}
              >
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yield Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">{t('dashboard.weekly')}</h3>
            <BarChart3 className="w-6 h-6 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">{t('dashboard.recentActivities')}</h3>
            <Clock className="w-6 h-6 text-gray-600" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
