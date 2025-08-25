import React, { useState, useEffect } from 'react';

import { ArrowLeft, Play, Lock, Check, Star, Clock, BookOpen, Music, Piano, Guitar, Headphones, Users, Target, Zap, ChevronDown, LogOut, Download, Menu, Home, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useRating } from '../contexts/RatingContext';
import RatingModal from './ui/RatingModal';
import { ThemeToggle } from './ui/theme-toggle';
import GoogleDriveVideo from './ui/GoogleDriveVideo';

const BasicLearning: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { goBack } = useNavigation();
  const { addReview } = useRating();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showGuidedLearningCompleteModal, setShowGuidedLearningCompleteModal] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [selectedScale, setSelectedScale] = useState<{ name: string; notes: { chord: string[]; up: string[]; down: string[] } } | null>(null);
  const [selectedMinorScale, setSelectedMinorScale] = useState<{ name: string; notes: { chord: string[]; up: string[]; down: string[] } } | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<{ name: string; chords: string[] } | null>(null);
  const [selectedSharpScale, setSelectedSharpScale] = useState<{ name: string; notes: { chord: string[]; up: string[]; down: string[] } } | null>(null);
  const [selectedSharpMinorScale, setSelectedSharpMinorScale] = useState<{ name: string; notes: { chord: string[]; up: string[]; down: string[] } } | null>(null);
  const [selectedSharpFamily, setSelectedSharpFamily] = useState<{ name: string; chords: string[] } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCourseCompletionModal, setShowCourseCompletionModal] = useState(false);

  // Progress tracking state
  const [courseProgress, setCourseProgress] = useState<{
    introduction: boolean;
    basics: boolean;
    majorScales: boolean;
    minorScales: boolean;
    inversions: boolean;
    practicing: boolean;
    majorFamilyChords: boolean;
    minorFamilyChords: boolean;
  }>({
    introduction: false,
    basics: false,
    majorScales: false,
    minorScales: false,
    inversions: false,
    practicing: false,
    majorFamilyChords: false,
    minorFamilyChords: false,
  });

  // Individual section completion tracking
  const [sectionProgress, setSectionProgress] = useState<{
    keyboardIntro: boolean;
    octaveIntro: boolean;
    whiteKeys: boolean;
    blackKeys: boolean;
    handPosition: boolean;
    chordIntro: boolean;
  }>({
    keyboardIntro: false,
    octaveIntro: false,
    whiteKeys: false,
    blackKeys: false,
    handPosition: false,
    chordIntro: false,
  });

  const [completedItems, setCompletedItems] = useState<{
    scales: string[];
    families: string[];
    lessons: string[];
  }>({
    scales: [],
    families: [],
    lessons: [],
  });

  // Check if user has enrolled (this would typically come from your backend)
  useEffect(() => {
    // Simulate checking enrollment status
    if (currentUser) {
      // Check localStorage for enrollment status
      const enrollmentStatus = localStorage.getItem(`enrolled_${currentUser.uid}_basic`);
      if (enrollmentStatus === 'true') {
        setHasEnrolled(true);
      } else {
        // If user is not enrolled, redirect to overview page
        navigate('/basic');
        return;
      }
      
      // Load progress from localStorage
      loadProgress();
    } else {
      // If user is not logged in, redirect to login
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

  // Additional check for direct access without login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;
      // Don't close if clicking inside the menu or menu toggle
      if (target.closest('.user-menu-dropdown') || target.closest('.user-menu-toggle')) {
        return;
      }
      setShowUserMenu(false);
    };

    // Add both mouse and touch event listeners for better mobile support
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Load progress from localStorage
  const loadProgress = () => {
    if (!currentUser) return;
    
    const savedProgress = localStorage.getItem(`progress_${currentUser.uid}_basic`);
    const savedCompletedItems = localStorage.getItem(`completedItems_${currentUser.uid}_basic`);
    const savedSectionProgress = localStorage.getItem(`sectionProgress_${currentUser.uid}_basic`);
    
    if (savedProgress) {
      try {
        setCourseProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
    
    if (savedCompletedItems) {
      try {
        setCompletedItems(JSON.parse(savedCompletedItems));
      } catch (error) {
        console.error('Error loading completed items:', error);
      }
    }

    if (savedSectionProgress) {
      try {
        setSectionProgress(JSON.parse(savedSectionProgress));
      } catch (error) {
        console.error('Error loading section progress:', error);
      }
    }
  };

  // Save progress to localStorage
  const saveProgress = (newProgress: typeof courseProgress, newCompletedItems?: typeof completedItems) => {
    if (!currentUser) return;
    
    localStorage.setItem(`progress_${currentUser.uid}_basic`, JSON.stringify(newProgress));
    
    if (newCompletedItems) {
      localStorage.setItem(`completedItems_${currentUser.uid}_basic`, JSON.stringify(newCompletedItems));
    }
  };

  // Mark section as completed
  const markSectionCompleted = (section: keyof typeof courseProgress) => {
    const newProgress = { ...courseProgress, [section]: true };
    setCourseProgress(newProgress);
    saveProgress(newProgress);
  };

  // Mark individual subsection as completed
  const markSubsectionCompleted = (subsection: keyof typeof sectionProgress) => {
    const newSectionProgress = { ...sectionProgress, [subsection]: true };
    setSectionProgress(newSectionProgress);
    // Save to localStorage
    if (currentUser) {
      localStorage.setItem(`sectionProgress_${currentUser.uid}_basic`, JSON.stringify(newSectionProgress));
    }
  };

  // Check if all subsections are completed
  const areAllSubsectionsCompleted = () => {
    return Object.values(sectionProgress).every(Boolean);
  };

  // Check if all introduction subsections are completed
  const areAllIntroductionSubsectionsCompleted = () => {
    return sectionProgress.keyboardIntro && sectionProgress.octaveIntro;
  };

  // Mark scale as completed
  const markScaleCompleted = (scaleName: string) => {
    const newCompletedItems = {
      ...completedItems,
      scales: [...completedItems.scales, scaleName]
    };
    setCompletedItems(newCompletedItems);
    saveProgress(courseProgress, newCompletedItems);
  };

  // Mark family as completed
  const markFamilyCompleted = (familyName: string) => {
    // Prevent duplicate entries
    if (completedItems.families.includes(familyName)) {
      console.log('Family already completed:', familyName);
      return;
    }
    
    console.log('Marking family as completed:', familyName);
    console.log('Current completed families:', completedItems.families);
    
    const newCompletedItems = {
      ...completedItems,
      families: [...completedItems.families, familyName]
    };
    setCompletedItems(newCompletedItems);
    saveProgress(courseProgress, newCompletedItems);
    
    console.log('Updated completed families:', newCompletedItems.families);
  };

  // Calculate total progress percentage (capped at 45% for guided learning)
  const calculateProgress = () => {
    const totalSections = Object.keys(courseProgress).length;
    const completedSections = Object.values(courseProgress).filter(Boolean).length;
    const rawProgress = Math.round((completedSections / totalSections) * 100);
    // Cap progress at 45% - remaining 55% is self-directed learning
    return Math.min(rawProgress, 45);
  };

  // Check if all major scales are completed
  const areAllMajorScalesCompleted = () => {
    const allMajorScales = [
      'C Major', 'D Major', 'E Major', 'F Major', 'G Major', 'A Major', 'B Major',
      'C# Major', 'D# Major', 'F# Major', 'G# Major', 'A# Major'
    ];
    return allMajorScales.every(scale => completedItems.scales.includes(scale));
  };

  const areAllMinorScalesCompleted = () => {
    const allMinorScales = [
      'C Minor', 'D Minor', 'E Minor', 'F Minor', 'G Minor', 'A Minor', 'B Minor',
      'C# Minor', 'D# Minor', 'F# Minor', 'G# Minor', 'A# Minor'
    ];
    return allMinorScales.every(scale => completedItems.scales.includes(scale));
  };

  const areAllMajorFamilyChordsCompleted = () => {
    const allMajorFamilyChords = [
      'C-Major Family', 'D-Major Family', 'E-Major Family', 'F-Major Family', 'G-Major Family', 'A-Major Family', 'B-Major Family',
      'C#-Major Family', 'D#-Major Family', 'F#-Major Family', 'G#-Major Family', 'A#-Major Family'
    ];
    
    console.log('Checking major family completion...');
    console.log('All required major families:', allMajorFamilyChords);
    console.log('Completed families:', completedItems.families);
    
    const result = allMajorFamilyChords.every(family => completedItems.families.includes(family));
    console.log('All major families completed:', result);
    
    return result;
  };

  const areAllMinorFamilyChordsCompleted = () => {
    const allMinorFamilyChords = [
      'C-Minor Family', 'D-Minor Family', 'E-Minor Family', 'F-Minor Family', 'G-Minor Family', 'A-Minor Family', 'B-Minor Family',
      'C#-Minor Family', 'D#-Minor Family', 'F#-Minor Family', 'G#-Minor Family', 'A#-Minor Family'
    ];
    
    console.log('Checking minor family completion...');
    console.log('All required minor families:', allMinorFamilyChords);
    console.log('Completed families:', completedItems.families);
    
    const result = allMinorFamilyChords.every(family => completedItems.families.includes(family));
    console.log('All minor families completed:', result);
    
    return result;
  };

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Simulate enrollment
    localStorage.setItem(`enrolled_${currentUser.uid}_basic`, 'true');
    setHasEnrolled(true);
    
    // Show rating modal after a short delay
    setTimeout(() => {
      setShowRatingModal(true);
    }, 1000);
  };

  const handleLessonClick = (lesson: any) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!lesson.isFree && !hasEnrolled) {
      // For non-free lessons, require enrollment
      alert('Please enroll in the course to access this lesson.');
      return;
    }

    // Handle lesson access
    console.log(`Accessing lesson: ${lesson.title}`);
    // Here you would typically navigate to the actual lesson content
    alert(`Starting lesson: ${lesson.title}`);
  };

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    try {
      // Add review to live rating system
      addReview('basic', rating);

      // Store the review in localStorage for public display
      const newReview = {
        id: Date.now(),
        userName: currentUser ? getUserDisplayName(currentUser.email || '') : 'Anonymous',
        userInitials: currentUser ? getUserInitials(currentUser.email || '') : 'A',
        rating: rating,
        feedback: feedback,
        course: 'Basic Piano Course',
        date: new Date().toISOString(),
        userId: currentUser?.uid || 'anonymous'
      };

      // Get existing reviews
      const existingReviews = JSON.parse(localStorage.getItem('publicReviews') || '[]');
      existingReviews.push(newReview);
      localStorage.setItem('publicReviews', JSON.stringify(existingReviews));

      console.log('Review submitted:', newReview);
      console.log('Live rating updated for Basic course');
      
      // Show success message
      alert('Thank you for your feedback! Your review has been published and live ratings updated.');
      
      // Close the rating modal
      setShowRatingModal(false);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

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

  const menuSections = [
    { id: 'introduction', title: 'Introduction', icon: Music },
    { id: 'basics', title: 'Basics', icon: Piano },
    { id: 'major-scales', title: 'Major Scales', icon: Guitar },
    { id: 'minor-scales', title: 'Minor Scales', icon: Headphones },
    { id: 'major-family-chords', title: 'Major Family Chords', icon: Users },
    { id: 'minor-family-chords', title: 'Minor Family Chords', icon: Users },
    { id: 'inversions', title: 'Inversions of Chords', icon: Video },
    { id: 'practicing', title: 'Practicing', icon: Play }
  ];

  // Navigate to next section
  const goToNextSection = () => {
    const currentIndex = menuSections.findIndex(section => section.id === activeSection);
    if (currentIndex < menuSections.length - 1) {
      const nextSection = menuSections[currentIndex + 1];
      setActiveSection(nextSection.id);
      // Mark current section as completed
      markSectionCompleted(activeSection as keyof typeof courseProgress);
    }
  };

  // Navigate to previous section
  const goToPreviousSection = () => {
    const currentIndex = menuSections.findIndex(section => section.id === activeSection);
    if (currentIndex > 0) {
      const previousSection = menuSections[currentIndex - 1];
      setActiveSection(previousSection.id);
    }
  };

  const lessons = [
    {
      id: 1,
      title: "Introduction to Piano",
      duration: "15 min",
      description: "Learn the basics of piano and proper hand positioning",
      isFree: true,
      isCompleted: false
    },
    {
      id: 2,
      title: "Reading Sheet Music",
      duration: "20 min",
      description: "Understanding musical notation and reading notes",
      isFree: true,
      isCompleted: false
    },
    {
      id: 3,
      title: "Basic Chords",
      duration: "25 min",
      description: "Learn your first chords and chord progressions",
      isFree: false,
      isCompleted: false
    }
  ];

  const MajorScaleCard: React.FC<{ scale: { name: string; notes: { chord: string[]; up: string[]; down: string[] } } }> = ({ scale }) => {
    const isCompleted = completedItems.scales.includes(scale.name);
    
    return (
      <div
        onClick={() => {
          if (selectedScale?.name === scale.name) {
            setSelectedScale(null); // Close if same scale is clicked
          } else {
            setSelectedScale(scale); // Open if different scale is clicked
          }
        }}
        className={`p-4 sm:p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md relative min-h-[120px] sm:min-h-[140px] ${
          selectedScale?.name === scale.name
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-blue-400'
            : isCompleted
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-slate-700 dark:hover:to-slate-600'
        }`}
      >
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
        
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md ${
            selectedScale?.name === scale.name
              ? 'bg-white/20 shadow-white/20'
              : isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/30'
          }`}>
            <Music className={`w-6 h-6 sm:w-7 sm:h-7 ${selectedScale?.name === scale.name ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="space-y-1">
            <h3 className={`font-bold text-base sm:text-lg break-words ${selectedScale?.name === scale.name ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
              {scale.name}
            </h3>
            <p className={`text-xs sm:text-sm ${selectedScale?.name === scale.name ? 'text-white/90' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {isCompleted ? '✅ Completed' : 'Click to learn'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const MinorScaleCard: React.FC<{ scale: { name: string; notes: { chord: string[]; up: string[]; down: string[] } } }> = ({ scale }) => {
    const isCompleted = completedItems.scales.includes(scale.name);
    
    return (
      <div
        onClick={() => {
          if (selectedMinorScale?.name === scale.name) {
            setSelectedMinorScale(null); // Close if same scale is clicked
          } else {
            setSelectedMinorScale(scale); // Open if different scale is clicked
          }
        }}
        className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md relative ${
          selectedMinorScale?.name === scale.name
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-blue-400'
            : isCompleted
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-slate-700 dark:hover:to-slate-600'
        }`}
      >
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
            selectedMinorScale?.name === scale.name
              ? 'bg-white/20 shadow-white/20'
              : isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/30'
          }`}>
            <Music className={`w-7 h-7 ${selectedMinorScale?.name === scale.name ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="space-y-1">
            <h3 className={`font-bold text-lg ${selectedMinorScale?.name === scale.name ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
              {scale.name}
            </h3>
            <p className={`text-sm ${selectedMinorScale?.name === scale.name ? 'text-white/90' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {isCompleted ? '✅ Completed' : 'Click to learn'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SharpMinorScaleCard: React.FC<{ scale: { name: string; notes: { chord: string[]; up: string[]; down: string[] } } }> = ({ scale }) => {
    const isCompleted = completedItems.scales.includes(scale.name);
    
    return (
      <div
        onClick={() => {
          if (selectedSharpMinorScale?.name === scale.name) {
            setSelectedSharpMinorScale(null); // Close if same scale is clicked
          } else {
            setSelectedSharpMinorScale(scale); // Open if different scale is clicked
          }
        }}
        className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md relative ${
          selectedSharpMinorScale?.name === scale.name
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border-indigo-400'
            : isCompleted
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600'
            : 'bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-800 dark:to-slate-700 border-indigo-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-400 hover:from-indigo-100 hover:to-purple-200 dark:hover:from-slate-700 dark:hover:to-slate-600'
        }`}
      >
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
            selectedSharpMinorScale?.name === scale.name
              ? 'bg-white/20 shadow-white/20'
              : isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/30'
          }`}>
            <Music className={`w-7 h-7 ${selectedSharpMinorScale?.name === scale.name ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="space-y-1">
            <h3 className={`font-bold text-lg ${selectedSharpMinorScale?.name === scale.name ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
              {scale.name}
            </h3>
            <p className={`text-sm ${selectedSharpMinorScale?.name === scale.name ? 'text-white/90' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {isCompleted ? '✅ Completed' : 'Click to learn'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SharpMajorScaleCard: React.FC<{ scale: { name: string; notes: { chord: string[]; up: string[]; down: string[] } } }> = ({ scale }) => {
    const isCompleted = completedItems.scales.includes(scale.name);
    
    return (
      <div
        onClick={() => {
          if (selectedSharpScale?.name === scale.name) {
            setSelectedSharpScale(null); // Close if same scale is clicked
          } else {
            setSelectedSharpScale(scale); // Open if different scale is clicked
          }
        }}
        className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md relative ${
          selectedSharpScale?.name === scale.name
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border-indigo-400'
            : isCompleted
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600'
            : 'bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-800 dark:to-slate-700 border-indigo-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-400 hover:from-indigo-100 hover:to-purple-200 dark:hover:from-slate-700 dark:hover:to-slate-600'
        }`}
      >
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
            selectedSharpScale?.name === scale.name
              ? 'bg-white/20 shadow-white/20'
              : isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/30'
          }`}>
            <Music className={`w-7 h-7 ${selectedSharpScale?.name === scale.name ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="space-y-1">
            <h3 className={`font-bold text-lg ${selectedSharpScale?.name === scale.name ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
              {scale.name}
            </h3>
            <p className={`text-sm ${selectedSharpScale?.name === scale.name ? 'text-white/90' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {isCompleted ? '✅ Completed' : 'Click to learn'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SharpFamilyCard: React.FC<{ family: { name: string; chords: string[] } }> = ({ family }) => {
    const isCompleted = completedItems.families.includes(family.name);
    
    return (
      <div
        onClick={() => {
          if (selectedSharpFamily?.name === family.name) {
            setSelectedSharpFamily(null); // Close if same family is clicked
          } else {
            setSelectedSharpFamily(family); // Open if different family is clicked
          }
        }}
        className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md relative ${
          selectedSharpFamily?.name === family.name
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border-indigo-400'
            : isCompleted
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600'
            : 'bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-800 dark:to-slate-700 border-indigo-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-400 hover:from-indigo-100 hover:to-purple-200 dark:hover:from-slate-700 dark:hover:to-slate-600'
        }`}
      >
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
            selectedSharpFamily?.name === family.name
              ? 'bg-white/20 shadow-white/20'
              : isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/30'
          }`}>
            <Music className={`w-7 h-7 ${selectedSharpFamily?.name === family.name ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="space-y-1">
            <h3 className={`font-bold text-lg ${selectedSharpFamily?.name === family.name ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
              {family.name}
            </h3>
            <p className={`text-sm ${selectedSharpFamily?.name === family.name ? 'text-white/90' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {isCompleted ? '✅ Completed' : 'Click to learn'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const FamilyChordCard: React.FC<{ family: { name: string; chords: string[] } }> = ({ family }) => {
    const isCompleted = completedItems.families.includes(family.name);
    
    return (
      <div
        onClick={() => {
          if (selectedFamily?.name === family.name) {
            setSelectedFamily(null); // Close if same family is clicked
          } else {
            setSelectedFamily(family); // Open if different family is clicked
          }
        }}
        className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md relative ${
          selectedFamily?.name === family.name
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-blue-400'
            : isCompleted
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-slate-700 dark:hover:to-slate-600'
        }`}
      >
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
            selectedFamily?.name === family.name
              ? 'bg-white/20 shadow-white/20'
              : isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/30'
          }`}>
            <Music className={`w-7 h-7 ${selectedFamily?.name === family.name ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="space-y-1">
            <h3 className={`font-bold text-lg ${selectedFamily?.name === family.name ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
              {family.name}
            </h3>
            <p className={`text-sm ${selectedFamily?.name === family.name ? 'text-white/90' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {isCompleted ? '✅ Completed' : 'Click to learn'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const MajorScaleDetails: React.FC = () => {
    const scales = [
      { name: 'C Major', notes: { chord: ['C', 'E', 'G', 'C'], up: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], down: ['C', 'B', 'A', 'G', 'F', 'E', 'D', 'C'] } },
      { name: 'G Major', notes: { chord: ['G', 'B', 'D', 'G'], up: ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'], down: ['G', 'F#', 'E', 'D', 'C', 'B', 'A', 'G'] } },
      { name: 'D Major', notes: { chord: ['D', 'F#', 'A', 'D'], up: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'], down: ['D', 'C#', 'B', 'A', 'G', 'F#', 'E', 'D'] } },
      { name: 'A Major', notes: { chord: ['A', 'C#', 'E', 'A'], up: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'], down: ['A', 'G#', 'F#', 'E', 'D', 'C#', 'B', 'A'] } },
      { name: 'E Major', notes: { chord: ['E', 'G#', 'B', 'E'], up: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'], down: ['E', 'D#', 'C#', 'B', 'A', 'G#', 'F#', 'E'] } },
      { name: 'B Major', notes: { chord: ['B', 'D#', 'F#', 'B'], up: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'], down: ['B', 'A#', 'G#', 'F#', 'E', 'D#', 'C#', 'B'] } },
      { name: 'F Major', notes: { chord: ['F', 'A', 'C', 'F'], up: ['F', 'G', 'A', 'A#', 'C', 'D', 'E', 'F'], down: ['F', 'E', 'D', 'C', 'A#', 'A', 'G', 'F'] } },
      { name: 'A# Major', notes: { chord: ['A#', 'D', 'F', 'A#'], up: ['A#', 'C', 'D', 'D#', 'F', 'G', 'A', 'A#'], down: ['A#', 'A', 'G', 'F', 'D#', 'D', 'C', 'A#'] } },
      { name: 'D# Major', notes: { chord: ['D#', 'G', 'A#', 'D#'], up: ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D', 'D#'], down: ['D#', 'D', 'C', 'A#', 'G#', 'G', 'F', 'D#'] } }
    ];

    const isSharp = (note: string) => {
      return note.includes('#') || note.includes('b');
    };

    const NoteBox: React.FC<{ note: string; className?: string }> = ({ note, className = '' }) => (
      <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 ${
        isSharp(note) 
          ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
          : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
      } ${className}`}>
        {note}
      </div>
    );

    const selectedScaleData = selectedScale;

  return (
      <div className="p-2 sm:p-4 lg:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">Major Scales</h3>
        
        {selectedScaleData && (
          <div className="mt-4 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl shadow-lg">
            <h4 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">🎼 {selectedScaleData.name} Scale</h4>
            
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                                    {/* Chord Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                    C
                  </div>
                  <span className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Chord</span>
                </div>
                <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                  {selectedScaleData.notes.chord.map((note, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <NoteBox note={note} />
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Up & Down Section Combined */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-3 sm:p-4 lg:p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                    ↕
                  </div>
                  <span className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Scale (Up & Down)</span>
                </div>
                
                {/* Up Scale */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ↑
                    </div>
                    <span className="font-medium text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">Up</span>
                  </div>
                  <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                    {selectedScaleData.notes.up.map((note, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <NoteBox note={note} />
                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                          {(index % 4) + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Down Scale */}
            <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ↓
                    </div>
                    <span className="font-medium text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">Down</span>
                  </div>
                  <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                    {selectedScaleData.notes.down.map((note, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <NoteBox note={note} />
                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                          {(index % 4) + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Practice Note */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
              💡
            </div>
            <span className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Practice Tip</span>
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">
            Practice each scale as much you can do!
          </p>
        </div>

        {/* Done Button */}
        {selectedScaleData && (
          <div className="mt-4 sm:mt-6 text-center">
                                    <button
                          onClick={() => {
                            markScaleCompleted(selectedScaleData.name);
                            setSelectedScale(null);
                          }}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                        >
                          ✅ Done Abhi! I've Learned This Scale Perfectly
                        </button>
          </div>
        )}
      </div>
    );
  };

  const SharpMajorScaleDetails: React.FC = () => {
    const isSharp = (note: string) => {
      return note.includes('#');
    };

    const NoteBox: React.FC<{ note: string; className?: string }> = ({ note, className = '' }) => (
      <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
        isSharp(note)
          ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
          : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
      } ${className}`}>
        {note}
      </div>
    );

    if (!selectedSharpScale) return null;

    return (
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Chord Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-3 sm:p-4 lg:p-6 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
              C
            </div>
            <span className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Chord</span>
          </div>
          <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
            {selectedSharpScale.notes.chord.map((note, index) => (
              <div key={index} className="flex flex-col items-center">
                <NoteBox note={note} />
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scale Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-3 sm:p-4 lg:p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
              ↕
            </div>
            <span className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Scale (Up & Down)</span>
          </div>
          
          {/* Up Scale */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ↑
              </div>
              <span className="font-medium text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">Up</span>
            </div>
            <div className="flex gap-1 justify-center flex-wrap">
              {selectedSharpScale.notes.up.map((note, index) => (
                <div key={index} className="flex flex-col items-center">
                  <NoteBox note={note} />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Down Scale */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ↓
              </div>
              <span className="font-medium text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">Down</span>
            </div>
            <div className="flex gap-1 justify-center flex-wrap">
              {selectedSharpScale.notes.down.map((note, index) => (
                <div key={index} className="flex flex-col items-center">
                  <NoteBox note={note} />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Practice Tip */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-3 sm:p-4 lg:p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              💡
            </div>
            <span className="font-semibold text-xs sm:text-sm lg:text-base text-slate-800 dark:text-white">Practice Tip</span>
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">
            Practice each sharp major scale as much you can do!
          </p>
        </div>

        {/* Done Button */}
        <div className="text-center">
          <button
            onClick={() => {
              markScaleCompleted(selectedSharpScale.name);
              setSelectedSharpScale(null);
            }}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
          >
            ✅ Done Abhi! I've Learned This Sharp Scale Perfectly
          </button>
        </div>
      </div>
    );
  };

  const SharpMinorScaleDetails: React.FC = () => {
    const isSharp = (note: string) => {
      return note.includes('#');
    };

    const NoteBox: React.FC<{ note: string; className?: string }> = ({ note, className = '' }) => (
      <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
        isSharp(note)
          ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
          : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
      } ${className}`}>
        {note}
      </div>
    );

    if (!selectedSharpMinorScale) return null;

    return (
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Chord Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-3 sm:p-4 lg:p-6 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
              C
            </div>
            <span className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Chord</span>
          </div>
          <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
            {selectedSharpMinorScale.notes.chord.map((note, index) => (
              <div key={index} className="flex flex-col items-center">
                <NoteBox note={note} />
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scale Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-3 sm:p-4 lg:p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
              ↕
            </div>
            <span className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Scale (Up & Down)</span>
          </div>
          
          {/* Up Scale */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ↑
              </div>
              <span className="font-medium text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">Up</span>
            </div>
            <div className="flex gap-1 justify-center flex-wrap">
              {selectedSharpMinorScale.notes.up.map((note, index) => (
                <div key={index} className="flex flex-col items-center">
                  <NoteBox note={note} />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Down Scale */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ↓
              </div>
              <span className="font-medium text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">Down</span>
            </div>
            <div className="flex gap-1 justify-center flex-wrap">
              {selectedSharpMinorScale.notes.down.map((note, index) => (
                <div key={index} className="flex flex-col items-center">
                  <NoteBox note={note} />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Practice Tip */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-3 sm:p-4 lg:p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              💡
            </div>
            <span className="font-semibold text-sm text-slate-800 dark:text-white">Practice Tip</span>
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300">
            Practice each sharp minor scale as much you can do!
          </p>
        </div>

        {/* Done Button */}
        <div className="text-center">
          <button
            onClick={() => {
              markScaleCompleted(selectedSharpMinorScale.name);
              setSelectedSharpMinorScale(null);
            }}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
          >
            ✅ Done Abhi! I've Learned This Sharp Minor Scale Perfectly
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              {/* Soft keyboard background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-16 h-8 bg-white/30 rounded-sm"></div>
                <div className="absolute top-4 left-20 w-12 h-8 bg-white/20 rounded-sm"></div>
                <div className="absolute top-4 left-32 w-16 h-8 bg-white/30 rounded-sm"></div>
                <div className="absolute top-4 left-48 w-12 h-8 bg-white/20 rounded-sm"></div>
                <div className="absolute top-4 left-60 w-16 h-8 bg-white/30 rounded-sm"></div>
                <div className="absolute top-4 left-76 w-12 h-8 bg-white/20 rounded-sm"></div>
                <div className="absolute top-4 left-88 w-16 h-8 bg-white/30 rounded-sm"></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">🎹 Let's Begin Your Piano Journey</h2>
                <p className="text-xl mb-6">Welcome to the wonderful world of piano! We're here to guide you through every step of your musical adventure.</p>
              </div>
            </div>

            {/* What is a Keyboard/Digital Piano Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Piano className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white break-words">What is a Keyboard / Digital Piano?</h3>
                </div>
                <button
                  onClick={() => markSubsectionCompleted('keyboardIntro')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
                    sectionProgress.keyboardIntro
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {sectionProgress.keyboardIntro ? '✅ Complete' : 'Mark Complete'}
                </button>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Think of a keyboard like a magical box that makes beautiful sounds when you touch it! It's your very own musical instrument that you can learn to play.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30">
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">🎹 White Keys</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      These are the main keys you'll use most often. They're like the foundation of your musical alphabet - C, D, E, F, G, A, B!
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-800/30 dark:hover:to-blue-800/30">
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">⚫ Black Keys</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      These are the smaller keys that add special sounds to your music. They're like the spices that make your cooking more interesting!
                    </p>
                  </div>
                </div>


              </div>
            </div>

            {/* What is an Octave Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white break-words">What is an Octave?</h3>
                </div>
                <button
                  onClick={() => markSubsectionCompleted('octaveIntro')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
                    sectionProgress.octaveIntro
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {sectionProgress.octaveIntro ? '✅ Complete' : 'Mark Complete'}
                </button>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  An octave is like a musical "family" of 8 white keys that work together. It starts and ends with the same note, just higher or lower!
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30">
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">🎵 The C Octave Example</h4>
                  <div className="space-y-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      Let's look at the C octave - it's the easiest one to understand:
                    </p>
                    <div className="grid grid-cols-8 gap-2 max-w-md">
                      {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'].map((note, index) => (
                        <div key={index} className="text-center">
                          <div className="w-8 h-8 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded flex items-center justify-center text-sm font-bold text-slate-800 dark:text-white">
                            {note}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                            {index === 0 ? 'Start' : index === 7 ? 'End' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                      Notice how it starts with C and ends with C? That's what makes it an octave!
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:from-green-100 hover:to-blue-100 dark:hover:from-green-800/30 dark:hover:to-blue-800/30">
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">🎯 Simple Tips</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tip 1: Start with C octave */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-48 h-48 md:w-40 md:h-40 mb-3">
                        <img 
                          src="/tips/octave.jpeg" 
                          alt="C octave on keyboard" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Start with C octave</p>
                    </div>
                    
                    {/* Tip 3: Listen to notes */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-64 h-48 md:w-80 md:h-58 mb-3">
                        <img 
                          src="/tips/notes.png" 
                          alt="Musical notes" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Listen to notes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Encouragement Section */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎉 You're Ready to Start!</h3>
              <p className="text-lg mb-6">
                You've just learned the basics of your keyboard and octaves. These are your first steps into the wonderful world of piano playing!
              </p>
              <div className="flex items-center justify-center gap-4 text-sm mb-6">
                <span>🎹</span>
                <span>Ready to learn more?</span>
                <span>🎹</span>
              </div>
              
              {/* Completion and Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    markSectionCompleted('introduction');
                  }}
                  disabled={!areAllSubsectionsCompleted()}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    courseProgress.introduction 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : areAllIntroductionSubsectionsCompleted()
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {courseProgress.introduction 
                    ? '✅ Completed' 
                    : areAllIntroductionSubsectionsCompleted()
                    ? '🎯 Mark as Complete'
                    : '🔒 Complete All Sections First'
                  }
                </button>
                
                <button
                  onClick={goToNextSection}
                  className="px-6 py-3 rounded-xl font-bold transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ➡️ Next: Basics
                </button>
              </div>
            </div>
          </div>
        );
      case 'basics':
        return (
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 px-2 sm:px-0">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white relative overflow-hidden">
              {/* Low-opacity piano background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2 w-6 sm:w-8 lg:w-16 h-3 sm:h-4 lg:h-8 bg-white/30 rounded-sm"></div>
                <div className="absolute top-1 sm:top-2 left-7 sm:left-10 w-4 sm:w-6 lg:w-12 h-3 sm:h-4 lg:h-8 bg-white/20 rounded-sm"></div>
                <div className="absolute top-1 sm:top-2 left-11 sm:left-16 w-6 sm:w-8 lg:w-16 h-3 sm:h-4 lg:h-8 bg-white/30 rounded-sm"></div>
                <div className="absolute top-1 sm:top-2 left-17 sm:left-24 w-4 sm:w-6 lg:w-12 h-3 sm:h-4 lg:h-8 bg-white/20 rounded-sm"></div>
                <div className="absolute top-1 sm:top-2 left-21 sm:left-30 w-6 sm:w-8 lg:w-16 h-3 sm:h-4 lg:h-8 bg-white/30 rounded-sm"></div>
                <div className="absolute top-1 sm:top-2 left-27 sm:left-38 w-4 sm:w-6 lg:w-12 h-3 sm:h-4 lg:h-8 bg-white/20 rounded-sm"></div>
                <div className="absolute top-1 sm:top-2 left-31 sm:left-44 w-6 sm:w-8 lg:w-16 h-3 sm:h-4 lg:h-8 bg-white/30 rounded-sm"></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">🎼 Let's Learn the Keys & Fingers!</h2>
                <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">Welcome to the basics of piano playing! We'll learn about the keys and how to use your fingers.</p>
              </div>
            </div>

            {/* White Keys Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Piano className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">🎹 White Keys</h3>
                </div>
                <button
                  onClick={() => markSubsectionCompleted('whiteKeys')}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm ${
                    sectionProgress.whiteKeys
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {sectionProgress.whiteKeys ? '✅ Done' : 'Mark'}
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30">
                  <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3">What are White Keys?</h4>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-2 sm:mb-3">
                    White keys are called <strong>Notes</strong>, <strong>Natural Keys</strong>, or <strong>White Keys</strong>.
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-2 sm:mb-3">
                    They play the basic music notes:
                  </p>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 max-w-[280px] sm:max-w-md mx-auto">
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note, index) => (
                      <div key={index} className="text-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded flex items-center justify-center text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                          {note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Black Keys Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Music className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">⚫ Black Keys</h3>
                </div>
                <button
                  onClick={() => markSubsectionCompleted('blackKeys')}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm ${
                    sectionProgress.blackKeys
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {sectionProgress.blackKeys ? '✅ Done' : 'Mark'}
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30">
                  <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3">What are Black Keys?</h4>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-2 sm:mb-3">
                    Black keys are called <strong>Sharps</strong>.
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-2 sm:mb-3">
                    They use the sharp symbol: <strong>#</strong>
                  </p>
                  <div className="bg-white dark:bg-slate-700 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 max-w-[200px] sm:max-w-xs lg:max-w-md mx-auto">
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-2">
                      <strong>Example:</strong> C# is the black key after C
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-white dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-500 rounded flex items-center justify-center text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                        C
                      </div>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-slate-800 dark:bg-slate-800 border-2 border-slate-600 dark:border-slate-500 rounded flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                        C#
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hand Position Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">🤲 Hand Position</h3>
                </div>
                <button
                  onClick={() => markSubsectionCompleted('handPosition')}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm ${
                    sectionProgress.handPosition
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {sectionProgress.handPosition ? '✅ Done' : 'Mark'}
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200 hover:from-green-100 hover:to-blue-100 dark:hover:from-green-800/30 dark:hover:to-blue-800/30">
                  <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3">Finger Numbers</h4>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-2 sm:mb-3">
                    Each finger has a number:
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          1
                        </div>
                        <span className="text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Thumb</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          2
                        </div>
                        <span className="text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Index Finger</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          3
                        </div>
                        <span className="text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Middle Finger</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          4
                        </div>
                        <span className="text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Ring Finger</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          5
                        </div>
                        <span className="text-sm sm:text-base lg:text-lg text-slate-800 dark:text-white">Pinky</span>
                      </div>
                    </div>
                    
                    {/* Hand Diagram Image */}
                    <div className="flex justify-center items-center">
                      <img 
                        src="/finger-numbers.jpeg" 
                        alt="Piano finger numbering diagram" 
                        className="max-w-full h-auto rounded-lg sm:rounded-xl shadow-lg"
                        style={{ maxHeight: '200px', maxWidth: '100%' }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 lg:mt-6 p-2 sm:p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-200">
                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300 text-center">
                      <strong>💡 Tip:</strong> Keep your hand relaxed and curved like you're holding a small ball!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What is a Chord? Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Music className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">🎼 What is a Chord?</h3>
                </div>
                <button
                  onClick={() => markSubsectionCompleted('chordIntro')}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm ${
                    sectionProgress.chordIntro
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {sectionProgress.chordIntro ? '✅ Done' : 'Mark'}
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30">
                  <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3">Understanding Chords</h4>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-3 sm:mb-4">
                    A chord is when you play <strong>3 or more notes together</strong> at the same time to create a beautiful sound!
                  </p>
                  
                  {/* Live Example */}
                  <div className="bg-white dark:bg-slate-700 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
                    <h5 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3 text-center">🎹 Live Example: C Major Chord</h5>
                    <div className="flex justify-center gap-2 sm:gap-3 mb-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-500 rounded flex items-center justify-center text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                          C
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">1st</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-500 rounded flex items-center justify-center text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                          E
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">3rd</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-500 rounded flex items-center justify-center text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                          G
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">5th</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300 text-center">
                      <strong>Try it:</strong> Press these three keys together on your keyboard - it sounds beautiful! 🎵
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Encouragement Section */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white text-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">🎉 Great Job!</h3>
              <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 lg:mb-6">
                You've learned about white keys, black keys, and finger numbers. You're ready to start playing!
              </p>
              <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-4 text-xs sm:text-sm mb-4">
                <span>🎹</span>
                <span>Ready for the next lesson?</span>
                <span>🎹</span>
              </div>
              
              {/* Completion and Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => {
                    markSectionCompleted('basics');
                  }}
                  disabled={!areAllSubsectionsCompleted()}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 text-xs sm:text-sm ${
                    courseProgress.basics
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : areAllSubsectionsCompleted()
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {courseProgress.basics 
                    ? '✅ Completed' 
                    : areAllSubsectionsCompleted()
                    ? '🎯 Mark as Complete'
                    : '🔒 Complete All Sections First'
                  }
                </button>
                
                <button
                  onClick={goToNextSection}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ➡️ Next: Major Scales
                </button>
              </div>
            </div>
          </div>
        );
      case 'major-scales':
        return (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">🎼 Major Scales</h2>
                <p className="text-lg mb-6">Explore the building blocks of Western music with major scales.</p>
                
                {/* Progress Indicator */}
                <div className="mb-4 p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress: {completedItems.scales.filter(scale => scale.includes('Major')).length}/12 scales completed</span>
                    <span className="text-sm font-bold">{Math.round((completedItems.scales.filter(scale => scale.includes('Major')).length / 12) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedItems.scales.filter(scale => scale.includes('Major')).length / 12) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span>🎹</span>
                  <span>Click on any scale to see the notes!</span>
                  <span>🎹</span>
                </div>
              </div>
            </div>

            {/* Scales Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { name: 'C Major', notes: { chord: ['C', 'E', 'G', 'C'], up: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], down: ['C', 'B', 'A', 'G', 'F', 'E', 'D', 'C'] } },
                { name: 'D Major', notes: { chord: ['D', 'F#', 'A', 'D'], up: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'], down: ['D', 'C#', 'B', 'A', 'G', 'F#', 'E', 'D'] } },
                { name: 'E Major', notes: { chord: ['E', 'G#', 'B', 'E'], up: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'], down: ['E', 'D#', 'C#', 'B', 'A', 'G#', 'F#', 'E'] } },
                { name: 'F Major', notes: { chord: ['F', 'A', 'C', 'F'], up: ['F', 'G', 'A', 'A#', 'C', 'D', 'E', 'F'], down: ['F', 'E', 'D', 'C', 'A#', 'A', 'G', 'F'] } },
                { name: 'G Major', notes: { chord: ['G', 'B', 'D', 'G'], up: ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'], down: ['G', 'F#', 'E', 'D', 'C', 'B', 'A', 'G'] } },
                { name: 'A Major', notes: { chord: ['A', 'C#', 'E', 'A'], up: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'], down: ['A', 'G#', 'F#', 'E', 'D', 'C#', 'B', 'A'] } },
                { name: 'B Major', notes: { chord: ['B', 'D#', 'F#', 'B'], up: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'], down: ['B', 'A#', 'G#', 'F#', 'E', 'D#', 'C#', 'B'] } }
              ].map((scale, index) => (
                <div key={scale.name} className="group">
                  <MajorScaleCard scale={scale} />
                </div>
              ))}
            </div>

            {/* Scale Details Modal */}
            {selectedScale && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2 sticky top-0 bg-white dark:bg-slate-800 py-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white break-words">🎼 {selectedScale.name} Scale</h3>
                      <button
                        onClick={() => setSelectedScale(null)}
                        className="w-8 h-8 sm:w-6 sm:h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                                              {/* Chord Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              C
                            </div>
                            <span className="font-semibold text-sm text-slate-800 dark:text-white">Chord</span>
                          </div>
                                                  <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                          {selectedScale.notes.chord.map((note, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                note.includes('#') || note.includes('b')
                                  ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                  : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                              }`}>
                                {note}
                              </div>
                              <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                        </div>

                                              {/* Scale Section */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              ↕
                            </div>
                            <span className="font-semibold text-sm text-slate-800 dark:text-white">Scale (Up & Down)</span>
                          </div>
                          
                          {/* Up Scale */}
                          <div className="mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                ↑
                              </div>
                              <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Up</span>
                            </div>
                            <div className="flex gap-1 justify-center flex-wrap">
                              {selectedScale.notes.up.map((note, index) => (
                                <div key={index} className="flex flex-col items-center">
                                  <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                    note.includes('#') || note.includes('b')
                                      ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                      : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                  }`}>
                                    {note}
                                  </div>
                                  <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                    {(index % 4) + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Down Scale */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                ↓
                              </div>
                              <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Down</span>
                            </div>
                            <div className="flex gap-1 justify-center flex-wrap">
                              {selectedScale.notes.down.map((note, index) => (
                                <div key={index} className="flex flex-col items-center">
                                  <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                    note.includes('#') || note.includes('b')
                                      ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                      : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                  }`}>
                                    {note}
                                  </div>
                                  <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                    {(index % 4) + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                                              {/* Practice Tip */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              💡
                            </div>
                            <span className="font-semibold text-xs text-slate-800 dark:text-white">Practice Tip</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300">
                            Practice each scale as much you can do!
                          </p>
                        </div>

                                              {/* Done Button */}
                        <div className="text-center mt-2">
                          <button
                            onClick={() => {
                              markScaleCompleted(selectedScale.name);
                              setSelectedScale(null);
                            }}
                            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                          >
                            ✅ Done Abhi! I've Learned This Scale Perfectly
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* # Major Scales Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">🎼 # Major Scales</h2>
                <p className="text-xl mb-6">Learn the sharp major scales for advanced music theory!</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>🎹</span>
                  <span>Click on any sharp scale to see the notes!</span>
                  <span>🎹</span>
                </div>
              </div>
            </div>

            {/* # Major Scales Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'C# Major', notes: { chord: ['C#', 'F', 'G#', 'C#'], up: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C', 'C#'], down: ['C#', 'C', 'A#', 'G#', 'F#', 'F', 'D#', 'C#'] } },
                { name: 'D# Major', notes: { chord: ['D#', 'G', 'A#', 'D#'], up: ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D', 'D#'], down: ['D#', 'D', 'C', 'A#', 'G#', 'G', 'F', 'D#'] } },
                { name: 'F# Major', notes: { chord: ['F#', 'A#', 'C#', 'F#'], up: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F', 'F#'], down: ['F#', 'F', 'D#', 'C#', 'B', 'A#', 'G#', 'F#'] } },
                { name: 'G# Major', notes: { chord: ['G#', 'C', 'D#', 'G#'], up: ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G', 'G#'], down: ['G#', 'G', 'F', 'D#', 'C#', 'C', 'A#', 'G#'] } },
                { name: 'A# Major', notes: { chord: ['A#', 'D', 'F', 'A#'], up: ['A#', 'C', 'D', 'D#', 'F', 'G', 'A', 'A#'], down: ['A#', 'A', 'G', 'F', 'D#', 'D', 'C', 'A#'] } }
              ].map((scale, index) => (
                <div key={scale.name} className="group">
                  <SharpMajorScaleCard scale={scale} />
                </div>
              ))}
            </div>

            {/* # Major Scale Details Modal */}
            {selectedSharpScale && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full">
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">🎼 {selectedSharpScale.name}</h3>
                      <button
                        onClick={() => setSelectedSharpScale(null)}
                        className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Chord Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            C
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Chord</span>
                        </div>
                        <div className="flex gap-1 justify-center flex-wrap">
                          {selectedSharpScale.notes.chord.map((note, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                note.includes('#') || note.includes('b')
                                  ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                  : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                              }`}>
                                {note}
                              </div>
                              <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Scale Section */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            ↕
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Scale (Up & Down)</span>
                        </div>
                        
                        {/* Up Scale */}
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              ↑
                            </div>
                            <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Up</span>
                          </div>
                          <div className="flex gap-1 justify-center flex-wrap">
                            {selectedSharpScale.notes.up.map((note, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                  note.includes('#') || note.includes('b')
                                    ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                    : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                }`}>
                                  {note}
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                  {(index % 4) + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Down Scale */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              ↓
                            </div>
                            <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Down</span>
                          </div>
                          <div className="flex gap-1 justify-center flex-wrap">
                            {selectedSharpScale.notes.down.map((note, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                  note.includes('#') || note.includes('b')
                                    ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                    : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                }`}>
                                  {note}
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                  {(index % 4) + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Practice Tip */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            💡
                          </div>
                          <span className="font-semibold text-xs text-slate-800 dark:text-white">Practice Tip</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Practice each sharp major scale as much you can do!
                        </p>
                      </div>

                      {/* Done Button */}
                      <div className="text-center mt-2">
                        <button
                                      onClick={() => {
              markScaleCompleted(selectedSharpScale.name);
              setSelectedSharpScale(null);
            }}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                        >
                          ✅ Done Abhi! I've Learned This Scale Perfectly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Encouragement Footer */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎼 Master the Scales!</h3>
              <p className="text-lg mb-6">
                You're learning the foundation of all music! Practice these scales regularly and you'll become a piano master.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm mb-6">
                <span>🎹</span>
                <span>Keep practicing and never give up!</span>
                <span>🎹</span>
              </div>
              
              {/* Completion and Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    markSectionCompleted('majorScales');
                  }}
                  disabled={!areAllMajorScalesCompleted()}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    courseProgress.majorScales
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : areAllMajorScalesCompleted()
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {courseProgress.majorScales 
                    ? '✅ Completed' 
                    : areAllMajorScalesCompleted()
                    ? '🎯 Mark as Complete'
                    : '🔒 Complete All Scales First'
                  }
                </button>
                
                <button
                  onClick={goToNextSection}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all duration-300"
                >
                  ➡️ Next: Minor Scales
                </button>
              </div>
            </div>
          </div>
        );
      case 'minor-scales':
        return (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl font-bold">🎼 Minor Scales</h2>
                  {areAllMinorScalesCompleted() && (
                    <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-full">
                      <span className="text-green-300">✅</span>
                      <span className="text-sm font-medium">Ready to Complete!</span>
                    </div>
                  )}
                </div>
                <p className="text-xl mb-6">Discover the emotional depth and unique characteristics of minor scales!</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>🎹</span>
                  <span>Click on any scale to see the notes!</span>
                  <span>🎹</span>
                </div>
              </div>
            </div>

            {/* Minor Scales Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'C Minor', notes: { chord: ['C', 'D#', 'G', 'C'], up: ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#', 'C'], down: ['C', 'A#', 'G#', 'G', 'F', 'D#', 'D', 'C'] } },
                { name: 'D Minor', notes: { chord: ['D', 'F', 'A', 'D'], up: ['D', 'E', 'F', 'G', 'A', 'A#', 'C', 'D'], down: ['D', 'C', 'A#', 'A', 'G', 'F', 'E', 'D'] } },
                { name: 'E Minor', notes: { chord: ['E', 'G', 'B', 'E'], up: ['E', 'F#', 'G', 'A', 'B', 'C', 'D', 'E'], down: ['E', 'D', 'C', 'B', 'A', 'G', 'F#', 'E'] } },
                { name: 'F Minor', notes: { chord: ['F', 'G#', 'C', 'F'], up: ['F', 'G', 'G#', 'A#', 'C', 'C#', 'D#', 'F'], down: ['F', 'D#', 'C#', 'C', 'A#', 'G#', 'G', 'F'] } },
                { name: 'G Minor', notes: { chord: ['G', 'A#', 'D', 'G'], up: ['G', 'A', 'A#', 'C', 'D', 'D#', 'F', 'G'], down: ['G', 'F', 'D#', 'D', 'C', 'A#', 'A', 'G'] } },
                { name: 'A Minor', notes: { chord: ['A', 'C', 'E', 'A'], up: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'], down: ['A', 'G', 'F', 'E', 'D', 'C', 'B', 'A'] } },
                { name: 'B Minor', notes: { chord: ['B', 'D', 'F#', 'B'], up: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A', 'B'], down: ['B', 'A', 'G', 'F#', 'E', 'D', 'C#', 'B'] } }
              ].map((scale, index) => (
                <div key={scale.name} className="group">
                  <MinorScaleCard scale={scale} />
                </div>
              ))}
            </div>

            {/* Minor Scale Details Modal */}
            {selectedMinorScale && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full">
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">🎼 {selectedMinorScale.name} Scale</h3>
                      <button
                        onClick={() => setSelectedMinorScale(null)}
                        className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Chord Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            C
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Chord</span>
                        </div>
                        <div className="flex gap-1 justify-center flex-wrap">
                          {selectedMinorScale.notes.chord.map((note, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                note.includes('#') || note.includes('b')
                                  ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                  : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                              }`}>
                                {note}
                              </div>
                              <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                                              {/* Scale Section */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              ↕
                            </div>
                            <span className="font-semibold text-sm text-slate-800 dark:text-white">Scale (Up & Down)</span>
                          </div>
                          
                          {/* Up Scale */}
                          <div className="mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                ↑
                              </div>
                              <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Up</span>
                            </div>
                                                      <div className="flex gap-1 justify-center flex-wrap">
                            {selectedMinorScale.notes.up.map((note, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                  note.includes('#') || note.includes('b')
                                    ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                    : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                }`}>
                                    {note}
                                  </div>
                                  <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                    {(index % 4) + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Down Scale */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                ↓
                              </div>
                              <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Down</span>
                            </div>
                                                      <div className="flex gap-1 justify-center flex-wrap">
                            {selectedMinorScale.notes.down.map((note, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                  note.includes('#') || note.includes('b')
                                    ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                    : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                }`}>
                                    {note}
                                  </div>
                                  <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                    {(index % 4) + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                      {/* Practice Tip */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            💡
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Practice Tip</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Practice each minor scale as much you can do!
                        </p>
                      </div>

                      {/* Done Button */}
                      <div className="text-center">
                        <button
                                                      onClick={() => {
                              markScaleCompleted(selectedMinorScale.name);
                              setSelectedMinorScale(null);
                            }}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                        >
                          ✅ Done Abhi! I've Learned This Scale Perfectly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* # Minor Scales Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">🎼 # Minor Scales</h2>
                <p className="text-xl mb-6">Learn the sharp minor scales for advanced music theory!</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>🎹</span>
                  <span>Click on any sharp minor scale to see the notes!</span>
                  <span>🎹</span>
                </div>
              </div>
            </div>

            {/* # Minor Scales Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'C# Minor', notes: { chord: ['C#', 'E', 'G#', 'C#'], up: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B', 'C#'], down: ['C#', 'B', 'A', 'G#', 'F#', 'E', 'D#', 'C#'] } },
                { name: 'D# Minor', notes: { chord: ['D#', 'F#', 'A#', 'D#'], up: ['D#', 'F', 'F#', 'G#', 'A#', 'B', 'C#', 'D#'], down: ['D#', 'C#', 'B', 'A#', 'G#', 'F#', 'F', 'D#'] } },
                { name: 'F# Minor', notes: { chord: ['F#', 'A', 'C#', 'F#'], up: ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E', 'F#'], down: ['F#', 'E', 'D', 'C#', 'B', 'A', 'G#', 'F#'] } },
                { name: 'G# Minor', notes: { chord: ['G#', 'B', 'D#', 'G#'], up: ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#', 'G#'], down: ['G#', 'F#', 'E', 'D#', 'C#', 'B', 'A#', 'G#'] } },
                { name: 'A# Minor', notes: { chord: ['A#', 'C#', 'F', 'A#'], up: ['A#', 'C', 'C#', 'D#', 'F', 'F#', 'G#', 'A#'], down: ['A#', 'G#', 'F#', 'F', 'D#', 'C#', 'C', 'A#'] } }
              ].map((scale, index) => (
                <div key={scale.name} className="group">
                  <SharpMinorScaleCard scale={scale} />
                </div>
              ))}
            </div>

            {/* # Minor Scale Details Modal */}
            {selectedSharpMinorScale && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full">
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">🎼 {selectedSharpMinorScale.name}</h3>
                      <button
                        onClick={() => setSelectedSharpMinorScale(null)}
                        className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Chord Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            C
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Chord</span>
                        </div>
                        <div className="flex gap-1 justify-center flex-wrap">
                          {selectedSharpMinorScale.notes.chord.map((note, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                note.includes('#') || note.includes('b')
                                  ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                  : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                              }`}>
                                {note}
                              </div>
                              <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Scale Section */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            ↕
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Scale (Up & Down)</span>
                        </div>
                        
                        {/* Up Scale */}
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              ↑
                            </div>
                            <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Up</span>
                          </div>
                          <div className="flex gap-1 justify-center flex-wrap">
                            {selectedSharpMinorScale.notes.up.map((note, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                  note.includes('#') || note.includes('b')
                                    ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                    : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                }`}>
                                  {note}
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                  {(index % 4) + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Down Scale */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              ↓
                            </div>
                            <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Down</span>
                          </div>
                          <div className="flex gap-1 justify-center flex-wrap">
                            {selectedSharpMinorScale.notes.down.map((note, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                                  note.includes('#') || note.includes('b')
                                    ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                    : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                }`}>
                                  {note}
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                  {(index % 4) + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Practice Tip */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            💡
                          </div>
                          <span className="font-semibold text-xs text-slate-800 dark:text-white">Practice Tip</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Practice each sharp minor scale as much you can do!
                        </p>
                      </div>

                      {/* Done Button */}
                      <div className="text-center mt-2">
                        <button
                          onClick={() => {
                            markScaleCompleted(selectedSharpMinorScale.name);
                            setSelectedSharpMinorScale(null);
                          }}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                        >
                          ✅ Done Abhi! I've Learned This Scale Perfectly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Encouragement Footer */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎼 Master the Minor Scales!</h3>
              <p className="text-lg mb-6">
                You're learning the emotional foundation of music! Practice these minor scales regularly and you'll become a complete piano master.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm mb-6">
                <span>🎹</span>
                <span>Keep practicing and never give up!</span>
                <span>🎹</span>
              </div>
              
              {/* Completion and Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    markSectionCompleted('minorScales');
                  }}
                  disabled={!areAllMinorScalesCompleted()}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    courseProgress.minorScales
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : areAllMinorScalesCompleted()
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {courseProgress.minorScales 
                    ? '✅ Completed' 
                    : areAllMinorScalesCompleted()
                    ? '🎯 Mark as Complete'
                    : '🔒 Complete All Scales First'
                  }
                </button>
                
                <button
                  onClick={() => {
                    setActiveSection('major-family-chords');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all duration-300"
                >
                  ➡️ Next: Major Families
                </button>
              </div>
            </div>
          </div>
        );
      case 'inversions':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Chord Inversions</h2>
              <p className="text-lg mb-6">Learn how to play chords in different positions for smoother transitions.</p>
            </div>
            
            {/* Google Drive Videos Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Video Lessons</h3>
              <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                <GoogleDriveVideo
                  title="How to Play Chord Inversions"
                  description="Master the technique of playing chord inversions for smoother transitions."
                  driveVideoId="1lAEZ4zn_GaN5D2zE6Y9B__llFPswqfrG"
                  duration="12:30"
                  onPlay={() => console.log('Playing Chord Inversions video')}
                  onVideoComplete={() => {
                    markSectionCompleted('inversions');
                    console.log('✅ Inversions video completed!');
                  }}
                  sectionId="inversions"
                />

              </div>
            </div>
            

            
            {/* Completion and Navigation Buttons */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎼 Inversions Mastered!</h3>
              <p className="text-lg mb-6">
                You've learned about chord inversions and voice leading. These skills will make your playing much smoother!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    markSectionCompleted('inversions');
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    courseProgress.inversions
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-white text-green-600 hover:bg-green-50'
                  }`}
                >
                  {courseProgress.inversions ? '✅ Completed' : '🎯 Mark as Complete'}
                </button>
                
                <button
                  onClick={goToNextSection}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all duration-300"
                >
                  ➡️ Next: Practicing
                </button>
              </div>
            </div>
          </div>
        );
      case 'practicing':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Effective Practice</h2>
              <p className="text-lg mb-6">Develop a practice routine that maximizes your learning and progress.</p>
            </div>
            
            {/* Google Drive Videos Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Video Lessons</h3>
              <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                <GoogleDriveVideo
                  title="How to Practice Effectively"
                  description="Learn proven techniques to maximize your practice sessions and accelerate your progress."
                  driveVideoId="1AkJn3ugoB-CfUABi95hzMW0G2zn35mb5"
                  duration="15:45"
                  onPlay={() => console.log('Playing Practice video')}
                  onVideoComplete={() => {
                    markSectionCompleted('practicing');
                    console.log('✅ Practice video completed!');
                  }}
                  sectionId="practicing"
                />
              </div>
            </div>
            

            
            {/* Completion and Navigation Buttons */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎼 Practice Techniques Mastered!</h3>
              <p className="text-lg mb-6">
                You've learned effective practice techniques. Apply these methods to accelerate your progress!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    markSectionCompleted('practicing');
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    courseProgress.practicing
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-white text-green-600 hover:bg-green-50'
                  }`}
                >
                  {courseProgress.practicing ? '✅ Completed' : '🎯 Mark as Complete'}
                </button>
                
                                  <button
                    onClick={() => setShowGuidedLearningCompleteModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🏆 Guided Learning Complete
                  </button>
              </div>
            </div>


          </div>
        );
      case 'major-family-chords':
        return (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl font-bold">🎼 Family Chords</h2>
                  {areAllMajorFamilyChordsCompleted() && (
                    <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-full">
                      <span className="text-green-300">✅</span>
                      <span className="text-sm font-medium">Ready to Complete!</span>
                    </div>
                  )}
                </div>
                <p className="text-xl mb-6">Learn how chords work together in families for smooth transitions!</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>🎹</span>
                  <span>Click on any family to see the chords!</span>
                  <span>🎹</span>
                </div>
              </div>
            </div>

            {/* Family Chords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'C-Major Family', chords: ['C-C,D,G,C', 'F-F,A,C,F', 'G-G,B,D,G', 'C-C,E,G,C'] },
                { name: 'D-Major Family', chords: ['D-D,F#,A,D', 'G-G,B,D,G', 'A-A,C#,E,A', 'D-D,F#,A,D'] },
                { name: 'E-Major Family', chords: ['E-E,G#,B,E', 'A-A,C#,E,A', 'B-B,D#,F#,B', 'E-E,G#,B,E'] },
                { name: 'F-Major Family', chords: ['F-F,A,C,F', 'Bb-Bb,D,F,Bb', 'C-C,E,G,C', 'F-F,A,C,F'] },
                { name: 'G-Major Family', chords: ['G-G,B,D,G', 'C-C,E,G,C', 'D-D,F#,A,D', 'G-G,B,D,G'] },
                { name: 'A-Major Family', chords: ['A-A,C#,E,A', 'D-D,F#,A,D', 'E-E,G#,B,E', 'A-A,C#,E,A'] },
                { name: 'B-Major Family', chords: ['B-B,D#,F#,B', 'E-E,G#,B,E', 'F#-F#,A#,C#,F#', 'B-B,D#,F#,B'] }
              ].map((family, index) => (
                <div key={family.name} className="group">
                  <FamilyChordCard family={family} />
                </div>
              ))}
            </div>

            {/* Family Chord Details Modal */}
            {selectedFamily && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full">
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">🎼 {selectedFamily.name}</h3>
                      <button
                        onClick={() => setSelectedFamily(null)}
                        className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Family Chords Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            🎼
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Family Chords</span>
                        </div>
                        <div className="space-y-1">
                          {selectedFamily.chords.map((chord, index) => (
                            <div key={index} className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200">
                              <div className="flex gap-1 justify-center">
                                {chord.split('-')[1].split(',').map((note, noteIndex) => (
                                  <div key={noteIndex} className="flex flex-col items-center">
                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                                      note.includes('#') || note.includes('b')
                                        ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                        : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                    }`}>
                                      {note}
                                    </div>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                                      {noteIndex + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-center text-xs text-slate-600 dark:text-slate-300 mt-1 font-bold">
                                <strong>{chord.split('-')[0]}</strong>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Practice Tip */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            💡
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Practice Tip</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Practice each family chord progression as much you can do!
                        </p>
                      </div>

                      {/* Done Button */}
                      <div className="text-center">
                        <button
                          onClick={() => {
                            markFamilyCompleted(selectedFamily.name);
                            setSelectedFamily(null);
                          }}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                        >
                          ✅ Done Abhi! I've Learned This Family Perfectly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* # Major Family Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">🎼 # Major Family</h2>
                <p className="text-xl mb-6">Learn the sharp major family chords for advanced music theory!</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>🎹</span>
                  <span>Click on any sharp family to see the chords!</span>
                  <span>🎹</span>
                </div>
              </div>
            </div>

            {/* # Major Family Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'C#-Major Family', chords: ['C#-C#,D#,G#,C#', 'F#-F#,A#,C#,F#', 'G#-G#,B,D#,G#', 'C#-C#,F,G#,C#'] },
                { name: 'D#-Major Family', chords: ['D#-D#,F,G,D#', 'G-G,B,D,G', 'A-A,C#,E,A', 'D#-D#,F,G,D#'] },
                { name: 'F#-Major Family', chords: ['F#-F#,G#,A#,F#', 'B-B,D#,F#,B', 'C#-C#,F,G#,C#', 'F#-F#,G#,A#,F#'] },
                { name: 'G#-Major Family', chords: ['G#-G#,A#,C,G#', 'C-C,E,G,C', 'D-D,F#,A,D', 'G#-G#,A#,C,G#'] },
                { name: 'A#-Major Family', chords: ['A#-A#,C,D,A#', 'D-D,F,A,D', 'E-E,G#,B,E', 'A#-A#,C,D,A#'] }
              ].map((family, index) => (
                <div key={family.name} className="group">
                  <SharpFamilyCard family={family} />
                </div>
              ))}
            </div>

            {/* # Major Family Details Modal */}
            {selectedSharpFamily && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full">
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">🎼 {selectedSharpFamily.name}</h3>
                      <button
                        onClick={() => setSelectedSharpFamily(null)}
                        className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Family Chords Section */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            🎼
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Family Chords</span>
                        </div>
                        <div className="space-y-1">
                          {selectedSharpFamily.chords.map((chord, index) => (
                            <div key={index} className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200">
                              <div className="flex gap-1 justify-center">
                                {chord.split('-')[1].split(',').map((note, noteIndex) => (
                                  <div key={noteIndex} className="flex flex-col items-center">
                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                                      note.includes('#') || note.includes('b')
                                        ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                        : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                    }`}>
                                      {note}
                                    </div>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                                      {noteIndex + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-center text-xs text-slate-600 dark:text-slate-300 mt-1 font-bold">
                                <strong>{chord.split('-')[0]}</strong>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Practice Tip */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            💡
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Practice Tip</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Practice each sharp family chord progression as much you can do!
                        </p>
                      </div>

                      {/* Done Button */}
                      <div className="text-center">
                        <button
                          onClick={() => {
                            markFamilyCompleted(selectedSharpFamily.name);
                            setSelectedSharpFamily(null);
                          }}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                        >
                          ✅ Done Abhi! I've Learned This Sharp Family Perfectly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Encouragement Footer */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎼 Master the Family Chords!</h3>
              <p className="text-lg mb-6">
                You're learning how chords work together! Practice these family progressions regularly and you'll become a complete piano master.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm mb-6">
                <span>🎹</span>
                <span>Keep practicing and never give up!</span>
                <span>🎹</span>
              </div>
              
              {/* Completion and Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    markSectionCompleted('majorFamilyChords');
                  }}
                  disabled={!areAllMajorFamilyChordsCompleted()}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    courseProgress.majorFamilyChords
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : areAllMajorFamilyChordsCompleted()
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {courseProgress.majorFamilyChords 
                    ? '✅ Completed' 
                    : areAllMajorFamilyChordsCompleted()
                    ? '🎯 Mark as Complete'
                    : '🔒 Complete All Major Families First'
                  }
                </button>
                
                {calculateProgress() === 45 && areAllMajorFamilyChordsCompleted() && (
                  <button
                    onClick={() => {
                      setActiveSection('minor-family-chords');
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-300"
                  >
                    ➡️ Next: Minor Families
                </button>
                )}
                
                <button
                  onClick={() => {
                    setActiveSection('minor-family-chords');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-300"
                >
                  ➡️ Next: Minor Families
                </button>
              </div>
            </div>
          </div>
        );
      case 'minor-family-chords':
        return (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl font-bold">🎼 Minor Family Chords</h2>
                  {areAllMinorFamilyChordsCompleted() && (
                    <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-full">
                      <span className="text-green-300">✅</span>
                      <span className="text-sm font-medium">Ready to Complete!</span>
                    </div>
                  )}
                </div>
                <p className="text-xl mb-6">Learn how minor chords work together in families for emotional progressions!</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>🎹</span>
                  <span>Click on any minor family to see the chords!</span>
                  <span>🎹</span>
                </div>
              </div>
            </div>

            {/* Minor Family Chords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'C-Minor Family', chords: ['Cm-C,Eb,G,C', 'A#-A#,C#,F,A#', 'G#-G#,B,D#,G#', 'G-G,B,D,G', 'Cm-C,Eb,G,C'] },
                { name: 'D-Minor Family', chords: ['Dm-D,F,A,D', 'B-B,D#,F#,B', 'A-A,C#,E,A', 'G-G,B,D,G', 'Dm-D,F,A,D'] },
                { name: 'E-Minor Family', chords: ['Em-E,G,B,E', 'C-C,E,G,C', 'A-A,C#,E,A', 'G-G,B,D,G', 'Em-E,G,B,E'] },
                { name: 'F-Minor Family', chords: ['Fm-F,Ab,C,F', 'C#-C#,F,G#,C#', 'A#-A#,C#,F,A#', 'G#-G#,B,D#,G#', 'Fm-F,Ab,C,F'] },
                { name: 'G-Minor Family', chords: ['Gm-G,Bb,D,G', 'D-D,F#,A,D', 'B-B,D#,F#,B', 'A-A,C#,E,A', 'Gm-G,Bb,D,G'] },
                { name: 'A-Minor Family', chords: ['Am-A,C,E,A', 'E-E,G#,B,E', 'C-C,E,G,C', 'A-A,C#,E,A', 'Am-A,C,E,A'] },
                { name: 'B-Minor Family', chords: ['Bm-B,D,F#,B', 'F#-F#,A#,C#,F#', 'D-D,F#,A,D', 'B-B,D#,F#,B', 'Bm-B,D,F#,B'] }
              ].map((family, index) => (
                <div key={family.name} className="group">
                  <FamilyChordCard family={family} />
                </div>
              ))}
            </div>

            {/* Minor Family Chord Details Modal */}
            {selectedFamily && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full">
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">🎼 {selectedFamily.name}</h3>
                      <button
                        onClick={() => setSelectedFamily(null)}
                        className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Family Chords Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            🎼
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Minor Family Chords</span>
                        </div>
                        <div className="space-y-1">
                          {selectedFamily.chords.map((chord, index) => (
                            <div key={index} className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200">
                              <div className="flex gap-1 justify-center">
                                {chord.split('-')[1].split(',').map((note, noteIndex) => (
                                  <div key={noteIndex} className="flex flex-col items-center">
                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                                      note.includes('#') || note.includes('b')
                                        ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                        : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                    }`}>
                                      {note}
                                    </div>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                                      {noteIndex + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-center text-xs text-slate-600 dark:text-slate-300 mt-1 font-bold">
                                <strong>{chord.split('-')[0]}</strong>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Practice Tip */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            💡
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Practice Tip</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Practice each minor family chord progression as much you can do!
                        </p>
                      </div>

                      {/* Done Button */}
                      <div className="text-center">
                        <button
                          onClick={() => {
                            markFamilyCompleted(selectedFamily.name);
                            setSelectedFamily(null);
                          }}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                        >
                          ✅ Done Abhi! I've Learned This Minor Family Perfectly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* # Minor Family Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">🎼 # Minor Family</h2>
                <p className="text-xl mb-6">Learn the sharp minor family chords for advanced music theory!</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>🎹</span>
                  <span>Click on any sharp minor family to see the chords!</span>
                  <span>🎹</span>
                </div>
              </div>
            </div>

            {/* # Minor Family Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'C#-Minor Family', chords: ['C#m-C#,E,G#,C#', 'B-B,D#,F#,B', 'A-A,C#,E,A', 'G#-G#,B,D#,G#', 'C#m-C#,E,G#,C#'] },
                { name: 'D#-Minor Family', chords: ['D#m-D#,F#,A#,D#', 'C-C,E,G,C', 'A#-A#,C#,F,A#', 'G#-G#,B,D#,G#', 'D#m-D#,F#,A#,D#'] },
                { name: 'F#-Minor Family', chords: ['F#m-F#,A,C#,F#', 'D-D,F#,A,D', 'B-B,D#,F#,B', 'A-A,C#,E,A', 'F#m-F#,A,C#,F#'] },
                { name: 'G#-Minor Family', chords: ['G#m-G#,B,D#,G#', 'E-E,G#,B,E', 'C-C,E,G,C', 'A-A,C#,E,A', 'G#m-G#,B,D#,G#'] },
                { name: 'A#-Minor Family', chords: ['A#m-A#,C#,F,A#', 'F#-F#,A#,C#,F#', 'D-D,F#,A,D', 'B-B,D#,F#,B', 'A#m-A#,C#,F,A#'] }
              ].map((family, index) => (
                <div key={family.name} className="group">
                  <SharpFamilyCard family={family} />
                </div>
              ))}
            </div>

            {/* # Minor Family Details Modal */}
            {selectedSharpFamily && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full">
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">🎼 {selectedSharpFamily.name}</h3>
                      <button
                        onClick={() => setSelectedSharpFamily(null)}
                        className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Family Chords Section */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            🎼
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Sharp Minor Family Chords</span>
                        </div>
                        <div className="space-y-1">
                          {selectedSharpFamily.chords.map((chord, index) => (
                            <div key={index} className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200">
                              <div className="flex gap-1 justify-center">
                                {chord.split('-')[1].split(',').map((note, noteIndex) => (
                                  <div key={noteIndex} className="flex flex-col items-center">
                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                                      note.includes('#') || note.includes('b')
                                        ? 'bg-slate-800 dark:bg-slate-800 text-white dark:text-white border-slate-600 dark:border-slate-400' 
                                        : 'bg-white dark:bg-white text-slate-800 dark:text-slate-800 border-slate-300 dark:border-slate-500'
                                    }`}>
                                      {note}
                                    </div>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                                      {noteIndex + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-center text-xs text-slate-600 dark:text-slate-300 mt-1 font-bold">
                                <strong>{chord.split('-')[0]}</strong>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Practice Tip */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            💡
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">Practice Tip</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Practice each sharp minor family chord progression as much you can do!
                        </p>
                      </div>

                      {/* Done Button */}
                      <div className="text-center">
                        <button
                          onClick={() => {
                            markFamilyCompleted(selectedSharpFamily.name);
                            setSelectedSharpFamily(null);
                          }}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
                        >
                          ✅ Done Abhi! I've Learned This Sharp Minor Family Perfectly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Encouragement Footer */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎼 Master the Minor Family Chords!</h3>
              <p className="text-lg mb-6">
                You're learning how minor chords work together! Practice these family progressions regularly and you'll become a complete piano master.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm mb-6">
                <span>🎹</span>
                <span>Keep practicing and never give up!</span>
                <span>🎹</span>
              </div>
              
              {/* Completion and Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    markSectionCompleted('minorFamilyChords');
                  }}
                  disabled={!areAllMinorFamilyChordsCompleted()}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    courseProgress.minorFamilyChords
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : areAllMinorFamilyChordsCompleted()
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {courseProgress.minorFamilyChords 
                    ? '✅ Completed' 
                    : areAllMinorFamilyChordsCompleted()
                    ? '🎯 Mark as Complete'
                    : '🔒 Complete All Minor Families First'
                  }
                </button>
                
                <button
                  onClick={goToNextSection}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all duration-300"
                >
                  ➡️ Next: Inversions
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Check if course is completed
  const checkCourseCompletion = () => {
    const allSectionsCompleted = Object.values(courseProgress).every(completed => completed);
    const allSubsectionsCompleted = Object.values(sectionProgress).every(completed => completed);
    const allScalesCompleted = completedItems.scales.length >= 12; // All major and minor scales
    const allFamiliesCompleted = completedItems.families.length >= 4; // All chord families
    
    return allSectionsCompleted && allSubsectionsCompleted && allScalesCompleted && allFamiliesCompleted;
  };

  // Check for course completion on progress changes
  useEffect(() => {
    if (checkCourseCompletion() && !showCourseCompletionModal) {
      setShowCourseCompletionModal(true);
    }
  }, [courseProgress, sectionProgress, completedItems]);

  const handleCourseCompletion = () => {
    setShowCourseCompletionModal(false);
    setShowRatingModal(true);
  };

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
            {/* Back to Home Button - Desktop */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Home className="h-4 w-4" />
              <span>Back</span>
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
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 text-slate-800 dark:text-white font-medium"
            >
              <Menu className="h-5 w-5" />
              <span>Course Menu</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center gap-2">
              {/* Back to Home Button - Mobile */}
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm"
              >
                <Home className="h-4 w-4" />
                <span>Back</span>
              </button>
              
              {/* Mobile User Menu Button */}
              {currentUser && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 touch-manipulation user-menu-toggle"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      {getUserInitials(currentUser.email || '')}
                    </div>
                  </button>
                  
                  {/* Mobile User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute top-12 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 min-w-48 z-[99999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 animate-in slide-in-from-top-2 duration-200 user-menu-dropdown">
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
                                Free Plan
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            navigate('/psr-i500');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300 mb-2 touch-manipulation active:scale-95"
                        >
                          <Music className="h-4 w-4" />
                          <span>PSR-I500 Styles</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/downloads');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 mb-2 touch-manipulation active:scale-95"
                        >
                          <Download className="h-4 w-4" />
                          <span>Downloads</span>
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 mb-2 touch-manipulation active:scale-95"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                        
                        {/* Theme Toggle in Mobile Menu */}
                        <div className="flex items-center justify-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Left Sidebar Menu - Mobile Responsive */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white dark:bg-slate-800 shadow-lg border-b lg:border-r border-slate-200 dark:border-slate-700 min-h-auto lg:min-h-screen overflow-y-auto max-h-[70vh] lg:max-h-none`}>
          <div className="p-3 sm:p-4 lg:p-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-3 sm:mb-4 lg:mb-6">Course Sections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-2">
              {menuSections.map((section) => {
                const IconComponent = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsMenuOpen(false); // Close menu on mobile when section is selected
                    }}
                    className={`w-full flex flex-col lg:flex-row items-center gap-2 lg:gap-3 p-3 sm:p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-300 touch-manipulation min-h-[44px] ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base font-medium text-center lg:text-left break-words">{section.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Course Progress */}
            <div className="mt-4 sm:mt-6 lg:mt-8 p-3 sm:p-4 bg-slate-50 dark:bg-slate-700 rounded-lg lg:rounded-xl">
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3">Course Progress</h3>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${calculateProgress()}%` }}></div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {calculateProgress()}% Complete (Guided Learning)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Remaining 55% is self-directed practice
              </p>
              
              {/* Progress Details */}
              <div className="mt-3 space-y-1">
                {menuSections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 truncate mr-2">{section.title}</span>
                    {courseProgress[section.id as keyof typeof courseProgress] ? (
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-500 flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Completed Items Summary */}
              {(completedItems.scales.length > 0 || completedItems.families.length > 0) && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Completed Items:</h4>
                  {completedItems.scales.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Scales: {completedItems.scales.length}</p>
                    </div>
                  )}
                  {completedItems.families.length > 0 && (
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Families: {completedItems.families.length}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enrollment Status - Removed since user is already enrolled */}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-2 sm:p-4 lg:p-8 overflow-x-hidden">
          <div
            key={activeSection}
            className="max-w-full"
          >
            {renderContent()}
          </div>

          {/* Course Lessons Section - Removed lesson buttons */}
        </div>
      </div>

      {/* Course Completion Modal */}
      {showCourseCompletionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-2">🎉</div>
                <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-green-100">You've completed the Basic Piano Course!</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎹</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  Course Completed Successfully!
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  You've mastered all the fundamentals of piano playing. 
                  Please share your experience with us!
                </p>
              </div>

              {/* Progress Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">What You've Achieved:</h4>
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>All major and minor scales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Chord families and progressions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Proper hand positioning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Basic music theory</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={handleCourseCompletion}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Rate & Review Course
              </button>
              <button
                onClick={() => setShowCourseCompletionModal(false)}
                className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        courseName="Basic Piano Course"
      />

      {/* Guided Learning Complete Modal */}
      {showGuidedLearningCompleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-[90vw] max-w-md sm:max-w-lg lg:max-w-xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Header with Professional Background */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-6 text-white text-center relative">
              <div className="absolute inset-0 bg-black/10 rounded-t-xl"></div>
              <div className="relative z-10">
                <div className="text-2xl mb-2">🎉</div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-sm sm:text-base opacity-95">You've completed the guided portion (45%) of the Basic Piano Course!</p>
              </div>

            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Important Note */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    ℹ️
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Important Note</h3>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  You still have more to learn! The remaining 55% is self-directed practice.
                </p>
              </div>

              {/* What You've Learned */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    🎹
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">What You've Learned</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Basic piano fundamentals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Major and Minor scales</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Family chords and progressions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Hand positioning and technique</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    🎯
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Next Steps for Remaining 55%</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Keep practicing regularly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Try playing church songs and hymns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Follow professional piano players on YouTube</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Study advanced techniques and music theory</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Practice with different genres and styles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Join piano communities and forums</span>
                  </div>
                </div>
              </div>

              {/* Key Reminder */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    💡
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Key Reminder</h3>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  The remaining 55% is self-directed learning where you apply your knowledge and develop your own style!
                </p>
              </div>

              {/* Final Encouragement */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600 text-center">
                <div className="text-2xl mb-2">🌟</div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">All the best on your continued piano journey!</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Keep practicing and never give up!</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => setShowGuidedLearningCompleteModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base"
              >
                Thank You! I'm Ready to Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default BasicLearning; 
