import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// Create the auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    // Check local storage for user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // For demo purposes, we're simulating a login
    // In a real app, you would call your API here
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password) {
          // Create a mock user
          const newUser = {
            id: '1',
            email: email,
            displayName: email.split('@')[0],
            isAuthenticated: true
          };
          
          // Save to state
          setUser(newUser);
          
          // Save to local storage
          localStorage.setItem('user', JSON.stringify(newUser));
          
          resolve(newUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000); // Simulate network delay
    });
  };

  // Logout function
  const logout = async () => {
    // Remove user from state
    setUser(null);
    
    // Remove from local storage
    localStorage.removeItem('user');
    
    return Promise.resolve();
  };

  // Create the context value
  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}