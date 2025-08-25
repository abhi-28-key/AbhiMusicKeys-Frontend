import React, { useEffect } from 'react';
import { CheckCircle, Crown, Home, Download } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { downloadReceipt, getReceiptData } from '../utils/receiptGenerator';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { updatePurchaseStatusInFirestore } from '../utils/userPlanUtils';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { grantSubscription } = usePayment();
  
  const planId = searchParams.get('planId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (planId && currentUser) {
        try {
          // Grant subscription locally
          grantSubscription(planId);
          console.log(`Subscription granted for plan: ${planId}`);
          
          // Update Firestore with purchase status for cross-device sync
          await updatePurchaseStatusInFirestore(currentUser, planId, true);
          console.log(`Purchase status updated in Firestore for plan: ${planId}`);
          
          // Mark user as enrolled based on plan (localStorage for backward compatibility)
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
          } else if (planId === 'styles-tones') {
            localStorage.setItem(`styles_tones_access_${currentUser.uid}`, 'true');
            localStorage.setItem(`enrolled_${currentUser.uid}_styles_tones`, 'true');
            console.log('User enrolled in styles & tones plan');
          } else if (planId === 'indian-styles') {
            localStorage.setItem(`indian_styles_access_${currentUser.uid}`, 'true');
            localStorage.setItem(`enrolled_${currentUser.uid}_indian_styles`, 'true');
            console.log('User enrolled in indian styles plan');
          }
          
          console.log('✅ Payment success processing completed');
        } catch (error) {
          console.error('Error processing payment success:', error);
        }
      }
    };

    processPaymentSuccess();
  }, [planId, currentUser, grantSubscription]);

  const getPlanName = (id: string | null) => {
    switch (id) {
      case 'basic':
        return 'Basic Plan';
      case 'intermediate':
        return 'Intermediate Plan';
      case 'advanced':
        return 'Advanced Plan';
      case 'styles-tones':
        return 'Styles & Tones Package';
      case 'indian-styles':
        return 'Indian Styles Package';
      default:
        return 'Plan';
    }
  };

  const getPlanDescription = (id: string | null) => {
    switch (id) {
      case 'basic':
        return 'Access to basic piano fundamentals and exercises';
      case 'intermediate':
        return 'Advanced chord progressions, families, and transpose techniques';
      case 'advanced':
        return 'Professional Indian ragas, scale identification, and interlude mastery';
      case 'styles-tones':
        return 'Complete collection of Indian musical styles and tones';
      case 'indian-styles':
        return 'Authentic Indian musical styles for your keyboard';
      default:
        return 'Premium content access';
    }
  };

  const getPlanIcon = (id: string | null) => {
    switch (id) {
      case 'basic':
        return <Crown className="h-8 w-8" />;
      case 'intermediate':
        return <Crown className="h-8 w-8" />;
      case 'advanced':
        return <Crown className="h-8 w-8" />;
      case 'styles-tones':
        return <Download className="h-8 w-8" />;
      case 'indian-styles':
        return <Download className="h-8 w-8" />;
      default:
        return <Crown className="h-8 w-8" />;
    }
  };

  const getPlanAmount = (id: string | null) => {
    switch (id) {
      case 'basic':
        return 0;
      case 'intermediate':
        return 399;
      case 'advanced':
        return 699;
      case 'styles-tones':
        return 299;
      case 'indian-styles':
        return 299;
      default:
        return 0;
    }
  };

  const getPlanDuration = (id: string | null) => {
    switch (id) {
      case 'basic':
        return 'Free';
      case 'intermediate':
        return 'Lifetime Access';
      case 'advanced':
        return 'Lifetime Access';
      case 'styles-tones':
        return 'Lifetime Access';
      case 'indian-styles':
        return 'Lifetime Access';
      default:
        return 'Plan';
    }
  };

  const handleDownloadReceipt = async () => {
    if (currentUser && planId && paymentId) {
      try {
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
      } catch (error) {
        console.error('Error downloading receipt:', error);
        alert('Failed to download receipt. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Thank you for your purchase! Your payment has been processed successfully.
            </p>

            {/* Plan Details */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  {getPlanIcon(planId)}
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getPlanName(planId)}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {getPlanDescription(planId)}
                  </p>
                </div>
              </div>
              
              {paymentId && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Payment ID: {paymentId}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  // Navigate based on plan type
                  if (planId === 'styles-tones' || planId === 'indian-styles') {
                    navigate('/downloads');
                  } else if (planId === 'intermediate') {
                    navigate('/intermediate-content');
                  } else if (planId === 'advanced') {
                    navigate('/advanced-content');
                  } else {
                    navigate('/');
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {planId === 'styles-tones' || planId === 'indian-styles' ? (
                  <>
                    <Download className="inline-block w-5 h-5 mr-2" />
                    Go to Downloads
                  </>
                ) : planId === 'intermediate' ? (
                  <>
                    <Home className="inline-block w-5 h-5 mr-2" />
                    Go to Intermediate Course
                  </>
                ) : planId === 'advanced' ? (
                  <>
                    <Home className="inline-block w-5 h-5 mr-2" />
                    Go to Advanced Course
                  </>
                ) : (
                  <>
                    <Home className="inline-block w-5 h-5 mr-2" />
                    Go to Dashboard
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownloadReceipt}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Download Receipt
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You will receive a confirmation email shortly. If you have any questions, 
                please contact us at{' '}
                <a 
                  href="mailto:abhimusickeys13@gmail.com?subject=Support%20Request%20-%20AbhiMusicKeys&body=Hello,%0A%0AI%20need%20support%20regarding%20my%20purchase.%0A%0APayment%20ID:%20${paymentId}%0APlan:%20${getPlanName(planId)}%0A%0AThank%20you!" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  abhimusickeys13@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
