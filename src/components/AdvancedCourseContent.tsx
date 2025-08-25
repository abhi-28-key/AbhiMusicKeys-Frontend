import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Lock, Check, Star, Clock, BookOpen, Music, Piano, Guitar, Headphones, Users, Target, Zap, ChevronDown, LogOut, Download, Menu, Home, GraduationCap, Award, Calendar, Bookmark, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import VideoSection from './ui/VideoSection';
import RatingModal from './ui/RatingModal';

// Lazy Video Player Component for Advanced Course Content
const LazyVideoPlayer: React.FC<{
  videoId: string;
  title: string;
  thumbnailUrl: string;
  loadingColor: string;
}> = ({ videoId, title, thumbnailUrl, loadingColor }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlayClick = () => {
    setIsLoading(true);
    setShowVideo(true);
    setHasError(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const getLoadingSpinnerColor = () => {
    switch (loadingColor) {
      case 'orange': return 'border-orange-500';
      case 'blue': return 'border-blue-500';
      case 'green': return 'border-green-500';
      case 'pink': return 'border-pink-500';
      case 'fuchsia': return 'border-fuchsia-500';
      default: return 'border-pink-500';
    }
  };

  return (
    <div className="relative">
      {!showVideo ? (
        // Show thumbnail with play button overlay
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg">
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default thumbnail if YouTube thumbnail fails
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 transform hover:scale-110 shadow-lg"
            >
              <Play className="w-8 h-8 text-slate-800 ml-1" fill="currentColor" />
            </button>
          </div>
        </div>
      ) : (
        // Show actual video player
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg">
          {/* Loading Animation */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-xl z-10">
              <div className="flex flex-col items-center gap-3">
                <div className={`w-8 h-8 border-4 ${getLoadingSpinnerColor()} border-t-transparent rounded-full animate-spin`}></div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Loading video...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-xl z-10">
              <div className="text-center">
                <Play className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-300 mb-2">Video unavailable</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Check your internet connection</p>
                <button 
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    // Force reload by updating iframe src
                    const iframe = document.querySelector('iframe');
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }}
                  className="mt-3 text-pink-500 hover:text-pink-600 text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleVideoLoad}
            onError={handleVideoError}
          ></iframe>
        </div>
      )}
    </div>
  );
};

const AdvancedCourseContent: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('introduction');
  const [selectedFamily, setSelectedFamily] = useState<any>(null);
  const [selectedRaga, setSelectedRaga] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCourseCompletionModal, setShowCourseCompletionModal] = useState(false);
  const [hasAdvancedAccess, setHasAdvancedAccess] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);

  // Progress tracking state
  const [courseProgress, setCourseProgress] = useState<{
    introduction: boolean;
    module1: boolean;
    module2: boolean;
    module3: boolean;
    module4: boolean;
  }>({
    introduction: false,
    module1: false,
    module2: false,
    module3: false,
    module4: false,
  });

  // Video completion tracking
  const [completedVideos, setCompletedVideos] = useState<{
    scales: string[];
    interludes: string[];
  }>({
    scales: [],
    interludes: [],
  });

  // Check payment status and load progress
  useEffect(() => {
    const checkPaymentStatus = () => {
      if (!currentUser) {
        // If user is not logged in, redirect to login
        navigate('/login');
        return;
      }

      // 🔐 ADMIN BYPASS: Check if accessed through admin route
      const isAdminRoute = window.location.pathname.includes('/secure-admin-panel/');
      if (isAdminRoute) {
        // Admin access - bypass payment check
        setHasAdvancedAccess(true);
        setIsCheckingPayment(false);
        return;
      }

      // Check if user has advanced course enrollment (check both enrollment systems)
      const advancedEnrollment = localStorage.getItem(`enrolled_${currentUser.uid}_advanced`);
      const advancedAccess = localStorage.getItem(`advanced_access_${currentUser.uid}`);
      const hasEnrolled = advancedEnrollment === 'true' || advancedAccess === 'true';
      
      if (!hasEnrolled) {
        // If not enrolled, redirect to overview page
        navigate('/advanced-overview');
        return;
      }

      setHasAdvancedAccess(true);
      setIsCheckingPayment(false);
    };

    checkPaymentStatus();
  }, [currentUser, navigate]);

  // Load progress from localStorage
  useEffect(() => {
    if (!currentUser || !hasAdvancedAccess) return;
    
    const savedProgress = localStorage.getItem(`progress_${currentUser.uid}_advanced`);
    const savedCompletedVideos = localStorage.getItem(`completedVideos_${currentUser.uid}_advanced`);
    
    if (savedProgress) {
      try {
        setCourseProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
    
    if (savedCompletedVideos) {
      try {
        setCompletedVideos(JSON.parse(savedCompletedVideos));
      } catch (error) {
        console.error('Error loading completed videos:', error);
      }
    }
  }, [currentUser, hasAdvancedAccess]);

  // Save progress to localStorage
  const saveProgress = () => {
    if (!currentUser || !hasAdvancedAccess) return;
    
    localStorage.setItem(`progress_${currentUser.uid}_advanced`, JSON.stringify(courseProgress));
    localStorage.setItem(`completedVideos_${currentUser.uid}_advanced`, JSON.stringify(completedVideos));
  };

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress();
  }, [courseProgress, completedVideos]);

  // Check for course completion
  const checkCourseCompletion = () => {
    const allModulesCompleted = Object.values(courseProgress).every(completed => completed);
    const allVideosCompleted = completedVideos.scales.length > 0 && completedVideos.interludes.length > 0;
    return allModulesCompleted && allVideosCompleted;
  };

  // Check for course completion on progress changes
  useEffect(() => {
    if (checkCourseCompletion() && !showCourseCompletionModal) {
      setShowCourseCompletionModal(true);
    }
  }, [courseProgress, completedVideos]);

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

  const menuSections = [
    { id: 'introduction', title: 'Advanced Major Families', icon: BookOpen },
    { id: 'module-1', title: 'Advanced Minor Families', icon: Music },
    { id: 'module-2', title: 'Ragas With Chords', icon: Music },
    { id: 'module-3', title: 'How to Find out Scale ?', icon: Play },
    { id: 'module-4', title: 'How to Play interludes ?', icon: Play },
  ];

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

  const getUserInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    try {
      // Store the review in localStorage for public display
      const newReview = {
        id: Date.now(),
        userName: currentUser ? getUserDisplayName(currentUser.email || '') : 'Anonymous',
        userInitials: currentUser ? getUserInitials(currentUser.email || '') : 'A',
        rating: rating,
        feedback: feedback,
        course: 'Advanced Piano Course',
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

  const handleCourseCompletion = () => {
    setShowCourseCompletionModal(false);
    setShowRatingModal(true);
  };

  // Function to mark video as completed
  const markVideoCompleted = (videoId: string, category: 'scales' | 'interludes') => {
    setCompletedVideos(prev => ({
      ...prev,
      [category]: [...prev[category], videoId]
    }));
  };

  // Function to mark module as completed
  const markModuleCompleted = (moduleId: string) => {
    setCourseProgress(prev => ({
      ...prev,
      [moduleId]: true
    }));
  };



  // Major Family Data - Regular Major Families
  const regularMajorFamilies = [
    {
      id: 'c-major',
      name: 'C-Major Family',
      chords: [
        { name: 'C-Add9', notes: ['C', 'D', 'E', 'G'] },
        { name: 'F-Add9', notes: ['F', 'G', 'A', 'C'] },
        { name: 'G7', notes: ['G', 'B', 'D', 'F'] },
        { name: 'E7', notes: ['E', 'G#', 'B', 'D'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'A7', notes: ['A', 'C#', 'E', 'G'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'G#-Diminished', notes: ['G#', 'B', 'D'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'C-Add9', notes: ['C', 'D', 'E', 'G'] }
      ]
    },
    {
      id: 'd-major',
      name: 'D-Major Family',
      chords: [
        { name: 'D-Add9', notes: ['D', 'E', 'F#', 'A'] },
        { name: 'G-Add9', notes: ['G', 'A', 'B', 'D'] },
        { name: 'A7', notes: ['A', 'C#', 'E', 'G'] },
        { name: 'F#7', notes: ['F#', 'A#', 'C#', 'E'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'B7', notes: ['B', 'D#', 'F#', 'A'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'A#-Diminished', notes: ['A#', 'C#', 'E'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'D-Add9', notes: ['D', 'E', 'F#', 'A'] }
      ]
    },
    {
      id: 'e-major',
      name: 'E-Major Family',
      chords: [
        { name: 'E-Add9', notes: ['E', 'F#', 'G#', 'B'] },
        { name: 'A-Add9', notes: ['A', 'B', 'C#', 'E'] },
        { name: 'B7', notes: ['B', 'D#', 'F#', 'A'] },
        { name: 'G#7', notes: ['G#', 'C', 'D#', 'F#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'C#7', notes: ['C#', 'E#', 'G#', 'B'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'C-Diminished', notes: ['C', 'D#', 'F#'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'E-Add9', notes: ['E', 'F#', 'G#', 'B'] }
      ]
    },
    {
      id: 'f-major',
      name: 'F-Major Family',
      chords: [
        { name: 'F-Add9', notes: ['F', 'G', 'A', 'C'] },
        { name: 'A#-Add9', notes: ['A#', 'C', 'D', 'F'] },
        { name: 'C7', notes: ['C', 'E', 'G', 'A#'] },
        { name: 'A7', notes: ['A', 'C#', 'E', 'G'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'D7', notes: ['D', 'F#', 'A', 'C'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'C#-Diminished', notes: ['C#', 'E', 'G'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'F-Add9', notes: ['F', 'G', 'A', 'C'] }
      ]
    },
    {
      id: 'g-major',
      name: 'G-Major Family',
      chords: [
        { name: 'G-Add9', notes: ['G', 'A', 'B', 'D'] },
        { name: 'C-Add9', notes: ['C', 'D', 'E', 'G'] },
        { name: 'D7', notes: ['D', 'F#', 'A', 'C'] },
        { name: 'B7', notes: ['B', 'D#', 'F#', 'A'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'E7', notes: ['E', 'G#', 'B', 'D'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'D#-Diminished', notes: ['D#', 'F#', 'A'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'G-Add9', notes: ['G', 'A', 'B', 'D'] }
      ]
    },
    {
      id: 'a-major',
      name: 'A-Major Family',
      chords: [
        { name: 'A-Add9', notes: ['A', 'B', 'C#', 'E'] },
        { name: 'D-Add9', notes: ['D', 'E', 'F#', 'A'] },
        { name: 'E7', notes: ['E', 'G#', 'B', 'D'] },
        { name: 'C#7', notes: ['C#', 'E#', 'G#', 'B'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'F#7', notes: ['F#', 'A#', 'C#', 'E'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'F-Diminished', notes: ['F', 'G#', 'B'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'A-Add9', notes: ['A', 'B', 'C#', 'E'] }
      ]
    },
    {
      id: 'b-major',
      name: 'B-Major Family',
      chords: [
        { name: 'B-Add9', notes: ['B', 'C#', 'D#', 'F#'] },
        { name: 'E-Add9', notes: ['E', 'F#', 'G#', 'B'] },
        { name: 'F#7', notes: ['F#', 'A#', 'C#', 'E'] },
        { name: 'D#7', notes: ['D#', 'F#', 'A#', 'C#'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'G#7', notes: ['G#', 'C', 'D#', 'F#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'G-Diminished', notes: ['G', 'A#', 'C#'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'B-Add9', notes: ['B', 'C#', 'D#', 'F#'] }
      ]
    }
  ];

  // Advanced # Major Families
  const advancedSharpFamilies = [
    {
      id: 'c-sharp-major',
      name: 'C# Major Family',
      chords: [
        { name: 'C#-Add9', notes: ['C#', 'D#', 'F', 'G#'] },
        { name: 'F#-Add9', notes: ['F#', 'G#', 'A#', 'C#'] },
        { name: 'G#7', notes: ['G#', 'C', 'D#', 'F#'] },
        { name: 'F7', notes: ['F', 'A', 'C', 'D#'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'A#7', notes: ['A#', 'D', 'F', 'G#'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'A-Diminished', notes: ['A', 'C', 'D#'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'C#-Add9', notes: ['C#', 'D#', 'F', 'G#'] }
      ]
    },
    {
      id: 'd-sharp-major',
      name: 'D# Major Family',
      chords: [
        { name: 'D#-Add9', notes: ['D#', 'F', 'G', 'A#'] },
        { name: 'G#-Add9', notes: ['G#', 'A#', 'C', 'D#'] },
        { name: 'A#7', notes: ['A#', 'D', 'F', 'G#'] },
        { name: 'G7', notes: ['G', 'B', 'D', 'F'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'C7', notes: ['C', 'E', 'G', 'A#'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'B-Diminished', notes: ['B', 'D', 'F'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'D#-Add9', notes: ['D#', 'F', 'G', 'A#'] }
      ]
    },
    {
      id: 'f-sharp-major',
      name: 'F# Major Family',
      chords: [
        { name: 'F#-Add9', notes: ['F#', 'G#', 'A#', 'C#'] },
        { name: 'B-Add9', notes: ['B', 'C#', 'D#', 'F#'] },
        { name: 'C#7', notes: ['C#', 'E#', 'G#', 'B'] },
        { name: 'A#7', notes: ['A#', 'D', 'F', 'G#'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'D#7', notes: ['D#', 'G', 'A#', 'C#'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'C#-Major', notes: ['C#', 'F', 'G#'] },
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'D-Diminished', notes: ['D', 'F', 'G#'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'F#-Add9', notes: ['F#', 'G#', 'A#', 'C#'] }
      ]
    },
    {
      id: 'g-sharp-major',
      name: 'G# Major Family',
      chords: [
        { name: 'G#-Add9', notes: ['G#', 'A#', 'C', 'D#'] },
        { name: 'C#-Add9', notes: ['C#', 'D#', 'F', 'G#'] },
        { name: 'D#7', notes: ['D#', 'G', 'A#', 'C#'] },
        { name: 'C7', notes: ['C', 'E', 'G', 'A#'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'F7', notes: ['F', 'A', 'C', 'D#'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'C#-Major', notes: ['C#', 'F', 'G#'] },
        { name: 'E-Diminished', notes: ['E', 'G', 'A#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'G#-Add9', notes: ['G#', 'A#', 'C', 'D#'] }
      ]
    },
    {
      id: 'a-sharp-major',
      name: 'A# Major Family',
      chords: [
        { name: 'A#-Add9', notes: ['A#', 'C', 'D', 'F'] },
        { name: 'D#-Add9', notes: ['D#', 'F', 'G', 'A#'] },
        { name: 'F7', notes: ['F', 'A', 'C', 'D#'] },
        { name: 'D7', notes: ['D', 'F#', 'A', 'C'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'G7', notes: ['G', 'B', 'D', 'F'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'F#-Diminished', notes: ['F#', 'A', 'C'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'A#-Add9', notes: ['A#', 'C', 'D', 'F'] }
      ]
    }
  ];

  // Advanced Minor Families Data
  const regularMinorFamilies = [
    {
      id: 'c-minor',
      name: 'C Minor Family',
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'F-7', notes: ['F', 'A', 'C', 'D#'] },
        { name: 'A#-Sus2', notes: ['A#', 'C', 'F'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'D#-Add9', notes: ['D#', 'F', 'G', 'A#'] },
        { name: 'D-Diminished', notes: ['D', 'F', 'G#'] },
        { name: 'G#-Add9', notes: ['G#', 'A#', 'C', 'D#'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] }
      ]
    },
    {
      id: 'd-minor',
      name: 'D Minor Family',
      chords: [
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'G-7', notes: ['G', 'B', 'D', 'F'] },
        { name: 'C-Sus2', notes: ['C', 'D', 'G'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'F-Add9', notes: ['F', 'G', 'A', 'C'] },
        { name: 'E-Diminished', notes: ['E', 'G', 'A#'] },
        { name: 'A-Add9', notes: ['A', 'B', 'C#', 'E'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] }
      ]
    },
    {
      id: 'e-minor',
      name: 'E Minor Family',
      chords: [
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'A-7', notes: ['A', 'C#', 'E', 'G'] },
        { name: 'D-Sus2', notes: ['D', 'E', 'A'] },
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'G-Add9', notes: ['G', 'A', 'B', 'D'] },
        { name: 'F#-Diminished', notes: ['F#', 'A', 'C'] },
        { name: 'B-Add9', notes: ['B', 'C#', 'D#', 'F#'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] }
      ]
    },
    {
      id: 'f-minor',
      name: 'F Minor Family',
      chords: [
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'C#-Major', notes: ['C#', 'F', 'G#'] },
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'A#-7', notes: ['A#', 'D', 'F', 'G#'] },
        { name: 'D#-Sus2', notes: ['D#', 'F', 'A#'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'G#-Add9', notes: ['G#', 'A#', 'C', 'D#'] },
        { name: 'G-Diminished', notes: ['G', 'A#', 'C#'] },
        { name: 'C#-Add9', notes: ['C#', 'D#', 'F', 'G#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] }
      ]
    },
    {
      id: 'g-minor',
      name: 'G Minor Family',
      chords: [
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'C-7', notes: ['C', 'E', 'G', 'A#'] },
        { name: 'F-Sus2', notes: ['F', 'G', 'C'] },
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'A#-Add9', notes: ['A#', 'C', 'D', 'F'] },
        { name: 'A-Diminished', notes: ['A', 'C', 'D#'] },
        { name: 'D-Add9', notes: ['D', 'E', 'F#', 'A'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] }
      ]
    },
    {
      id: 'a-minor',
      name: 'A Minor Family',
      chords: [
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'D-7', notes: ['D', 'F#', 'A', 'C'] },
        { name: 'G-Sus2', notes: ['G', 'A', 'D'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'C-Add9', notes: ['C', 'D', 'E', 'G'] },
        { name: 'B-Diminished', notes: ['B', 'D', 'F'] },
        { name: 'F-Add9', notes: ['F', 'G', 'A', 'C'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] }
      ]
    },
    {
      id: 'b-minor',
      name: 'B Minor Family',
      chords: [
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'E-7', notes: ['E', 'G#', 'B', 'D'] },
        { name: 'A-Sus2', notes: ['A', 'B', 'E'] },
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'D-Add9', notes: ['D', 'E', 'F#', 'A'] },
        { name: 'C#-Diminished', notes: ['C#', 'E', 'G'] },
        { name: 'G-Add9', notes: ['G', 'A', 'B', 'D'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] }
      ]
    }
  ];

  // Advanced # Minor Families
  const advancedSharpMinorFamilies = [
    {
      id: 'c-sharp-minor',
      name: 'C# Minor Family',
      chords: [
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'F#-7', notes: ['F#', 'A#', 'C#', 'E'] },
        { name: 'B-Sus2', notes: ['B', 'C#', 'F#'] },
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'E-Add9', notes: ['E', 'F#', 'G#', 'B'] },
        { name: 'D#-Diminished', notes: ['D#', 'F#', 'A'] },
        { name: 'A-Add9', notes: ['A', 'B', 'C#', 'E'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] }
      ]
    },
    {
      id: 'd-sharp-minor',
      name: 'D# Minor Family',
      chords: [
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'C#-Major', notes: ['C#', 'F', 'G#'] },
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'G#-7', notes: ['G#', 'C', 'D#', 'F#'] },
        { name: 'C#-Sus2', notes: ['C#', 'D#', 'G#'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'F#-Add9', notes: ['F#', 'G#', 'A#', 'C#'] },
        { name: 'F-Diminished', notes: ['F', 'G#', 'B'] },
        { name: 'B-Add9', notes: ['B', 'C#', 'D#', 'F#'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] }
      ]
    },
    {
      id: 'f-sharp-minor',
      name: 'F# Minor Family',
      chords: [
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'C#-Major', notes: ['C#', 'F', 'G#'] },
        { name: 'B-7', notes: ['B', 'D#', 'F#', 'A'] },
        { name: 'E-Sus2', notes: ['E', 'F#', 'B'] },
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'A-Add9', notes: ['A', 'B', 'C#', 'E'] },
        { name: 'G#-Diminished', notes: ['G#', 'B', 'D'] },
        { name: 'D-Add9', notes: ['D', 'E', 'F#', 'A'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] }
      ]
    },
    {
      id: 'g-sharp-minor',
      name: 'G# Minor Family',
      chords: [
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'C#-7', notes: ['C#', 'E#', 'G#', 'B'] },
        { name: 'F#-Sus2', notes: ['F#', 'G#', 'C#'] },
        { name: 'C#-Major', notes: ['C#', 'F', 'G#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'B-Add9', notes: ['B', 'C#', 'D#', 'F#'] },
        { name: 'A#-Diminished', notes: ['A#', 'C#', 'E'] },
        { name: 'E-Add9', notes: ['E', 'F#', 'G#', 'B'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] }
      ]
    },
    {
      id: 'a-sharp-minor',
      name: 'A# Minor Family',
      chords: [
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'D#-7', notes: ['D#', 'G', 'A#', 'C#'] },
        { name: 'G#-Sus2', notes: ['G#', 'A#', 'D#'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'C#-Add9', notes: ['C#', 'D#', 'F', 'G#'] },
        { name: 'C-Diminished', notes: ['C', 'D#', 'F#'] },
        { name: 'F#-Add9', notes: ['F#', 'G#', 'A#', 'C#'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] }
      ]
    }
  ];

  // Ragas Data
  const ragas = [
    {
      id: 'harikambhoji',
      name: 'Harikambhoji Raga',
      up: ['C', 'D', 'E', 'F', 'G', 'A', 'A#', 'C'],
      down: ['C', 'A#', 'A', 'G', 'F', 'E', 'D', 'C'],
      chords: [
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'E-Diminished', notes: ['E', 'G', 'A#'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] }
      ],
      songs: [
        'Yesoo Entha Varaala Manasu',
        'Aa Dari Chere Daare',
        'Kanaraadu'
      ]
    },
    {
      id: 'kalyani',
      name: 'Kalyani Raga',
      up: ['C', 'D', 'E', 'F#', 'G', 'A', 'B', 'C'],
      down: ['C', 'B', 'A', 'G', 'F#', 'E', 'D', 'C'],
      chords: [
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] }
      ],
      songs: [
        'Entha Dooramaina Aadi',
        'Entha Bhaaramaina Mahasunudavu',
        'Mahonnatudavu Parishuddha Sthalamulone',
        'Nivasinchu Vaadavu'
      ]
    },
    {
      id: 'charukeshi',
      name: 'Charukeshi Raga',
      up: ['C', 'D', 'E', 'F', 'G', 'G#', 'A#', 'C'],
      down: ['C', 'B', 'A#', 'G#', 'F', 'E', 'D', 'C'],
      chords: [
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'D-Diminished', notes: ['D', 'F', 'G#'] },
        { name: 'E-Diminished', notes: ['E', 'G', 'A#'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] }
      ],
      songs: [
        'Maarpu Chendavaa Neevu',
        'Maarpu Chendavaa Nee Bratuku',
        'Marchukona Nee Preme',
        'Nanu Aadarinsenu'
      ]
    },
    {
      id: 'maya-mowla-gowla',
      name: 'Maya Mowla Gowla Raga',
      up: ['C', 'C#', 'E', 'F', 'G', 'G#', 'B', 'C'],
      down: ['C', 'B', 'G#', 'G', 'F', 'E', 'C#', 'C'],
      chords: [
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'C#-Diminished', notes: ['C#', 'E', 'F'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'F-Diminished', notes: ['F', 'G#', 'B'] }
      ],
      songs: [
        'Kontha Sepu Kanabadi',
        'Anthalone Mayamaye'
      ]
    },
    {
      id: 'mohana',
      name: 'Mohana Raga',
      up: ['C', 'D', 'E', 'G', 'A', 'C'],
      down: ['C', 'A', 'G', 'E', 'D', 'C'],
      chords: [
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'B-Sus2', notes: ['B', 'E', 'A'] },
        { name: 'D-Sus4', notes: ['D', 'G', 'A'] }
      ],
      songs: [
        'Kalavara Padi Ne Kondalavaipu',
        'Naa Kannu Lethuduna',
        'Naa Stuti Pathruda',
        'Naa Yesayya'
      ]
    },
    {
      id: 'keeravani',
      name: 'Keeravani Raga',
      up: ['C', 'D', 'D#', 'F', 'G', 'G#', 'B', 'C'],
      down: ['C', 'B', 'G#', 'G', 'F', 'D#', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'C-Sus2', notes: ['C', 'D', 'G'] }
      ],
      songs: [
        'Padamulu Chaalani Prema',
        'Idi Kattela Pai',
        'Nee Shareeram Kanipinchadu',
        'Gantaku Malli'
      ]
    },
    {
      id: 'natabhairavi',
      name: 'Natabhairavi Raga',
      up: ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#', 'C'],
      down: ['C', 'A#', 'G#', 'G', 'F', 'D#', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'D-Diminished', notes: ['D', 'F', 'G#'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'D#-Minor', notes: ['D#', 'G', 'A#'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] }
      ],
      songs: [
        'Neetho Naa Jeevitham Santhoshame',
        'Neetho Naa Anubandham Maadhuryame',
        'Sajeevudavaina Yesayya',
        'Ninnashrayinchina'
      ]
    },
    {
      id: 'karaharapriya',
      name: 'Karaharapriya Raga',
      up: ['C', 'D', 'D#', 'F', 'G', 'A', 'A#', 'C'],
      down: ['C', 'A#', 'A', 'G', 'F', 'D#', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'A-Diminished', notes: ['A', 'C', 'D#'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] }
      ],
      songs: [
        'Kalvari Giripai Siluvabharam',
        'Barinchitiva O Naa Prabhuva'
      ]
    },
    {
      id: 'hanumatodi',
      name: 'Hanumatodi Raga',
      up: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A#', 'C'],
      down: ['C', 'A#', 'G', 'F', 'D#', 'D', 'C#', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'G-Diminished', notes: ['G', 'A#', 'C#'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] }
      ],
      songs: [
        'SannuThinchedanu Dayaludavu Neevani',
        'Sarirarevvaru Naa Priyudaina Yesayya',
        'Naa Yesu Raajyam Andamaina'
      ]
    },
    {
      id: 'shivananjani',
      name: 'Shivananjani Raga',
      up: ['C', 'D', 'D#', 'G', 'A', 'C'],
      down: ['C', 'A', 'G', 'D#', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'G-Sus2', notes: ['G', 'A', 'D'] },
        { name: 'A-Minor7♭5', notes: ['A', 'C', 'D#', 'F'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] }
      ],
      songs: [
        'Evarulek Omtarinai Andariki',
        'Ne Dooramai Kanu Teriste',
        'Veluguraa Kanu Mooste',
        'Cheekati Raa'
      ]
    },
    {
      id: 'madhyamavathi',
      name: 'Madhyamavathi Raga',
      up: ['C', 'D', 'F', 'G', 'A#', 'C'],
      down: ['C', 'A#', 'G', 'F', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'C-Sus2', notes: ['C', 'D', 'G'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] }
      ],
      songs: [
        'Sarva Yugamulalo Sajeevudavu',
        'Enno Enno Melulu Chesavayya',
        'Ninnee Ninnee Stutiyintunu Yesayya',
        'Paralokame Naa Anthahpuram'
      ]
    },
    {
      id: 'abheri',
      name: 'Abheri Raga',
      up: ['C', 'D#', 'F', 'G', 'A#', 'C'],
      down: ['C', 'A#', 'A', 'G', 'F', 'D#', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] }
      ],
      songs: [
        'Sruthi Chesi Ne Paadanaa',
        'Stotra Geetam Jyothirmayida',
        'Naa Praanapriyuda'
      ]
    },
    {
      id: 'gowri-manohari',
      name: 'Gowri Manohari Raga',
      up: ['C', 'D', 'D#', 'F', 'G', 'A', 'B', 'C'],
      down: ['C', 'B', 'A', 'G', 'F', 'D#', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'B-Diminished', notes: ['B', 'D', 'F'] },
        { name: 'A-Diminished', notes: ['A', 'C', 'D#'] }
      ],
      songs: [
        'O Prabhuvaa O Prabhuvaa',
        'Neevene Manchi Kaaparivi'
      ]
    },
    {
      id: 'konnada',
      name: 'Konnada Raga',
      up: ['C', 'D', 'D#', 'F', 'A', 'A#', 'C'],
      down: ['C', 'A#', 'G', 'F', 'D#', 'F', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] }
      ],
      songs: [
        'Neevu Chesina Upakaramulaku',
        'Nenemi Chellintunu'
      ]
    },
    {
      id: 'mukhari',
      name: 'Mukhari Raga',
      up: ['C', 'D', 'F', 'G', 'A#', 'A', 'C'],
      down: ['C', 'A#', 'G#', 'G', 'F', 'D#', 'D', 'C'],
      chords: [
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'C-Sus2', notes: ['C', 'D', 'E'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] }
      ],
      songs: [
        'Yesoo Nannu Preminchaanu'
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">
                Advanced Major Families
              </h1>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8">
                Master professional-level piano techniques and jazz harmony
              </p>
            </div>
            
            {!selectedFamily ? (
              <div className="space-y-12">
                {/* Regular Major Families Section */}
                <div>
                  {/* <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 text-center">
                    Regular Major Families
                  </h2> */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {regularMajorFamilies.map((family) => (
                      <div key={family.id} className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedFamily(family)}>
                        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                            <Music className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">
                              {family.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                              Click to learn
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced # Major Families Section */}
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 text-center">
                    Advanced # Major Families
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {advancedSharpFamilies.map((family) => (
                      <div key={family.id} className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedFamily(family)}>
                        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                            <Music className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">
                              {family.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                              Click to learn
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedFamily(null)}
                    className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{selectedFamily.name}</h1>
                  </div>
                </div>
                
                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                   {selectedFamily.chords.map((chord: any, index: number) => (
                     <div key={index} className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                       <div className="text-center">
                         <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white mb-2 sm:mb-3">{chord.name}</h3>
                         <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mb-2">
                           {chord.notes.map((note: string, noteIndex: number) => (
                             <div key={noteIndex} className="flex flex-col items-center">
                               <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center text-xs sm:text-sm font-bold border-2 border-slate-300 ${
                                 note.includes('#') 
                                   ? 'bg-black text-white border-black' 
                                   : 'bg-white text-slate-800 border-slate-300'
                               }`}>
                                 {note}
                               </div>
                               <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                 {noteIndex + 1}
                               </span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
                 );

      case 'module-1':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-slate-800 dark:text-white mb-4">
                Advanced Minor Families
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                Master professional-level minor chord progressions and harmony
              </p>
            </div>
            
            {!selectedFamily ? (
              <div className="space-y-12">
                {/* Regular Minor Families Section */}
                <div>
                  {/* <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
                    Regular Minor Families
                  </h2> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularMinorFamilies.map((family) => (
                      <div key={family.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedFamily(family)}>
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                            <Music className="w-7 h-7 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                              {family.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Click to learn
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced # Minor Families Section */}
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
                    Advanced # Minor Families
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advancedSharpMinorFamilies.map((family) => (
                      <div key={family.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedFamily(family)}>
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md">
                            <Music className="w-7 h-7 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                              {family.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Click to learn
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedFamily(null)}
                    className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{selectedFamily.name}</h1>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedFamily.chords.map((chord: any, index: number) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-3">{chord.name}</h3>
                        <div className="flex flex-wrap gap-2 justify-center mb-2">
                          {chord.notes.map((note: string, noteIndex: number) => (
                            <div key={noteIndex} className="flex flex-col items-center">
                              <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-slate-300 ${
                                note.includes('#') 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-slate-800 border-slate-300'
                              }`}>
                                {note}
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {noteIndex + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'module-2':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                Ragas With Chords
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-4">
                Explore traditional Indian ragas with their chord progressions and song examples
              </p>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-3 sm:p-4 border border-orange-200 dark:border-orange-800 max-w-2xl mx-auto mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">🎹</span>
                  </div>
                  <p className="text-orange-800 dark:text-orange-200 font-semibold text-sm sm:text-base">
                    Practice all these Ragas In All Scales
                  </p>
                </div>
              </div>
            </div>
            
            {!selectedRaga ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {ragas.map((raga) => (
                  <div key={raga.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedRaga(raga)}>
                    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                        <Music className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
                          {raga.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          Click to explore
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <button
                    onClick={() => setSelectedRaga(null)}
                    className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{selectedRaga.name}</h1>
                  </div>
                </div>
                
                <div className="space-y-6 sm:space-y-8">
                  {/* Up/Down Notes Section */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4">Scale Notes</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Up: {selectedRaga.up.join(' – ')}</h3>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {selectedRaga.up.map((note: string, index: number) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold border-2 border-slate-300 ${
                                note.includes('#') 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-slate-800 border-slate-300'
                              }`}>
                                {note}
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Down: {selectedRaga.down.join(' – ')}</h3>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {selectedRaga.down.map((note: string, index: number) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold border-2 border-slate-300 ${
                                note.includes('#') 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-slate-800 border-slate-300'
                              }`}>
                                {note}
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chords Section */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4">Chords</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {selectedRaga.chords.map((chord: any, index: number) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-600">
                          <div className="text-center">
                            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white mb-2 sm:mb-3">{chord.name}</h3>
                            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mb-2">
                              {chord.notes.map((note: string, noteIndex: number) => (
                                <div key={noteIndex} className="flex flex-col items-center">
                                  <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold border-2 border-slate-300 ${
                                    note.includes('#') 
                                      ? 'bg-black text-white border-black' 
                                      : 'bg-white text-slate-800 border-slate-300'
                                  }`}>
                                    {note}
                                  </div>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {noteIndex + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Song Examples Section */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4">Song Examples</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {selectedRaga.songs.map((song: string, index: number) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-600">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                              <Music className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="font-medium text-sm sm:text-base text-slate-800 dark:text-white">{song}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practice Tip */}
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 sm:p-6 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-orange-800 dark:text-orange-200">Practice Tip</h3>
                    </div>
                    <p className="text-sm sm:text-base text-orange-700 dark:text-orange-300 font-medium">
                      Practice Well As Much You Can Do - Master the scale patterns and chord progressions to understand the raga's unique character and emotional expression.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
       
       default:
        const module = menuSections.find(m => m.id === activeSection);
        
        // Handle different modules with appropriate video sections
        if (activeSection === 'module-3') {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <button
                  onClick={() => setActiveSection('introduction')}
                  className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{module?.title}</h1>
                </div>
              </div>
              
              <VideoSection
                category="scales"
                title="How to Find Out Scale"
                description=""
                icon={<Target className="w-6 h-6 text-white" />}
                onVideoComplete={(videoId, category) => {
                  markVideoCompleted(videoId, category as 'scales');
                  markModuleCompleted('module3');
                }}
              />
            </div>
          );
        }
        
        if (activeSection === 'module-4') {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <button
                  onClick={() => setActiveSection('introduction')}
                  className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{module?.title}</h1>
                </div>
              </div>
              
              <VideoSection
                category="interludes"
                title="How to Play Interludes"
                description=""
                icon={<Play className="w-6 h-6 text-white" />}
                onVideoComplete={(videoId, category) => {
                  markVideoCompleted(videoId, category as 'interludes');
                  markModuleCompleted('module4');
                }}
              />
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={() => setActiveSection('introduction')}
                className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{module?.title}</h1>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Music className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4">
                  {module?.title} - Coming Soon!
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 sm:mb-6">
                  This advanced module is currently under development. Stay tuned for professional-level content!
                </p>
                <button
                  onClick={() => setActiveSection('introduction')}
                  className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-pink-600 hover:to-fuchsia-700 transition-all duration-300 text-sm sm:text-base"
                >
                  Back to Overview
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  // Show loading screen while checking payment
  if (isCheckingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Verifying Access...</h2>
          <p className="text-slate-600 dark:text-slate-300">Please wait while we check your payment status</p>
        </div>
      </div>
    );
  }

  // Show access denied screen for non-paying users
  if (!hasAdvancedAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Advanced Course Locked
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            This advanced course requires payment. Please upgrade to the Advanced Plan to access premium content.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-fuchsia-50 dark:from-pink-900/20 dark:to-fuchsia-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">What's Included:</h3>
            <ul className="text-sm text-pink-700 dark:text-pink-300 space-y-1">
              <li>• Advanced Major & Minor Families</li>
              <li>• Ragas with Chord Progressions</li>
              <li>• Scale Identification Techniques</li>
              <li>• Professional Interlude Playing</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-800/90 via-fuchsia-800/90 to-pink-900/90 dark:from-slate-900/95 dark:via-fuchsia-900/95 dark:to-slate-800/95"></div>
        
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-r from-pink-400 to-fuchsia-400 rounded-full blur-2xl opacity-20"></div>
          <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full blur-xl opacity-20"></div>
        </div>

        <div className="relative flex justify-between items-center p-3 sm:p-4 lg:p-6 min-h-[60px]">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="p-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-lg">
              <Music className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-wider">
              <span className="bg-gradient-to-r from-white via-pink-100 to-fuchsia-100 bg-clip-text text-transparent">
                AbhiMusicKeys
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3 relative z-[99999] w-auto flex-shrink-0">
            {/* Back to Home Button */}
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 p-2 sm:p-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm border border-white/30 hover:border-white/50 backdrop-blur-sm"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </button>
            
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    console.log('User menu clicked, current state:', showUserMenu);
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-1 sm:gap-2 hover:scale-105 transition-all duration-300 min-w-0 user-menu-toggle"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    {getUserInitials(currentUser.email || '')}
                  </div>
                  <ChevronDown className={`h-3 w-3 text-white transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                                  {showUserMenu && (
                    <div className="fixed sm:absolute top-16 sm:top-12 left-4 sm:left-auto sm:right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-64 sm:w-auto sm:min-w-48 z-[999999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 user-menu-dropdown overflow-hidden">
                    <div className="p-3 sm:p-4 lg:p-5 border-b border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {getUserInitials(currentUser.email || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1 truncate">
                            {getUserDisplayName(currentUser.email || '')}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3">
                      <button
                        onClick={() => {
                          navigate('/psr-i500');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300 hover:scale-105 group mb-2"
                      >
                        <Music className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium text-sm sm:text-xs">PSR-I500 Styles</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/downloads');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-all duration-300 hover:scale-105 group mb-2"
                      >
                        <Download className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium text-sm sm:text-xs">Downloads</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 hover:scale-105 group"
                      >
                        <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-medium text-sm sm:text-xs">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-white hover:text-pink-200 transition-colors duration-300 font-medium text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Login</span>
                  <span className="sm:hidden">Login</span>
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Sign Up</span>
                </button>
              </div>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 bg-white/20 hover:bg-white/30 text-white border border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 rounded-lg shadow-lg"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 sm:p-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 text-slate-800 dark:text-white font-medium w-full"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Course Menu</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Left Sidebar Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white dark:bg-slate-800 shadow-lg border-b lg:border-r border-slate-200 dark:border-slate-700 min-h-auto lg:min-h-screen overflow-y-auto max-h-[60vh] sm:max-h-[70vh] lg:max-h-none`}>
          <div className="p-2 sm:p-3 lg:p-6">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 dark:text-white mb-2 sm:mb-3 lg:mb-6">Advanced Course Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1 sm:gap-2 lg:space-y-2">
              {menuSections.map((section) => {
                const IconComponent = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex flex-col lg:flex-row items-center gap-1 sm:gap-2 lg:gap-3 p-2 sm:p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-300 touch-manipulation ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm lg:text-base font-medium text-center lg:text-left leading-tight">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-2 sm:p-3 lg:p-8">
          <div key={activeSection} className="min-h-screen">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        courseName="Advanced Piano Course"
      />

      {/* Course Completion Modal */}
      {showCourseCompletionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-600 rounded-t-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-2">🎉🎉🎉</div>
                <h2 className="text-xl font-bold mb-2">CONGRATULATIONS!</h2>
                <p className="text-sm opacity-90">You've completed the Advanced Piano Course!</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* What You've Learned */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    🎹
                  </div>
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-200">What You've Mastered</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">Advanced Major & Minor Families</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">Ragas with Chord Progressions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">Scale Identification Techniques</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">Professional Interlude Playing</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    🎯
                  </div>
                  <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200">Your Next Journey</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-purple-700 dark:text-purple-300">Continue practicing advanced techniques</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-purple-700 dark:text-purple-300">Explore different musical genres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-purple-700 dark:text-purple-300">Compose your own music</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCourseCompletion}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Rate This Course
                </button>
                <button
                  onClick={() => setShowCourseCompletionModal(false)}
                  className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedCourseContent;
