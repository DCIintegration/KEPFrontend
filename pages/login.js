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
      
      <div className="login-page">
        <div className="login-container">
          <div className={`login-card ${isAnimated ? 'animated' : ''}`}>
            <div className="login-header">
              <h1 className="login-title">Iniciar Sesión</h1>
              <p className="login-subtitle">Bienvenido de nuevo</p>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo"
                  disabled={loading}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                  className="form-input"
                />
              </div>
              
              <div className="forgot-password">
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>
              
              <button 
                type="submit" 
                className="login-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Cargando...</span>
                  </>
                ) : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
        
        <style jsx>{`
          .login-page {
            width: 100%;
            min-height: 100vh;
            background: linear-gradient(135deg, #4361ee, #3a0ca3);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .login-container {
            width: 100%;
            max-width: 450px;
          }
          
          .login-card {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
          }
          
          .login-card.animated {
            opacity: 1;
            transform: translateY(0);
          }
          
          .login-header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .login-title {
            color: #333333;
            font-size: 28px;
            margin: 0 0 8px;
          }
          
          .login-subtitle {
            color: #666666;
            font-size: 16px;
            margin: 0;
          }
          
          .error-message {
            background-color: rgba(255, 76, 76, 0.1);
            border-left: 4px solid #ff4c4c;
            border-radius: 4px;
            color: #ff4c4c;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 14px;
          }
          
          .login-form {
            margin-bottom: 25px;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #555555;
            font-size: 14px;
          }
          
          .form-input {
            width: 100%;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
            font-size: 16px;
            background-color: #ffffff;
            color: #333333;
            transition: all 0.3s ease;
          }
          
          .form-input:focus {
            border-color: #4361ee;
            box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
            outline: none;
          }
          
          .forgot-password {
            text-align: right;
            margin-bottom: 20px;
          }
          
          .forgot-password a {
            color: #4361ee;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s;
          }
          
          .forgot-password a:hover {
            color: #3a0ca3;
            text-decoration: underline;
          }
          
          .login-button {
            width: 100%;
            padding: 14px;
            border-radius: 6px;
            border: none;
            background-color: #4361ee;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          
          .login-button:hover:not(:disabled) {
            background-color: #3a0ca3;
          }
          
          .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          /* Responsive design */
          @media (max-width: 640px) {
            .login-card {
              padding: 30px 20px;
            }
            
            .login-title {
              font-size: 24px;
            }
            
            .form-input {
              padding: 10px;
              font-size: 15px;
            }
            
            .login-button {
              padding: 12px;
            }
          }
        `}</style>
      </div>
    </>
  );
}