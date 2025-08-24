import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Droplets,
  Thermometer,
  Sun,
  Leaf
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

const SoilAnalysis = () => {
  const [formData, setFormData] = useState({
    soilType: '',
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
    moisture: '',
    temperature: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysisResult = generateSoilAnalysis(formData);
      setAnalysis(analysisResult);
      toast.success('Soil analysis completed!');
    } catch (error) {
      toast.error('Failed to analyze soil data');
    } finally {
      setLoading(false);
    }
  };

  const generateSoilAnalysis = (data) => {
    const ph = parseFloat(data.ph);
    const nitrogen = parseFloat(data.nitrogen);
    const phosphorus = parseFloat(data.phosphorus);
    const potassium = parseFloat(data.potassium);
    const organicMatter = parseFloat(data.organicMatter);

    const recommendations = [];
    const healthScore = calculateHealthScore(data);

    // pH recommendations
    if (ph < 6.0) {
      recommendations.push({
        type: 'warning',
        title: 'Low pH (Acidic Soil)',
        description: 'Add lime to increase soil pH. Apply 2-4 tons per acre of agricultural lime.',
        priority: 'High'
      });
    } else if (ph > 7.5) {
      recommendations.push({
        type: 'warning',
        title: 'High pH (Alkaline Soil)',
        description: 'Add sulfur to decrease soil pH. Apply 1-2 tons per acre of elemental sulfur.',
        priority: 'Medium'
      });
    }

    // Nutrient recommendations
    if (nitrogen < 50) {
      recommendations.push({
        type: 'warning',
        title: 'Low Nitrogen',
        description: 'Apply nitrogen-rich fertilizer. Consider organic options like compost or manure.',
        priority: 'High'
      });
    }

    if (phosphorus < 30) {
      recommendations.push({
        type: 'warning',
        title: 'Low Phosphorus',
        description: 'Apply phosphorus fertilizer. Bone meal is a good organic option.',
        priority: 'Medium'
      });
    }

    if (potassium < 40) {
      recommendations.push({
        type: 'warning',
        title: 'Low Potassium',
        description: 'Apply potassium fertilizer. Wood ash is a natural source of potassium.',
        priority: 'Medium'
      });
    }

    if (organicMatter < 2) {
      recommendations.push({
        type: 'info',
        title: 'Low Organic Matter',
        description: 'Add organic matter through compost, manure, or cover crops.',
        priority: 'Medium'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: 'Optimal Soil Conditions',
        description: 'Your soil is in excellent condition for most crops.',
        priority: 'Low'
      });
    }

    return {
      healthScore,
      recommendations,
      chartData: [
        { nutrient: 'Nitrogen', value: nitrogen, optimal: 50, unit: 'ppm' },
        { nutrient: 'Phosphorus', value: phosphorus, optimal: 30, unit: 'ppm' },
        { nutrient: 'Potassium', value: potassium, optimal: 40, unit: 'ppm' },
        { nutrient: 'Organic Matter', value: organicMatter, optimal: 3, unit: '%' }
      ],
      phData: [
        { month: 'Jan', ph: ph - 0.2 },
        { month: 'Feb', ph: ph - 0.1 },
        { month: 'Mar', ph: ph },
        { month: 'Apr', ph: ph + 0.1 },
        { month: 'May', ph: ph + 0.2 },
        { month: 'Jun', ph: ph + 0.1 }
      ]
    };
  };

  const calculateHealthScore = (data) => {
    let score = 100;
    
    const ph = parseFloat(data.ph);
    if (ph < 6.0 || ph > 7.5) score -= 20;
    
    const nitrogen = parseFloat(data.nitrogen);
    if (nitrogen < 50) score -= 15;
    
    const phosphorus = parseFloat(data.phosphorus);
    if (phosphorus < 30) score -= 15;
    
    const potassium = parseFloat(data.potassium);
    if (potassium < 40) score -= 15;
    
    const organicMatter = parseFloat(data.organicMatter);
    if (organicMatter < 2) score -= 10;
    
    return Math.max(0, score);
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Soil Analysis</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Analyze your soil composition and get personalized recommendations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Soil Analysis Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-purple-500" />
            Soil Test Input
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent form-input"
                required
              >
                <option value="">Select soil type</option>
                <option value="clay">Clay</option>
                <option value="loam">Loam</option>
                <option value="sandy">Sandy</option>
                <option value="silt">Silt</option>
                <option value="chalky">Chalky</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  pH Level
                </label>
                <input
                  type="number"
                  name="ph"
                  value={formData.ph}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="6.5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nitrogen (ppm)
                </label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  placeholder="45"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phosphorus (ppm)
                </label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  placeholder="25"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potassium (ppm)
                </label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  placeholder="35"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organic Matter (%)
                </label>
                <input
                  type="number"
                  name="organicMatter"
                  value={formData.organicMatter}
                  onChange={handleInputChange}
                  step="0.1"
                  placeholder="2.5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moisture (%)
                </label>
                <input
                  type="number"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  placeholder="65"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent form-input"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-400 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-5 h-5"></div>
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

        {/* Analysis Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {analysis ? (
            <>
              {/* Health Score */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Soil Health Score
                </h3>
                <div className={`text-center p-6 rounded-xl ${getHealthScoreBg(analysis.healthScore)}`}>
                  <div className={`text-4xl font-bold ${getHealthScoreColor(analysis.healthScore)}`}>
                    {analysis.healthScore}/100
                  </div>
                  <p className="text-gray-600 mt-2">
                    {analysis.healthScore >= 80 ? 'Excellent' : 
                     analysis.healthScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${
                      rec.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      rec.type === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        {rec.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        ) : rec.type === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {rec.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-6xl mb-4">🧪</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Analysis Yet</h3>
              <p className="text-gray-600">Enter your soil test data to get personalized recommendations</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Nutrient Levels Chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Nutrient Levels</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysis.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nutrient" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
                <Bar dataKey="optimal" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* pH Trend Chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">pH Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysis.phData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SoilAnalysis;
