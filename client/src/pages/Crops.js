import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Sprout, 
  Calendar, 
  Droplets, 
  Thermometer, 
  Sun, 
  Clock,
  Info,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [searchTerm, selectedSeason, crops]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cropsData = [
        {
          id: 1,
          name: 'Wheat',
          scientificName: 'Triticum aestivum',
          season: 'Winter',
          duration: '120 days',
          waterNeeds: 'Medium',
          temperature: '15-25°C',
          sunlight: 'Full sun',
          description: 'A staple cereal grain grown worldwide. Wheat is used for making bread, pasta, and other food products.',
          tips: [
            'Plant in well-drained soil with pH 6.0-7.5',
            'Requires 6-8 hours of sunlight daily',
            'Water regularly but avoid waterlogging',
            'Harvest when grains are golden brown'
          ],
          image: '🌾',
          difficulty: 'Easy',
          yield: 'High'
        },
        {
          id: 2,
          name: 'Rice',
          scientificName: 'Oryza sativa',
          season: 'Monsoon',
          duration: '150 days',
          waterNeeds: 'High',
          temperature: '20-35°C',
          sunlight: 'Full sun',
          description: 'The most important food crop in Asia. Rice is a staple food for more than half the world\'s population.',
          tips: [
            'Requires standing water during growth',
            'Plant in clay or loamy soil',
            'Maintain water level 2-4 inches',
            'Harvest when 80% of grains are mature'
          ],
          image: '🌾',
          difficulty: 'Medium',
          yield: 'Very High'
        },
        {
          id: 3,
          name: 'Corn',
          scientificName: 'Zea mays',
          season: 'Summer',
          duration: '90 days',
          waterNeeds: 'Medium',
          temperature: '18-32°C',
          sunlight: 'Full sun',
          description: 'A versatile crop used for food, feed, and industrial products. Sweet corn is popular for human consumption.',
          tips: [
            'Plant in blocks for better pollination',
            'Requires rich, well-drained soil',
            'Water deeply but infrequently',
            'Harvest when kernels are milky'
          ],
          image: '🌽',
          difficulty: 'Easy',
          yield: 'High'
        },
        {
          id: 4,
          name: 'Soybeans',
          scientificName: 'Glycine max',
          season: 'Spring',
          duration: '100 days',
          waterNeeds: 'Low',
          temperature: '20-30°C',
          sunlight: 'Full sun',
          description: 'A legume crop rich in protein and oil. Used for food, animal feed, and industrial products.',
          tips: [
            'Plant in well-drained, fertile soil',
            'Inoculate seeds with rhizobia bacteria',
            'Avoid overwatering',
            'Harvest when pods are dry and brown'
          ],
          image: '🫘',
          difficulty: 'Medium',
          yield: 'Medium'
        },
        {
          id: 5,
          name: 'Cotton',
          scientificName: 'Gossypium hirsutum',
          season: 'Summer',
          duration: '180 days',
          waterNeeds: 'Medium',
          temperature: '21-37°C',
          sunlight: 'Full sun',
          description: 'A fiber crop used for making textiles. Cotton is also used for oil and animal feed.',
          tips: [
            'Plant in warm, well-drained soil',
            'Requires long growing season',
            'Control weeds early',
            'Harvest when bolls are fully open'
          ],
          image: '🧶',
          difficulty: 'Hard',
          yield: 'Medium'
        },
        {
          id: 6,
          name: 'Sugarcane',
          scientificName: 'Saccharum officinarum',
          season: 'Year-round',
          duration: '365 days',
          waterNeeds: 'High',
          temperature: '20-38°C',
          sunlight: 'Full sun',
          description: 'A tall perennial grass used for sugar production. Also used for biofuel and animal feed.',
          tips: [
            'Plant in tropical or subtropical climate',
            'Requires heavy, fertile soil',
            'Needs regular irrigation',
            'Harvest when sugar content is highest'
          ],
          image: '🎋',
          difficulty: 'Hard',
          yield: 'Very High'
        }
      ];
      
      setCrops(cropsData);
      setFilteredCrops(cropsData);
      toast.success('Crop database loaded!');
    } catch (error) {
      toast.error('Failed to load crop database');
    } finally {
      setLoading(false);
    }
  };

  const filterCrops = () => {
    let filtered = crops;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by season
    if (selectedSeason !== 'all') {
      filtered = filtered.filter(crop => crop.season === selectedSeason);
    }

    setFilteredCrops(filtered);
  };

  const seasons = ['all', 'Winter', 'Spring', 'Summer', 'Monsoon', 'Year-round'];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Crop Database</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Explore comprehensive information about various crops and farming techniques
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search crops..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent form-input"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent form-input"
            >
              {seasons.map(season => (
                <option key={season} value={season}>
                  {season === 'all' ? 'All Seasons' : season}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className="text-gray-600">
          Found {filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Crops Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCrops.map((crop, index) => (
          <motion.div
            key={crop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="crop-card rounded-2xl p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{crop.image}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(crop.difficulty)}`}>
                {crop.difficulty}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-1">{crop.name}</h3>
            <p className="text-sm text-gray-500 italic mb-3">{crop.scientificName}</p>
            
            <p className="text-gray-600 text-sm mb-4">{crop.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">Season: <span className="font-medium">{crop.season}</span></span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Duration: <span className="font-medium">{crop.duration}</span></span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">Water: <span className="font-medium">{crop.waterNeeds}</span></span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-gray-600">Temp: <span className="font-medium">{crop.temperature}</span></span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">Sun: <span className="font-medium">{crop.sunlight}</span></span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                Farming Tips
              </h4>
              <ul className="space-y-1">
                {crop.tips.slice(0, 2).map((tip, tipIndex) => (
                  <li key={tipIndex} className="text-xs text-gray-600 flex items-start">
                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
              {crop.tips.length > 2 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{crop.tips.length - 2} more tips
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredCrops.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No crops found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default Crops;
