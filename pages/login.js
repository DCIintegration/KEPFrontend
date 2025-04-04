import styles from '../styles/login.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';

export default function Login() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  
  //const api_url = "";
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  // Trigger animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call login function from context
      await login(email, password);
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Iniciar Sesión | Portal Web</title>
        <meta name="description" content="Inicia sesión en tu cuenta" />
      </Head>
      
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={`${styles.loginCard} ${isAnimated ? styles.animated : ''}`}>
            <div className={styles.loginHeader}>
              <h1 className={styles.loginTitle}>Iniciar Sesión</h1>
              <p className={styles.loginSubtitle}>Bienvenido de nuevo</p>
            </div>
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo"
                  disabled={loading}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.forgotPassword}>
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>
              
              <button 
                type="submit" 
                className={styles.loginButton} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    <span>Cargando...</span>
                  </>
                ) : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}