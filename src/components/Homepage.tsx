import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';
import { Lock, Unlock, Youtube, MessageCircle, LogOut, Music, ChevronDown, Phone, Mail, MapPin, BookOpen, Users, Award, Star, Menu, X, Home, Moon, Sun, Crown, Download, Bell, XCircle, Info, AlertTriangle, CheckCircle, AlertCircle, Pin } from 'lucide-react';
import Rating from './ui/Rating';
import YouTubeCarousel from './ui/YouTubeCarousel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useRating } from '../contexts/RatingContext';
import { collection, getDocs, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUserPlanStatus } from '../utils/userPlanUtils';

const Homepage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { getCourseRating } = useRating();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [publicReviews, setPublicReviews] = useState<any[]>([]);
  const [dynamicAverageRating, setDynamicAverageRating] = useState(4.8);
  const [dynamicTotalRatings, setDynamicTotalRatings] = useState(1247);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<any>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  
  

  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // Load dynamic rating data from localStorage
  useEffect(() => {
    const storedAverageRating = localStorage.getItem('averageRating');
    const storedTotalRatings = localStorage.getItem('totalRatings');
    const storedReviews = localStorage.getItem('publicReviews');
    
    if (storedAverageRating) {
      setDynamicAverageRating(parseFloat(storedAverageRating));
    }
    if (storedTotalRatings) {
      setDynamicTotalRatings(parseInt(storedTotalRatings));
    }
    if (storedReviews) {
      setPublicReviews(JSON.parse(storedReviews));
    }
  }, []);

           // Fetch active announcements
         useEffect(() => {
           fetchActiveAnnouncements();
         }, []);

           const fetchActiveAnnouncements = async () => {
           try {
             // Simplified query to avoid index requirements
             const announcementsQuery = query(
               collection(db, 'announcements'),
               where('isActive', '==', true)
             );
             
             const snapshot = await getDocs(announcementsQuery);
             const activeAnnouncements: any[] = [];
             
             snapshot.forEach(doc => {
               const data = doc.data();
               const announcement = {
                 id: doc.id,
                 title: data.title || '',
                 content: data.content || '',
                 type: data.type || 'info',
                 isPinned: data.isPinned || false,
                 targetAudience: data.targetAudience || 'all',
                 imageUrl: data.imageUrl || '',
                 createdAt: data.createdAt
               };
               console.log('Fetched announcement:', announcement.title, 'Image URL:', announcement.imageUrl);
               activeAnnouncements.push(announcement);
             });

             // Sort announcements by createdAt date (most recent first)
             activeAnnouncements.sort((a, b) => {
               const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
               const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
               return dateB.getTime() - dateA.getTime();
             });
             
             setAnnouncements(activeAnnouncements);

             // Show popup if there are active announcements
             if (activeAnnouncements.length > 0) {
               // Check if user has already seen announcements today
               const lastSeenDate = localStorage.getItem('lastAnnouncementSeen');
               const today = new Date().toDateString();

               if (lastSeenDate !== today) {
                 setCurrentAnnouncement(activeAnnouncements[0]);
                 setShowAnnouncementPopup(true);
                 localStorage.setItem('lastAnnouncementSeen', today);
               }
             }
           } catch (error) {
             console.error('Error fetching announcements:', error);
           }
         };

  const handleNextAnnouncement = () => {
    if (announcementIndex < announcements.length - 1) {
      setAnnouncementIndex(announcementIndex + 1);
      setCurrentAnnouncement(announcements[announcementIndex + 1]);
    } else {
      setShowAnnouncementPopup(false);
      setAnnouncementIndex(0);
    }
  };

  const handlePreviousAnnouncement = () => {
    if (announcementIndex > 0) {
      setAnnouncementIndex(announcementIndex - 1);
      setCurrentAnnouncement(announcements[announcementIndex - 1]);
    }
  };

  const closeAnnouncementPopup = () => {
    setShowAnnouncementPopup(false);
    setAnnouncementIndex(0);
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-6 h-6 text-white drop-shadow-sm" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-white drop-shadow-sm" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-white drop-shadow-sm" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-white drop-shadow-sm" />;
      default:
        return <Bell className="w-6 h-6 text-white drop-shadow-sm" />;
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-500 text-white border-blue-400';
      case 'warning':
        return 'bg-orange-500 text-white border-orange-400';
      case 'success':
        return 'bg-green-500 text-white border-green-400';
      case 'error':
        return 'bg-red-500 text-white border-red-400';
      default:
        return 'bg-purple-500 text-white border-purple-400';
    }
  };



  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      setShowUserMenu(false); // Close dropdown immediately
      
      // Call Firebase logout
      await logout();
      console.log('Firebase logout successful');
      
      // Clear any local storage or session data
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Force navigation to home page
      console.log('Redirecting to home page...');
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to log out:', error);
      
      // Clear local data even if Firebase logout fails
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Force navigation to home page
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

  // Newsletter subscription handler
  const handleNewsletterSubscription = async () => {
    if (!newsletterEmail.trim()) {
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage('');

    try {
      // Store subscription in localStorage for demo purposes
      // In a real app, you would send this to your backend
      const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
      const existingSubscription = subscriptions.find((sub: any) => sub.email === newsletterEmail);
      
      if (existingSubscription) {
        setSubscriptionMessage('You are already subscribed to our newsletter!');
      } else {
        const newSubscription = {
          email: newsletterEmail,
          subscribedAt: new Date().toISOString(),
          userId: currentUser?.uid || 'anonymous'
        };
        
        subscriptions.push(newSubscription);
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        
        setSubscriptionMessage('Successfully subscribed to our newsletter!');
        setNewsletterEmail('');
      }
    } catch (error) {
      setSubscriptionMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollPosition > windowHeight * 0.3) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-toggle')) {
        setShowMobileMenu(false);
      }
      if (!target.closest('.user-menu') && !target.closest('.user-menu-toggle')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Enhanced Background with Piano Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-indigo-900/50 to-slate-800/60"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Mobile-Friendly Header */}
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
                             <div className="p-2 sm:p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Music className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
               </div>
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider">
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
                    <div className="fixed sm:absolute top-16 sm:top-12 left-4 sm:left-auto sm:right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-64 sm:w-auto sm:min-w-48 z-[99999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 animate-in slide-in-from-top-2 duration-200 transform origin-top-right scale-100 user-menu-dropdown overflow-hidden">
                      <div className="p-3 sm:p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-white/20 flex-shrink-0">
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
                            navigate('/psr-i500');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200 mb-1.5"
                        >
                          <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate min-w-0 flex-1">PSR-I500 Styles</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/downloads');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 mb-1.5"
                        >
                          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-xs">Downloads</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-xs">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button 
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="bg-transparent hover:bg-white/10 text-white font-bold border border-white/30 hover:border-white/50 transition-all duration-300 text-xs px-3 py-1"
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/signup')}
                     className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-xs px-3 py-1"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
              
              {/* Theme Toggle */}
              <div className="glass-effect rounded-lg p-0">
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="md" />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="mobile-menu-toggle p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 bg-white/10 backdrop-blur-sm hover:scale-105 touch-manipulation"
              >
                {showMobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <motion.div 
              className="mobile-menu md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.div 
                className="absolute top-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-b-xl max-h-[70vh] overflow-y-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="p-3 space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <Music className="h-3 w-3 text-white" />
                      </div>
                      <h2 className="text-sm font-bold text-slate-800 dark:text-white">Menu</h2>
                    </div>
                    <button
                      onClick={() => setShowMobileMenu(false)}
                      className="p-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Menu Options */}
                  <div className="space-y-1">
                    {/* Theme Toggle Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        toggleTheme();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 group"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        {isDark ? (
                          <Moon className="h-3 w-3 text-white" />
                        ) : (
                          <Sun className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-xs">
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                      </span>
                    </motion.button>

                    {/* Home Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate('/');
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 group"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Home className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium text-xs">Home</span>
                    </motion.button>

                    {/* Pricing Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate('/pricing');
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 group"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium text-xs">Pricing</span>
                    </motion.button>

                    {currentUser && (
                      <>
                        <button


                          onClick={() => {
                            navigate('/psr-i500');
                            setShowMobileMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 group"
                        >
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Music className="h-3 w-3 text-white" />
                          </div>
                          <span className="font-medium text-sm sm:text-xs">PSR-I500 Styles</span>
                        </button>
                        <button


                          onClick={() => {
                            navigate('/downloads');
                            setShowMobileMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 group"
                        >
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Download className="h-3 w-3 text-white" />
                          </div>
                          <span className="font-medium text-xs">Downloads</span>
                        </button>
                      </>
                    )}

                    {currentUser ? (
                      <>
                        {/* User Info */}
                        <div 



                          className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {getUserInitials(currentUser.email || '')}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-800 dark:text-white">
                              {getUserDisplayName(currentUser.email || '')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                        
                        {/* Logout Button */}
                        <button


                          onClick={() => {
                            handleLogout();
                            setShowMobileMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 group"
                        >
                          <LogOut className="h-3 w-3 group-hover:rotate-12 transition-transform duration-200" />
                          <span className="font-medium text-xs">Logout</span>
                        </button>
                      </>
                    ) : (
                      <div className="space-y-1 pt-1">
                        <div


                        >
                          <Button 
                            onClick={() => {
                              navigate('/signup');
                              setShowMobileMenu(false);
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 py-2 text-xs"
                          >
                            Sign Up
                          </Button>
                        </div>
                        <div


                        >
                          <Button 
                            onClick={() => {
                              navigate('/login');
                              setShowMobileMenu(false);
                            }}
                            variant="outline"
                            className="w-full border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-2 text-xs"
                          >
                            Login
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </header>

        {/* Mobile-Optimized Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center py-8 sm:py-12 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4 sm:mb-8 leading-tight tracking-tight text-white drop-shadow-2xl">
              Master Piano with
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg text-5xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
                AbhiMusicKeys
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/90 dark:text-white/80 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg px-4">
              Learn keyboard from scratch with easy-to-follow lessons.
            </p>

            {/* Mobile-Optimized Learning Level Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto mb-8">
                             {/* Basic Card */}
               <motion.div 
                className="professional-card p-3 sm:p-4 lg:p-6 text-center cursor-pointer group backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50 hover:scale-105 hover:-translate-y-2 transition-all duration-300 min-h-[180px] sm:min-h-[220px] lg:min-h-[250px] flex flex-col justify-center touch-manipulation"
                onClick={() => {
                  if (currentUser) {
                    // Check if user is enrolled in basic course
                    const isEnrolled = localStorage.getItem(`enrolled_${currentUser.uid}_basic`) === 'true';
                    if (isEnrolled) {
                      // If enrolled, go directly to learning page
                      navigate('/basic-learning');
                    } else {
                      // If not enrolled, go to overview page
                      navigate('/basic');
                    }
                  } else {
                    // If not logged in, go to overview page
                    navigate('/basic');
                  }
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.08, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Unlock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">Basic</h3>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-4 flex-1">Perfect for complete beginners. Start your piano journey with fundamental lessons.</p>
                
                {/* Course Rating */}
                <div className="flex items-center justify-between mb-3">
                  <Rating value={getCourseRating('basic')?.rating || 4.9} readonly size="sm" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {getCourseRating('basic')?.rating || 4.9} ({(getCourseRating('basic')?.reviewCount || 2100).toLocaleString()})
                  </span>
                 </div>
                
                {/* Free Tag - Top Right */}
                <div className="absolute top-2 right-2 z-20">
                  <div className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white px-3 py-1.5 rounded-full text-sm font-extrabold shadow-2xl border-3 border-white dark:border-slate-800">
                    <span className="drop-shadow-lg">FREE</span>
                  </div>
                 </div>
                
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold group-hover:shadow-lg transition-all duration-200 text-base sm:text-lg">
                   Start Learning
                 </div>
               </motion.div>
              
                             {/* Intermediate Card */}
               <motion.div 
                className="professional-card p-4 sm:p-6 lg:p-8 text-center cursor-pointer group backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50 hover:scale-105 hover:-translate-y-2 transition-all duration-300 min-h-[200px] sm:min-h-[250px] flex flex-col justify-center"
                onClick={() => {
                  if (currentUser) {
                    // Check if user is enrolled in intermediate course
                    const isEnrolled = localStorage.getItem(`enrolled_${currentUser.uid}_intermediate`) === 'true';
                    if (isEnrolled) {
                      // If enrolled, go directly to learning page
                      navigate('/intermediate-content');
                    } else {
                      // If not enrolled, go to overview page
                      navigate('/intermediate-overview');
                    }
                  } else {
                    // If not logged in, go to overview page
                    navigate('/intermediate-overview');
                  }
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.08, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">Intermediate</h3>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-4 flex-1">Build on your foundation with advanced techniques and complex pieces.</p>
                
                {/* Course Rating */}
                <div className="flex items-center justify-between mb-3">
                  <Rating value={getCourseRating('intermediate')?.rating || 4.7} readonly size="sm" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {getCourseRating('intermediate')?.rating || 4.7} ({(getCourseRating('intermediate')?.reviewCount || 1800).toLocaleString()})
                  </span>
                 </div>
                
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold group-hover:shadow-lg transition-all duration-200 text-base sm:text-lg">
                   Premium Access
                 </div>
               </motion.div>
              
                             {/* Advanced Card */}
               <motion.div 
                className="professional-card p-4 sm:p-6 lg:p-8 text-center cursor-pointer group backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50 hover:scale-105 hover:-translate-y-2 transition-all duration-300 min-h-[200px] sm:min-h-[250px] flex flex-col justify-center sm:col-span-2 lg:col-span-1"
                onClick={() => {
                  if (currentUser) {
                    // Check if user is enrolled in advanced course
                    const isEnrolled = localStorage.getItem(`enrolled_${currentUser.uid}_advanced`) === 'true';
                    if (isEnrolled) {
                      // If enrolled, go directly to learning page
                      navigate('/advanced-content');
                    } else {
                      // If not enrolled, go to overview page
                      navigate('/advanced-overview');
                    }
                  } else {
                    // If not logged in, go to overview page
                    navigate('/advanced-overview');
                  }
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.08, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">Advanced</h3>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-4 flex-1">Master complex compositions and professional-level techniques.</p>
                
                {/* Course Rating */}
                <div className="flex items-center justify-between mb-3">
                  <Rating value={getCourseRating('advanced')?.rating || 4.8} readonly size="sm" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {getCourseRating('advanced')?.rating || 4.8} ({(getCourseRating('advanced')?.reviewCount || 1500).toLocaleString()})
                  </span>
                 </div>
                
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold group-hover:shadow-lg transition-all duration-200 text-base sm:text-lg">
                   Premium Access
                 </div>
               </motion.div>
             </div>
           
            {/* Mobile-Optimized Pricing CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 sm:mt-16 mb-8 sm:mb-16 text-center px-4"
            >
             <div className="max-w-2xl mx-auto">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
                 Ready to Start Your Musical Journey?
               </h3>
                <p className="text-white/80 mb-6 sm:mb-8 text-base sm:text-lg">
                 Choose from our flexible pricing plans and unlock your full potential
               </p>
               <button
                 onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg relative z-20 inline-block w-full sm:w-auto"
               >
                 View Pricing Plans
               </button>
             </div>
            </motion.div>
                          </div>
              </main>

              {/* YouTube Channel Buttons */}
              <YouTubeCarousel />

              {/* Mobile-Optimized Why AbhiMusicKeys Section */}
         <section className="py-12 sm:py-16 px-4 sm:px-6">
           <div className="max-w-6xl mx-auto">
                           <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center text-white mb-8 sm:mb-12 drop-shadow-lg px-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Why Choose <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">AbhiMusicKeys</span>?
              </motion.h2>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                {/* Community Support */}
                <motion.div 
                  className="professional-card p-4 sm:p-6 text-center backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3">Community Support</h3>
                  <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300">Join our community of learners and get support whenever you need help.</p>
                </motion.div>

                {/* Flexible Learning */}
                <motion.div 
                  className="professional-card p-4 sm:p-6 text-center backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Unlock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3">Flexible Learning</h3>
                  <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300">Learn at your own pace with 24/7 access to all course materials.</p>
                </motion.div>

                {/* PDF Resources */}
                <motion.div 
                  className="professional-card p-4 sm:p-6 text-center backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Youtube className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3">Video Lessons</h3>
                  <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300">Video tutorials covering piano fundamentals and advanced techniques.</p>
                </motion.div>
              </div>
           </div>
         </section>

        {/* Rating Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
                             <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-4">
                 What My Students Say
               </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Join thousands of satisfied learners who have transformed their piano skills with AbhiMusicKeys
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Display Real User Reviews */}
              {(() => {
                // Remove duplicate reviews by userId and get unique reviews
                const uniqueReviews = publicReviews.reduce((acc: any[], review: any) => {
                  const existingReview = acc.find(r => r.userId === review.userId);
                  if (!existingReview) {
                    acc.push(review);
                  }
                  return acc;
                }, []);

                // Get the latest 3 unique reviews
                const latestReviews = uniqueReviews
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3);

                if (latestReviews.length === 0) {
                  // Show placeholder when no reviews exist
                  return (
                    <div className="col-span-full text-center py-8">
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white font-semibold text-xl">🎹</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                          Be the First to Share Your Experience!
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                          Start your piano learning journey and leave a review to help others discover the joy of music.
                        </p>
                      </div>
                    </div>
                  );
                }

                return latestReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Rating value={review.rating} readonly size="sm" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">{review.rating}.0</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      "{review.feedback || 'Great learning experience!'}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{review.userInitials}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{review.userName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{review.course}</p>
                      </div>
                    </div>
                  </motion.div>
                ));
              })()}
            </div>

            {/* Overall Rating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg max-w-full overflow-hidden">
                <div className="text-center flex-1 min-w-0">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">{dynamicAverageRating}</div>
                  <Rating value={dynamicAverageRating} readonly size="lg" className="justify-center mt-2" />
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {dynamicTotalRatings.toLocaleString()} ratings
                  </div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center flex-1 min-w-0">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">{publicReviews.length > 0 ? publicReviews.length : '0'}</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Happy Students</div>
                </div>
                                   <div className="hidden sm:block w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                   <div className="text-center flex-1 min-w-0">
                     <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">0</div>
                     <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Video Lessons</div>
                   </div>
              </div>
            </motion.div>

            {/* Public Reviews Section */}
            {publicReviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white text-center mb-6">
                  What Our Students Say
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {publicReviews.slice(-6).map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.userInitials}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm">
                            {review.userName}
                          </h4>
                          <Rating value={review.rating} readonly size="sm" className="mt-1" />
                        </div>
                      </div>
                      {review.feedback && (
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                          "{review.feedback}"
                        </p>
                      )}
                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Mobile-Optimized Footer */}
        <footer className="relative overflow-hidden">
          {/* Footer Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-indigo-900/95 to-slate-900/95"></div>
          
          {/* Simplified Animated Elements */}
          <div className="absolute inset-0">
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-20"></div>
          </div>

          {/* Content */}
          <div className="relative py-8 sm:py-12 px-4 sm:px-6">
             <div className="max-w-6xl mx-auto">
                               {/* Contact & Courses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8">
                  {/* My Courses */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                      My Courses
                    </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="glass-effect rounded-lg p-2 sm:p-3 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-white font-semibold text-sm">Basic Piano</p>
                      </div>
                    </div>
                    <div className="glass-effect rounded-lg p-2 sm:p-3 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        <p className="text-white font-semibold text-sm">Intermediate Piano</p>
                      </div>
                    </div>
                    <div className="glass-effect rounded-lg p-2 sm:p-3 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        <p className="text-white font-semibold text-sm">Advanced Piano</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                    Contact
                    </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <a 
                      href="tel:+916301859369"
                      className="flex items-center gap-2 sm:gap-3 text-slate-300 hover:text-green-400 transition-colors duration-300 text-sm sm:text-base group"
                    >
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>+91 6301859369</span>
                    </a>
                    <a 
                      href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=abhimusickeys13@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base group"
                    >
                      <div className="w-6 h-6 border border-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-500">
                        <Mail className="h-3 w-3 text-blue-500 group-hover:text-white" />
                      </div>
                      <span>abhimusickeys13@gmail.com</span>
                    </a>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-sm sm:text-base">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Kurnool City, Andhra Pradesh, India</span>
                    </div>
                  </div>
                </div>

                {/* Social Media Accounts */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                    Social Media Account
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <a 
                      href="https://www.youtube.com/@abhimusickeys"
                target="_blank" 
                rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors duration-300 text-sm sm:text-base group"
                    >
                      <div className="w-6 h-6 border border-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-red-500">
                        <Youtube className="h-3 w-3 text-red-500 group-hover:text-white" />
                        </div>
                      <span>@abhimusickeys</span>
                      </a>
                    </div>
                  </div>

                {/* Features */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                    Features
                    </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-sm sm:text-base">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      <span>Video Lessons</span>
                        </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-sm sm:text-base">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      <span>Flexible Learning</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-sm sm:text-base">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      <span>Community Support</span>
                    </div>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    Newsletter
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base mb-3 sm:mb-4">
                    Stay updated with our latest courses and tips
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubscription()}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button 
                      onClick={handleNewsletterSubscription}
                      disabled={isSubscribing}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-fit"
                    >
                      {isSubscribing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </div>
                  {subscriptionMessage && (
                    <p className={`text-sm mt-2 ${subscriptionMessage.includes('Successfully') ? 'text-green-400' : subscriptionMessage.includes('already subscribed') ? 'text-yellow-400' : 'text-red-400'}`}>
                      {subscriptionMessage}
                    </p>
                  )}
                </div>
              </div>
               
               {/* Copyright */}
              <div className="border-t border-white/20 pt-6 sm:pt-8 text-center">
                <p className="text-slate-300 text-sm sm:text-base">
                  © 2024 AbhiMusicKeys. All rights reserved.
                </p>
              </div>
             </div>
          </div>
        </footer>
      </div>





      {/* Announcement Popup */}
      {showAnnouncementPopup && currentAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative max-w-md w-full rounded-lg shadow-lg overflow-hidden ${
              currentAnnouncement.imageUrl 
                ? 'bg-transparent border-0' 
                : `${getAnnouncementColor(currentAnnouncement.type)} border`
            }`}
          >
            {/* Image Poster Display */}
            {currentAnnouncement.imageUrl ? (
              <div className="relative">
                {/* Image */}
                <img 
                  src={currentAnnouncement.imageUrl} 
                  alt={currentAnnouncement.title}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', currentAnnouncement.imageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', currentAnnouncement.imageUrl);
                  }}
                />
                
                {/* Title Overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <h3 className="font-bold text-xl text-white drop-shadow-lg">
                    {currentAnnouncement.title}
                  </h3>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={closeAnnouncementPopup}
                  className="absolute top-4 right-4 p-2 text-white/90 hover:text-white hover:bg-black/30 rounded-full transition-colors backdrop-blur-sm"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            ) : (
              /* Regular Announcement Display */
              <>
                {/* Simple Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {getAnnouncementIcon(currentAnnouncement.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{currentAnnouncement.title}</h3>
                      {currentAnnouncement.isPinned && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-white/20 text-white">
                          <Pin className="w-3 h-3 mr-1" />
                          Pinned
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={closeAnnouncementPopup}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Simple Content */}
                <div className="p-4">
                  <p className="text-white/90 leading-relaxed mb-4 text-sm">
                    {currentAnnouncement.content}
                  </p>
                  
                  {/* Target Audience */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-white/20 px-3 py-1 rounded text-white">
                      {currentAnnouncement.targetAudience === 'all' ? '🎯 All Users' : 
                       currentAnnouncement.targetAudience === 'basic' ? '🎵 Basic Course' :
                       currentAnnouncement.targetAudience === 'intermediate' ? '🎼 Intermediate Course' :
                       '🎹 Advanced Course'}
                    </span>
                  </div>
                </div>

                {/* Simple Navigation */}
                <div className="flex items-center justify-between p-4 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    {announcementIndex > 0 && (
                      <button
                        onClick={handlePreviousAnnouncement}
                        className="px-3 py-2 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors text-white"
                      >
                        ← Previous
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded">
                      {announcementIndex + 1} of {announcements.length}
                    </span>
                    {announcementIndex < announcements.length - 1 ? (
                      <button
                        onClick={handleNextAnnouncement}
                        className="px-3 py-2 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors text-white"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        onClick={closeAnnouncementPopup}
                        className="px-4 py-2 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors text-white"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Homepage; 
