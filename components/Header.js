import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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
  
  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  
  
  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link href={user ? '/dashboard' : '/'}>
            <div className="logo-image">
              <img src="/DCIlogo.png" alt="DCI Logo" width={140} height={40} />
            </div>
            <button 
                onClick={handleLogout} 
                className="logout-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Cerrar sesión</span>
              </button>
            
          </Link>
          
        </div>
        
        {user && (
          <div className="nav-actions">
            {/* Dropdown de Configuración */}
            <div className="config-dropdown" ref={dropdownRef}>
              <button 
                className="config-button" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Configuración</span>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">Perfil de Usuario</div>
                  <div className="dropdown-item">Preferencias</div>
                  <div className="dropdown-item">Notificaciones</div>
                  <div className="dropdown-item">Apariencia</div>
                </div>
              )}
            </div>
            
            <button className="logout-button" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid #e0e0e0;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .header.scrolled {
          height: 60px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
        
        .logo-image {
          cursor: pointer;
          display: flex;
          align-items: center;
          height: 40px;
        }
        
        .logo-image img {
          max-height: 100%;
          width: auto;
          object-fit: contain;
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .config-dropdown {
          position: relative;
        }
        
        .config-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          font-size: 16px;
          color: #555555;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .config-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 8px 0;
          min-width: 180px;
          z-index: 1001;
          border: 1px solid #eee;
        }
        
        .dropdown-item {
          padding: 10px 16px;
          color: #555;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
          color: #4361ee;
        }
        
        .logout-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          font-size: 16px;
          color: #f72585;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: all 0.3s;
        }
        
        .logout-button:hover {
          background-color: rgba(247, 37, 133, 0.1);
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .nav-actions {
            gap: 8px;
          }
          
          .config-button span, 
          .logout-button span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}