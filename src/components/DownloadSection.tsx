import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Lock, Crown, AlertCircle, Music, FileText, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DownloadItem {
  id: string;
  name: string;
  description: string;
  fileType: 'pdf' | 'styles' | 'tones';
  fileSize: string;
  requiredPlan: 'intermediate' | 'advanced' | 'styles-tones';
  downloadUrl: string;
  isActive: boolean;
  createdAt: any;
}

const DownloadSection: React.FC = () => {
  const { currentUser } = useAuth();
  const { hasSubscription } = usePayment();
  const navigate = useNavigate();
  const { goBack } = useNavigation();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [files, setFiles] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      // First, let's get all files without the isActive filter to debug
      const filesQuery = query(
        collection(db, 'downloadableFiles'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(filesQuery);
      const filesData: DownloadItem[] = [];
      
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
      setLoading(false);
    }
  };

  const hasRequiredPlan = (requiredPlan: 'intermediate' | 'advanced' | 'styles-tones') => {
    if (!currentUser) return false;
    
    switch (requiredPlan) {
      case 'intermediate':
        return hasSubscription('intermediate');
      case 'advanced':
        return hasSubscription('advanced');
      case 'styles-tones':
        // Check if user has purchased styles and tones (this would need to be implemented based on your purchase system)
        // For now, we'll check if they have any subscription
        return hasSubscription('intermediate') || hasSubscription('advanced');
      default:
        return false;
    }
  };

  // Function to get the correct display name for required plan based on file type
  const getDisplayPlanName = (fileType: string, requiredPlan: string) => {
    if (fileType === 'pdf') {
      // For PDF files, show the actual course name instead of styles-tones
      switch (requiredPlan) {
        case 'intermediate':
          return '';
        case 'advanced':
          return '';
        case 'styles-tones':
          return ''; // Default to intermediate for PDFs
        default:
          return '';
      }
    } else {
      // For styles and tones files, show the original plan name
      return requiredPlan === 'styles-tones' ? 'Styles & Tones' : requiredPlan;
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'styles': return <Music className="h-5 w-5" />;
      case 'tones': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const handleDownload = async (item: DownloadItem) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!hasRequiredPlan(item.requiredPlan)) {
      // Redirect to appropriate purchase page based on required plan
      if (item.requiredPlan === 'styles-tones') {
        navigate('/psr-i500');
      } else {
        navigate('/pricing');
      }
      return;
    }

    console.log('Starting download for:', item.id, item.name);
    setDownloading(item.id);
    
    try {
      // Mobile-friendly download implementation
      const downloadFile = (url: string, filename: string) => {
        // Check if it's a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // For mobile devices, try multiple approaches
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
            if (window.confirm('Automatic download failed. Would you like to see the manual download instructions?')) {
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
      downloadFile(item.downloadUrl, item.name);

      alert(`✅ ${item.name} downloaded successfully!`);
      
      // Log download for analytics
      console.log(`User ${currentUser.uid} downloaded: ${item.name}`);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'intermediate': return '';
      case 'advanced': return '';
      case 'styles-tones': return '';
      default: return '';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'intermediate': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
      case 'advanced': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'styles-tones': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                Downloads Center
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Access your course materials and resources
              </p>
            </div>
            <motion.button
              onClick={goBack}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Access Notice */}
        {!currentUser && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                Login Required
              </h3>
            </div>
            <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
              Please log in to access downloads. Some materials require a purchase.
            </p>
            <motion.button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Login Now
            </motion.button>
          </div>
        )}

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading files...</p>
            </motion.div>
          ) : (
            files.map((item, index) => {
              const hasAccess = hasRequiredPlan(item.requiredPlan);
              const isDownloading = downloading === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border-2 ${
                    hasAccess ? 'border-green-200 dark:border-green-800' : 'border-slate-200 dark:border-slate-700'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-500">{getFileTypeIcon(item.fileType)}</span>
                        <h3 className="font-semibold text-slate-800 dark:text-white">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>{item.fileSize}</span>
                                                 <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(item.requiredPlan)}`}>
                           {getPlanIcon(item.requiredPlan)} {getDisplayPlanName(item.fileType, item.requiredPlan)}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    {hasAccess ? (
                      <motion.button
                        onClick={() => handleDownload(item)}
                        disabled={isDownloading}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                          isDownloading
                            ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white'
                        }`}
                        whileHover={!isDownloading ? { scale: 1.05, y: -2 } : {}}
                        whileTap={!isDownloading ? { scale: 0.95 } : {}}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {isDownloading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Lock className="h-4 w-4" />
                          <span className="text-sm">
                            Purchase Required
                          </span>
                        </div>
                        <motion.button
                          onClick={() => item.requiredPlan === 'styles-tones' ? navigate('/psr-i500') : navigate('/pricing')}
                          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-center"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <Crown className="h-4 w-4 mr-1" />
                          Purchase
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Show message if no files are available */}
        {currentUser && !loading && files.length === 0 && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No downloadable files are available at the moment. Check back later for new content.
            </p>
          </motion.div>
        )}

        {/* Purchase Info */}
        {currentUser && files.length > 0 && (
          <motion.div 
            className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
          >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
              Need More Access?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Purchase Intermediate or Advanced courses to access PDF materials, or Styles & Tones for exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                View Courses
              </motion.button>
              <motion.button
                onClick={() => navigate('/psr-i500')}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                Styles & Tones
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DownloadSection; 
