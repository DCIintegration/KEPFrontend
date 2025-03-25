import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to appropriate page based on authentication status
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  // Show minimal loading state
  return (
    <>
      <Head>
        <title>Portal Web</title>
        <meta name="description" content="Bienvenido al Portal Web" />
      </Head>
      
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
    </>
  );
}