import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationContextType {
  previousRoute: string;
  goBack: () => void;
  goHome: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [previousRoute, setPreviousRoute] = useState<string>('/');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't update previousRoute if we're going to the same route
    if (location.pathname !== previousRoute) {
      setPreviousRoute(location.pathname);
    }
  }, [location.pathname, previousRoute]);

  const goBack = () => {
    // If we have a previous route and it's not the current route, go back
    if (previousRoute && previousRoute !== location.pathname) {
      navigate(previousRoute);
    } else {
      // Fallback to home if no previous route or same route
      navigate('/');
    }
  };

  const goHome = () => {
    navigate('/');
  };

  const value: NavigationContextType = {
    previousRoute,
    goBack,
    goHome,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
