import React from 'react';

import { Button } from './ui/button';
import { ArrowLeft, Lock, Crown, Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumPageProps {
  level: 'intermediate' | 'advanced';
}

const PremiumPage: React.FC<PremiumPageProps> = ({ level }) => {
  const navigate = useNavigate();
  
  const isIntermediate = level === 'intermediate';
  const title = isIntermediate ? 'Intermediate Learning' : 'Advanced Learning';
  const description = isIntermediate 
    ? 'Take your skills to the next level with intermediate techniques and songs.'
    : 'Master advanced piano techniques and complex compositions.';

  const features = isIntermediate ? [
    'Advanced chord progressions',
    'Popular song tutorials',
    'Music theory fundamentals',
    'Ear training exercises',
    'Performance techniques',
    'Recording and mixing basics'
  ] : [
    'Complex chord voicings',
    'Jazz and classical pieces',
    'Advanced music theory',
    'Composition techniques',
    'Professional performance skills',
    'Studio recording mastery'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Header */}
      <header className="relative overflow-hidden">
        {/* Professional Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 opacity-95"></div>
        
        {/* Subtle Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-amber-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-8 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-orange-400/10 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-0 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-red-400/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wider">
              <span className="bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent font-serif">
                {title}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 border border-white/20">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white drop-shadow-lg">Premium</span>
          </div>
        </div>
      </header>

      {/* Mobile-Optimized Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div



          className="max-w-5xl mx-auto"
        >
          {/* Mobile-Optimized Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div



              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-lg"
            >
              <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-bold text-xs sm:text-sm">Premium Content</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-800 via-amber-700 to-orange-700 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              {description}
            </p>
          </div>

          {/* Mobile-Optimized Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {features.map((feature, index) => (
              <div
                key={index}



                className="professional-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                      {feature}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile-Optimized CTA Section */}
          <div



            className="text-center"
          >
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 sm:p-8 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
                <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                  Premium Access Required
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Unlock this premium content by subscribing to our intermediate or advanced plan. 
                Get access to exclusive lessons, advanced techniques, and professional guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                >
                  <Crown className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  View Pricing Plans
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 py-3 sm:py-4 px-6 sm:px-8 text-sm sm:text-base"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile-Optimized Benefits Section */}
          <div



            className="mt-8 sm:mt-12"
          >
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 text-center">
              What You'll Get
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">Exclusive Content</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Access to premium lessons and advanced techniques</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">Expert Guidance</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Professional instruction and personalized feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PremiumPage; 
