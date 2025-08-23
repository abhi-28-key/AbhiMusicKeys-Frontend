import React, { useEffect } from 'react';
import { CheckCircle, Crown, Home, Download } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { downloadReceipt, getReceiptData } from '../utils/receiptGenerator';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { grantSubscription } = usePayment();
  
  const planId = searchParams.get('planId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    // Grant subscription immediately when component mounts
    if (planId && currentUser) {
      grantSubscription(planId);
      console.log(`Subscription granted for plan: ${planId}`);
      
      // Mark user as enrolled based on plan
      if (planId === 'intermediate') {
        localStorage.setItem(`intermediate_access_${currentUser.uid}`, 'true');
        localStorage.setItem(`enrolled_${currentUser.uid}_intermediate`, 'true');
        console.log('User enrolled in intermediate course');
      } else if (planId === 'advanced') {
        // Advanced course automatically unlocks intermediate course too
        localStorage.setItem(`advanced_access_${currentUser.uid}`, 'true');
        localStorage.setItem(`enrolled_${currentUser.uid}_advanced`, 'true');
        localStorage.setItem(`intermediate_access_${currentUser.uid}`, 'true');
        localStorage.setItem(`enrolled_${currentUser.uid}_intermediate`, 'true');
        console.log('User enrolled in advanced course (includes intermediate access)');
      }
    }
  }, [planId, currentUser, grantSubscription]);

  const getPlanName = (id: string | null) => {
    switch (id) {
      case 'basic':
        return 'Basic Plan';
      case 'intermediate':
        return 'Intermediate Plan';
      case 'advanced':
        return 'Advanced Plan';
      default:
        return 'Premium Plan';
    }
  };

  const getPlanDuration = (planId: string | null) => {
    switch (planId) {
      case 'basic':
        return '3 months';
      case 'intermediate':
        return 'Lifetime Access';
      case 'advanced':
        return 'Lifetime';
      default:
        return 'Plan';
    }
  };

  const getPlanAmount = (planId: string | null) => {
    switch (planId) {
      case 'basic':
        return 999;
      case 'intermediate':
        return 399;
      case 'advanced':
        return 699;
      default:
        return 0;
    }
  };

  const handleDownloadReceipt = () => {
    if (!currentUser || !planId || !paymentId) return;
    
    const receiptData = getReceiptData(
      currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
      currentUser.email || '',
      getPlanName(planId),
      getPlanAmount(planId),
      'INR',
      paymentId,
      `order_${Date.now()}`,
      getPlanDuration(planId)
    );
    
    downloadReceipt(receiptData);
  };

  const handleNavigateToCourse = () => {
    if (planId === 'intermediate') {
      navigate('/intermediate-content');
    } else if (planId === 'advanced') {
      navigate('/advanced-content');
    } else if (planId === 'styles-tones') {
      navigate('/downloads?paymentId=' + paymentId);
    } else {
      navigate('/');
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

      {/* Mobile-Optimized Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto text-center w-full">
          {/* Success Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Payment Successful!
          </h1>

          <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-lg mx-auto">
            Thank you for subscribing to {getPlanName(planId)}. Your payment has been processed successfully.
          </p>

          {/* Plan Details Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {getPlanName(planId)}
                </h3>
                <p className="text-sm sm:text-base text-white/70">
                  {getPlanDuration(planId)} • ₹{getPlanAmount(planId)}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-white/70">Payment ID:</span>
                <span className="text-white font-mono text-xs sm:text-sm">
                  {paymentId?.slice(0, 8)}...
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-white/70">Plan Duration:</span>
                <span className="text-white">{getPlanDuration(planId)}</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-white/70">Amount Paid:</span>
                <span className="text-white font-semibold">₹{getPlanAmount(planId)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={handleDownloadReceipt}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              Download Receipt
            </button>
            
            <button
              onClick={handleNavigateToCourse}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg border border-white/30 hover:border-white/50 transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              {planId === 'intermediate' ? 'Go to Intermediate Course' : 
               planId === 'advanced' ? 'Go to Advanced Course' : 
               planId === 'styles-tones' ? 'Go to Downloads' :
               'Go to Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
