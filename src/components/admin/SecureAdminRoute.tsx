import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyAdminUrl } from '../../utils/adminSetup';

interface SecureAdminRouteProps {
  children: React.ReactNode;
}

const SecureAdminRoute: React.FC<SecureAdminRouteProps> = ({ children }) => {
  const location = useLocation();
  
  console.log('🔐 SecureAdminRoute: Checking URL security...');
  console.log('📍 Current pathname:', location.pathname);
  
  // Verify the encrypted admin URL
  const isSecureUrl = verifyAdminUrl(location.pathname);
  console.log('✅ Is secure URL:', isSecureUrl);
  
  if (!isSecureUrl) {
    console.log('❌ URL not secure - redirecting to homepage');
    // Redirect to a generic 404 or home page to hide admin existence
    return <Navigate to="/" replace />;
  }
  
  console.log('✅ URL verified - rendering admin content');
  return <>{children}</>;
};

export default SecureAdminRoute;
