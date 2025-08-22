import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setupAdminUser, isAuthorizedAdmin, generateAdminUrl } from '../../utils/adminSetup';
import { Shield, User, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Extract the encrypted hash from the current URL
  const getEncryptedHash = () => {
    const parts = location.pathname.split('/');
    return parts[2]; // The hash part of /secure-admin-panel/{hash}/setup
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // 🔒 SECURITY CHECK: Only authorized admin email can create admin
    if (!isAuthorizedAdmin(formData.email)) {
      setError('❌ UNAUTHORIZED: Only the platform owner can create admin accounts. Please contact the system administrator.');
      setLoading(false);
      return;
    }

    try {
      await setupAdminUser(formData.email, formData.password, formData.displayName);
      setSuccess(true);
      setTimeout(() => {
        // Redirect to secure admin login URL
        const hash = getEncryptedHash();
        navigate(`/secure-admin-panel/${hash}`);
      }, 3000);
    } catch (error: any) {
      console.error('Setup error:', error);
      setError(error.message || 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Setup Complete!</h1>
          <p className="text-gray-600 mb-4">
            Your admin account has been created successfully. You will be redirected to the login page shortly.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Email:</strong> {formData.email}<br />
              <strong>Name:</strong> {formData.displayName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">Create your first admin account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="displayName"
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@abhimusickeys.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a strong password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">🔒 SECURE ADMIN SETUP:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Only the platform owner can create admin accounts</li>
                  <li>Use a strong, unique password</li>
                  <li>Keep your admin credentials secure</li>
                  <li>This account will have full platform access</li>
                  <li>No other users can access admin features</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
