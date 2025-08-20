import React from 'react';
import { Play, Clock, BookOpen, Star } from 'lucide-react';
import VideoLesson from './VideoLesson';
import { VideoLesson as VideoLessonType, getVideosByCategory } from '../../data/advancedVideos';

interface VideoSectionProps {
  category: VideoLessonType['category'];
  title: string;
  description: string;
  icon?: React.ReactNode;
  onVideoComplete?: (videoId: string, category: VideoLessonType['category']) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  category,
  title,
  description,
  icon,
  onVideoComplete
}) => {
  const videos = getVideosByCategory(category);

  const handleVideoPlay = (videoId: string) => {
    console.log(`Playing video: ${videoId}`);
    // Mark video as completed when played
    if (onVideoComplete) {
      onVideoComplete(videoId, category);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          {icon && (
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
              {icon}
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Play className="h-5 w-5 text-pink-500" />
            <span className="font-semibold">{videos.length} Videos</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Clock className="h-5 w-5 text-pink-500" />
            <span className="font-semibold">Advanced Content</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Star className="h-5 w-5 text-pink-500" />
            <span className="font-semibold">Advanced Level</span>
          </div>
        </div>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoLesson
              key={video.id}
              title={video.title}
              description={video.description}
              videoUrl={video.videoUrl}
              duration={video.duration}
              isPremium={video.isPremium}
              onPlay={() => handleVideoPlay(video.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Videos Coming Soon!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            We're working on creating amazing video content for this section. Stay tuned!
          </p>
          <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 dark:from-pink-900/20 dark:to-fuchsia-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800 max-w-md mx-auto">
            <p className="text-pink-700 dark:text-pink-300 font-medium">
              💡 Tip: Subscribe to our channel to get notified when new videos are uploaded!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSection;
