import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // Authentication check
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setIsAuthChecking(false);
    }, 100);
    
    return () => clearTimeout(checkAuth);
  }, []);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthChecking && !user) {
      router.push('/login');
    }
  }, [user, router, isAuthChecking]);

  // Show loading state during authentication check
  if (!user || isAuthChecking) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
        
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #f9fafc;
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(67, 97, 238, 0.2);
            border-radius: 50%;
            border-top-color: #4361ee;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          p {
            margin-top: 20px;
            font-size: 18px;
            color: #555555;
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Mi Perfil | Portal Web</title>
        <meta name="description" content="Administra tu perfil" />
      </Head>
      
      <div className="profile-page">
        <div className="container">
          <h1 className="page-title">Mi Perfil</h1>
          <p>Este es un espacio reservado para el contenido de la página de perfil.</p>
          <button 
            className="back-button"
            onClick={() => router.push('/dashboard')}
          >
            Volver al Panel de Control
          </button>
        </div>
        
        <style jsx>{`
          .profile-page {
            width: 100%;
            min-height: 100vh;
            background-color: #f9fafc;
            padding: 40px 20px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .page-title {
            font-size: 28px;
            margin-bottom: 20px;
            color: #333333;
          }
          
          .back-button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4361ee;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          
          .back-button:hover {
            background-color: #3a0ca3;
          }
          
          /* Responsive design */
          @media (max-width: 640px) {
            .page-title {
              font-size: 24px;
            }
          }
        `}</style>
      </div>
    </>
  );
}