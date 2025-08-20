import React, { useState , useEffect} from 'react';
import { Play, ExternalLink, Clock, BookOpen, Loader2, Video, Check } from 'lucide-react';

interface GoogleDriveVideoProps {
  title: string;
  description: string;
  driveVideoId: string;
  duration?: string;
  thumbnail?: string;
  isPremium?: boolean;
  onPlay?: () => void;
  onVideoComplete?: () => void;
  sectionId?: string;
}

const GoogleDriveVideo: React.FC<GoogleDriveVideoProps> = ({
  title,
  description,
  driveVideoId,
  duration = "10:00",
  thumbnail,
  isPremium = false,
  onPlay,
  onVideoComplete,
  sectionId
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVideoWatched, setIsVideoWatched] = useState(false);

  // Check if video was already watched (from localStorage)
  useEffect(() => {
    if (sectionId) {
      const savedProgress = localStorage.getItem(`progress_${sectionId}_video`);
      if (savedProgress === 'true') {
        setIsVideoWatched(true);
      }
    }
  }, [sectionId]);

  // Google Drive embed URL format - using minimal mode to hide share options
  const embedUrl = `https://drive.google.com/file/d/${driveVideoId}/preview?rm=minimal&embedded=true`;

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleVideoPlay = () => {
    if (!isVideoWatched) {
      setIsVideoWatched(true);
      // Save video completion to localStorage
      if (sectionId) {
        localStorage.setItem(`progress_${sectionId}_video`, 'true');
      }
      if (onVideoComplete) {
        onVideoComplete();
      }
    }
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300">
             {/* Video Player */}
       <div className="relative aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
        {driveVideoId ? (
          <>
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Loading video...</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Please wait while we load your content</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 flex items-center justify-center z-10">
                <div className="text-center">
                  <Video className="w-12 h-12 text-slate-400 mx-auto mb-2" />
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
                    className="mt-3 text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
            
                         <div 
               className="w-full h-full cursor-pointer"
               onClick={handleVideoPlay}
             >
               <iframe
                 src={embedUrl}
                 title={title}
                 className="w-full h-full"
                 frameBorder="0"
                 allow="autoplay"
                 onLoad={handleVideoLoad}
                 onError={handleVideoError}
                 style={{
                   border: 'none',
                   outline: 'none',
                   pointerEvents: 'auto'
                 }}
               ></iframe>
             </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Video className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500 dark:text-slate-400">Video not available</p>
            </div>
          </div>
        )}
        
                 {/* Premium Badge */}
         {isPremium && (
           <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-20">
             Premium
           </div>
         )}

         {/* Completion Badge */}
         {isVideoWatched && (
           <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-20 flex items-center gap-1">
             <Check className="w-3 h-3" />
             Watched
           </div>
         )}
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">
            {title}
          </h3>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Basic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveVideo;
