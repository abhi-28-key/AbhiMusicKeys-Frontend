import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { ArrowLeft, Play, Lock, Check, Star, Clock, BookOpen, Music, Piano, Guitar, Headphones, Users, Target, Zap, ChevronDown, LogOut, Download, Menu, Home, GraduationCap, Award, Calendar, Bookmark, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ui/theme-toggle';
import { getUserPlanStatus } from '../utils/userPlanUtils';

const BasicCourseOverview: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

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
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Check enrollment status when component mounts
  React.useEffect(() => {
    if (currentUser) {
      const enrollmentStatus = localStorage.getItem(`enrolled_${currentUser.uid}_basic`);
      setIsEnrolled(enrollmentStatus === 'true');
    }
  }, [currentUser]);

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Mark user as enrolled in basic course
    localStorage.setItem(`enrolled_${currentUser.uid}_basic`, 'true');
    setIsEnrolled(true);
    
    // If user is logged in, redirect to the actual course
    navigate('/basic-learning');
  };

  const handleContinueLearning = () => {
    navigate('/basic-learning');
  };

     const courseModules = [
     {
       id: 'introduction',
       title: 'Introduction',
       icon: Music,
       description: 'Learn about keyboard basics, octaves, and fundamental concepts',
       isFree: true,
       topics: ['What is a Keyboard?', 'Understanding Octaves', 'Basic Music Theory']
     },
     {
       id: 'basics',
       title: 'Basics',
       icon: Piano,
       description: 'Master white keys, black keys, hand position, and chord basics',
       isFree: true,
       topics: ['White Keys (C, D, E, F, G, A, B)', 'Black Keys (Sharps)', 'Hand Position & Finger Numbers', 'What is a Chord?']
     },
           {
        id: 'major-scales',
        title: 'Major Scales',
        icon: Guitar,
        description: 'Learn all major scales with chord progressions and practice tips',
        isFree: true,
        topics: ['C, D, E, F, G, A, B Major Scales', 'Sharp Major Scales (C#, D#, F#, G#, A#)']
      },
           {
        id: 'minor-scales',
        title: 'Minor Scales',
        icon: Headphones,
        description: 'Explore minor scales and their emotional characteristics',
        isFree: true,
        topics: ['C, D, E, F, G, A, B Minor Scales', 'Sharp Minor Scales (C#, D#, F#, G#, A#)']
      },
     {
       id: 'major-family-chords',
       title: 'Major Family Chords',
       icon: Users,
       description: 'Learn how major chords work together in families',
       isFree: true,
       topics: ['Major Families','Sharpe Major Families']
     },
     {
       id: 'minor-family-chords',
       title: 'Minor Family Chords',
       icon: Users,
       description: 'Master minor chord families for emotional progressions',
       isFree: true,
       topics: ['Minor Families','Sharpe Minor Families']
     },
           {
        id: 'inversions',
        title: 'Inversions of Chords',
        icon: Target,
        description: 'Learn chord inversions to play Family chords with Left Hand',
        isFree: true,
        topics: ['First Inversion', 'Second Inversion']
      },
           {
        id: 'practicing',
        title: 'Practicing',
        icon: Zap,
        description: '',
        isFree: true,
        topics: ['Small tip for Finger Practicing']
      }
   ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Homepage Navbar */}
      <header className="relative">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/90 via-indigo-800/90 to-slate-900/90 dark:from-slate-900/95 dark:via-indigo-900/95 dark:to-slate-800/95"></div>
        
        {/* Simplified Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20"></div>
          <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20"></div>
        </div>

        {/* Content */}
        <div className="relative flex justify-between items-center p-4 sm:p-6">
          {/* Enhanced Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Music className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
                          <h1 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  AbhiMusicKeys
                </span>
              </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 relative z-[99999]">
            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
            
            {currentUser ? (
              <div className="relative user-menu">
                {/* User Avatar with Dropdown */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:scale-105 transition-all duration-300 user-menu-toggle"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      {getUserInitials(currentUser.email || '')}
                    </div>
                    <ChevronDown className={`h-3 w-3 text-white transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute top-12 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 min-w-56 z-[99999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-5 border-b border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20">
                          {getUserInitials(currentUser.email || '')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                            {getUserDisplayName(currentUser.email || '')}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {currentUser.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              {getUserPlanStatus(currentUser)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <button
                        onClick={() => {
                          navigate('/psr-i500');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300 hover:scale-105 group mb-2"
                      >
                        <Music className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">PSR-I500 Styles</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/downloads');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 hover:scale-105 group mb-2"
                      >
                        <Download className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">Downloads</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 hover:scale-105 group"
                      >
                        <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-white hover:text-blue-200 transition-colors duration-300 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            {/* Theme Toggle */}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Home</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 text-white hover:text-blue-200 transition-colors duration-300"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {showUserMenu && (
            <div className="md:hidden absolute top-16 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 min-w-48 z-[99999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 animate-in slide-in-from-top-2 duration-200">
              {currentUser ? (
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getUserInitials(currentUser.email || '')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {getUserDisplayName(currentUser.email || '')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {currentUser.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {getUserPlanStatus(currentUser)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/psr-i500');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300 mb-2"
                  >
                    <Music className="h-4 w-4" />
                    <span>PSR-I500 Styles</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/downloads');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 mb-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Downloads</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 mb-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                  
                  {/* Theme Toggle in Mobile Menu */}
                  <div className="flex items-center justify-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-300 mb-2"
                  >
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 mb-2"
                  >
                    <span>Sign Up</span>
                  </button>
                  
                  {/* Theme Toggle in Mobile Menu */}
                  <div className="flex items-center justify-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Background Blur Overlay */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setShowPopup(false)}
        />
      )}

      {/* Popup Message */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-red-500 via-pink-500 to-red-600 rounded-2xl shadow-2xl border-2 border-red-300">
              <div className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-white font-extrabold text-xl tracking-wide">Important Notice</h3>
                  </div>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-white hover:text-red-200 transition-colors p-1 rounded-full hover:bg-white/10"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-white font-bold mb-6 text-center text-lg leading-relaxed tracking-wide">
                  If You Know All Basics About Keyboard You Can <span className="text-yellow-300 font-extrabold text-xl">SKIP</span> This
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => navigate('/intermediate-overview')}
                    className="bg-white text-red-600 hover:bg-red-50 px-8 py-3 rounded-xl font-extrabold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl tracking-wide"
                  >
                    See Intermediate Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-2 sm:py-8">

        {/* Course Header */}
        <div className="text-center mb-2 sm:mb-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-1 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-800 dark:text-white">
              Basic Piano Course
            </h1>
          </div>
                                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-3 sm:mb-6">
             Learn Basics, scales, chords, and Practice well 
             - @AbhiMusicKeys
           </p>
           
                       {/* Course Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 sm:mb-8">
             <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
               <BookOpen className="h-5 w-5" />
               <span className="font-semibold">8 Modules</span>
             </div>
             <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
               <Award className="h-5 w-5" />
               <span className="font-semibold">Beginner Level</span>
             </div>

           </div>
        </div>

        {/* Course Modules - Horizontal Scrolling Cards */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
            Course Modules
          </h2>
          <div className="relative">
            <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-hide">
              {courseModules.map((module, index) => {
                const IconComponent = module.icon;
                return (
                  <div
                    key={module.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 flex-shrink-0 w-80 sm:w-96"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Module Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white break-words">
                            {module.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            {module.isFree && (
                              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Module Description */}
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Module Topics */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">What you'll learn:</h4>
                        <ul className="space-y-1">
                          {module.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Check className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="break-words">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Scroll Indicators */}
            <div className="flex justify-center mt-4 gap-2">
              {courseModules.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-300"
                />
              ))}
            </div>
          </div>
        </div>

                 {/* My Journey Section */}
         <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 rounded-2xl p-8 text-slate-800 dark:text-white text-center mb-8 shadow-xl">
           <div className="max-w-4xl mx-auto">
             <div className="flex flex-col lg:flex-row items-start gap-8 mb-8">
               {/* Profile Image */}
               <div className="flex-shrink-0 lg:ml-0">
                 <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full border-4 border-white/50 shadow-2xl overflow-hidden">
                   <img src="/images/abhi-profile.jpg.jpg" alt="AbhiMusicKeys" className="w-full h-full object-cover" />
                 </div>
               </div>
               
               {/* Journey Content */}
               <div className="flex-1 text-left">
                 <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-800 dark:text-white">
                   MY JOURNEY to KEYBOARD
                 </h2>
                 <div className="space-y-4 text-lg">
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">1</span>
                     </div>
                     <p className="text-slate-700 dark:text-slate-200">I didn't have my own piano or any special resources when I started.</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">2</span>
                     </div>
                     <p className="text-slate-700 dark:text-slate-200">I didn't take any paid course — I learned everything by myself with God's help.</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">3</span>
                     </div>
                     <p className="text-slate-700 dark:text-slate-200">I followed my inspiration players, used chord books, and practiced every day.</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">4</span>
                     </div>
                     <p className="text-slate-700 dark:text-slate-200">I faced many problems, but I never gave up — now I play in God's ministry.</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">5</span>
                     </div>
                     <p className="text-slate-700 dark:text-slate-200">Listen to Christian songs, watch live playing videos, and keep learning new things.</p>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Call to Action */}
             <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-600 shadow-lg">
               <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                 <div className="text-left">
                   <p className="text-xl font-bold mb-2 text-slate-800 dark:text-white">I'm the proof this works — check my journey on YouTube @AbhiMusicKeys 🙏🎹</p>
                   <p className="text-lg text-slate-600 dark:text-slate-300">I made this course free to support you — use it well and be a blessing in God's ministry.</p>
                 </div>
                 <div className="flex-shrink-0">
                   <button
                     onClick={() => window.open('https://youtube.com/@AbhiMusicKeys', '_blank')}
                     className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                   >
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                     </svg>
                     Watch My Journey
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>


        
        {/* Combined Important Notes Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-3">Important Notes</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700 dark:text-red-300 font-medium">
                      Just completing this basic course won't make you perfect — real learning comes from your daily practice.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700 dark:text-red-300 font-medium">
                      Those who really practice well can learn just in <strong className="text-red-900 dark:text-red-100">ONE MONTH</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Enroll Now Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isEnrolled ? handleContinueLearning : handleEnroll}
          className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-4 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300 transform hover:shadow-3xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">
                {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
              </div>
              <div className="text-xs opacity-90">
                {isEnrolled ? 'Resume Your Progress' : 'Start Learning Today'}
              </div>
            </div>
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowLeft className="h-3 w-3 text-white rotate-180" />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default BasicCourseOverview; 
