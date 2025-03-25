import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check scroll position for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link href={user ? '/dashboard' : '/'}>
            <span className="logo-text">Portal Web</span>
          </Link>
        </div>
        
        {user && (
          <>
            <button 
              className="menu-toggle" 
              onClick={toggleMenu}
              aria-label="Alternar menú"
            >
              <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
            
            <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
              <ul className="nav-list">
                <li className="nav-item">
                  <Link href="/dashboard">
                    <span className={router.pathname === '/dashboard' ? 'active' : ''}>
                      Panel de Control
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/profile">
                    <span className={router.pathname === '/profile' ? 'active' : ''}>
                      Perfil
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/settings">
                    <span className={router.pathname === '/settings' ? 'active' : ''}>
                      Configuración
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="logout-button" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
      
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .header.scrolled {
          height: 60px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .logo {
          display: flex;
          align-items: center;
        }
        
        .logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #4361ee;
          cursor: pointer;
        }
        
        .nav-menu {
          display: flex;
        }
        
        .nav-list {
          display: flex;
          list-style: none;
        }
        
        .nav-item {
          margin-left: 30px;
        }
        
        .nav-item span {
          font-size: 16px;
          color: #555555;
          cursor: pointer;
          transition: color 0.3s;
          position: relative;
        }
        
        .nav-item span:hover,
        .nav-item span.active {
          color: #4361ee;
        }
        
        .nav-item span.active:after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #4361ee;
        }
        
        .logout-button {
          background: none;
          border: none;
          font-size: 16px;
          color: #f72585;
          cursor: pointer;
          transition: color 0.3s;
        }
        
        .logout-button:hover {
          color: #b5179e;
        }
        
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          width: 30px;
          height: 30px;
          position: relative;
          cursor: pointer;
        }
        
        .menu-icon,
        .menu-icon:before,
        .menu-icon:after {
          width: 30px;
          height: 3px;
          background-color: #333333;
          position: absolute;
          transition: all 0.3s ease;
        }
        
        .menu-icon {
          top: 14px;
        }
        
        .menu-icon:before {
          content: '';
          top: -8px;
        }
        
        .menu-icon:after {
          content: '';
          top: 8px;
        }
        
        .menu-icon.open {
          background-color: transparent;
        }
        
        .menu-icon.open:before {
          transform: rotate(45deg);
          top: 0;
        }
        
        .menu-icon.open:after {
          transform: rotate(-45deg);
          top: 0;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
            z-index: 1001;
          }
          
          .nav-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 100%;
            max-width: 300px;
            height: 100vh;
            background-color: #ffffff;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .nav-menu.open {
            right: 0;
          }
          
          .nav-list {
            flex-direction: column;
            align-items: center;
            padding: 0;
          }
          
          .nav-item {
            margin: 15px 0;
          }
          
          .nav-item span.active:after {
            bottom: -3px;
          }
        }
      `}</style>
    </header>
  );
}