import React, { useState } from 'react';
import { Play, Clock, BookOpen, Loader2 } from 'lucide-react';

interface VideoLessonProps {
  title: string;
  description: string;
  videoUrl: string;
  duration?: string;
  thumbnail?: string;
  isPremium?: boolean;
  onPlay?: () => void;
}

const VideoLesson: React.FC<VideoLessonProps> = ({
  title,
  description,
  videoUrl,
  duration = "10:00",
  thumbnail,
  isPremium = false,
  onPlay
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0` : '';

  // Generate thumbnail URL from video ID
  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handlePlayClick = () => {
    if (!videoId) return;
    
    setIsLoading(true);
    setShowVideo(true);
    setHasError(false);
    
    if (onPlay) {
      onPlay();
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Video Thumbnail/Player */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-700">
        {!showVideo ? (
          // Show thumbnail with play button overlay
          <div className="relative w-full h-full">
            {videoId && (
              <img 
                src={getThumbnailUrl(videoId)} 
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default thumbnail if YouTube thumbnail fails
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <button
                onClick={handlePlayClick}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 transform hover:scale-110 shadow-lg"
              >
                <Play className="w-8 h-8 text-slate-800 ml-1" fill="currentColor" />
              </button>
            </div>
            
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          </div>
        ) : (
          // Show actual video player
          <>
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-2" />
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Loading video...</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Please wait while we load your content</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 flex items-center justify-center z-10">
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
            
            {embedUrl && (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              ></iframe>
            )}
          </>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Advanced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLesson;
