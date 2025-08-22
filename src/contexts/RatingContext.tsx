import React, { createContext, useContext, useState, useEffect } from 'react';

interface CourseRating {
  courseId: string;
  rating: number;
  reviewCount: number;
  lastUpdated: Date;
}

interface RatingContextType {
  courseRatings: CourseRating[];
  updateRating: (courseId: string, newRating: number) => void;
  addReview: (courseId: string, rating: number) => void;
  getCourseRating: (courseId: string) => CourseRating | null;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a RatingProvider');
  }
  return context;
};

interface RatingProviderProps {
  children: React.ReactNode;
}

export const RatingProvider: React.FC<RatingProviderProps> = ({ children }) => {
  const [courseRatings, setCourseRatings] = useState<CourseRating[]>([
    {
      courseId: 'basic',
      rating: 4.9,
      reviewCount: 2100,
      lastUpdated: new Date()
    },
    {
      courseId: 'intermediate',
      rating: 4.7,
      reviewCount: 1800,
      lastUpdated: new Date()
    },
    {
      courseId: 'advanced',
      rating: 4.8,
      reviewCount: 1500,
      lastUpdated: new Date()
    }
  ]);

  // Load ratings from localStorage on mount
  useEffect(() => {
    const savedRatings = localStorage.getItem('courseRatings');
    if (savedRatings) {
      try {
        const parsed = JSON.parse(savedRatings);
        setCourseRatings(parsed.map((rating: any) => ({
          ...rating,
          lastUpdated: new Date(rating.lastUpdated)
        })));
      } catch (error) {
        console.error('Error loading ratings from localStorage:', error);
      }
    }
  }, []);

  // Save ratings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('courseRatings', JSON.stringify(courseRatings));
  }, [courseRatings]);

  const updateRating = (courseId: string, newRating: number) => {
    setCourseRatings(prev => 
      prev.map(rating => 
        rating.courseId === courseId 
          ? { ...rating, rating: newRating, lastUpdated: new Date() }
          : rating
      )
    );
  };

  const addReview = (courseId: string, rating: number) => {
    setCourseRatings(prev => 
      prev.map(courseRating => {
        if (courseRating.courseId === courseId) {
          const newReviewCount = courseRating.reviewCount + 1;
          const newRating = ((courseRating.rating * courseRating.reviewCount) + rating) / newReviewCount;
          return {
            ...courseRating,
            rating: Math.round(newRating * 10) / 10, // Round to 1 decimal place
            reviewCount: newReviewCount,
            lastUpdated: new Date()
          };
        }
        return courseRating;
      })
    );
  };

  const getCourseRating = (courseId: string): CourseRating | null => {
    return courseRatings.find(rating => rating.courseId === courseId) || null;
  };

  const value: RatingContextType = {
    courseRatings,
    updateRating,
    addReview,
    getCourseRating,
  };

  return (
    <RatingContext.Provider value={value}>
      {children}
    </RatingContext.Provider>
  );
};
