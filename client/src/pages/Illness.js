import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Search, CheckCircle, AlertTriangle, Info, UploadCloud, Camera, Image as ImageIcon, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n';

const crops = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Potato', 'Onion', 'Sugarcane'
];

const symptomOptions = [
  'Yellowing leaves',
  'Brown spots',
  'Wilting',
  'Powdery coating',
  'Leaf curl',
  'Stunted growth',
  'Rotting roots',
  'Holes in leaves'
];

// AI-powered image analysis function
async function analyzeImageWithAI(imageFile) {
  try {
    // Create FormData to send image to backend
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Call backend API for AI analysis
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }
    
    return result.analysis;
  } catch (error) {
    console.error('AI analysis failed:', error);
    throw new Error('Failed to analyze image with AI');
  }
}

function generateDiagnosis(crop, symptoms, aiAnalysis = null) {
  const s = new Set(symptoms);
  const issues = [];

  // If AI analysis is available, use it to enhance diagnosis
  if (aiAnalysis) {
    crop = aiAnalysis.cropType || crop;
    symptoms = aiAnalysis.detectedSymptoms || symptoms;
  }

  if (s.has('Yellowing leaves')) {
    issues.push({
      name: 'Nitrogen Deficiency',
      confidence: aiAnalysis ? Math.min(0.95, 0.72 + 0.15) : 0.72,
      solutions: [
        'Apply nitrogen-rich fertilizer (e.g., urea) as per soil test',
        'Use compost/manure for organic nitrogen',
        'Avoid overwatering to reduce leaching'
      ],
      prevention: [
        'Regular soil testing and balanced fertilization',
        'Incorporate green manure or legumes in rotation'
      ],
      severity: 'medium',
      aiDetected: aiAnalysis ? true : false
    });
  }

  if (s.has('Brown spots')) {
    issues.push({
      name: 'Leaf Spot (Fungal)',
      confidence: aiAnalysis ? Math.min(0.95, 0.68 + 0.15) : 0.68,
      solutions: [
        'Remove and destroy infected leaves',
        'Apply copper-based or azoxystrobin fungicide',
        'Improve air circulation, avoid wet foliage at night'
      ],
      prevention: [
        'Use disease-resistant varieties',
        'Practice crop rotation and sanitation'
      ],
      severity: 'medium',
      aiDetected: aiAnalysis ? true : false
    });
  }

  if (s.has('Powdery coating')) {
    issues.push({
      name: 'Powdery Mildew',
      confidence: aiAnalysis ? Math.min(0.95, 0.8 + 0.1) : 0.8,
      solutions: [
        'Apply sulfur or potassium bicarbonate spray',
        'Ensure good spacing and sunlight'
      ],
      prevention: ['Avoid excessive nitrogen', 'Remove volunteer hosts'],
      severity: 'high',
      aiDetected: aiAnalysis ? true : false
    });
  }

  if (s.has('Leaf curl')) {
    issues.push({
      name: 'Viral Leaf Curl (vector: whiteflies)',
      confidence: aiAnalysis ? Math.min(0.95, 0.64 + 0.15) : 0.64,
      solutions: [
        'Manage whiteflies with yellow sticky traps and neem oil',
        'Remove severely infected plants'
      ],
      prevention: ['Use virus-free seedlings', 'Install insect-proof nets'],
      severity: 'high',
      aiDetected: aiAnalysis ? true : false
    });
  }

  if (issues.length === 0) {
    issues.push({
      name: 'No strong match',
      confidence: 0.3,
      solutions: ['Collect more details or upload a clear photo for better results'],
      prevention: ['Monitor regularly and record symptom progression'],
      severity: 'low',
      aiDetected: false
    });
  }

  // Light weighting by crop (example: tomato more prone to leaf curl/powdery)
  if (crop === 'Tomato') {
    issues.forEach(i => {
      if (i.name.toLowerCase().includes('curl') || i.name.toLowerCase().includes('powdery')) {
        i.confidence = Math.min(0.95, i.confidence + 0.1);
      }
    });
  }

  return issues.sort((a, b) => b.confidence - a.confidence);
}

