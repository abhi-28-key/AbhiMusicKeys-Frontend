import React, { useState, useEffect } from 'react';
import { Music, Users, X, Check, ChevronDown, Phone, Mail, MapPin, BookOpen, Award, Star, Menu, Home, Moon, Sun, Crown, Download, Bell, XCircle, Info, AlertTriangle, CheckCircle, AlertCircle, Pin, LogOut, Play, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import RatingModal from './ui/RatingModal';

const IntermediateCourseContent: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hasIntermediateAccess, setHasIntermediateAccess] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);

  const [activeSection, setActiveSection] = useState('seventh-chords');
  const [selectedChordType, setSelectedChordType] = useState<'seventh' | 'sharp-seventh' | 'suspended' | 'sharp-suspended' | 'diminished' | 'sharp-diminished' | 'add-ninth' | 'sharp-add-ninth' | 'major-families' | 'sharp-major-families' | 'minor-families' | 'c-major-family' | 'd-major-family' | 'e-major-family' | 'f-major-family' | 'g-major-family' | 'a-major-family' | 'b-major-family' | 'c-sharp-major-family' | 'd-sharp-major-family' | 'f-sharp-major-family' | 'g-sharp-major-family' | 'a-sharp-major-family' | 'c-sharp-major-scale' | 'd-sharp-major-scale' | 'f-sharp-major-scale' | 'g-sharp-major-scale' | 'a-sharp-major-scale' | 'c-sharp-major' | 'f-sharp-major' | 'g-sharp-major' | 'd-sharp-major' | 'a-sharp-major' | 'd-sharp-minor' | 'f-minor' | 'a-sharp-minor' | 'b-sharp-diminished' | 'g-minor' | 'c-minor' | 'd-diminished' | 'b-major-sharp' | 'c-sharp-major-second' | 'g-sharp-minor' | 'a-sharp-minor-second' | 'e-sharp-diminished' | 'f-major-sharp' | 'd-minor-sharp' | 'g-minor-second' | 'a-diminished' | 'c-minor-family' | 'd-minor-family' | 'e-minor-family' | 'f-minor-family' | 'g-minor-family' | 'a-minor-family' | 'b-minor-family' | 'c-sharp-minor-family' | 'd-sharp-minor-family' | 'f-sharp-minor-family' | 'g-sharp-minor-family' | 'a-sharp-minor-family' | null>(null);
  const [showChordModal, setShowChordModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [courseProgress, setCourseProgress] = useState<{
    seventhChords: boolean;
    diminishedChords: boolean;
    suspendedChords: boolean;
    addNinthChords: boolean;
    majorFamilies: boolean;
    minorFamilies: boolean;
    howToPlayFamilies: boolean;
    howToUseTranspose: boolean;
  }>({
    seventhChords: false,
    diminishedChords: false,
    suspendedChords: false,
    addNinthChords: false,
    majorFamilies: false,
    minorFamilies: false,
    howToPlayFamilies: false,
    howToUseTranspose: false,
  });

  // Check payment status and load progress
  useEffect(() => {
    const checkPaymentStatus = () => {
      if (!currentUser) {
        setIsCheckingPayment(false);
        return;
      }

      // 🔐 ADMIN BYPASS: Check if accessed through admin route
      const isAdminRoute = window.location.pathname.includes('/secure-admin-panel/');
      if (isAdminRoute) {
        // Admin access - bypass payment check
        setHasIntermediateAccess(true);
        setIsCheckingPayment(false);
        return;
      }

      // Check if user has intermediate course access
      const intermediateAccess = localStorage.getItem(`intermediate_access_${currentUser.uid}`);
      const hasPaid = intermediateAccess === 'true';
      
      setHasIntermediateAccess(hasPaid);
      setIsCheckingPayment(false);

      if (!hasPaid) {
        // Redirect to pricing page after a short delay
        setTimeout(() => {
          navigate('/pricing');
        }, 2000);
      }
    };

    checkPaymentStatus();
  }, [currentUser, navigate]);

  // Load progress from localStorage
  useEffect(() => {
    if (!currentUser || !hasIntermediateAccess) return;
    
    const savedProgress = localStorage.getItem(`progress_${currentUser.uid}_intermediate`);
    if (savedProgress) {
      try {
        setCourseProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, [currentUser, hasIntermediateAccess]);

  // Save progress to localStorage
  const saveProgress = (newProgress: typeof courseProgress) => {
    if (!currentUser || !hasIntermediateAccess) return;
    localStorage.setItem(`progress_${currentUser.uid}_intermediate`, JSON.stringify(newProgress));
  };

  // Mark section as completed
  const markSectionCompleted = (section: keyof typeof courseProgress) => {
    const newProgress = { ...courseProgress, [section]: true };
    setCourseProgress(newProgress);
    saveProgress(newProgress);
    
    // Check if course is completed
    const allCompleted = Object.values(newProgress).every(completed => completed);
    if (allCompleted) {
      // Show rating modal after a short delay
      setTimeout(() => {
        setShowRatingModal(true);
      }, 1000);
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async (rating: number, feedback: string) => {
    try {
      // Store the review in localStorage for public display
      const newReview = {
        id: Date.now(),
        userName: currentUser ? getUserDisplayName(currentUser.email || '') : 'Anonymous',
        userInitials: currentUser ? getUserInitials(currentUser.email || '') : 'A',
        rating: rating,
        feedback: feedback,
        course: 'Intermediate Piano Course',
        date: new Date().toISOString(),
        userId: currentUser?.uid || 'anonymous'
      };

      // Get existing reviews
      const existingReviews = JSON.parse(localStorage.getItem('publicReviews') || '[]');
      existingReviews.push(newReview);
      localStorage.setItem('publicReviews', JSON.stringify(existingReviews));

      // Update average rating
      const totalRating = existingReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      const newAverageRating = totalRating / existingReviews.length;
      localStorage.setItem('averageRating', newAverageRating.toString());
      localStorage.setItem('totalRatings', existingReviews.length.toString());

      console.log('Review submitted:', newReview);
      console.log('New average rating:', newAverageRating);
      
      // Show success message
      alert('Thank you for your feedback! Your review has been published.');
      
      // Close the rating modal
      setShowRatingModal(false);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu') && !target.closest('.user-menu-toggle')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  };

  const courseSections = [
    { id: 'seventh-chords', title: '7th Chords', icon: Music },
    { id: 'diminished-chords', title: 'Diminished Chords', icon: Music },
    { id: 'suspended-chords', title: 'Suspended Chords', icon: Music },
    { id: 'add-ninth-chords', title: 'Add 9th Chords', icon: Music },
    { id: 'minor-families', title: 'Major Families', icon: Users },
    { id: 'minor-families-new', title: 'Minor Families', icon: Users },
    { id: 'how-to-play-families', title: 'How to play Major and Minor Families?', icon: Play },
    { id: 'how-to-use-transpose', title: 'How to Use Transpose?', icon: Play }
  ];

    const renderContent = () => {
    switch (activeSection) {
      case 'seventh-chords':
        return (
          <div className="space-y-6">
            {/* 7th Chords Banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Music className="h-8 w-8" />
                      </div>
                <div>
                  <h1 className="text-3xl font-bold">7th Chords</h1>
                  <p className="text-indigo-100">Master the essential 7th chords that add richness and complexity to your music!</p>
                    </div>
                  </div>
                      </div>

                         {/* Chord Type Buttons */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <button
                      onClick={() => {
                    setSelectedChordType('seventh');
                    setShowChordModal(true);
                      }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
                    >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Music className="h-8 w-8 text-white" />
                      </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">7th Chords</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                      </div>
                    </button>

                        <button
                          onClick={() => {
                    setSelectedChordType('sharp-seventh');
                    setShowChordModal(true);
                          }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
                        >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Music className="h-8 w-8 text-white" />
                          </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">#7th Chords</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                          </div>
                        </button>
                          </div>
                          </div>
                 );

       case 'suspended-chords':
         return (
           <div className="space-y-6">
             {/* Suspended Chords Banner */}
             <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                   <Music className="h-8 w-8" />
                        </div>
                        <div>
                   <h1 className="text-3xl font-bold">Suspended Chords</h1>
                   <p className="text-orange-100">Master the essential suspended chords that add tension and color to your music!</p>
                        </div>
                      </div>
                  </div>

             {/* Chord Type Buttons */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <button
                 onClick={() => {
                   setSelectedChordType('suspended');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                          </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Suspended Chords</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                      </div>
                    </button>

                          <button
                            onClick={() => {
                   setSelectedChordType('sharp-suspended');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                              </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">#Suspended Chords</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                            </div>
                          </button>
                      </div>
                  </div>
         );

       case 'diminished-chords':
         return (
           <div className="space-y-6">
             {/* Diminished Chords Banner */}
             <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                   <Music className="h-8 w-8" />
                          </div>
                 <div>
                   <h1 className="text-3xl font-bold">Diminished Chords</h1>
                   <p className="text-red-100">Master the essential diminished chords that add tension and mystery to your music!</p>
                          </div>
                        </div>
                  </div>
                  
             {/* Chord Type Buttons */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <button
                 onClick={() => {
                   setSelectedChordType('diminished');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                  </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Diminished Chords</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                </div>
                              </button>
      
                              <button
                 onClick={() => {
                   setSelectedChordType('sharp-diminished');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                  </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">#Diminished Chords</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                </div>
                              </button>
                                  </div>
                                </div>
         );

       case 'add-ninth-chords':
         return (
           <div className="space-y-6">
             {/* Add-9th Chords Banner */}
             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                   <Music className="h-8 w-8" />
                                  </div>
                 <div>
                   <h1 className="text-3xl font-bold">Add-9th Chords</h1>
                   <p className="text-indigo-100">Master the essential add-9th chords that add richness and depth to your music!</p>
                                </div>
                                  </div>
                                </div>
      
             {/* Chord Type Buttons */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <button
                              onClick={() => {
                   setSelectedChordType('add-ninth');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                  </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Add-9th Chords</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                </div>
                              </button>
                              
                              <button
                              onClick={() => {
                   setSelectedChordType('sharp-add-ninth');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                  </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">#Add-9th Chords</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                </div>
                              </button>
                                  </div>
                                </div>
         );

       case 'minor-families':
         return (
           <div className="space-y-6">
             {/* Major Families Banner */}
             <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                   <Music className="h-8 w-8" />
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold">Major Families</h1>
                   <p className="text-violet-100">Master the essential major scale families and their chord progressions!</p>
                 </div>
               </div>
                              </div>
                              
             {/* Major Family Buttons */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                 <button
                 onClick={() => {
                   setSelectedChordType('c-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">C-Major Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                              </div>
                            </button>
                            
                                           <button
                 onClick={() => {
                   setSelectedChordType('d-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">D-Major Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                              </div>
                            </button>
                            
                                           <button
                 onClick={() => {
                   setSelectedChordType('e-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                    </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">E-Major Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                                
                                               <button
                 onClick={() => {
                   setSelectedChordType('f-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                    </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">F-Major Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                                
                                               <button
                 onClick={() => {
                   setSelectedChordType('g-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                    </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">G-Major Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                                
                                               <button
                 onClick={() => {
                   setSelectedChordType('a-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                    </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">A-Major Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                                
                                               <button
                 onClick={() => {
                   setSelectedChordType('b-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                                    </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">B-Major Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                              </div>
                              
                              {/* # Major Families Section */}
                              <div className="mt-12 mb-8">
                                <div className="text-center">
                                  <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                                    # Major Families
                                  </h2>
                                  <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full"></div>
                                </div>
                              </div>
                              
                              {/* # Major Family Buttons */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                               <button
                 onClick={() => {
                   setSelectedChordType('c-sharp-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                      <Music className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">C#-Major Family</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                                
                                               <button
                 onClick={() => {
                   setSelectedChordType('d-sharp-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                      <Music className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">D#-Major Family</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                                
                                               <button
                 onClick={() => {
                   setSelectedChordType('f-sharp-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                      <Music className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">F#-Major Family</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                                
                                               <button
                 onClick={() => {
                   setSelectedChordType('g-sharp-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                      <Music className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">G#-Major Family</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                                
                                               <button
                 onClick={() => {
                   setSelectedChordType('a-sharp-major-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                      <Music className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">A#-Major Family</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                                  </div>
                                </button>
                              </div>
                              </div>
         );

       case 'minor-families-new':
         return (
           <div className="space-y-6">
             {/* Minor Families Banner */}
             <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                   <Music className="h-8 w-8" />
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold">Minor Families</h1>
                   <p className="text-blue-100">Master the essential minor scale families and their chord progressions!</p>
                 </div>
               </div>
             </div>
             
             {/* Minor Family Buttons */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
               <button
                 onClick={() => {
                   setSelectedChordType('c-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">C Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('d-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">D Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('e-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">E Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('f-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">F Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('g-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">G Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('a-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">A Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('b-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">B Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
             </div>
             
             {/* # Minor Families Section */}
             <div className="mt-12 mb-8">
               <div className="text-center">
                 <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                   # Minor Families
                 </h2>
                 <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
               </div>
             </div>
             
             {/* # Minor Family Buttons */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
               <button
                 onClick={() => {
                   setSelectedChordType('c-sharp-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">C# Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('d-sharp-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">D# Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('f-sharp-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">F# Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('g-sharp-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">G# Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
               
               <button
                 onClick={() => {
                   setSelectedChordType('a-sharp-minor-family');
                   setShowChordModal(true);
                 }}
                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
               >
                 <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                     <Music className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">A# Minor Family</h3>
                   <p className="text-gray-600 dark:text-gray-300 text-sm">Click to learn</p>
                 </div>
               </button>
             </div>
           </div>
         );

       case 'how-to-play-families':
         return (
           <div className="space-y-6">
             {/* Video Tutorial Banner */}
             <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                   <Play className="h-8 w-8" />
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold">How to play Major and Minor Families?</h1>
                   <p className="text-orange-100">Learn the essential techniques for playing Major and Minor scale families on your keyboard!</p>
                 </div>
               </div>
             </div>
             
             {/* Video Player */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
               <div className="max-w-2xl mx-auto">
                 <div className="relative">
                   {/* Loading Animation */}
                   <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-xl z-10" id="video-loading">
                     <div className="flex flex-col items-center gap-3">
                       <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-gray-600 dark:text-gray-300 text-sm">Loading video...</p>
                     </div>
                   </div>
                   
                   {/* Video Container */}
                   <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                     <iframe
                       className="w-full h-full"
                       src="https://www.youtube.com/embed/-T5bUxE8-no?modestbranding=1&rel=0&showinfo=0"
                       title="How to play Major and Minor Families"
                       frameBorder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                       onLoad={() => {
                         const loadingElement = document.getElementById('video-loading');
                         if (loadingElement) {
                           loadingElement.style.display = 'none';
                         }
                       }}
                     ></iframe>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         );

       case 'how-to-use-transpose':
         return (
           <div className="space-y-6">
             {/* Video Tutorial Banner */}
             <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                   <Play className="h-8 w-8" />
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold">How to Use Transpose?</h1>
                   <p className="text-blue-100">Master the transpose function to change keys and play in different musical scales!</p>
                 </div>
               </div>
             </div>
             
             {/* Video Player */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
               <div className="max-w-2xl mx-auto">
                 <div className="relative">
                   {/* Loading Animation */}
                   <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-xl z-10" id="transpose-video-loading">
                     <div className="flex flex-col items-center gap-3">
                       <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-gray-600 dark:text-gray-300 text-sm">Loading video...</p>
                     </div>
                   </div>
                   
                   {/* Video Container */}
                   <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                     <iframe
                       className="w-full h-full"
                       src="https://www.youtube.com/embed/k3mCSERywf8?modestbranding=1&rel=0&showinfo=0"
                       title="How to Use Transpose"
                       frameBorder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                       onLoad={() => {
                         const loadingElement = document.getElementById('transpose-video-loading');
                         if (loadingElement) {
                           loadingElement.style.display = 'none';
                         }
                       }}
                     ></iframe>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         );

       default:
        return (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Music className="h-8 w-8 text-white" />
                                    </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {courseSections.find(section => section.id === activeSection)?.title}
                                </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Content for this section will be added soon. Stay tuned!
              </p>
                              </div>
          </div>
        );
    }
  };

  // Show loading screen while checking payment status
  if (isCheckingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Verifying Access...</h2>
          <p className="text-slate-600 dark:text-slate-300">Please wait while we check your payment status</p>
        </div>
      </div>
    );
  }

  // Show access denied screen for non-paying users
  if (!hasIntermediateAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Intermediate Course Locked
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            This intermediate course requires payment. Please upgrade to the Intermediate Plan to access premium content.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              View Pricing Plans
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">What's Included:</h3>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              <li>• 7th Chords & Suspended Chords</li>
              <li>• Major & Minor Families</li>
              <li>• Diminished & Add-9th Chords</li>
              <li>• Family Playing Techniques</li>
              <li>• Transpose Methods</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="fixed inset-0 bg-gradient-to-br from-orange-900/70 via-yellow-800/60 to-orange-700/70"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Mobile-Friendly Header */}
        <header className="relative z-[999998]">
          {/* Enhanced Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 via-yellow-500/90 to-orange-600/90 dark:from-orange-600/95 dark:via-yellow-600/95 dark:to-orange-700/95"></div>
          
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider">
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
                    <div className="fixed sm:absolute top-16 sm:top-12 left-4 sm:left-auto sm:right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-64 sm:w-auto sm:min-w-48 z-[999999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 animate-in slide-in-from-top-2 duration-200 transform origin-top-right scale-100 user-menu-dropdown overflow-hidden">
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
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-105 group mb-2"
                        >
                          <Download className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">Downloads</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 hover:scale-105 group"
                        >
                          <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
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
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out transform"
                  >
                    Login
                            </button>
                                <button
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out transform"
                  >
                    Sign Up
                                </button>
                </div>
              )}
              
              {/* Theme Toggle */}
                                <button
                onClick={toggleTheme}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 hover:scale-110 transition-all duration-300 ease-in-out transform"
              >
                {isDark ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
                                </button>
            </div>

            {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 hover:scale-110 transition-all duration-300 ease-in-out transform"
            >
              <Menu className="h-5 w-5 text-white" />
              </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-t border-white/20 dark:border-slate-700/50 z-[999999] shadow-2xl">
              <div className="p-4 space-y-3">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {getUserInitials(currentUser.email || '')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {getUserDisplayName(currentUser.email || '')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {currentUser.email}
                        </p>
                    </div>
                  </div>
                    <button
                      onClick={() => {
                        navigate('/psr-i500');
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105 rounded-lg transition-all duration-300 ease-in-out transform font-medium"
                    >
                      <Music className="h-4 w-4" />
                      <span className="font-medium">PSR-I500 Styles</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/downloads');
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105 rounded-lg transition-all duration-300 ease-in-out transform font-medium"
                    >
                      <Download className="h-4 w-4" />
                      <span className="font-medium">Downloads</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-105 rounded-lg transition-all duration-300 ease-in-out transform font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                      <>
                        <button
                          onClick={() => {
                            navigate('/login');
                            setShowMobileMenu(false);
                          }}
                          className="w-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out transform font-medium"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                        navigate('/signup');
                            setShowMobileMenu(false);
                          }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out transform"
                        >
                      Sign Up
                        </button>
                      </>
                    )}

                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105 rounded-lg transition-all duration-300 ease-in-out transform font-medium"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 py-0">
          <div className="w-full px-2 sm:px-4 md:px-6">
            {/* Mobile Sidebar - Always visible on mobile, hidden on desktop */}
            <div className="xl:hidden mb-4">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 p-3 sm:p-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-600 hover:to-yellow-600 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out transform flex items-center gap-2 mb-4"
                >
                  <Home className="h-5 w-5" />
                  Back to Home
                </button>

                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Course Sections</h2>
                <div className="grid grid-cols-2 gap-2">
                  {courseSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`text-left p-2 sm:p-3 rounded-lg transition-all duration-300 ease-in-out transform text-sm ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:scale-105 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <section.icon className="h-4 w-4" />
                        <span className="font-medium truncate">{section.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden xl:grid xl:grid-cols-5 gap-6">
              <div className="xl:col-span-1">
                {/* Desktop Sidebar */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 p-4 sticky top-4">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-600 hover:to-yellow-600 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out transform flex items-center gap-2 mb-6"
                  >
                    <Home className="h-5 w-5" />
                    Back to Home
                  </button>

                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Course Sections</h2>
                  <div className="space-y-2">
                    {courseSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 ease-in-out transform ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:scale-105 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <section.icon className="h-5 w-5" />
                          <span className="font-medium">{section.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4">
                {/* Main Content */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6">
                  {renderContent()}
                </div>
              </div>
            </div>

            {/* Mobile Main Content */}
            <div className="xl:hidden">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 p-4 sm:p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>

               {/* Chord Modal */}
        {showChordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-1 sm:p-2 md:p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3">
                 <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Music className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                 <div>
                                       <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedChordType === 'seventh' ? '7th Chords' : 
                       selectedChordType === 'sharp-seventh' ? '#7th Chords' :
                       selectedChordType === 'suspended' ? 'Suspended Chords' : 
                       selectedChordType === 'sharp-suspended' ? '#Suspended Chords' :
                       selectedChordType === 'diminished' ? 'Diminished Chords' : 
                       selectedChordType === 'sharp-diminished' ? '#Diminished Chords' :
                       selectedChordType === 'add-ninth' ? 'Add-9th Chords' : 
                       selectedChordType === 'sharp-add-ninth' ? '#Add-9th Chords' :
                       selectedChordType === 'major-families' ? 'Major Families' : 
                       selectedChordType === 'sharp-major-families' ? '#Major Families' :
                       selectedChordType === 'minor-families' ? 'Minor Families' :
                       selectedChordType === 'c-major-family' ? 'C Major Family' :
                       selectedChordType === 'd-major-family' ? 'D Major Family' :
                       selectedChordType === 'e-major-family' ? 'E Major Family' :
                       selectedChordType === 'f-major-family' ? 'F Major Family' :
                       selectedChordType === 'g-major-family' ? 'G Major Family' :
                       selectedChordType === 'a-major-family' ? 'A Major Family' :
                       selectedChordType === 'b-major-family' ? 'B Major Family' :
                       selectedChordType === 'c-sharp-major-family' ? 'C# Major Family' :
                       selectedChordType === 'd-sharp-major-family' ? 'D# Major Family' :
                       selectedChordType === 'f-sharp-major-family' ? 'F# Major Family' :
                       selectedChordType === 'g-sharp-major-family' ? 'G# Major Family' :
                       selectedChordType === 'a-sharp-major-family' ? 'A# Major Family' :
                       selectedChordType === 'c-minor-family' ? 'C Minor Family' :
                       selectedChordType === 'd-minor-family' ? 'D Minor Family' :
                       selectedChordType === 'e-minor-family' ? 'E Minor Family' :
                       selectedChordType === 'f-minor-family' ? 'F Minor Family' :
                       selectedChordType === 'g-minor-family' ? 'G Minor Family' :
                       selectedChordType === 'a-minor-family' ? 'A Minor Family' :
                       selectedChordType === 'b-minor-family' ? 'B Minor Family' :
                       selectedChordType === 'c-sharp-minor-family' ? 'C# Minor Family' :
                       selectedChordType === 'd-sharp-minor-family' ? 'D# Minor Family' :
                       selectedChordType === 'f-sharp-minor-family' ? 'F# Minor Family' :
                       selectedChordType === 'g-sharp-minor-family' ? 'G# Minor Family' :
                       selectedChordType === 'a-sharp-minor-family' ? 'A# Minor Family' : 'Family Chords'}
                        </h2>
                        </div>
                      </div>
                              <button
                 onClick={() => setShowChordModal(false)}
                 className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 hover:scale-110 rounded-lg transition-all duration-200 ease-in-out transform"
              >
                 <X className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                              </button>
            </div>
            
             {/* Modal Content */}
             <div className="p-2 sm:p-4 md:p-6">
                                                                                                                                {selectedChordType === 'seventh' && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {/* C7 */}
                     <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 sm:p-3 border border-blue-200 dark:border-blue-700/30 min-w-0">
                       <h3 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white mb-2 sm:mb-3 text-center truncate">C-7th</h3>
                  <div className="flex justify-center gap-0.5 sm:gap-1 flex-wrap">
                    <div className="flex flex-col items-center min-w-0">
                             <div className="bg-white dark:bg-gray-700 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-center mb-0.5 sm:mb-1 min-w-[1.5rem] sm:min-w-[2rem]">
                               <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                                  </div>
                             <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                </div>
                    <div className="flex flex-col items-center">
                             <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                               <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
                                  </div>
                             <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                                </div>
                    <div className="flex flex-col items-center">
                             <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                               <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                                  </div>
                             <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                                </div>
                    <div className="flex flex-col items-center">
                             <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                               <span className="text-white font-medium text-xs">A♯</span>
                                  </div>
                             <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                                </div>
                                  </div>
                                </div>

              {/* D7 */}
                     <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                       <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-7th</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                           <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                             <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                                  </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                             <span className="text-white font-medium text-xs">F♯</span>
                                  </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                                </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                             <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                              </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                                </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                             <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                              </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                                </div>
                              </div>
              </div>

              {/* E7 */}
                     <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700/30">
                       <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-7th</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">E</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-white font-medium">G♯</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">B</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">D</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                                  </div>
                </div>
              </div>

              {/* F7 */}
                     <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                       <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-7th</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">F</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">A</span>
                              </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">C</span>
                              </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-white font-medium">D♯</span>
                                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                                  </div>
                                </div>
              </div>

              {/* G7 */}
                     <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700/30">
                       <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-7th</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">G</span>
                                  </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">B</span>
                                  </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                                </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">D</span>
                                  </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                                </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">F</span>
                              </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                            </div>
                </div>
                              </div>
                              
              {/* A7 */}
                     <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700/30">
                       <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-7th</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">A</span>
                                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-white font-medium">C♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                        </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">E</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">G</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                                  </div>
                                    </div>
                                  </div>

              {/* B7 */}
                     <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700/30">
                       <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-7th</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">B</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-white font-medium">D♯</span>
                                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-white font-medium">F♯</span>
                              </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium">A</span>
                              </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                                    </div>
                                  </div>
                                    </div>
                                  </div>
      )}

                                                                                                                               {selectedChordType === 'sharp-seventh' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                           {/* C♯7 */}
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                        <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C♯-7th</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                            <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                              <span className="text-white font-medium text-xs">C♯</span>
                                    </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                  </div>
                    <div className="flex flex-col items-center">
                            <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                              <span className="text-white font-medium text-xs">E♯</span>
                                    </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                                  </div>
                    <div className="flex flex-col items-center">
                            <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                              <span className="text-white font-medium text-xs">G♯</span>
                                    </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                                  </div>
                    <div className="flex flex-col items-center">
                            <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                              <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                      </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                    </div>
                            </div>
                        </div>
            
                                                                               {/* D♯7 */}
                     <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700/30">
                       <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 text-center">D♯-7th</h3>
                       <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">D♯</span>
                      </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">F𝄪</span>
                </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
              </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">A♯</span>
            </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
          </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">C♯</span>
      </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                </div>
              </div>
            </div>
            
                                                                               {/* F♯7 */}
                     <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700/30">
                       <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 text-center">F♯-7th</h3>
                       <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">F♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">A♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">C♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-gray-800 dark:text-white font-medium">E</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
              </div>

                                                                               {/* G♯7 */}
                     <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-700/30">
                       <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 text-center">G♯-7th</h3>
                       <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">G♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">B♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">D♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">F♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
              </div>

                                                                               {/* A♯7 */}
                     <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-cyan-200 dark:border-cyan-700/30">
                       <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 text-center">A♯-7th</h3>
                       <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">A♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">C𝄪</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">E♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                    </div>
                    <div className="flex flex-col items-center">
                           <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1">
                             <span className="text-white font-medium">G♯</span>
                    </div>
                           <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
              </div>
        </div>
      )}

                {selectedChordType === 'suspended' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* Csus2 */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Csus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* Dsus2 */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Dsus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* Esus2 */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Esus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* Fsus2 */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Fsus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* Gsus2 */}
                    <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Gsus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                </div>
              </div>
            </div>

                    {/* Asus2 */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Asus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
          </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
        </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
              </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
            </div>
            
                    {/* Bsus2 */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Bsus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>
        </div>
      )}

                {selectedChordType === 'sharp-suspended' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* C♯sus2 */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C♯sus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* D♯sus2 */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D♯sus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* F♯sus2 */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F♯sus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* G♯sus2 */}
                    <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G♯sus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                </div>
              </div>
            </div>

                    {/* A♯sus2 */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A♯sus2</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
            </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
        </div>
                </div>
              </div>
            </div>
      )}
            
                {selectedChordType === 'diminished' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Cdim */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Cdim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

              {/* Ddim */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Ddim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

              {/* Edim */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Edim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

              {/* Fdim */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Fdim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

              {/* Gdim */}
                    <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Gdim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

              {/* Adim */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Adim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

              {/* Bdim */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Bdim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>
            </div>
      )}

                {selectedChordType === 'sharp-diminished' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* C♯dim */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C♯dim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
            </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
        </div>
                </div>
              </div>

                    {/* D♯dim */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D♯dim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
            </div>
            
                    {/* F♯dim */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F♯dim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* G♯dim */}
                    <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G♯dim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                    {/* A♯dim */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A♯dim</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>
            </div>
      )}

                {selectedChordType === 'add-ninth' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* Cadd9 */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Cadd9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
              </div>

                    {/* Dadd9 */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Dadd9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                </div>
              </div>
            </div>

                    {/* Eadd9 */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Eadd9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                </div>
              </div>
            </div>

                    {/* Fadd9 */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Fadd9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
          </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
        </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
            </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
        </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
              </div>
                </div>
            </div>
            
                    {/* Gadd9 */}
                    <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Gadd9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
            </div>
            
                    {/* Aadd9 */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Aadd9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">A</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">E</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
              </div>

                    {/* Badd9 */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">Badd9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">B</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
              </div>
                </div>
              </div>
        </div>
      )}

                {selectedChordType === 'sharp-add-ninth' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* C♯add9 */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C♯add9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
              </div>

              {/* D♯add9 */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D♯add9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">G</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
              </div>

              {/* F♯add9 */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F♯add9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">F♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">C♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                  </div>
                </div>
              </div>

              {/* G♯add9 */}
                    <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G♯add9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">G♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">D♯</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
                </div>
                </div>
              </div>

              {/* A♯add9 */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700/30">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A♯add9</h3>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                          <div className="bg-gray-800 dark:bg-gray-600 rounded px-2 py-1 text-center mb-1">
                            <span className="text-white font-medium text-xs">A♯</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">C</span>
            </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">D</span>
                    </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                        <div className="flex flex-col items-center">
                          <div className="bg-white dark:bg-gray-700 rounded px-2 py-1 text-center mb-1">
                            <span className="text-gray-800 dark:text-white font-medium text-xs">F</span>
                </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">4</span>
              </div>
            </div>
          </div>
                          </div>
                )}

                {selectedChordType === 'c-major-family' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/30">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">C Major Family</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                 {/* C-Major */}
                         <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                           <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Major</h4>
                           <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                               </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
            </div>

                                                 {/* F-Major */}
                         <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                           <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Major</h4>
                           <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
            </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
          </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
        </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                                                 {/* G-Major */}
                         <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                           <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Major</h4>
                           <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                               </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
            </div>
            
                         {/* D-Minor */}
                         <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                           <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Minor</h4>
                           <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                               </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                         {/* E-Minor */}
                         <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                           <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Minor</h4>
                           <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                               </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                         {/* A-Minor */}
                         <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                           <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Minor</h4>
                           <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
            </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>

                         {/* B-Diminished */}
                         <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                           <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Diminished</h4>
                           <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
            </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                               <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                                 <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                    </div>
                               <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                </div>
              </div>
               </div>
             </div>
           </div>
         )}

         {selectedChordType === 'd-major-family' && (
           <div className="space-y-6">
             <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700/30">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">D Major Family</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                 {/* D-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                  </div>
                   </div>
                 </div>

                 {/* G-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                </div>
              </div>
            </div>

                 {/* A-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
            </div>

                 {/* E-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
            </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
          </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
        </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* F#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
            </div>
            
                 {/* B-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* C#-Diminished */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Diminished</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
              </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {selectedChordType === 'e-major-family' && (
           <div className="space-y-6">
             <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700/30">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">E Major Family</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                 {/* E-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* A-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                </div>
              </div>

                 {/* B-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* F#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                </div>
              </div>

                 {/* G#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* C#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                </div>
              </div>

                 {/* D#-Diminished */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Diminished</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {selectedChordType === 'f-major-family' && (
           <div className="space-y-6">
             <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700/30">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">F Major Family</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                 {/* F-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                </div>
              </div>

                 {/* A#-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* C-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                </div>
              </div>

                 {/* G-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* A-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
              </div>
            </div>

                 {/* D-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
            </div>

                 {/* E-Diminished */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Diminished</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
            </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
               </div>
          </div>
        </div>
      )}

         {selectedChordType === 'g-major-family' && (
           <div className="space-y-6">
             <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700/30">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">G Major Family</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                 {/* G-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
            </div>
            
                 {/* C-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* D-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                </div>
              </div>

                 {/* A-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* B-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                </div>
              </div>

                 {/* E-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* F#-Diminished */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Diminished</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
              </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {selectedChordType === 'a-major-family' && (
           <div className="space-y-6">
             <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700/30">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">A Major Family</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                 {/* A-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* D-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                </div>
              </div>

                 {/* E-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Major</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* B-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Minor</h4>
                   <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
              </div>
            </div>

                 {/* C#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
            </div>

                 {/* F#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
            </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* G#-Diminished */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Diminished</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
               </div>
          </div>
        </div>
      )}

         {selectedChordType === 'b-major-family' && (
           <div className="space-y-6">
             <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-700/30">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">B Major Family</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                 {/* B-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
              </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
            </div>
            
                 {/* E-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
              </div>
              
                 {/* F#-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                          </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                        </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                    </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                  </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
              </div>
            </div>

                 {/* C#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* D#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* G#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>

                 {/* A#-Diminished */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Diminished</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {selectedChordType === 'c-sharp-major-family' && (
           <div className="space-y-6">
             <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/30">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">C# Major Family</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                 {/* C#-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* F#-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* G#-Major */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Major</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* D#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* F-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">G♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* A#-Minor */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Minor</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">A♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">C♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* B#-Diminished */}
                 <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B#-Diminished</h4>
                   <div className="flex justify-center gap-2">
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">B♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">D♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                         <span className="text-white font-medium text-sm">F♯</span>
                       </div>
                       <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
                       </div>
          )}

          {selectedChordType === 'd-sharp-major-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">D# Major Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* D#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* G#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* A#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* F-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* G-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* C-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* D-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedChordType === 'f-sharp-major-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">F# Major Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* F#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* B-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* C#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">E♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* G#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* A#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">E♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* D#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* E#-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E#-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">E♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedChordType === 'g-sharp-major-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">G# Major Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* G#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* C#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* D#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* A#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* C-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* F-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* G-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedChordType === 'a-sharp-major-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">A# Major Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* A#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* D#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* F-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* C-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* D-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* G-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* A-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* C Minor Family */}
          {selectedChordType === 'c-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">C Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* C-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* D Minor Family */}
          {selectedChordType === 'd-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">D Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* D-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* E-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                     )}

          {/* E Minor Family */}
          {selectedChordType === 'e-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">E Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* E-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* B-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F#-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                     )}

          {/* C# Minor Family */}
          {selectedChordType === 'c-sharp-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">C# Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* C#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* B-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* E-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D#-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                     )}

          {/* D# Minor Family */}
          {selectedChordType === 'd-sharp-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">D# Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* D#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* B-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* F# Minor Family */}
          {selectedChordType === 'f-sharp-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">F# Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* F#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* E-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* B-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G#-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                     )}

          {/* G# Minor Family */}
          {selectedChordType === 'g-sharp-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">G# Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* G#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* E-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* B-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A#-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* A# Minor Family */}
          {selectedChordType === 'a-sharp-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">A# Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* A#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                     )}

          {/* F Minor Family */}
          {selectedChordType === 'f-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">F Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* F-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">G♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* G Minor Family */}
          {selectedChordType === 'g-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">G Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* G-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A#-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A#-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">A♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">D♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                     )}

          {/* A Minor Family */}
          {selectedChordType === 'a-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">A Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* A-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">C</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* E-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* B-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">F</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B Minor Family */}
          {selectedChordType === 'b-minor-family' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">B Minor Family</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* B-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">B-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* A-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">A-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* G-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">G-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* D-Major */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">D-Major</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">D</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* E-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">E-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">B</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* F#-Minor */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">F#-Minor</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">F♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>

                  {/* C#-Diminished */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3 text-center">C#-Diminished</h4>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-white font-medium text-sm">C♯</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">E</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-2 text-center mb-1 border border-gray-200 dark:border-gray-500">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">G</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Practice Tip Section */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700/30 mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                    <h3 className="font-bold text-gray-800 dark:text-white">Practice Tip</h3>
              </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Practice Well As Much You Can Do
              </p>
            </div>

               {/* Confirmation Button */}
               <div className="flex justify-center mt-6">
              <button
                   onClick={() => {
                     // Mark section as completed based on current section
                     if (activeSection === 'seventh-chords') {
                       markSectionCompleted('seventhChords');
                     } else if (activeSection === 'diminished-chords') {
                       markSectionCompleted('diminishedChords');
                     } else if (activeSection === 'suspended-chords') {
                       markSectionCompleted('suspendedChords');
                     } else if (activeSection === 'add-ninth-chords') {
                       markSectionCompleted('addNinthChords');
                     } else if (activeSection === 'minor-families') {
                       markSectionCompleted('majorFamilies');
                     } else if (activeSection === 'minor-families-new') {
                       markSectionCompleted('minorFamilies');
                     } else if (activeSection === 'how-to-play-families') {
                       markSectionCompleted('howToPlayFamilies');
                     } else if (activeSection === 'how-to-use-transpose') {
                       markSectionCompleted('howToUseTranspose');
                     }
                     setShowChordModal(false);
                   }}
                   className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-blue-700 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out transform flex items-center gap-3 shadow-lg"
              >
                <Check className="h-5 w-5" />
                Done Abhi! I've Learned This {selectedChordType === 'seventh' ? '7th Chords' : 
                 selectedChordType === 'sharp-seventh' ? '#7th Chords' :
                 selectedChordType === 'suspended' ? 'Suspended Chords' : 
                 selectedChordType === 'sharp-suspended' ? '#Suspended Chords' :
                 selectedChordType === 'diminished' ? 'Diminished Chords' : 
                 selectedChordType === 'sharp-diminished' ? '#Diminished Chords' :
                 selectedChordType === 'add-ninth' ? 'Add-9th Chords' : 
                 selectedChordType === 'sharp-add-ninth' ? '#Add-9th Chords' :
                 selectedChordType === 'major-families' ? 'Major Families' : 
                 selectedChordType === 'sharp-major-families' ? '#Major Families' :
                 selectedChordType === 'minor-families' ? 'Minor Families' :
                 selectedChordType === 'c-major-family' ? 'C Major Family' :
                 selectedChordType === 'd-major-family' ? 'D Major Family' :
                 selectedChordType === 'e-major-family' ? 'E Major Family' :
                 selectedChordType === 'f-major-family' ? 'F Major Family' :
                 selectedChordType === 'g-major-family' ? 'G Major Family' :
                 selectedChordType === 'a-major-family' ? 'A Major Family' :
                 selectedChordType === 'b-major-family' ? 'B Major Family' :
                 selectedChordType === 'c-sharp-major-family' ? 'C# Major Family' :
                 selectedChordType === 'd-sharp-major-family' ? 'D# Major Family' :
                 selectedChordType === 'f-sharp-major-family' ? 'F# Major Family' :
                 selectedChordType === 'g-sharp-major-family' ? 'G# Major Family' :
                 selectedChordType === 'a-sharp-major-family' ? 'A# Major Family' :
                 selectedChordType === 'c-minor-family' ? 'C Minor Family' :
                 selectedChordType === 'd-minor-family' ? 'D Minor Family' :
                 selectedChordType === 'e-minor-family' ? 'E Minor Family' :
                 selectedChordType === 'f-minor-family' ? 'F Minor Family' :
                 selectedChordType === 'g-minor-family' ? 'G Minor Family' :
                 selectedChordType === 'a-minor-family' ? 'A Minor Family' :
                 selectedChordType === 'b-minor-family' ? 'B Minor Family' :
                 selectedChordType === 'c-sharp-minor-family' ? 'C# Minor Family' :
                 selectedChordType === 'd-sharp-minor-family' ? 'D# Minor Family' :
                 selectedChordType === 'f-sharp-minor-family' ? 'F# Minor Family' :
                 selectedChordType === 'g-sharp-minor-family' ? 'G# Minor Family' :
                 selectedChordType === 'a-sharp-minor-family' ? 'A# Minor Family' : 'Family'} Perfectly
              </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        courseName="Intermediate Piano Course"
      />
    </div>
  );
};

export default IntermediateCourseContent;

