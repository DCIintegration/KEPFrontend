import styles from '../styles/index.module.css';
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
      
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    </>
  );
}