import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Droplets, 
  Thermometer, 
  Sun,
  Leaf,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n';

const SoilAnalysis = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    soilType: '',
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
    moisture: '',
    temperature: '',
    location: ''
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const soilTypes = [
    'Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Black Soil', 'Red Soil'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.soilType || !formData.ph || !formData.nitrogen || !formData.phosphorus || !formData.potassium) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/soil-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to analyze soil');
      }

      const data = await response.json();
      setResults(data.analysis);
      toast.success('Soil analysis complete!');
    } catch (error) {
      console.error('Soil analysis error:', error);
      toast.error('Failed to analyze soil data');
    } finally {
      setLoading(false);
    }
  };

  const getNutrientStatus = (value, type) => {
    const ranges = {
      nitrogen: { low: 0, medium: 50, high: 100 },
      phosphorus: { low: 0, medium: 30, high: 60 },
      potassium: { low: 0, medium: 40, high: 80 },
      ph: { low: 0, medium: 6.5, high: 7.5 }
    };

    const range = ranges[type];
    if (!range) return 'medium';

    if (value < range.medium) return 'low';
    if (value > range.high) return 'high';
    return 'medium';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'high': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Soil Analysis</h1>
        </div>
        <p className="text-gray-600 text-lg">Analyze your soil composition and get personalized recommendations</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analysis Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Search className="w-6 h-6 mr-2 text-amber-500" />
            Soil Test Data
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Soil Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type *</label>
              <select 
                name="soilType" 
                value={formData.soilType} 
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
                required
              >
                <option value="">Select soil type</option>
                {soilTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* pH Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">pH Level *</label>
              <input
                type="number"
                name="ph"
                value={formData.ph}
                onChange={handleInputChange}
                min="0"
                max="14"
                step="0.1"
                placeholder="6.5"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
                required
              />
            </div>

            {/* Nutrients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nitrogen (ppm) *</label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="75"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus (ppm) *</label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="25"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Potassium (ppm) *</label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="50"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
                  required
                />
              </div>
            </div>

            {/* Additional Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organic Matter (%)</label>
                <input
                  type="number"
                  name="organicMatter"
                  value={formData.organicMatter}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="3.5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moisture (%)</label>
                <input
                  type="number"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="25"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Farm location or field name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit" 
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-600 text-white rounded-xl font-medium hover:from-amber-500 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <TestTube className="w-5 h-5" />
                  <span>Analyze Soil</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          {results ? (
            <>
              {/* Soil Overview */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-amber-500" />
                  Soil Analysis Results
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Soil Type:</span>
                    <span className="font-medium">{results.soilType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">pH Level:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getNutrientStatus(results.ph, 'ph'))}`}>
                      {results.ph}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nutrient Levels */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-500" />
                  Nutrient Levels
                </h3>
                
                <div className="space-y-4">
                  {[
                    { name: 'Nitrogen', value: results.nitrogen, unit: 'ppm', type: 'nitrogen' },
                    { name: 'Phosphorus', value: results.phosphorus, unit: 'ppm', type: 'phosphorus' },
                    { name: 'Potassium', value: results.potassium, unit: 'ppm', type: 'potassium' }
                  ].map((nutrient) => {
                    const status = getNutrientStatus(nutrient.value, nutrient.type);
                    return (
                      <div key={nutrient.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(status)}
                          <span className="text-gray-600">{nutrient.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{nutrient.value} {nutrient.unit}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Recommendations
                </h3>
                
                <div className="space-y-3">
                  {results.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-6xl mb-4">🧪</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Analysis Yet</h3>
              <p className="text-gray-600">Fill in your soil test data to get personalized recommendations</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Soil Health Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Sun className="w-5 h-5 mr-2 text-yellow-500" />
          Soil Health Tips
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <Droplets className="w-6 h-6 text-blue-500 mb-2" />
            <h4 className="font-semibold text-gray-800 mb-1">Water Management</h4>
            <p className="text-sm text-gray-600">Maintain proper moisture levels for optimal plant growth</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <Thermometer className="w-6 h-6 text-orange-500 mb-2" />
            <h4 className="font-semibold text-gray-800 mb-1">Temperature</h4>
            <p className="text-sm text-gray-600">Monitor soil temperature for planting timing</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <Leaf className="w-6 h-6 text-green-500 mb-2" />
            <h4 className="font-semibold text-gray-800 mb-1">Organic Matter</h4>
            <p className="text-sm text-gray-600">Add compost to improve soil structure</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <TestTube className="w-6 h-6 text-purple-500 mb-2" />
            <h4 className="font-semibold text-gray-800 mb-1">Regular Testing</h4>
            <p className="text-sm text-gray-600">Test soil every 3-6 months for best results</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SoilAnalysis;
