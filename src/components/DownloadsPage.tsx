import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Download, File, Music, Loader } from 'lucide-react';
import { generateDownloadLink } from '../pages/api/download';

const DownloadsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (currentUser) {
        try {
          const db = getFirestore();
          const userDoc = doc(db, 'users', currentUser.uid);
          const userData = await getDoc(userDoc);
          
          if (userData.exists() && userData.data().hasPurchasedIndianStyles) {
            setHasPurchased(true);
          }
        } catch (error) {
          console.error('Error checking purchase status:', error);
        }
      }
    };

    checkPurchaseStatus();
  }, [currentUser]);

  const handleDownload = async (fileType: 'styles' | 'tones') => {
    if (!currentUser) {
      alert('Please sign in to download files.');
      return;
    }

    if (!hasPurchased) {
      alert('Purchase required to download files.');
      return;
    }

    setIsDownloading(true);
    try {
      const data = await generateDownloadLink({
        fileType,
        userId: currentUser.uid,
      });
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Downloading ${data.fileName}...`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in to access your downloads.
          </p>
        </div>
      </div>
    );
  }

  if (!hasPurchased) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Purchase Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to purchase the Indian Styles package to access downloads.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Your Downloads
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Download your purchased Indian Styles and Tones
            </p>
          </div>

          {/* Download Cards */}
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
                    Complete collection of Indian styles
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <File className="w-4 h-4 mr-2" />
                  <span>30+ Indian Styles</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Download className="w-4 h-4 mr-2" />
                  <span>ZIP file format</span>
                </div>
              </div>

              <button
                onClick={() => handleDownload('styles')}
                disabled={isDownloading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isDownloading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Styles
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
                    Premium Indian instrument tones
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <File className="w-4 h-4 mr-2" />
                  <span>20+ Indian Tones</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Download className="w-4 h-4 mr-2" />
                  <span>ZIP file format</span>
                </div>
              </div>

              <button
                onClick={() => handleDownload('tones')}
                disabled={isDownloading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isDownloading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Tones
                  </>
                )}
              </button>
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
