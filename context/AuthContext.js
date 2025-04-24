// context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api'; // Importamos nuestro servicio API
import { useRouter } from 'next/router';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Comprobar si hay un usuario autenticado al cargar
  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        // Verificar si hay un token guardado en localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        
        if (token && storedUser) {
          // Si hay un token, consideramos al usuario como autenticado
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuthentication();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.login(email, password);
      
      if (response && response.user) {
        setUser(response.user);
        return response;
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      setError(error.message || 'Error durante el inicio de sesión');
      // No propagar el error, sino manejarlo aquí
      return { success: false, error: error.message || 'Error durante el inicio de sesión' };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setLoading(true);
      
      // Llamar al endpoint de logout en la API
      try {
        await api.logout();
      } catch (logoutError) {
        console.error('Error al cerrar sesión en el servidor:', logoutError);
        // Continuamos a pesar del error, para asegurar el logout en el cliente
      }
      
      // Limpiar el estado local siempre
      setUser(null);
      
      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      
      // Redirigir al login
      router.push('/login');
      
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError(error.message || 'Error al cerrar sesión');
      
      // Aún así, intentamos limpiar datos del cliente
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      
      return { success: false, error: error.message || 'Error al cerrar sesión' };
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamada a la API para crear usuario
      const response = await api.createUser(userData);
      
      return { success: true, data: response };
    } catch (error) {
      setError(error.message || 'Error al registrar el usuario');
      return { success: false, error: error.message || 'Error al registrar el usuario' };
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto que será proveído
  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  return useContext(AuthContext);
}