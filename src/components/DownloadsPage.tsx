import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Download, File, Music, Loader, ArrowLeft, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';
import { ThemeToggle } from './ui/theme-toggle';
import { getUserPlanStatus, hasPlanAccess } from '../utils/userPlanUtils';

const DownloadsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { goBack } = useNavigation();
  const [isDownloadingStyles, setIsDownloadingStyles] = useState(false);
  const [isDownloadingTones, setIsDownloadingTones] = useState(false);
  const [isDownloadingFile, setIsDownloadingFile] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  // Function to fetch files from admin dashboard
  const fetchFiles = async () => {
    try {
      console.log('Fetching files from admin dashboard...');
      const db = getFirestore();
      const filesQuery = query(
        collection(db, 'downloadableFiles'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(filesQuery);
      const filesData: any[] = [];
      
      console.log('Total files found:', snapshot.size);
      
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log('File data:', data);
        
        // Only include files that are active (default to true if not specified)
        const isActive = data.isActive !== false;
        
        if (isActive) {
          filesData.push({
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            fileType: data.fileType || 'pdf',
            fileSize: data.fileSize || '0 MB',
            downloadUrl: data.downloadUrl || '',
            requiredPlan: data.requiredPlan || 'intermediate',
            isActive: isActive,
            createdAt: data.createdAt
          });
        }
      });
      
      console.log('Active files:', filesData.length);
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    const initializePage = () => {
      if (currentUser) {
        console.log('User logged in, fetching files...');
        setIsCheckingAccess(false);
        // Always fetch files for logged-in users
        fetchFiles();
        
        // Sync purchase status from Firestore to localStorage
        syncPurchaseStatus();
      } else {
        // No user logged in
        setIsCheckingAccess(false);
        console.log('❌ No user logged in');
      }
    };

    initializePage();
  }, [currentUser]);

  // Function to sync purchase status from Firestore to localStorage
  const syncPurchaseStatus = async () => {
    if (!currentUser) return;
    
    try {
      const db = getFirestore();
      const userDoc = doc(db, 'users', currentUser.uid);
      const userData = await getDoc(userDoc);
      
      if (userData.exists()) {
        const data = userData.data();
        console.log('Syncing purchase status from Firestore:', data);
        
        // Check and sync styles & tones access
        const hasPurchasedIndianStyles = data.hasPurchasedIndianStyles || false;
        const hasStylesTonesAccess = data.hasStylesTonesAccess || false;
        const hasIndianStylesAccess = data.hasIndianStylesAccess || false;
        const purchaseStatus = data.purchaseStatus || {};
        
        const hasStylesTones = hasPurchasedIndianStyles || hasStylesTonesAccess || hasIndianStylesAccess || 
                              purchaseStatus.stylesTones || purchaseStatus.indianStyles;
        
        if (hasStylesTones) {
          localStorage.setItem(`styles_tones_access_${currentUser.uid}`, 'true');
          localStorage.setItem(`indian_styles_access_${currentUser.uid}`, 'true');
          console.log('✅ Styles & Tones access synced to localStorage');
        }
        
        // Check and sync advanced access
        const hasAdvancedAccess = data.hasAdvancedAccess || false;
        const hasAdvanced = hasAdvancedAccess || purchaseStatus.advanced;
        
        if (hasAdvanced) {
          localStorage.setItem(`advanced_access_${currentUser.uid}`, 'true');
          console.log('✅ Advanced access synced to localStorage');
        }
      }
    } catch (error) {
      console.error('Error syncing purchase status:', error);
    }
  };

  // Initialize theme state
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

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

  // Handle mobile menu toggle with better touch support
  const handleMobileMenuToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  // Unified mobile menu button handler
  const handleMobileMenuButton = (action: () => void) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close menu first
    setShowUserMenu(false);
    
    // Execute action with a small delay to ensure menu closes
    setTimeout(() => {
      action();
    }, 100);
  };

  const handleDownload = async (fileType: 'styles' | 'tones') => {
    if (!currentUser) {
      alert('Please sign in to download files.');
      return;
    }

    try {
      // Set specific loading state based on file type
      if (fileType === 'styles') {
        setIsDownloadingStyles(true);
      } else if (fileType === 'tones') {
        setIsDownloadingTones(true);
      }

      // Use the enhanced purchase verification system
      const hasAccess = await hasPlanAccess(currentUser, 'styles-tones');
      
      console.log('Purchase status check for styles-tones:', hasAccess);
      console.log('Current user:', currentUser.uid);
      console.log('localStorage styles_tones_access:', localStorage.getItem(`styles_tones_access_${currentUser.uid}`));
      console.log('localStorage indian_styles_access:', localStorage.getItem(`indian_styles_access_${currentUser.uid}`));

    if (!hasAccess) {
      // Redirect to PSR-I500 page for styles & tones
      alert('PSR-I500 Styles & Tones purchase required to download this file. Redirecting...');
      navigate('/psr-i500');
      return;
    }

      console.log('✅ Purchase verified, proceeding with download');
      
      // Determine the correct API URL for development vs production
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiBaseUrl = isDevelopment 
        ? 'http://localhost:5000' 
        : 'https://abhimusickeys-backend.onrender.com'; // Your deployed backend URL
      
      // Call backend API to get download link
      const response = await fetch(`${apiBaseUrl}/api/download/${fileType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get download link');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Download failed');
      }
      
      // Mobile-friendly download implementation
      const downloadFile = (url: string, filename: string) => {
        // Check if it's a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // For mobile devices, provide better handling for ZIP files
          const isZipFile = filename.toLowerCase().includes('.zip');
          
          if (isZipFile) {
            // Try to copy link to clipboard first
            const copyToClipboard = async (text: string) => {
              try {
                if (navigator.clipboard && window.isSecureContext) {
                  await navigator.clipboard.writeText(text);
                  return true;
                } else {
                  // Fallback for older browsers
                  const textArea = document.createElement('textarea');
                  textArea.value = text;
                  textArea.style.position = 'fixed';
                  textArea.style.left = '-999999px';
                  textArea.style.top = '-999999px';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  const result = document.execCommand('copy');
                  document.body.removeChild(textArea);
                  return result;
                }
              } catch (err) {
                console.error('Failed to copy: ', err);
                return false;
              }
            };
            
            // Copy link to clipboard
            copyToClipboard(url).then((success) => {
              if (success) {
                const mobileZipInstructions = `📱 Mobile Download Instructions for ${filename}:\n\n` +
                  `✅ Download link copied to clipboard!\n\n` +
                  `Since this is a ZIP file, mobile browsers cannot open it directly.\n\n` +
                  `📋 Next Steps:\n` +
                  `1. Open your file manager app\n` +
                  `2. Paste the copied link to download\n` +
                  `3. Use a ZIP extractor app to open the file\n\n` +
                  `🔗 Direct Download Link:\n${url}\n\n` +
                  `💡 Alternative Methods:\n` +
                  // `• Use a ZIP extractor app from your app store\n` +
                  `• Download on a computer and transfer to your phone`;
                
                alert(mobileZipInstructions);
              } else {
                // Fallback if clipboard copy fails
                const mobileZipInstructions = `📱 Mobile Download Instructions for ${filename}:\n\n` +
                  `Since this is a ZIP file, mobile browsers cannot open it directly.\n\n` +
                  `✅ Recommended Methods:\n` +
                  // `1. Use a file manager app (like Files, My Files, or Documents)\n` +
                  // `2. Use a ZIP extractor app from your app store\n` +
                  `3. Download on a computer and transfer to your phone\n\n` +
                  `🔗 Direct Download Link:\n${url}\n\n` +
                  `📋 Alternative Steps:\n` +
                  `1. Long press and select "Copy" on the link above\n` +
                  `2. Open your file manager app\n` +
                  `3. Paste the link to download\n` +
                  `4. Use a ZIP extractor app to open the file`;
                
                // Show the instructions first
                alert(mobileZipInstructions);
                
                // Then show a second alert with just the link for easy copying
                const copyLinkMessage = `🔗 Copy this download link:\n\n${url}\n\n` +
                  `📋 Instructions:\n` +
                  `1. Long press and select "Copy"\n` +
                  `2. Open your file manager app\n` +
                  `3. Paste the link to download\n` +
                  `4. Use a ZIP extractor app to open the file`;
                
                setTimeout(() => {
                  alert(copyLinkMessage);
                }, 500);
              }
            });
            
            return;
          }
          
          // For non-ZIP files, try the normal mobile download
          let downloadStarted = false;
          
          // First, try to open in new tab/window
          const newWindow = window.open(url, '_blank');
          if (newWindow) {
            downloadStarted = true;
            // Close the window after a short delay to avoid cluttering
            setTimeout(() => {
              try {
                newWindow.close();
              } catch (e) {
                // Window might already be closed
              }
            }, 2000);
          }
          
          // If popup was blocked or failed, show manual instructions
          if (!downloadStarted) {
            const manualDownloadMessage = `Download Link for ${filename}:\n\n${url}\n\nInstructions:\n1. Copy the link above\n2. Open a new tab in your browser\n3. Paste the link and press Enter\n4. The file should download automatically\n\nIf you're still having issues, try:\n- Using a different browser\n- Checking your download settings\n- Ensuring you have enough storage space`;
            
            // Show the message in a more user-friendly way
            const userWantsInstructions = window.confirm('Automatic download failed. Would you like to see the manual download instructions?');
            if (userWantsInstructions) {
              alert(manualDownloadMessage);
            }
          }
        } else {
          // For desktop, use the traditional method
      const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
        }
      };

      // Trigger the download
      downloadFile(data.downloadUrl, data.fileName);

      alert(`Downloading ${data.fileName}...`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      // Reset specific loading state
      if (fileType === 'styles') {
        setIsDownloadingStyles(false);
      } else if (fileType === 'tones') {
        setIsDownloadingTones(false);
      }
    }
  };

  const handleDownloadFile = async (file: any) => {
    if (!currentUser) {
      alert('Please sign in to download files.');
      return;
    }

    // Enhanced purchase verification - prioritize Firestore over localStorage
    const checkPurchaseStatus = async () => {
      try {
        const db = getFirestore();
        const userDoc = doc(db, 'users', currentUser.uid);
        const userData = await getDoc(userDoc);
        
        if (userData.exists()) {
          const data = userData.data();
          console.log('User data from Firestore for file download:', data);
          
          // Check multiple purchase indicators in Firestore
          const hasPurchasedIndianStyles = data.hasPurchasedIndianStyles || false;
          const hasStylesTonesAccess = data.hasStylesTonesAccess || false;
          const hasIndianStylesAccess = data.hasIndianStylesAccess || false;
          const hasAdvancedAccess = data.hasAdvancedAccess || false;
          const purchaseStatus = data.purchaseStatus || {};
          
          return {
            stylesTones: hasPurchasedIndianStyles || hasStylesTonesAccess || hasIndianStylesAccess || 
                        purchaseStatus.stylesTones || purchaseStatus.indianStyles,
            advanced: hasAdvancedAccess || purchaseStatus.advanced
          };
        }
        
        return { stylesTones: false, advanced: false };
      } catch (error) {
        console.error('Error checking Firestore purchase status:', error);
        return { stylesTones: false, advanced: false };
      }
    };

    // Check localStorage as fallback
    const checkLocalStorageAccess = () => {
      const stylesTonesAccess = localStorage.getItem(`styles_tones_access_${currentUser.uid}`);
      const enrolledStylesTones = localStorage.getItem(`enrolled_${currentUser.uid}_styles_tones`);
      const indianStylesAccess = localStorage.getItem(`indian_styles_access_${currentUser.uid}`);
      const enrolledIndianStyles = localStorage.getItem(`enrolled_${currentUser.uid}_indian_styles`);
      const advancedAccess = localStorage.getItem(`advanced_access_${currentUser.uid}`);
      const enrolledAdvanced = localStorage.getItem(`enrolled_${currentUser.uid}_advanced`);
      
      return {
        stylesTones: stylesTonesAccess === 'true' || enrolledStylesTones === 'true' || 
                    indianStylesAccess === 'true' || enrolledIndianStyles === 'true',
        advanced: advancedAccess === 'true' || enrolledAdvanced === 'true'
      };
    };

    // Determine file category and required access
    const fileName = file.name?.toLowerCase() || '';
    const fileCategory = file.category?.toLowerCase() || '';
    
    // Check if this is a styles & tones file
    const isStylesAndTones = fileName.includes('style') || fileName.includes('tone') || 
                             fileCategory.includes('style') || fileCategory.includes('tone') ||
                             fileCategory.includes('indian');

    // Check if this is an advanced course file (PDF, advanced materials)
    const isAdvancedCourse = fileName.includes('.pdf') || fileName.includes('advanced') ||
                            fileCategory.includes('advanced') || fileCategory.includes('pdf');

    // Check purchase status - prioritize Firestore
    let hasAccess = false;
    let redirectPage = '/pricing'; // Default redirect

    // First check Firestore (primary source of truth)
    const firestoreAccess = await checkPurchaseStatus();
    
    // If Firestore doesn't show access, check localStorage as fallback
    const localStorageAccess = checkLocalStorageAccess();
    
    if (isStylesAndTones) {
      hasAccess = firestoreAccess.stylesTones || localStorageAccess.stylesTones;
      redirectPage = '/psr-i500';
    } else if (isAdvancedCourse) {
      hasAccess = firestoreAccess.advanced || localStorageAccess.advanced;
      redirectPage = '/pricing';
    } else {
      // For other files, check both access types (more permissive)
      hasAccess = firestoreAccess.stylesTones || firestoreAccess.advanced || 
                  localStorageAccess.stylesTones || localStorageAccess.advanced;
      redirectPage = '/pricing';
    }

    // Sync Firestore access to localStorage if found
    if (firestoreAccess.stylesTones && !localStorageAccess.stylesTones) {
      localStorage.setItem(`styles_tones_access_${currentUser.uid}`, 'true');
      localStorage.setItem(`indian_styles_access_${currentUser.uid}`, 'true');
      console.log('✅ Styles & Tones access synced from Firestore to localStorage');
    }
    
    if (firestoreAccess.advanced && !localStorageAccess.advanced) {
      localStorage.setItem(`advanced_access_${currentUser.uid}`, 'true');
      console.log('✅ Advanced access synced from Firestore to localStorage');
    }

    if (!hasAccess) {
      // Redirect to appropriate page based on file type
      if (isStylesAndTones) {
        alert('PSR-I500 Styles & Tones purchase required to download this file. Redirecting...');
        navigate('/psr-i500');
      } else if (isAdvancedCourse) {
        alert('Advanced Course purchase required to download this file. Redirecting to pricing page...');
        navigate('/pricing');
      } else {
        alert('Purchase required to download this file. Redirecting to pricing page...');
        navigate('/pricing');
      }
      return;
    }

    console.log('✅ Purchase verified for file download, proceeding');

    setIsDownloadingFile(true);
    try {
      console.log('Downloading file:', file);
      
      // Mobile-friendly download implementation
      const downloadFile = (url: string, filename: string) => {
        // Check if it's a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // For mobile devices, provide better handling for ZIP files
          const isZipFile = filename.toLowerCase().includes('.zip');
          
          if (isZipFile) {
            // Try to copy link to clipboard first
            const copyToClipboard = async (text: string) => {
              try {
                if (navigator.clipboard && window.isSecureContext) {
                  await navigator.clipboard.writeText(text);
                  return true;
                } else {
                  // Fallback for older browsers
                  const textArea = document.createElement('textarea');
                  textArea.value = text;
                  textArea.style.position = 'fixed';
                  textArea.style.left = '-999999px';
                  textArea.style.top = '-999999px';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  const result = document.execCommand('copy');
                  document.body.removeChild(textArea);
                  return result;
                }
              } catch (err) {
                console.error('Failed to copy: ', err);
                return false;
              }
            };
            
            // Copy link to clipboard
            copyToClipboard(url).then((success) => {
              if (success) {
                const mobileZipInstructions = `📱 Mobile Download Instructions for ${filename}:\n\n` +
                  `✅ Download link copied to clipboard!\n\n` +
                  `Since this is a ZIP file, mobile browsers cannot open it directly.\n\n` +
                  `📋 Next Steps:\n` +
                  `1. Open your file manager app\n` +
                  `2. Paste the copied link to download\n` +
                  `3. Use a ZIP extractor app to open the file\n\n` +
                  `🔗 Direct Download Link:\n${url}\n\n` +
                  `💡 Alternative Methods:\n` +
                  `• Use a ZIP extractor app from your app store\n` +
                  `• Download on a computer and transfer to your phone`;
                
                alert(mobileZipInstructions);
              } else {
                // Fallback if clipboard copy fails
                const mobileZipInstructions = `📱 Mobile Download Instructions for ${filename}:\n\n` +
                  `Since this is a ZIP file, mobile browsers cannot open it directly.\n\n` +
                  `✅ Recommended Methods:\n` +
                  `1. Use a file manager app (like Files, My Files, or Documents)\n` +
                  `2. Use a ZIP extractor app from your app store\n` +
                  `3. Download on a computer and transfer to your phone\n\n` +
                  `🔗 Direct Download Link:\n${url}\n\n` +
                  `📋 Alternative Steps:\n` +
                  `1. Long press and select "Copy" on the link above\n` +
                  `2. Open your file manager app\n` +
                  `3. Paste the link to download\n` +
                  `4. Use a ZIP extractor app to open the file`;
                
                // Show the instructions first
                alert(mobileZipInstructions);
                
                // Then show a second alert with just the link for easy copying
                const copyLinkMessage = `🔗 Copy this download link:\n\n${url}\n\n` +
                  `📋 Instructions:\n` +
                  `1. Long press and select "Copy"\n` +
                  `2. Open your file manager app\n` +
                  `3. Paste the link to download\n` +
                  `4. Use a ZIP extractor app to open the file`;
                
                setTimeout(() => {
                  alert(copyLinkMessage);
                }, 500);
              }
            });
            
            return;
          }
          
          // For non-ZIP files, try the normal mobile download
          let downloadStarted = false;
          
          // First, try to open in new tab/window
          const newWindow = window.open(url, '_blank');
          if (newWindow) {
            downloadStarted = true;
            // Close the window after a short delay to avoid cluttering
            setTimeout(() => {
              try {
                newWindow.close();
              } catch (e) {
                // Window might already be closed
              }
            }, 2000);
          }
          
          // If popup was blocked or failed, show manual instructions
          if (!downloadStarted) {
            const manualDownloadMessage = `Download Link for ${filename}:\n\n${url}\n\nInstructions:\n1. Copy the link above\n2. Open a new tab in your browser\n3. Paste the link and press Enter\n4. The file should download automatically\n\nIf you're still having issues, try:\n- Using a different browser\n- Checking your download settings\n- Ensuring you have enough storage space`;
            
            // Show the message in a more user-friendly way
            const userWantsInstructions = window.confirm('Automatic download failed. Would you like to see the manual download instructions?');
            if (userWantsInstructions) {
              alert(manualDownloadMessage);
            }
          }
        } else {
          // For desktop, use the traditional method
      const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
        }
      };

      // Trigger the download
      downloadFile(file.downloadUrl, file.name);

      alert(`Downloading ${file.name}...`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloadingFile(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              
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
              </div>
            )}
          </div>
        </header>

        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Sign In Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to access your downloads.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              
              {currentUser ? (
                <div className="relative user-menu">
                  {/* User Avatar with Dropdown */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleMobileMenuToggle}
                      onTouchEnd={handleMobileMenuToggle}
                      className="flex items-center gap-2 hover:scale-105 transition-all duration-300 user-menu-toggle touch-manipulation"
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
                                Premium
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
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300 hover:scale-105 group mb-2 touch-manipulation active:scale-95"
                        >
                          <Music className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">PSR-I500 Styles</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 hover:scale-105 group touch-manipulation active:scale-95"
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
                onClick={handleMobileMenuToggle}
                onTouchEnd={handleMobileMenuToggle}
                className="p-2 text-white hover:text-blue-200 transition-colors duration-300 touch-manipulation user-menu-toggle"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {showUserMenu && (
              <div className="md:hidden absolute top-16 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 min-w-48 z-[99999] backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 animate-in slide-in-from-top-2 duration-200 user-menu-dropdown">
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
                            Premium
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMobileMenuButton(() => navigate('/psr-i500'))}
                      onTouchEnd={() => handleMobileMenuButton(() => navigate('/psr-i500'))}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300 mb-2 touch-manipulation active:scale-95"
                    >
                      <Music className="h-4 w-4" />
                      <span>PSR-I500 Styles</span>
                    </button>
                    <button
                      onClick={() => handleMobileMenuButton(handleLogout)}
                      onTouchEnd={() => handleMobileMenuButton(handleLogout)}
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
                ) : (
                  <div className="p-4">
                    <button
                      onClick={handleMobileMenuButton(() => navigate('/login'))}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-300 mb-2 touch-manipulation active:scale-95"
                    >
                      <span>Login</span>
                    </button>
                    <button
                      onClick={handleMobileMenuButton(() => navigate('/signup'))}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 mb-2 touch-manipulation active:scale-95"
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

        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Checking Access...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Verifying your purchase status...
            </p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
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
                              Premium
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
                          Premium
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

             <div className="container mx-auto px-4 py-8">
         <div className="max-w-4xl mx-auto">
           {/* Header */}
           <div className="text-center mb-12">
             <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 dark:text-white mb-4">
               Your Downloads
             </h1>
             <p className="text-lg text-gray-600 dark:text-gray-300">
               Download your purchased files
             </p>
           </div>

           {/* Loading State */}
           {loadingFiles && (
             <div className="text-center py-12">
               <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
               <p className="text-gray-600 dark:text-gray-300">Loading your files...</p>
             </div>
           )}

                       {/* Pre-set Styles & Tones Download Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Styles Download */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                    <Music className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Indian Styles Package
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Complete collection of Indian musical styles
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <File className="w-4 h-4 mr-2" />
                    <span>STYLES File</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Download className="w-4 h-4 mr-2" />
                    <span>Premium Quality</span>
                  </div>
                </div>

                                 <button
                   onClick={() => handleDownload('styles')}
                   disabled={isDownloadingStyles}
                   className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center"
                 >
                   {isDownloadingStyles ? (
                     <>
                       <Loader className="w-5 h-5 mr-2 animate-spin" />
                       Downloading...
                     </>
                   ) : (
                     <>
                       <Download className="w-5 h-5 mr-2" />
                       Download Styles Package
                     </>
                   )}
                 </button>
              </div>

              {/* Tones Download */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
                    <Music className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Indian Tones Package
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Authentic Indian musical tones collection
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <File className="w-4 h-4 mr-2" />
                    <span>TONES File</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Download className="w-4 h-4 mr-2" />
                    <span>Premium Quality</span>
                  </div>
                </div>

                                 <button
                   onClick={() => handleDownload('tones')}
                   disabled={isDownloadingTones}
                   className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center"
                 >
                   {isDownloadingTones ? (
                     <>
                       <Loader className="w-5 h-5 mr-2 animate-spin" />
                       Downloading...
                     </>
                   ) : (
                     <>
                       <Download className="w-5 h-5 mr-2" />
                       Download Tones Package
                     </>
                   )}
                 </button>
              </div>
            </div>

            {/* Files from Admin Dashboard */}
            {!loadingFiles && files.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                  Additional Files from Admin
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {files.map((file) => (
                    <div key={file.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-6">
                        <div className={`p-3 rounded-lg mr-4 ${
                          file.fileType === 'styles' ? 'bg-blue-100 dark:bg-blue-900' :
                          file.fileType === 'tones' ? 'bg-green-100 dark:bg-green-900' :
                          'bg-purple-100 dark:bg-purple-900'
                        }`}>
                          <Music className={`w-8 h-8 ${
                            file.fileType === 'styles' ? 'text-blue-600 dark:text-blue-400' :
                            file.fileType === 'tones' ? 'text-green-600 dark:text-green-400' :
                            'text-purple-600 dark:text-purple-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {file.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {file.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <File className="w-4 h-4 mr-2" />
                          <span>{file.fileType.toUpperCase()} File</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Download className="w-4 h-4 mr-2" />
                          <span>{file.fileSize}</span>
                        </div>
                      </div>

                                             <button
                         onClick={() => handleDownloadFile(file)}
                         disabled={isDownloadingFile}
                         className={`w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
                           file.fileType === 'styles' ? 'bg-blue-600 hover:bg-blue-700' :
                           file.fileType === 'tones' ? 'bg-green-600 hover:bg-green-700' :
                           'bg-purple-600 hover:bg-purple-700'
                         } disabled:bg-gray-400 text-white`}
                       >
                         {isDownloadingFile ? (
                           <>
                             <Loader className="w-5 h-5 mr-2 animate-spin" />
                             Downloading...
                           </>
                         ) : (
                           <>
                             <Download className="w-5 h-5 mr-2" />
                             Download {file.name}
                           </>
                         )}
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

           {/* No Files Message */}
           {!loadingFiles && files.length === 0 && (
             <div className="text-center py-12">
               <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
               <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                 No Files Available
               </h3>
               <p className="text-gray-600 dark:text-gray-300">
                 No downloadable files are currently available. Please check back later.
               </p>
             </div>
           )}

          {/* Mobile ZIP File Note */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  📱 Mobile Users - Important Note
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    These are ZIP files that mobile browsers cannot open directly. For the best experience:
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Use a file manager app or ZIP extractor app</li>
                    <li>Download on a computer and transfer to your phone</li>
                    <li>Use the direct download links provided when you click download</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Installation Instructions
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-start">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                  1
                </span>
                <p>Download both ZIP files to your computer</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                  2
                </span>
                <p>Extract the ZIP files using WinRAR, 7-Zip, or your system's built-in extractor</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                  3
                </span>
                <p>Copy the extracted files to your PSR-I500 keyboard's USB drive or SD card</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                  4
                </span>
                <p>Insert the USB drive or SD card into your keyboard and load the styles/tones</p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-300">
              Need help? Contact us at{' '}
              <a href="mailto:support@abhimusickeys.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                support@abhimusickeys.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage; 
