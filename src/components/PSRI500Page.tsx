import React, { useState, useEffect } from 'react';

import { ArrowLeft, Play, Lock, Check, Star, Clock, BookOpen, Music, Piano, Guitar, Headphones, Users, Target, Zap, ChevronDown, LogOut, Download, Menu, Home, GraduationCap, Award, Calendar, Bookmark, Volume2, Settings, Heart, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ui/theme-toggle';

const PSRI500Page: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { processPayment, isProcessing } = usePayment();
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

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



  // Indian Styles Plan
  const indianStylesPlan = {
    id: 'indian-styles',
    name: 'Indian Styles Package',
    price: 999, // ₹999 for Indian Styles
    duration: 'Lifetime',
    features: [
      '30+ Indian Styles',
      'Free Voices Included',
      'Lifetime Access',
      'Download & Offline Use',
      'Email Support'
    ]
  };

  const handlePurchaseIndianStyles = async () => {
    if (!currentUser) {
      alert('Please login to purchase Indian Styles');
      navigate('/login');
      return;
    }

    try {
      setShowPurchaseModal(false);
      await processPayment(indianStylesPlan);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const keyboardStyles = [
    {
      id: '001',
      name: 'Pop Ballad',
      description: 'Perfect for romantic ballads and slow songs',
      songs: ['Perfect - Ed Sheeran', 'All of Me - John Legend', 'Say You Love Me - Jessie Ware'],
      tempo: '70-80 BPM',
      key: 'C Major',
      difficulty: 'Beginner'
    },
    {
      id: '002',
      name: 'Rock',
      description: 'High energy rock rhythms and power chords',
      songs: ['Sweet Child O Mine - Guns N Roses', 'Hotel California - Eagles', 'Stairway to Heaven - Led Zeppelin'],
      tempo: '120-140 BPM',
      key: 'E Major',
      difficulty: 'Intermediate'
    },
    {
      id: '003',
      name: 'Jazz',
      description: 'Smooth jazz with complex chord progressions',
      songs: ['Take Five - Dave Brubeck', 'So What - Miles Davis', 'The Girl from Ipanema - Stan Getz'],
      tempo: '90-110 BPM',
      key: 'D Minor',
      difficulty: 'Advanced'
    },
    {
      id: '004',
      name: 'Country',
      description: 'Traditional country with twang and rhythm',
      songs: ['Ring of Fire - Johnny Cash', 'Jolene - Dolly Parton', 'Friends in Low Places - Garth Brooks'],
      tempo: '100-120 BPM',
      key: 'G Major',
      difficulty: 'Beginner'
    },
    {
      id: '005',
      name: 'Latin',
      description: 'Salsa, merengue, and Latin dance rhythms',
      songs: ['Despacito - Luis Fonsi', 'La Bamba - Ritchie Valens', 'Oye Como Va - Santana'],
      tempo: '130-150 BPM',
      key: 'A Minor',
      difficulty: 'Intermediate'
    },
    {
      id: '006',
      name: 'Blues',
      description: 'Classic blues with soulful progressions',
      songs: ['The Thrill is Gone - B.B. King', 'Hoochie Coochie Man - Muddy Waters', 'Red House - Jimi Hendrix'],
      tempo: '80-100 BPM',
      key: 'E Blues',
      difficulty: 'Intermediate'
    },
    {
      id: '007',
      name: 'Electronic',
      description: 'Modern electronic and dance music',
      songs: ['Clocks - Coldplay', 'Viva La Vida - Coldplay', 'Fix You - Coldplay'],
      tempo: '120-140 BPM',
      key: 'C Major',
      difficulty: 'Beginner'
    },
    {
      id: '008',
      name: 'Classical',
      description: 'Timeless classical compositions',
      songs: ['Moonlight Sonata - Beethoven', 'Für Elise - Beethoven', 'Canon in D - Pachelbel'],
      tempo: '60-80 BPM',
      key: 'C Minor',
      difficulty: 'Advanced'
    }
  ];

    return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden">
          {/* Floating Music Notes */}
          <div className="absolute top-20 left-10 w-8 h-8 text-red-400/30 dark:text-red-300/30 animate-bounce">
            <Music className="w-full h-full" />
          </div>
          <div className="absolute top-40 right-20 w-6 h-6 text-red-500/30 dark:text-red-400/30 animate-pulse">
            <Piano className="w-full h-full" />
          </div>
          <div className="absolute bottom-40 left-20 w-10 h-10 text-red-300/30 dark:text-red-200/30 animate-bounce">
            <Volume2 className="w-full h-full" />
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-400/20 dark:to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-red-400/10 to-rose-500/10 dark:from-red-300/20 dark:to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-red-300/10 to-pink-400/10 dark:from-red-200/20 dark:to-pink-300/20 rounded-full blur-2xl animate-bounce"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
                 {/* Modern Header */}
         <header className="relative overflow-hidden bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-lg">

           {/* Content */}
           <div className="relative flex justify-between items-center p-4 sm:p-6">
             {/* Modern Logo */}
             <div className="flex items-center gap-2 sm:gap-3">
                               <div className="p-2 sm:p-3 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-xl shadow-lg">
                  <Music className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider">
                  <span className="bg-gradient-to-r from-green-100 via-emerald-100 to-green-200 bg-clip-text text-transparent">
                    AbhiMusicKeys
                  </span>
                </h1>
             </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/')}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 font-medium text-xs px-2 sm:px-3 py-2 rounded-lg shadow-lg flex items-center gap-1 sm:gap-2"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </button>
              </div>
              
                                                           {currentUser ? (
                 <div className="relative z-[999999]">
                   <button
                     onClick={() => setShowUserMenu(!showUserMenu)}
                     className="flex items-center gap-2 hover:scale-105 transition-all duration-300 user-menu-toggle"
                   >
                     <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                       {getUserInitials(currentUser.email || '')}
                     </div>
                     <ChevronDown className={`h-3 w-3 text-white transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                   </button>

                                       {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="fixed sm:absolute top-16 sm:top-12 left-4 sm:left-auto sm:right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-64 sm:w-auto sm:min-w-48 z-[9999999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 animate-in slide-in-from-top-2 duration-200 transform origin-top-right scale-100 user-menu-dropdown overflow-hidden">
                       <div className="p-3 sm:p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                         <div className="flex items-center gap-2 sm:gap-3">
                           <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-white/20 flex-shrink-0">
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
                               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                               <span className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
                                 Free Member
                               </span>
                             </div>
                           </div>
                         </div>
                       </div>
                       <div className="p-1.5 sm:p-2">
                         <button
                           onClick={() => {
                             navigate('/downloads');
                             setShowUserMenu(false);
                           }}
                           className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 mb-1.5"
                         >
                           <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                           <span className="text-sm font-medium truncate min-w-0 flex-1">Downloads</span>
                         </button>
                         <button
                           onClick={handleLogout}
                           className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                         >
                           <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                           <span className="text-sm font-medium truncate min-w-0 flex-1">Sign Out</span>
                         </button>
                       </div>
                     </div>
                   )}
                 </div>
               ) : (
                 <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 font-medium text-xs px-3 py-2 rounded-lg shadow-lg"
                  >
                    Sign In
                  </button>
                                     <button
                     onClick={() => navigate('/signup')}
                     className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-xs px-3 py-2 rounded-lg"
                   >
                     Sign Up
                   </button>
                </div>
              )}

              {/* Theme Toggle for Desktop */}
              <div className="hidden md:block">
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-3 sm:px-6 py-6 sm:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8 sm:mb-12">
                          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 text-gray-800 dark:text-white drop-shadow-lg bg-gradient-to-r from-red-600 via-red-700 to-pink-600 bg-clip-text text-transparent">
              PSR-I500 Keyboard Styles
            </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium drop-shadow-md max-w-3xl mx-auto px-2">
                                 Here Some Free In-Built Styles in PSRI500 Keyboard
              </p>
            </div>

            {/* Keyboard Info Stats */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
               <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-red-300/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105 shadow-lg">
                 <Music className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 mx-auto mb-3 sm:mb-4" />
                 <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">27 Styles</h3>
                 <p className="text-sm sm:text-base text-red-600 dark:text-red-400 font-medium">Professional Rhythms</p>
               </div>
                               <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-pink-300/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 shadow-lg">
                  <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600 dark:text-pink-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">Covers Almost all Ministry Songs</h3>
                  <p className="text-sm sm:text-base text-pink-600 dark:text-pink-400 font-medium"></p>
                </div>
             </div>

                         {/* Style Numbers List */}
             <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-red-200/50 dark:border-red-700/50 shadow-lg">
               <div className="text-center mb-6 sm:mb-8">
                 <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">PSR-I500 Style Numbers</h2>
                 <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
                   Here are all the available style numbers for your PSR-I500 keyboard
                 </p>
               </div>
               
               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3 md:gap-4">
                 {[4, 8, 10, 11, 17, 18, 19, 20, 26, 28, 29, 34, 40, 53, 64, 68, 74, 92, 97, 114, 120, 128, 130, 183, 173, 203, 215].map((styleNumber, index) => (
                   <div
                     key={styleNumber}
                     className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-lg border border-red-200/30 dark:border-red-700/30 hover:border-red-400/50 dark:hover:border-red-600/50 transition-all duration-300 hover:scale-105 group touch-manipulation"
                   >
                     <div className="text-center">
                       <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                         <Music className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                       </div>
                       <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">Style Number</p>
                       <p className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white">{styleNumber}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

                         {/* Note Section */}
             <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200/50 dark:border-amber-700/50 shadow-lg">
               <div className="text-center">
                 <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">**Note:**</h3>
                 <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto mb-4 sm:mb-6 px-2">
                   <em>These 27 styles are very useful for church songs. I will use them regularly in my church. Your task is to check all styles, know what type of songs fit each one, and how to use them in the best way.</em>
                 </p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                   <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-amber-200/30 dark:border-amber-700/30">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                       <Music className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                     </div>
                                           <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-lg sm:text-xl">Style - 92</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        Best for Worship songs like:<br/>
                        • <span className="inline-block font-extrabold text-amber-300 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-md ring-1 ring-amber-400/30 shadow-sm">"Athunatha Simhanamupai"</span><br/>
                        • <span className="inline-block font-extrabold text-amber-300 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-md ring-1 ring-amber-400/30 shadow-sm">"Mahimaneke Prabu"</span><br/>
                        • <span className="inline-block font-extrabold text-amber-300 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-md ring-1 ring-amber-400/30 shadow-sm">"Aradanaku Youguyda"</span>
                      </p>
                   </div>
                   
                   <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-amber-200/30 dark:border-amber-700/30">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                       <Music className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                     </div>
                                           <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-lg sm:text-xl">Style - 203</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        Best for Worship song like:<br/>
                        • <span className="inline-block font-extrabold text-amber-300 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-md ring-1 ring-amber-400/30 shadow-sm">"Yesu Neve Kavalaya"</span>
                      </p>
                   </div>
                   
                   <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-amber-200/30 dark:border-amber-700/30">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                       <Music className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                     </div>
                                           <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-lg sm:text-xl">Style - 28</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        Best for Worship song like:<br/>
                        • <span className="inline-block font-extrabold text-amber-300 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-md ring-1 ring-amber-400/30 shadow-sm">"Ninne Preminthunu"</span>
                      </p>
                   </div>
                 </div>
               </div>
             </div>

            {/* Quick Tips Section */}
            <div
                             className="mt-12 sm:mt-16 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-red-200/50 dark:border-red-700/50 shadow-lg"
            >
                                                           <div className="text-center mb-6 sm:mb-8">
                                   <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Indian Backup for PSR-I500</h2>
                   <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
                     I have Indian Styles backup
                   </p>
                </div>
              
                                             {/* Video Section */}
                <div className="mt-6 sm:mt-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Video Tutorial</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
                      Watch this comprehensive tutorial to master PSR-I500 Indian backup techniques
                    </p>
                  </div>
                  
                                     <div className="max-w-3xl mx-auto px-2">
                     <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                       <iframe
                         className="absolute top-0 left-0 w-full h-full rounded-xl sm:rounded-2xl shadow-2xl"
                         src="https://www.youtube.com/embed/MV6mBZ4ICfk"
                         title="PSR-I500 Indian Backup Tutorial"
                         frameBorder="0"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                       ></iframe>
                     </div>
                   </div>
                   
                                       {/* Note Section */}
                    <div className="mt-6 sm:mt-8 text-center">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200/50 dark:border-green-700/50 shadow-lg">
                        <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3">💡 Special Offer</h4>
                        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                          <span className="font-bold text-green-600 dark:text-green-400">I have Total 30+ Indian Styles</span>
                          <br/>
                          <span className="text-gray-600 dark:text-gray-400">If you Purchase Styles, I will Give Voices for Free</span>
                        </p>
                                                 <button 
                           onClick={() => setShowPurchaseModal(true)}
                           className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-base sm:text-lg"
                         >
                           🎵 Purchase Styles
                         </button>
                      </div>
                    </div>
                </div>
                         </div>
           </div>
         </main>
         
                   {/* Purchase Modal */}
          {showPurchaseModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
              <div
                className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
              >
                                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Music className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                      Purchase Indian Styles
                    </h3>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-green-200/50 dark:border-green-700/50">
                      <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg mb-2">
                        <span className="font-bold text-green-600 dark:text-green-400">Total 30+ Indian Styles</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                        + Free Voices Included
                      </p>
                      <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                        ₹{indianStylesPlan.price}
                      </div>
                    </div>
                  
                  <div className="flex gap-2 sm:gap-3">
                                  <button
                onClick={() => setShowPurchaseModal(false)}
                disabled={isProcessing}
                className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>

                                         <button
                      onClick={handlePurchaseIndianStyles}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                     </button>
                  </div>
                </div>
              </div>
            </div>
                     )}
           
         </div>
       </div>
     </div>
   );
 };

export default PSRI500Page; 
