import React, { useState, useEffect } from 'react';

import { ArrowLeft, Play, Lock, Check, Star, Clock, BookOpen, Music, Piano, Guitar, Headphones, Users, Target, Zap, ChevronDown, LogOut, Download, Menu, Home, GraduationCap, Award, Calendar, Bookmark, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserPlanStatus } from '../utils/userPlanUtils';

const IntermediateCourseOverview: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userMembership, setUserMembership] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Check user's payment status and initialize theme from localStorage
  useEffect(() => {
    // Check theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Check if user has purchased advanced course
    if (currentUser) {
      const advancedAccess = localStorage.getItem(`advanced_access_${currentUser.uid}`);
      const subscription = localStorage.getItem(`subscription_${currentUser.uid}`);
      
      if (advancedAccess === 'true' || (subscription && JSON.parse(subscription).plan === 'advanced')) {
        setUserMembership('premium');
      } else {
        setUserMembership('');
      }

      // Check intermediate course enrollment
      const intermediateEnrollment = localStorage.getItem(`enrolled_${currentUser.uid}_intermediate`);
      setIsEnrolled(intermediateEnrollment === 'true');
    }
  }, [currentUser]);
  const [selectedChord, setSelectedChord] = useState<any>(null);
  const [selectedScale, setSelectedScale] = useState<any>(null);
  const [showChordDetails, setShowChordDetails] = useState(false);
  const [showScaleDetails, setShowScaleDetails] = useState(false);

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

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Close user menu and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-toggle') && !target.closest('.user-menu-dropdown')) {
        setShowUserMenu(false);
      }
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-toggle')) {
        setShowMobileMenu(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/signup');
      return;
    }
    // If user is logged in, redirect to the pricing page to subscribe
    navigate('/pricing');
  };

  const handleContinueLearning = () => {
    navigate('/intermediate-content');
  };

  // Intermediate Chords Data
  const intermediateChords = [
    {
      name: 'C7',
      notes: ['C', 'E', 'G', 'A#'],
      description: 'Dominant 7th chord - commonly used in blues and jazz',
      category: '7th Chords',
      difficulty: 'Intermediate'
    },
    {
      name: 'Dm7',
      notes: ['D', 'F', 'A', 'C'],
      description: 'Minor 7th chord - essential for jazz progressions',
      category: '7th Chords',
      difficulty: 'Intermediate'
    },
    {
      name: 'G9',
      notes: ['G', 'B', 'D', 'F', 'A'],
      description: 'Dominant 9th chord - rich, jazzy sound',
      category: '9th Chords',
      difficulty: 'Advanced'
    },
    {
      name: 'Csus4',
      notes: ['C', 'F', 'G'],
      description: 'Suspended 4th chord - creates tension and release',
      category: 'Suspended Chords',
      difficulty: 'Intermediate'
    },
    {
      name: 'F#5',
      notes: ['F#', 'C#'],
      description: 'Power chord - essential for rock and metal',
      category: 'Power Chords',
      difficulty: 'Intermediate'
    },
    {
      name: 'Am9',
      notes: ['A', 'C', 'E', 'G', 'B'],
      description: 'Minor 9th chord - sophisticated jazz harmony',
      category: '9th Chords',
      difficulty: 'Advanced'
    }
  ];

  // Intermediate Scales Data
  const intermediateScales = [
    {
      name: 'Dorian Mode',
      root: 'C',
      notes: ['C', 'D', 'D#', 'F', 'G', 'A', 'A#', 'C'],
      description: 'Jazz and blues scale with minor 3rd and major 6th',
      category: 'Modes',
      difficulty: 'Intermediate'
    },
    {
      name: 'Mixolydian Mode',
      root: 'G',
      notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
      description: 'Dominant scale used in rock and blues',
      category: 'Modes',
      difficulty: 'Intermediate'
    },
    {
      name: 'Harmonic Minor',
      root: 'A',
      notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G#', 'A'],
      description: 'Minor scale with raised 7th for dramatic effect',
      category: 'Minor Scales',
      difficulty: 'Intermediate'
    },
    {
      name: 'Melodic Minor',
      root: 'C',
      notes: ['C', 'D', 'D#', 'F', 'G', 'A', 'B', 'C'],
      description: 'Minor scale with raised 6th and 7th ascending',
      category: 'Minor Scales',
      difficulty: 'Advanced'
    }
  ];

  // Course Progress Sections - Updated to match actual content
  const courseSections = [
    {
      id: 'module-1',
      title: '7th Chords',
      description: 'Learn about dominant 7th chords and their variations',
      icon: Music,
      isCompleted: false
    },
    {
      id: 'module-2',
      title: 'Diminished Chords',
      description: 'Master diminished chords and their applications',
      icon: Music,
      isCompleted: false
    },
    {
      id: 'module-3',
      title: 'Suspended Chords',
      description: 'Explore suspended chords and their unique sound',
      icon: Music,
      isCompleted: false
    },
    {
      id: 'module-4',
      title: 'Add 9th Chords',
      description: 'Learn about add 9th chords and their rich harmonies',
      icon: Music,
      isCompleted: false
    },
    {
      id: 'module-5',
      title: 'Major Families',
      description: 'Master chord families within major scales. Each family consists of 7-CHORDS',
      icon: Music,
      isCompleted: false
    },
    {
      id: 'module-6',
      title: 'Minor Families',
      description: 'Master chord families within minor scales. Each family consists of 7-CHORDS',
      icon: Music,
      isCompleted: false
    },
    {
      id: 'module-7',
      title: 'Practicing Family Chords Major and Minor',
      description: 'Practice and master family chord progressions',
      icon: Play,
      isCompleted: false
    },
    {
      id: 'module-8',
      title: 'How to Use Transpose',
      description: 'Learn transposition techniques and applications',
      icon: Play,
      isCompleted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Floating Music Notes */}
        <div className="absolute top-20 left-10 w-8 h-8 text-orange-400/30 animate-bounce">
          <Music className="w-full h-full" />
        </div>
        <div className="absolute top-40 right-20 w-6 h-6 text-orange-500/30 animate-pulse">
          <Music className="w-full h-full" />
        </div>
        <div className="absolute bottom-40 left-20 w-10 h-10 text-orange-300/30 animate-bounce">
          <Music className="w-full h-full" />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-300/10 to-yellow-400/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Modern Header */}
        <header className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 shadow-lg">
          {/* Content */}
          <div className="relative flex justify-between items-center p-4 sm:p-6">
            {/* Modern Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 rounded-xl shadow-lg">
                <Music className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-wider">
                <span className="bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-200 bg-clip-text text-transparent">
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
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:scale-105 transition-all duration-300 user-menu-toggle"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      {getUserInitials(currentUser.email || '')}
                    </div>
                    <ChevronDown className={`h-3 w-3 text-white transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="fixed sm:absolute top-16 sm:top-12 left-4 sm:left-auto sm:right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-64 sm:w-auto sm:min-w-48 z-[999999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 animate-in slide-in-from-top-2 duration-200 transform origin-top-right scale-100 user-menu-dropdown overflow-hidden">
                      <div className="p-3 sm:p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-white/20 flex-shrink-0">
                            {getUserInitials(currentUser.email || '')}
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white mb-0.5 truncate">
                              {getUserDisplayName(currentUser.email || '')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {currentUser.email}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium truncate">
                                {getUserPlanStatus(currentUser)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-1.5 sm:p-2">
                        <button
                          onClick={() => {
                            console.log('Navigating to PSR-I500 page...');
                            setShowUserMenu(false);
                            navigate('/psr-i500');
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200 mb-1.5"
                        >
                          <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate min-w-0 flex-1">PSR-I500 Styles</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/downloads');
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 mb-1.5"
                        >
                          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate min-w-0 flex-1">Downloads</span>
                        </button>

                        <button
                          onClick={() => {
                            toggleTheme();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 mb-1.5"
                        >
                          {isDark ? (
                            <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          ) : (
                            <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate min-w-0 flex-1">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate min-w-0 flex-1">Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 font-medium text-xs px-2 sm:px-3 py-2 rounded-lg shadow-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-xs px-2 sm:px-3 py-2 rounded-lg"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Theme Toggle for Desktop */}
              <div className="hidden md:block">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 bg-white/10 backdrop-blur-sm hover:scale-105"
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

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mobile-menu md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm z-50">
            <div className="absolute top-0 right-0 w-64 sm:w-80 h-full bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out max-w-[85vw]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">Menu</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      navigate('/');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                  >
                    <Home className="h-4 w-4" />
                    <span className="text-sm font-medium">Home</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/basic');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                  >
                    <Music className="h-4 w-4" />
                    <span className="text-sm font-medium">Basic Course</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/pricing');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200"
                  >
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Pricing Plans</span>
                  </button>
                  
                  {currentUser && (
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        navigate('/psr-i500');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                    >
                      <Music className="h-4 w-4" />
                      <span className="text-sm font-medium">PSR-I500 Styles</span>
                    </button>
                  )}
                  
                  {/* Theme Toggle */}
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-4">
                    <button
                      onClick={() => {
                        toggleTheme();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {isDark ? (
                          <Sun className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Moon className="h-4 w-4 text-slate-600" />
                        )}
                        <span className="text-sm font-medium">
                          {isDark ? 'Light Mode' : 'Dark Mode'}
                        </span>
                      </div>
                      <div className={`w-10 h-6 rounded-full transition-colors duration-300 ${
                        isDark 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                          : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          isDark ? 'translate-x-5' : 'translate-x-1'
                        }`}></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 px-3 sm:px-6 py-6 sm:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Course Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 text-gray-800 dark:text-white drop-shadow-lg bg-gradient-to-r from-orange-600 via-orange-700 to-yellow-600 bg-clip-text text-transparent">
                Intermediate Piano Course
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium drop-shadow-md px-2">
                Take your skills to the next level with advanced techniques and popular songs
              </p>
            </div>



            {/* Course Modules - Horizontal Scrolling Cards */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                Course Modules
              </h2>
              <div className="relative">
                <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-hide">
                  {courseSections.map((section, index) => {
                    const IconComponent = section.icon;
                    return (
                      <div
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 flex-shrink-0 w-80 sm:w-96 cursor-pointer ${
                          activeSection === section.id ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        <div className="p-4 sm:p-6">
                          {/* Module Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white break-words">
                                {section.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                                  Intermediate
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Module Description */}
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {section.description}
                          </p>
                          
                          {/* Module Footer */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Course</span>
                            {section.isCompleted ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <Lock className="h-5 w-5 text-orange-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dynamic Content Based on Active Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-orange-200/50 dark:border-slate-600/50 shadow-lg">
              {/* Practice Quote */}
              <div className="text-center mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700 font-medium italic text-sm sm:text-base">
                  "Practice well, then only you will get knowledge - Mastery comes through dedicated practice!"
                </p>
              </div>
              
              {/* Lifetime Access Note */}
              <div className="text-center mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-green-700 font-bold text-base sm:text-lg">
                  ✨ One-time purchase gives you lifetime access! ✨
                </p>
              </div>
              {activeSection === 'advanced-chords' && (
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Advanced Chords</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {intermediateChords.map((chord, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedChord(chord);
                          setShowChordDetails(true);
                        }}
                        className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-4 sm:p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg"
                      >
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">{chord.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">{chord.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {chord.notes.map((note, noteIndex) => (
                            <span key={noteIndex} className="px-2 sm:px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs sm:text-sm font-medium">
                              {note}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{chord.category}</span>
                          <span className="text-xs text-orange-600 font-medium">{chord.difficulty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'intermediate-scales' && (
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Intermediate Scales</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {intermediateScales.map((scale, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedScale(scale);
                          setShowScaleDetails(true);
                        }}
                        className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 sm:p-6 border border-yellow-200 hover:border-yellow-300 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg"
                      >
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">{scale.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">{scale.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {scale.notes.map((note, noteIndex) => (
                            <span key={noteIndex} className="px-2 sm:px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs sm:text-sm font-medium">
                              {note}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{scale.category}</span>
                          <span className="text-xs text-yellow-600 font-medium">{scale.difficulty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}




            </div>

            {/* Enrollment CTA */}
            <div className="text-center mt-8 sm:mt-12">
              <button
                onClick={isEnrolled ? handleContinueLearning : handleEnroll}
                className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 hover:from-orange-600 hover:via-yellow-600 hover:to-orange-700 text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg lg:text-xl relative overflow-hidden group w-full sm:w-auto"
              >
                <span className="relative z-10">
                  {isEnrolled ? 'Continue Learning' : 'Subscribe to Intermediate Plan'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-orange-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
              <p className="text-gray-600 dark:text-gray-300 mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg px-2">
                {isEnrolled 
                  ? 'Resume your intermediate course progress' 
                  : 'Unlock all intermediate content and take your piano skills to the next level'
                }
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Chord Details Modal */}
      {showChordDetails && selectedChord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full shadow-2xl">
                          <div className="text-center">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{selectedChord.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{selectedChord.description}</p>
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h4 className="font-bold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Notes:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedChord.notes.map((note: string, index: number) => (
                    <span key={index} className="px-3 sm:px-4 py-1 sm:py-2 bg-orange-200 text-orange-800 rounded-full text-sm sm:text-lg font-bold">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <span className="text-xs sm:text-sm text-gray-500">{selectedChord.category}</span>
                <span className="text-xs sm:text-sm text-orange-600 font-medium">{selectedChord.difficulty}</span>
              </div>
              <button
                onClick={() => setShowChordDetails(false)}
                className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-orange-600 hover:to-yellow-700 transition-all duration-300 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scale Details Modal */}
      {showScaleDetails && selectedScale && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{selectedScale.name}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{selectedScale.description}</p>
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h4 className="font-bold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Notes:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedScale.notes.map((note: string, index: number) => (
                    <span key={index} className="px-3 sm:px-4 py-1 sm:py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm sm:text-lg font-bold">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <span className="text-xs sm:text-sm text-gray-500">{selectedScale.category}</span>
                <span className="text-xs sm:text-sm text-yellow-600 font-medium">{selectedScale.difficulty}</span>
              </div>
              <button
                onClick={() => setShowScaleDetails(false)}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntermediateCourseOverview; 
