import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Music, Chrome, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { login, signInWithGoogle } = useAuth();
  const [resetStatus, setResetStatus] = useState('');
  const navigate = useNavigate();

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  // Password validation
  useEffect(() => {
    setPasswordValid(password.length >= 6);
  }, [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!passwordValid) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            setError('No account found with this email address.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password. Please try again.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed attempts. Please try again later.');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled.');
            break;
          default:
            setError('Failed to log in. Please check your credentials.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            setError('Sign in was cancelled.');
            break;
          case 'auth/popup-blocked':
            setError('Pop-up was blocked. Please allow pop-ups and try again.');
            break;
          case 'auth/account-exists-with-different-credential':
            setError('An account exists with this email using a different sign-in method.');
            break;
          case 'auth/operation-not-allowed':
            setError('Google sign-in is not enabled. Please contact support.');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed attempts. Please try again later.');
            break;
          default:
            setError('Failed to sign in with Google. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setResetStatus('');
    setError('');
    if (!emailValid) {
      setError('Please enter a valid email above to receive a reset link.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Failed to send reset email. Please try again later.');
        return;
      }
      setResetStatus('Password reset link sent. Please check your email.');
    } catch (err) {
      setError('Failed to send reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Background with Piano Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-indigo-900/50 to-slate-800/60"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Professional Header */}
        <header className="relative overflow-hidden">
          {/* Enhanced Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-indigo-800 to-slate-900 opacity-95 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-800"></div>
          
          {/* Professional Animated Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse opacity-20"></div>
            <div className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl animate-bounce opacity-20"></div>
            <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-3xl animate-pulse opacity-20"></div>
          </div>

          {/* Content */}
          <div className="relative flex justify-between items-center p-6">
            {/* Enhanced Logo */}
            <div
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  AbhiMusicKeys
                </span>
              </h1>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Back to Home - compact on mobile */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="hidden sm:flex bg-white/20 hover:bg-white/30 text-white border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 font-medium text-xs shadow-lg"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="sm:hidden bg-white/20 hover:bg-white/30 text-white border-white/50 hover:border-white/70 backdrop-blur-sm transition-all duration-300 font-medium text-[10px] px-2 py-1 shadow-lg flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Home
              </Button>

              {/* Sign Up - slightly smaller on mobile */}
              <Button 
                size="sm"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-[11px] sm:text-xs px-2 sm:px-3 py-1.5"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </header>

        {/* Login Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-sm sm:max-w-md"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold mb-3 text-white drop-shadow-lg">
                Welcome Back
              </h1>
              <p className="text-lg text-blue-200 font-medium drop-shadow-md">
                Sign in to continue your piano journey
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Login successful! Redirecting...</span>
              </div>
            )}

            {/* Login Form */}
            <div className="professional-card p-8 bg-white/98 dark:bg-slate-800/98 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/30 hover:shadow-3xl transition-all duration-500">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl bg-white/90 dark:bg-slate-800/90 focus:outline-none focus:ring-4 transition-all duration-300 ${
                        emailValid && email 
                          ? 'border-green-500 focus:ring-green-500/30' 
                          : email 
                          ? 'border-red-500 focus:ring-red-500/30' 
                          : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/30'
                      }`}
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                    {email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {emailValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${emailValid ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span className="text-xs text-slate-500">Valid email format</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-12 py-4 border-2 rounded-xl bg-white/90 dark:bg-slate-800/90 focus:outline-none focus:ring-4 transition-all duration-300 ${
                        passwordValid && password 
                          ? 'border-green-500 focus:ring-green-500/30' 
                          : password 
                          ? 'border-red-500 focus:ring-red-500/30' 
                          : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/30'
                      }`}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {password && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        {passwordValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordValid ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span className="text-xs text-slate-500">Min 6 characters</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm sm:text-base text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline-offset-2 hover:underline"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 py-3" 
                  disabled={loading || !emailValid || !passwordValid}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                {resetStatus && (
                  <p className="mt-3 text-sm text-green-600 dark:text-green-400 text-center">{resetStatus}</p>
                )}
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">or</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <Button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold border border-slate-300 dark:border-slate-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 py-3 flex items-center justify-center gap-3"
              >
                <Chrome className="h-5 w-5" />
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </Button>

              <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-300">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline transition-colors duration-300"
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 
