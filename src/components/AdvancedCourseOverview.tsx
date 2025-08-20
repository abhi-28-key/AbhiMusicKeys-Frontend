import React, { useState, useEffect } from 'react';

import { Play, Lock, Check, Star, Clock, BookOpen, Music, ChevronDown, LogOut, Download, Menu, Home, Users, ArrowLeft, Award, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ui/theme-toggle';

const AdvancedCourseOverview: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [userMembership, setUserMembership] = useState('');

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-toggle') && !target.closest('.user-menu-dropdown')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine membership (free vs premium) based on stored purchase/subscription
  useEffect(() => {
    if (currentUser) {
      const advancedAccess = localStorage.getItem(`advanced_access_${currentUser.uid}`);
      const subscription = localStorage.getItem(`subscription_${currentUser.uid}`);
      if (advancedAccess === 'true' || (subscription && JSON.parse(subscription).plan === 'advanced')) {
        setUserMembership('premium');
      } else {
        setUserMembership('');
      }
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await logout();
      localStorage.removeItem('user');
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to log out:', error);
      localStorage.removeItem('user');
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  // Function to get user initials from email
  const getUserInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  // Function to get user display name
  const getUserDisplayName = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };







  // Course Sections - Updated to match actual content from Advanced Course Content
  const courseSections = [
    {
      id: 'introduction',
      title: 'Advanced Major Families',
      description: 'Master C, D, E, F, G, A, B Major Families and C#, D#, F#, G#, A# Major Families with interactive chord displays',
      icon: BookOpen,
      isCompleted: false
    },
    {
      id: 'module-1',
      title: 'Advanced Minor Families',
      description: 'Learn C, D, E, F, G, A, B Minor Families and C#, D#, F#, G#, A# Minor Families with chord progressions',
      icon: Music,
      isCompleted: false
    },
    {
      id: 'module-2',
      title: 'Ragas With Chords',
      description: 'Explore 15 traditional Indian ragas with their Up/Down notes, chord progressions, and song examples',
      icon: Music,
      isCompleted: false
    },
    {
      id: 'module-3',
      title: 'How to Find out Scale ?',
      description: 'Learn techniques to identify and determine musical scales for any song or composition',
      icon: Play,
      isCompleted: false
    },
    {
      id: 'module-4',
      title: 'How to Play interludes ?',
      description: 'Master the art of playing beautiful interludes and musical bridges between sections',
      icon: Play,
      isCompleted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-800">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Floating Music Notes */}
        <div className="absolute top-20 left-10 w-8 h-8 text-pink-400/30 animate-bounce">
          <Music className="w-full h-full" />
        </div>
        <div className="absolute top-40 right-20 w-6 h-6 text-fuchsia-500/30 animate-pulse">
          <Music className="w-full h-full" />
        </div>
        <div className="absolute bottom-40 left-20 w-10 h-10 text-pink-300/30 animate-bounce">
          <Music className="w-full h-full" />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-fuchsia-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-300/10 to-fuchsia-400/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Modern Header */}
        <header className="relative overflow-visible bg-gradient-to-r from-pink-500 via-fuchsia-600 to-pink-700 shadow-lg">
          {/* Content */}
          <div className="relative flex justify-between items-center p-3 sm:p-4 lg:p-6">
            {/* Modern Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-pink-600 rounded-xl shadow-lg">
                <Music className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-wider">
                <span className="bg-gradient-to-r from-pink-100 via-fuchsia-100 to-pink-200 bg-clip-text text-transparent">
                  AbhiMusicKeys
                </span>
              </h1>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 font-medium text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg flex items-center gap-1 sm:gap-2"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>
              
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1 sm:gap-2 hover:scale-105 transition-all duration-300 user-menu-toggle"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      {getUserInitials(currentUser.email || '')}
                    </div>
                    <ChevronDown className={`h-3 w-3 text-white transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="fixed sm:absolute top-16 sm:top-12 left-4 sm:left-auto sm:right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-64 sm:w-auto sm:min-w-48 z-[999999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 user-menu-dropdown overflow-hidden">
                      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {getUserInitials(currentUser.email || '')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                              {getUserDisplayName(currentUser.email || '')}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                              {currentUser.email}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${userMembership === 'premium' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className={`text-xs font-medium truncate ${userMembership === 'premium' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {userMembership === 'premium' ? 'Premium Member' : 'Free Member'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => navigate('/psr-i500')}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200 text-sm"
                        >
                          <Music className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">PSR-I500 Styles</span>
                        </button>
                        <button
                          onClick={() => navigate('/downloads')}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 text-sm"
                        >
                          <Download className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">Downloads</span>
                        </button>
                        <button
                          onClick={() => {
                            toggleTheme();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 text-sm"
                        >
                          {isDark ? (
                            <Sun className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <Moon className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm truncate">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 text-sm"
                        >
                          <LogOut className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 font-medium text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg"
                  >
                    <span className="hidden sm:inline">Sign In</span>
                    <span className="sm:hidden">Login</span>
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg"
                  >
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Sign Up</span>
                  </button>
                </div>
              )}

              {/* Theme Toggle for Desktop */}
              <div className="hidden md:block">
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              </div>
              
              {/* Theme Toggle for Mobile */}
              <div className="block md:hidden">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 text-white border border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 rounded-lg shadow-lg"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Course Header */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">
                Advanced Piano Course
              </h1>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
                Master advanced major and minor chord families, explore traditional Indian ragas, and learn professional techniques for scale identification and interlude playing. 
                Take your musicianship to the highest level with expert guidance.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Music className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">5 Advanced Modules</span>
                </span>
              </div>
            </div>

            {/* Course Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {courseSections.map((section, index) => (
                <div
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`bg-gradient-to-br from-pink-50 to-fuchsia-50 dark:from-slate-800 dark:to-slate-700 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-200/50 dark:border-slate-600 hover:border-pink-300/70 dark:hover:border-slate-500 hover:bg-gradient-to-br hover:from-pink-100 hover:to-fuchsia-100 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 hover:scale-105 group shadow-lg cursor-pointer ${
                    activeSection === section.id ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base lg:text-lg truncate">{section.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Course</span>
                    {section.isCompleted ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Content Based on Active Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-200/50 dark:border-slate-600/50 shadow-lg">
              {/* Practice Quote */}
              <div className="text-center mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700 dark:text-red-300 font-medium italic text-sm sm:text-base">
                  "Practice well, then only you will get knowledge - Mastery comes through dedicated practice!"
                </p>
              </div>
              
              {/* Lifetime Access Note */}
              <div className="text-center mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-green-700 dark:text-green-300 font-bold text-base sm:text-lg">
                  ✨ One-time purchase gives you lifetime access! ✨
                </p>
              </div>
            </div>

            {/* Subscribe Button */}
            <div className="text-center mt-8 sm:mt-12">
              <button
                onClick={() => navigate('/pricing')}
                className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-600 hover:from-pink-600 hover:via-fuchsia-600 hover:to-pink-700 text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg lg:text-xl relative overflow-hidden group w-full sm:w-auto"
              >
                <span className="relative z-10">Subscribe to Advance Plan</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-fuchsia-400/20 to-pink-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
              
              {/* Access Note */}
              <div className="text-center mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-blue-700 dark:text-blue-300 font-medium text-sm sm:text-base lg:text-lg">
                  💎 If You Purchase This Plan You Can Access to Intermediate and Basic Courses 💎
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>


    </div>
  );
};

export default AdvancedCourseOverview;