import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  HelpCircle, 
  Cloud, 
  Sprout, 
  Stethoscope, 
  TestTube,
  Menu, 
  X,
  Leaf
} from 'lucide-react';

import { useI18n, languages } from '../i18n';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, lang, setLang } = useI18n();

  const navItems = [
    { path: '/', name: t('nav.dashboard'), icon: Home },
    { path: '/assistance', name: t('nav.assistance'), icon: HelpCircle },
    { path: '/weather', name: t('nav.weather'), icon: Cloud },
    { path: '/crops', name: t('nav.crops'), icon: Sprout },
    { path: '/illness', name: t('nav.illness'), icon: Stethoscope },
    { path: '/soil-analysis', name: t('nav.soilAnalysis'), icon: TestTube },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center"
            >
              <Leaf className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text">{t('appTitle')}</h1>
              <p className="text-xs text-gray-500">{t('appSubtitle')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-green-50 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <div className="ml-4">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 form-input"
                title={t('common.language')}
              >
                {Object.entries(languages).map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-green-100"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              <div className="px-4">
                <label className="block text-xs text-gray-500 mb-1">{t('common.language')}</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 form-input"
                >
                  {Object.entries(languages).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
