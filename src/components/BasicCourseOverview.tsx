import React, { useState } from 'react';

import { ArrowLeft, Play, Lock, Check, Star, Clock, BookOpen, Music, Piano, Guitar, Headphones, Users, Target, Zap, ChevronDown, LogOut, Download, Menu, Home, GraduationCap, Award, Calendar, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ui/theme-toggle';

const BasicCourseOverview: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // If user is logged in, redirect to the actual course
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
       topics: ['C-Major Family', 'D-Major Family', 'E-Major Family', 'F-Major Family', 'G-Major Family', 'A-Major Family', 'B-Major Family', 'Sharp Major Families']
     },
     {
       id: 'minor-family-chords',
       title: 'Minor Family Chords',
       icon: Users,
       description: 'Master minor chord families for emotional progressions',
       isFree: true,
       topics: ['C-Minor Family', 'D-Minor Family', 'E-Minor Family', 'F-Minor Family', 'G-Minor Family', 'A-Minor Family', 'B-Minor Family', 'Sharp Minor Families']
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
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-wider">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                AbhiMusicKeys
              </span>
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 relative z-[99999]">
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
                              Free Plan
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Course Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white">
              Basic Piano Course
            </h1>
          </div>
                     <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-6">
             Learn Basics, scales, chords, and Practice well If Any doubts I am Here for You @AbhiMusicKeys
           </p>
           
           {/* Important Note */}
           <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 max-w-2xl mx-auto mb-8">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                 <BookOpen className="h-4 w-4 text-white" />
               </div>
               <p className="text-red-700 dark:text-red-300 font-medium">
                 <strong>Note:</strong> Just completing this basic course won't make you perfect — real learning comes from your daily practice.
               </p>
             </div>
           </div>
           
                      {/* Course Stats */}
           <div className="flex flex-wrap justify-center gap-6 mb-8">
             <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
               <BookOpen className="h-5 w-5" />
               <span className="font-semibold">8 Modules</span>
             </div>
             <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
               <Award className="h-5 w-5" />
               <span className="font-semibold">Beginner Level</span>
             </div>
             <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
               <Star className="h-5 w-5 text-yellow-500" />
               <span className="font-semibold">Free Course</span>
             </div>
           </div>
           
           {/* Time Note */}
           <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto mb-8">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                 <Clock className="h-4 w-4 text-white" />
               </div>
                               <p className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong>Those Who really Practice Well</strong> They can Learn Just in <strong>ONE MONTH</strong>
                </p>
             </div>
           </div>
        </div>

        {/* Course Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {courseModules.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
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

                 {/* My Journey Section */}
         <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 text-white text-center mb-8">
           <div className="max-w-4xl mx-auto">
             <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
               {/* Profile Image */}
               <div className="flex-shrink-0">
                 <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden">
                   <img src="/images/abhi-profile.jpg.jpg" alt="AbhiMusicKeys" className="w-full h-full object-cover" />
                 </div>
               </div>
               
               {/* Journey Content */}
               <div className="flex-1 text-left">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                     MY JOURNEY to KEYBOARD
                   </h2>
                 <div className="space-y-4 text-lg">
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">1</span>
                     </div>
                     <p>I didn't have my own piano or any special resources when I started.</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">2</span>
                     </div>
                     <p>I didn't take any paid course — I learned everything by myself with God's help.</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">3</span>
                     </div>
                     <p>I followed my inspiration players, used chord books, and practiced every day.</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">4</span>
                     </div>
                     <p>I faced many problems, but I never gave up — now I play in God's ministry.</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white text-sm font-bold">5</span>
                     </div>
                     <p>Listen to Christian songs, watch live playing videos, and keep learning new things.</p>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Call to Action */}
             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
               <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                 <div className="text-left">
                   <p className="text-xl font-bold mb-2">I'm the proof this works — check my journey on YouTube @AbhiMusicKeys 🙏🎹</p>
                   <p className="text-lg opacity-90">I made this course free to support you — use it well and be a blessing in God's ministry.</p>
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

         {/* Enrollment Section */}
         <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Piano Journey?</h2>
            <p className="text-lg mb-6 font-bold text-yellow-300 bg-red-600/20 px-4 py-2 rounded-lg border-2 border-yellow-400">
              ⚠️ If You Know All Basics About Keyboard You Can SKIP This ⚠️
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <button
                  onClick={handleEnroll}
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🎹 Start Learning Now
                </button>
              ) : (
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🎹 Enroll for Free
                </button>
              )}
              
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Browse Other Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicCourseOverview; 
