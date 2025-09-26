import React, { createContext, useContext, useMemo, useState } from 'react';

export const languages = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்'
};

const dictionary = {
  en: {
    appTitle: 'Farmer Agent',
    appSubtitle: 'Tailored Assistance',
    nav: {
      dashboard: 'Dashboard',
      assistance: 'AI Assistance',
      weather: 'Weather',
      crops: 'Crop Database',
      illness: 'Crop Illness',
      soilAnalysis: 'Soil Analysis'
    },
    dashboard: {
      welcome: 'Welcome to Farmer Agent',
      sub: 'Your AI-powered farming companion for tailored assistance',
      currentWeather: 'Current Weather',
      quickActions: 'Quick Actions',
      weekly: 'Weekly Progress',
      recentActivities: 'Recent Activities'
    },
    crops: {
      title: 'Crop Database',
      sub: 'Explore comprehensive information about various crops and farming techniques',
      searchPlaceholder: 'Search crops...',
      allSeasons: 'All Seasons',
      found: 'Found',
      crops: 'crops',
      season: 'Season',
      duration: 'Duration',
      water: 'Water',
      temp: 'Temp',
      sun: 'Sun',
      tips: 'Farming Tips',
      moreTips: 'more tips',
      noResultsTitle: 'No crops found',
      noResultsSub: 'Try adjusting your search terms or filters'
    },
    weather: {
      title: 'Weather Forecast',
      sub: 'Get detailed weather information and farming recommendations',
      inputPlaceholder: 'Enter your location...',
      update: 'Update',
      current: 'Current Weather -',
      humidity: 'Humidity',
      wind: 'Wind Speed',
      visibility: 'Visibility',
      forecastTitle: '5-Day Forecast',
      alerts: 'Weather Alerts',
      recommendations: 'Farming Recommendations'
    },
    illness: {
      title: 'Crop Illness Identifier',
      sub: 'Identify crop diseases by symptoms and get solutions',
      formTitle: 'Describe Symptoms',
      cropType: 'Crop',
      selectCrop: 'Select crop',
      symptoms: 'Symptoms',
      upload: 'Upload Leaf/Plant Photo (optional)',
      analyzeBtn: 'Identify Illness',
      analyzing: 'Analyzing...',
      likelyIssues: 'Likely Issues',
      recommendations: 'Solutions and Treatment',
      prevention: 'Prevention Tips',
      noResultTitle: 'No analysis yet',
      noResultSub: 'Enter symptoms to identify possible illnesses'
    },
    assistance: {
      title: 'AI Farming Assistant',
      sub: 'Get personalized farming advice powered by artificial intelligence',
      quick: 'Quick Questions',
      chat: 'Chat with AI Assistant',
      online: 'AI Online',
      thinking: 'AI is thinking...',
      inputPlaceholder: 'Ask me anything about farming...',
      send: 'Send',
      featureSmart: 'Smart Recommendations',
      featureSmartSub: 'Get personalized advice based on your specific farming conditions',
      featureSupport: '24/7 Support',
      featureSupportSub: 'Access farming expertise anytime, anywhere with instant responses',
      featureAI: 'AI-Powered',
      featureAISub: 'Advanced AI technology provides accurate and up-to-date farming insights'
    },
    common: {
      language: 'Language'
    }
  },
  hi: {
    appTitle: 'किसान एजेंट',
    appSubtitle: 'अनुकूलित सहायता',
    nav: { dashboard: 'डैशबोर्ड', assistance: 'एआई सहायता', weather: 'मौसम', crops: 'फसल डेटाबेस', illness: 'फसल रोग' },
    dashboard: { welcome: 'किसान एजेंट में आपका स्वागत है', sub: 'आपका एआई-संचालित खेती सहायक', currentWeather: 'वर्तमान मौसम', quickActions: 'त्वरित क्रियाएँ', weekly: 'साप्ताहिक प्रगति', recentActivities: 'हाल की गतिविधियाँ' },
    crops: { title: 'फसल डेटाबेस', sub: 'फसलों और खेती तकनीकों की जानकारी', searchPlaceholder: 'फसलें खोजें...', allSeasons: 'सभी मौसम', found: 'मिले', crops: 'फसल', season: 'मौसम', duration: 'अवधि', water: 'पानी', temp: 'ताप', sun: 'धूप', tips: 'खेती सुझाव', moreTips: 'और सुझाव', noResultsTitle: 'कोई फसल नहीं मिली', noResultsSub: 'खोज या फ़िल्टर बदलें' },
    weather: { title: 'मौसम पूर्वानुमान', sub: 'विस्तृत मौसम जानकारी और सलाह', inputPlaceholder: 'अपना स्थान दर्ज करें...', update: 'अपडेट', current: 'वर्तमान मौसम -', humidity: 'आर्द्रता', wind: 'पवन गति', visibility: 'दृश्यता', forecastTitle: '5-दिवसीय पूर्वानुमान', alerts: 'मौसम अलर्ट', recommendations: 'खेती सिफारिशें' },
    illness: { title: 'फसल रोग पहचान', sub: 'लक्षणों से रोग पहचानें और समाधान पाएं', formTitle: 'लक्षण बताएं', cropType: 'फसल', selectCrop: 'फसल चुनें', symptoms: 'लक्षण', upload: 'पत्ती/पौधे की फोटो अपलोड करें (वैकल्पिक)', analyzeBtn: 'रोग पहचानें', analyzing: 'विश्लेषण हो रहा है...', likelyIssues: 'संभावित समस्याएँ', recommendations: 'समाधान और उपचार', prevention: 'रोकथाम सुझाव', noResultTitle: 'अभी कोई विश्लेषण नहीं', noResultSub: 'संभावित रोग पहचानने हेतु लक्षण दर्ज करें' },
    assistance: { title: 'एआई खेती सहायक', sub: 'व्यक्तिगत खेती सलाह', quick: 'त्वरित प्रश्न', chat: 'एआई सहायक से चैट', online: 'एआई ऑनलाइन', thinking: 'एआई सोच रहा है...', inputPlaceholder: 'खेती से जुड़ा कुछ भी पूछें...', send: 'भेजें', featureSmart: 'स्मार्ट सिफारिशें', featureSmartSub: 'आपकी स्थिति के अनुसार सलाह', featureSupport: '24/7 सहायता', featureSupportSub: 'कभी भी, कहीं भी त्वरित जवाब', featureAI: 'एआई-संचालित', featureAISub: 'उन्नत एआई तकनीक से सटीक जानकारी' },
    common: { language: 'भाषा' }
  },
  ta: {
    appTitle: 'விவசாய உதவியாளர்',
    appSubtitle: 'தனிப்பயன் உதவி',
    nav: { dashboard: 'டாஷ்போர்டு', assistance: 'ஏஐ உதவி', weather: 'வானிலை', crops: 'பயிர் தரவுத்தளம்', illness: 'பயிர் நோய்' },
    dashboard: { welcome: 'விவசாய உதவியாளருக்கு வரவேற்கிறோம்', sub: 'உங்கள் ஏஐ அடிப்படையிலான விவசாய துணை', currentWeather: 'தற்போதைய வானிலை', quickActions: 'விரைவு செயல்கள்', weekly: 'வாராந்திர முன்னேற்றம்', recentActivities: 'சமீபத்திய செயல்கள்' },
    crops: { title: 'பயிர் தரவுத்தளம்', sub: 'பல்வேறு பயிர்கள் பற்றிய தகவல்', searchPlaceholder: 'பயிர்களை தேடவும்...', allSeasons: 'அனைத்து காலங்கள்', found: 'கண்டறியப்பட்டன', crops: 'பயிர்கள்', season: 'காலம்', duration: 'காலநிலை', water: 'நீர்', temp: 'வெப்பம்', sun: 'சூரியஒளி', tips: 'விவசாய குறிப்புகள்', moreTips: 'மேலும் குறிப்புகள்', noResultsTitle: 'பயிர்கள் இல்லை', noResultsSub: 'தேடல் அல்லது வடிகட்டலை மாற்றவும்' },
    weather: { title: 'வானிலை முன்னறிவிப்பு', sub: 'விரிவான வானிலை தகவல்', inputPlaceholder: 'உங்கள் இடத்தை உள்ளிடவும்...', update: 'புதுப்பிக்க', current: 'தற்போதைய வானிலை -', humidity: 'ஈரப்பதம்', wind: 'காற்று வேகம்', visibility: 'காண்ப்திறன்', forecastTitle: '5-நாள் முன்னறிவிப்பு', alerts: 'வானிலை எச்சரிக்கை', recommendations: 'விவசாய பரிந்துரைகள்' },
    illness: { title: 'பயிர் நோய் அடையாளம்', sub: 'அறிகுறிகளால் நோயை கண்டறிந்து தீர்வு பெறுங்கள்', formTitle: 'அறிகுறிகள் விவரம்', cropType: 'பயிர்', selectCrop: 'பயிரைத் தேர்ந்தெடுக்கவும்', symptoms: 'அறிகுறிகள்', upload: 'இலை/செடி படத்தை பதிவேற்றவும் (விரும்பினால்)', analyzeBtn: 'நோயை அறிய', analyzing: 'பகுப்பாய்வு செய்கிறது...', likelyIssues: 'சாத்தியமான பிரச்சினைகள்', recommendations: 'தீர்வுகள் மற்றும் சிகிச்சை', prevention: 'முன்னெச்சரிக்கை குறிப்புகள்', noResultTitle: 'இன்னும் பகுப்பாய்வு இல்லை', noResultSub: 'சாத்தியமான நோய்களை அறிய அறிகுறிகளை உள்ளிடவும்' },
    assistance: { title: 'ஏஐ விவசாய உதவியாளர்', sub: 'தனிப்பயன் விவசாய ஆலோசனை', quick: 'விரைவு கேள்விகள்', chat: 'ஏஐ உதவியாளருடன் அரட்டை', online: 'ஏஐ ஆன்லைன்', thinking: 'ஏஐ சிந்திக்கிறது...', inputPlaceholder: 'விவசாயம் குறித்து எதையும் கேளுங்கள்...', send: 'அனுப்பு', featureSmart: 'ச마트 பரிந்துரைகள்', featureSmartSub: 'உங்கள் நிலைமைக்கு ஏற்ற ஆலோசனைகள்', featureSupport: '24/7 ஆதரவு', featureSupportSub: 'எப்போதும் உடனடி பதில்கள்', featureAI: 'ஏஐ மூலம் இயக்கப்படுகிறது', featureAISub: 'மேம்பட்ட ஏஐ தொழில்நுட்பம்' },
    common: { language: 'மொழி' }
  }
};

const I18nContext = createContext({ lang: 'en', t: (key) => key, setLang: () => {} });

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = useMemo(() => {
    const dict = dictionary[lang] || dictionary.en;
    return (key) => {
      const segments = key.split('.');
      let node = dict;
      for (const seg of segments) {
        if (node && Object.prototype.hasOwnProperty.call(node, seg)) {
          node = node[seg];
        } else {
          return key;
        }
      }
      return typeof node === 'string' ? node : key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);