const Confidence = ({ value }) => {
  const pct = Math.round(value * 100);
  const color = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Confidence</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-2 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Illness = () => {
  const { t } = useI18n();
  const [crop, setCrop] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [imageName, setImageName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('manual'); // 'manual' or 'photo'
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoAnalysis = async () => {
    if (!imageFile) {
      toast.error('Please select an image first');
      return;
    }
    
    setLoading(true);
    try {
      // Analyze image with AI
      const analysis = await analyzeImageWithAI(imageFile);
      setAiAnalysis(analysis);
      
      // Auto-fill form with AI results
      setCrop(analysis.cropType);
      setSelectedSymptoms(analysis.detectedSymptoms);
      
      // Generate diagnosis with AI enhancement
      const issues = generateDiagnosis(analysis.cropType, analysis.detectedSymptoms, analysis);
      setResults(issues);
      
      toast.success('AI analysis complete! Crop and symptoms detected automatically.');
    } catch (error) {
      toast.error('AI analysis failed. Please try manual mode.');
      console.error('AI analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (analysisMode === 'photo') {
      await handlePhotoAnalysis();
      return;
    }
    
    // Manual mode validation
    if (!crop || selectedSymptoms.length === 0) {
      toast.error('Select crop and at least one symptom');
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const issues = generateDiagnosis(crop, selectedSymptoms);
      setResults(issues);
      toast.success('Analysis complete');
    } catch (e) {
      toast.error('Failed to analyze');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCrop('');
    setSelectedSymptoms([]);
    setImageName('');
    setImageFile(null);
    setImagePreview(null);
    setResults(null);
    setAiAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">{t('illness.title')}</h1>
        </div>
        <p className="text-gray-600 text-lg">{t('illness.sub')}</p>
      </motion.div>

      {/* Analysis Mode Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={() => setAnalysisMode('manual')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              analysisMode === 'manual'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Search className="w-5 h-5 inline mr-2" />
            Manual Analysis
          </button>
          <button
            onClick={() => setAnalysisMode('photo')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              analysisMode === 'photo'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Zap className="w-5 h-5 inline mr-2" />
            AI Photo Analysis
          </button>
        </div>
        <p className="text-center text-gray-600 text-sm">
          {analysisMode === 'manual' 
            ? 'Select crop type and symptoms manually for analysis'
            : 'Upload a photo and let AI automatically detect crop type and diseases'
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            {analysisMode === 'photo' ? (
              <Camera className="w-6 h-6 mr-2 text-emerald-500" />
            ) : (
              <Search className="w-6 h-6 mr-2 text-emerald-500" />
            )}
            {analysisMode === 'photo' ? 'AI Photo Analysis' : t('illness.formTitle')}
          </h2>
          
          {analysisMode === 'photo' ? (
            <div className="space-y-5">
              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Plant Photo</label>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Plant preview" 
                        className="w-full h-64 object-cover rounded-xl border-2 border-emerald-200"
                      />
                      <button
                        onClick={resetForm}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-emerald-300 transition-colors">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Click to upload plant photo</p>
                        <p className="text-gray-400 text-sm">JPG, PNG up to 10MB</p>
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={onFileChange} 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* AI Analysis Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={handlePhotoAnalysis}
                disabled={loading || !imageFile}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-500 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Analyze Photo with AI</span>
                  </>
                )}
              </motion.button>

              {/* AI Results Preview */}
              {aiAnalysis && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-semibold text-emerald-800 mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    AI Detection Results
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Crop Type:</span> {aiAnalysis.cropType}</p>
                    <p><span className="font-medium">Detected Symptoms:</span> {aiAnalysis.detectedSymptoms.join(', ')}</p>
                    <p><span className="font-medium">Confidence:</span> {Math.round(aiAnalysis.confidence * 100)}%</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('illness.cropType')}</label>
                <select value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent form-input" required>
                  <option value="">{t('illness.selectCrop')}</option>
                  {crops.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('illness.symptoms')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {symptomOptions.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-4 py-2 rounded-xl border transition ${selectedSymptoms.includes(sym) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('illness.upload')}</label>
                <label className="flex items-center justify-between px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <UploadCloud className="w-5 h-5" />
                    <span className="text-sm">{imageName || 'Choose file...'}</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                </label>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-500 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                {loading ? <span>{t('illness.analyzing')}</span> : <span>{t('illness.analyzeBtn')}</span>}
              </motion.button>
            </form>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
          {results ? (
            <>
              {results.map((item, idx) => (
                <div key={idx} className="glass rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                        {item.aiDetected && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center">
                            <Zap className="w-3 h-3 mr-1" />
                            AI Detected
                          </span>
                        )}
                      </div>
                      <div className="mt-3"><Confidence value={item.confidence} /></div>
                    </div>
                    {item.severity === 'high' ? (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : item.severity === 'medium' ? (
                      <Info className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{t('illness.recommendations')}</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {item.solutions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{t('illness.prevention')}</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {item.prevention.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-6xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('illness.noResultTitle')}</h3>
              <p className="text-gray-600">{t('illness.noResultSub')}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Illness;



