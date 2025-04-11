// context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../api';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is already logged in when the app loads
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Check if user data is in local storage (handled by the ApiService)
        if (ApiService.isAuthenticated()) {
          const userData = ApiService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        // If there's an error, log out the user
       // ApiService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await ApiService.login(email, password);
      
      // If login successful, set the user
      if (response && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    ApiService.logout();
    setUser(null);
  };

  // Values to provide in the context
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};