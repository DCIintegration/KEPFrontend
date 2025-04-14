// components/Layout.js with API integration
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, title = 'Portal Web', skipHeader = false }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [router.pathname]);
  
  const handleLogout = async () => {
    try {
      // Call logout from AuthContext (which uses ApiService)
      await logout();
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  return (
    <div className="layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Portal web para gestión de KPIs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {!skipHeader && (
        <header className="header">
          <div className="header-container">
            <div className="header-left">
              <Link href="/dashboard" className="logo">
                <span className="logo-text">Portal KPIs</span>
              </Link>
              
              <nav className="desktop-nav">
                <Link href="/dashboard" className={router.pathname === '/dashboard' ? 'active' : ''}>
                  Dashboard
                </Link>
                <Link href="/metricas" className={router.pathname === '/metricas' ? 'active' : ''}>
                  Métricas
                </Link>
                <Link href="/procesar-archivos" className={router.pathname === '/procesar-archivos' ? 'active' : ''}>
                  Archivos
                </Link>
                <Link href="/logs" className={router.pathname === '/logs' ? 'active' : ''}>
                  Logs
                </Link>
              </nav>
            </div>
            
            <div className="header-right">
              {/* User Profile */}
              <div className="profile-dropdown">
                <button 
                  className="profile-button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="user-avatar">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">{user ? user.name || 'Usuario' : 'Usuario'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link href="/profile" className="dropdown-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Mi Perfil
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMobileMenuOpen ? (
                    <g>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </g>
                  ) : (
                    <g>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </g>
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu">
              <nav className="mobile-nav">
                <Link href="/dashboard" className={router.pathname === '/dashboard' ? 'active' : ''}>
                  Dashboard
                </Link>
                <Link href="/metricas" className={router.pathname === '/metricas' ? 'active' : ''}>
                  Métricas
                </Link>
                <Link href="/procesar-archivos" className={router.pathname === '/procesar-archivos' ? 'active' : ''}>
                  Archivos
                </Link>
                <Link href="/logs" className={router.pathname === '/logs' ? 'active' : ''}>
                  Logs
                </Link>
                <hr />
                <Link href="/profile">
                  Mi Perfil
                </Link>
                <button className="logout-button" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          )}
        </header>
      )}
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Portal KPIs. Todos los derechos reservados.</p>
        </div>
      </footer>
      
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        .header {
          background-color: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          height: 70px;
        }
        
        .header-left,
        .header-right {
          display: flex;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          margin-right: 30px;
        }
        
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #4361ee;
        }
        
        .desktop-nav {
          display: flex;
          gap: 20px;
        }
        
        .desktop-nav a {
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
          padding: 8px 0;
          position: relative;
        }
        
        .desktop-nav a:hover {
          color: #4361ee;
        }
        
        .desktop-nav a.active {
          color: #4361ee;
        }
        
        .desktop-nav a.active:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #4361ee;
        }
        
        .profile-dropdown {
          position: relative;
        }
        
        .profile-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
        }
        
        .profile-button:hover {
          background-color: #f1f5f9;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          background-color: #4361ee;
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 600;
        }
        
        .user-name {
          font-weight: 500;
          color: #334155;
        }
        
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          width: 200px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          padding: 8px;
          margin-top: 8px;
          z-index: 100;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          color: #475569;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        
        .dropdown-item:hover {
          background-color: #f1f5f9;
          color: #4361ee;
        }
        
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
        }
        
        .mobile-menu {
          display: none;
          padding: 16px;
          border-top: 1px solid #e2e8f0;
        }
        
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .mobile-nav a {
          text-decoration: none;
          color: #334155;
          font-weight: 500;
          font-size: 16px;
        }
        
        .mobile-nav a.active {
          color: #4361ee;
        }
        
        .mobile-nav hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 8px 0;
        }
        
        .logout-button {
          text-align: left;
          background: none;
          border: none;
          color: #ef4444;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }
        
        .main-content {
          flex: 1;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          padding: 30px 20px;
        }
        
        .footer {
          background-color: #f8fafc;
          padding: 20px;
          margin-top: auto;
        }
        
        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          
          .mobile-menu-button {
            display: block;
          }
          
          .mobile-menu {
            display: block;
          }
          
          .user-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}