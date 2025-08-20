export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  category: 'major-families' | 'minor-families' | 'ragas' | 'scales' | 'interludes';
  isPremium: boolean;
  thumbnail?: string;
}

export const advancedVideoLessons: VideoLesson[] = [
  // How to Find out Scale Videos
  {
    id: 'scale-identification-basics',
    title: 'Scale Identification Basics',
    description: 'Learn the fundamentals of identifying musical scales',
    videoUrl: 'https://youtu.be/SzEO8I9s2PM?feature=shared',
    duration: '25:30',
    category: 'scales',
    isPremium: true
  },

  // How to Play Interludes Videos
  {
    id: 'interlude-basics',
    title: 'Interlude Playing Basics',
    description: 'Learn the fundamentals of playing beautiful interludes',
    videoUrl: 'https://youtu.be/moQ6F6IQCww?feature=shared',
    duration: '26:20',
    category: 'interludes',
    isPremium: true
  },

];

// Helper function to get videos by category
export const getVideosByCategory = (category: VideoLesson['category']) => {
  return advancedVideoLessons.filter(video => video.category === category);
};

// Helper function to get all videos
export const getAllVideos = () => {
  return advancedVideoLessons;
};
