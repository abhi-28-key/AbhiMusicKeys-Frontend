import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Music, FileText, Star, Clock, Users } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';

const DownloadPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { goBack } = useNavigation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // If paymentId is provided, verify it
    if (paymentId) {
      verifyPayment(paymentId);
    } else {
      // Check if user has any valid purchases
      checkUserPurchases();
    }
  }, [currentUser, navigate, paymentId]);

  const verifyPayment = async (paymentId: string) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/verify-download-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          paymentId: paymentId
        }),
      });

      if (!response.ok) {
        alert('Access denied. Please complete a purchase first.');
        navigate('/psr-i500');
        return;
      }

      const data = await response.json();
      if (!data.success) {
        alert('Access denied. Please complete a purchase first.');
        navigate('/psr-i500');
        return;
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Access denied. Please complete a purchase first.');
      navigate('/psr-i500');
      return;
    }
  };

  const checkUserPurchases = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/user-purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid
        }),
      });

      if (!response.ok) {
        alert('Access denied. Please complete a purchase first.');
        navigate('/psr-i500');
        return;
      }

      const data = await response.json();
      if (!data.success || data.purchases.length === 0) {
        alert('Access denied. Please complete a purchase first.');
        navigate('/psr-i500');
        return;
      }

      // User has valid purchases, allow access
      console.log('User has valid purchases:', data.purchases);
    } catch (error) {
      console.error('Purchase check failed:', error);
      alert('Access denied. Please complete a purchase first.');
      navigate('/psr-i500');
      return;
    }
  };

  const handleDownload = async (fileType: 'styles' | 'tones') => {
    if (!currentUser) {
      alert('Please login to download files');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call backend API to get download link
      const response = await fetch(`http://localhost:5000/api/download/${fileType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          fileType: fileType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get download link');
      }

      const downloadData = await response.json();

      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadData.downloadUrl;
      link.download = downloadData.fileName;
      link.target = '_blank'; // Open in new tab for external URLs
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      setTimeout(() => {
        alert(`✅ ${fileType === 'styles' ? 'Indian Styles' : 'Indian Tones'} downloaded successfully!`);
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {/* Background with Piano Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-indigo-900/50 to-slate-800/60"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/90 via-indigo-800/90 to-slate-900/90"></div>
          <div className="relative flex justify-between items-center p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wider">
                <span className="bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent">
                  Payment Successful!
                </span>
              </h1>
            </div>
            <button
              onClick={goBack}
              className="text-white hover:text-green-300 transition-colors duration-300 text-sm sm:text-base px-3 py-2 rounded-lg hover:bg-white/10"
            >
              ← Back
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Payment Successful! 🎉
              </h2>
                             <p className="text-lg sm:text-xl text-white/80 mb-4">
                 Thank you for your purchase! Your Indian Styles Package is ready for download with lifetime access.
               </p>
              {paymentId && (
                <p className="text-sm text-white/60">
                  Payment ID: {paymentId}
                </p>
              )}
            </motion.div>

            {/* Download Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            >
              {/* Indian Styles Download */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-green-400/50 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Indian Styles Package
                  </h3>
                  <p className="text-white/80 mb-4">
                    30+ Indian Styles with Free Voices Included
                  </p>
                  
                  {/* Download Progress */}
                  {isDownloading && (
                    <div className="mb-4">
                      <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-white/60">Downloading... {downloadProgress}%</p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleDownload('styles')}
                    disabled={isDownloading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-5 w-5 inline mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download Indian Styles'}
                  </button>
                </div>
              </motion.div>

              {/* Indian Tones Download */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-green-400/50 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Indian Tones Package
                  </h3>
                  <p className="text-white/80 mb-4">
                    Complete Indian Tones Collection with Voice Samples
                  </p>
                  
                  <button
                    onClick={() => handleDownload('tones')}
                    disabled={isDownloading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-5 w-5 inline mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download Indian Tones'}
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-12"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">
                What You Get
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">30+ Styles</h4>
                  <p className="text-sm text-white/60">Professional Indian Styles</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Music className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Free Voices</h4>
                  <p className="text-sm text-white/60">Included Voice Samples</p>
                </div>
                                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                   <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                   <h4 className="font-semibold text-white mb-1">Lifetime Access</h4>
                   <p className="text-sm text-white/60">Download Forever</p>
                 </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Support</h4>
                  <p className="text-sm text-white/60">Email Support</p>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 sm:mt-12 text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                  📋 Instructions
                </h3>
                                 <div className="text-white/80 text-sm sm:text-base space-y-2">
                   <p>1. Click the download buttons above to get your files</p>
                   <p>2. Extract the ZIP files to your computer</p>
                   <p>3. Copy all the styles in pendrive paste those normally</p>
                   <p>4. Create new Folder For voices Named as "USER FILES" in this folder copy only tones</p>
                   <p>5. Copy the styles/tones to your keyboard's memory</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DownloadPage; 