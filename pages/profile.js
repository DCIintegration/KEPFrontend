import styles from '../styles/profile.module.css';
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
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Cargando...</p>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Mi Perfil | Portal Web</title>
        <meta name="description" content="Administra tu perfil" />
      </Head>
      
      <div className={styles.profilePage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Mi Perfil</h1>
          <p className={styles.profileText}>Este es un espacio reservado para el contenido de la página de perfil.</p>
          <button 
            className={styles.backButton}
            onClick={() => router.push('/dashboard')}
          >
            Volver al Panel de Control
          </button>
        </div>
      </div>
    </>
  );
}