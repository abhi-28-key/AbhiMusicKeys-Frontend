import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Homepage from './components/Homepage';
import BasicCourseOverview from './components/BasicCourseOverview';
import IntermediateCourseOverview from './components/IntermediateCourseOverview';
import IntermediateCourseContent from './components/IntermediateCourseContent';
import AdvancedCourseOverview from './components/AdvancedCourseOverview';
import AdvancedCourseContent from './components/AdvancedCourseContent';
import BasicLearning from './components/BasicLearning';
import PremiumPage from './components/PremiumPage';
import PricingPage from './components/PricingPage';
import PaymentSuccess from './components/PaymentSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import DownloadSection from './components/DownloadSection';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PSRI500Page from './components/PSRI500Page';
import DownloadPage from './components/DownloadPage';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import SecureAdminRoute from './components/admin/SecureAdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import FileManagement from './components/admin/FileManagement';
import RevenueAnalytics from './components/admin/RevenueAnalytics';
import AnnouncementManagement from './components/admin/AnnouncementManagement';
import AdminSetup from './components/admin/AdminSetup';
import UserProgress from './components/admin/UserProgress';

// Import admin setup to make functions globally available
import './utils/adminSetup';

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/basic" element={<BasicCourseOverview />} />
            <Route path="/intermediate-overview" element={<IntermediateCourseOverview />} />
            <Route path="/intermediate-content" element={
              <ProtectedRoute requiredPlan="intermediate">
                <IntermediateCourseContent />
              </ProtectedRoute>
            } />
            <Route path="/advanced-overview" element={<AdvancedCourseOverview />} />
            <Route path="/advanced-content" element={
              <ProtectedRoute requiredPlan="advanced">
                <AdvancedCourseContent />
              </ProtectedRoute>
            } />
            <Route path="/basic-learning" element={<BasicLearning />} />
            <Route path="/intermediate" element={
              <ProtectedRoute requiredPlan="intermediate">
                <PremiumPage level="intermediate" />
              </ProtectedRoute>
            } />
            <Route path="/advanced" element={
              <ProtectedRoute requiredPlan="advanced">
                <PremiumPage level="advanced" />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/downloads" element={<DownloadSection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/psr-i500" element={<PSRI500Page />} />
            <Route path="/psr-i500/" element={<PSRI500Page />} />
            <Route path="/download" element={<DownloadPage />} />
            
            {/* 🔐 SECURE ENCRYPTED ADMIN ROUTES */}
            {/* Admin Dashboard - Only accessible with encrypted URL */}
            <Route path="/secure-admin-panel/:hash/dashboard" element={
              <SecureAdminRoute>
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              </SecureAdminRoute>
            } />
            
            {/* Admin Users - Only accessible with encrypted URL */}
            <Route path="/secure-admin-panel/:hash/users" element={
              <SecureAdminRoute>
              <AdminProtectedRoute>
                <UserManagement />
              </AdminProtectedRoute>
              </SecureAdminRoute>
            } />
            
            {/* Admin Files - Only accessible with encrypted URL */}
            <Route path="/secure-admin-panel/:hash/files" element={
              <SecureAdminRoute>
              <AdminProtectedRoute>
                  <FileManagement />
              </AdminProtectedRoute>
              </SecureAdminRoute>
            } />
            
            {/* Admin Revenue - Only accessible with encrypted URL */}
            <Route path="/secure-admin-panel/:hash/revenue" element={
              <SecureAdminRoute>
              <AdminProtectedRoute>
                <RevenueAnalytics />
              </AdminProtectedRoute>
              </SecureAdminRoute>
            } />
            
            {/* Admin Announcements - Only accessible with encrypted URL */}
            <Route path="/secure-admin-panel/:hash/announcements" element={
              <SecureAdminRoute>
              <AdminProtectedRoute>
                <AnnouncementManagement />
              </AdminProtectedRoute>
              </SecureAdminRoute>
            } />
            
            {/* Admin Progress - Only accessible with encrypted URL */}
            <Route path="/secure-admin-panel/:hash/progress" element={
              <SecureAdminRoute>
                <AdminProtectedRoute>
                  <UserProgress />
                </AdminProtectedRoute>
              </SecureAdminRoute>
            } />
            
            {/* 🔐 ADMIN-ONLY COURSE ACCESS ROUTES */}
            {/* Admin Intermediate Content - Direct access for owner */}
            <Route path="/secure-admin-panel/:hash/intermediate-content" element={
              <SecureAdminRoute>
                <AdminProtectedRoute>
                  <IntermediateCourseContent />
                </AdminProtectedRoute>
              </SecureAdminRoute>
            } />
            
            {/* Admin Advanced Content - Direct access for owner */}
            <Route path="/secure-admin-panel/:hash/advanced-content" element={
              <SecureAdminRoute>
                <AdminProtectedRoute>
                  <AdvancedCourseContent />
                </AdminProtectedRoute>
              </SecureAdminRoute>
            } />
            
            {/* Admin Login - Direct access with encrypted URL (must be last) */}
            <Route path="/secure-admin-panel/*" element={
              <SecureAdminRoute>
                <AdminLogin />
              </SecureAdminRoute>
            } />
            
            {/* Catch-all route for invalid admin URLs */}
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </ThemeProvider>
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;
