import React from 'react';

import { Check, Star, Crown, Zap, Shield, Clock, Users } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const { plans, isProcessing, processPayment, grantSubscription } = usePayment();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: any) => {
    if (!currentUser) {
      alert('Please login to subscribe to a plan');
      navigate('/login');
      return;
    }

    // Handle free Basic Plan
    if (plan.price === 0) {
      try {
        // For free plan, directly grant access without payment
        console.log('Granting free access to Basic Plan');
        
        // Grant subscription
        grantSubscription('basic');
        
        alert('Free access granted! Welcome to the Basic Plan.');
        navigate('/basic-learning'); // Redirect to basic learning page
        return;
      } catch (error) {
        console.error('Failed to grant free access:', error);
        alert('Failed to grant free access. Please try again.');
        return;
      }
    }

    // Handle Advanced Plan - redirect to overview first
    if (plan.id === 'advanced') {
      navigate('/advanced-overview');
      return;
    }

    // Handle paid plans
    try {
      await processPayment(plan);
      // Payment success will be handled in PaymentSuccess component
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Zap className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'intermediate':
        return <Star className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'advanced':
        return <Crown className="h-5 w-5 sm:h-6 sm:w-6" />;
      default:
        return <Check className="h-5 w-5 sm:h-6 sm:w-6" />;
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
        {/* Mobile-Friendly Header */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/90 via-indigo-800/90 to-slate-900/90"></div>
          <div className="relative flex justify-between items-center p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wider">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  AbhiMusicKeys
                </span>
              </h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base px-3 py-2 rounded-lg hover:bg-white/10"
            >
              ← Back to Home
            </button>
          </div>
        </header>

        {/* Mobile-Optimized Main Content */}
        <main className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Mobile-Optimized Header Section */}
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h1 



                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6"
              >
                Choose Your
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Learning Plan
                </span>
              </h1>
              <p 



                className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto px-4"
              >
                Start your musical journey with our comprehensive piano courses. 
                Choose the plan that best fits your learning goals and budget.
              </p>
            </div>

            {/* Mobile-Optimized Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                                 <div
                   key={plan.id}



                                       className="relative"
                 >
                                       {/* Removed "Most Popular" badge */}
                   
                                       <div className={`h-full p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                                         plan.price === 0 
                                           ? 'border-green-400/40 bg-white/15 hover:scale-105' 
                                           : plan.isRecommended
                                           ? 'border-purple-400/40 bg-white/15 hover:scale-105'
                                           : 'border-white/20 bg-white/10 hover:scale-105'
                                       }`}>
                                         {plan.price === 0 && (
                                           <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                             <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                               FREE
                                             </span>
                                           </div>
                                         )}
                                         {plan.isRecommended && (
                                           <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                             <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                               RECOMMENDED
                                             </span>
                                           </div>
                                         )}
                                              <div className="text-center mb-4 sm:mb-6">
                          <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 sm:mb-3 ${
                            plan.price === 0 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600'
                          }`}>
                            {getPlanIcon(plan.id)}
                          </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="mb-2 sm:mb-3">
                          {plan.price === 0 ? (
                            <div>
                              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">FREE</span>
                              <span className="text-white/60 ml-2 text-xs sm:text-sm">for registered users</span>
                            </div>
                          ) : (
                            <>
                              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">₹{plan.price}</span>
                              {plan.duration && (
                                <span className="text-white/60 ml-2 text-xs sm:text-sm">/{plan.duration}</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                              <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
                            </div>
                            <span className="text-white/90 text-xs sm:text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={isProcessing}
                        className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-white transition-all duration-300 text-xs sm:text-sm ${
                          plan.price === 0 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      >
                        {isProcessing ? 'Processing...' : plan.price === 0 ? 'Get Free Access' : 'Subscribe Now'}
                      </button>
                    </div>
                 </div>
              ))}
            </div>

            {/* Mobile-Optimized Additional Info */}
            <div 



              className="mt-8 sm:mt-12 md:mt-16 text-center"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base sm:col-span-2 md:col-span-1">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PricingPage; 
