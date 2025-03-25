// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeView, setActiveView, activeSection, setActiveSection }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = React.useRef(null);
  
  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
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

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Request fullscreen solo para el área de contenido
      const element = contentRef.current;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE11 */
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      }
    }
  };

  return (
    <div className={`layout-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Sidebar - no aparece en fullscreen */}
      {!isFullscreen && (
        <div className="sidebar">
          <div className="app-title">KPIs app</div>
          
          <div className="sidebar-divider">Discover</div>
          
          <nav className="sidebar-nav">
            <a 
              href="#" 
              className={`nav-item ${activeView === 'kpis' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('kpis');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>KPIs</span>
            </a>
            
            <a 
              href="#" 
              className={`nav-item ${activeView === 'hours' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('hours');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Actualizar métricas</span>
            </a>
            
            <a 
              href="#" 
              className={`nav-item ${activeView === 'logs' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('logs');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Log</span>
            </a>
            
            <a 
              href="#" 
              className={`nav-item ${activeView === 'files' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('files');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
              <span>Procesar Archivos</span>
            </a>
          </nav>
        </div>
      )}
      
      {/* Main Content */}
      <div className={`main-content ${isFullscreen ? 'fullscreen-content' : ''}`}>
        {/* Top Navigation - no aparece en fullscreen */}
        {!isFullscreen && (
          <div className="top-nav">
            <div className="section-tabs">
              <button 
                className={activeSection === 'generales' ? 'active' : ''} 
                onClick={() => setActiveSection('generales')}
              >
                Generales
              </button>
              <button 
                className={activeSection === 'proyectos' ? 'active' : ''} 
                onClick={() => setActiveSection('proyectos')}
              >
                Proyectos
              </button>
              <button 
                className={activeSection === 'administracion' ? 'active' : ''} 
                onClick={() => setActiveSection('administracion')}
              >
                Administración
              </button>
            </div>
            
            <button className="fullscreen-button" onClick={toggleFullscreen}>
              Pantalla Completa
            </button>
          </div>
        )}
        
        {/* Content Area */}
        <div ref={contentRef} className="content-area">
          {/* Botón para salir de fullscreen, solo visible en modo fullscreen */}
          {isFullscreen && (
            <button className="exit-fullscreen-button" onClick={toggleFullscreen}>
              Salir
            </button>
          )}
          
          {/* Aquí irá el contenido específico de cada vista */}
          {/* Los hijos se renderizarán aquí */}
          {props.children}
        </div>
      </div>

      <style jsx>{`
        .layout-container {
          display: flex;
          min-height: 100vh;
          background-color: #fff;
          transition: background-color 0.3s;
        }
        
        .layout-container.fullscreen {
          min-height: 100vh;
          width: 100vw;
        }
        
        /* Sidebar Styles */
        .sidebar {
          width: 200px;
          background-color: #fff;
          border-right: 1px solid #e0e0f0;
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          transition: width 0.3s;
        }
        
        .app-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          padding: 0 16px 15px;
        }
        
        .sidebar-divider {
          font-size: 14px;
          color: #666;
          padding: 8px 16px;
          margin-top: 5px;
        }
        
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          color: #555;
          text-decoration: none;
          transition: background-color 0.2s;
          margin: 2px 0;
          border-radius: 4px;
        }
        
        .nav-item svg {
          margin-right: 10px;
        }
        
        .nav-item.active {
          background-color: #f0f0f5;
          color: #4361ee;
          font-weight: 500;
        }
        
        .nav-item:hover:not(.active) {
          background-color: #f8f8f8;
        }
        
        /* Main Content Styles */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .main-content.fullscreen-content {
          width: 100vw;
        }
        
        /* Top Navigation */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          border-bottom: 1px solid #e0e0f0;
        }
        
        .section-tabs {
          display: flex;
        }
        
        .section-tabs button {
          background: none;
          border: none;
          font-size: 15px;
          padding: 8px 15px;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }
        
        .section-tabs button.active {
          color: #333;
          font-weight: 500;
          position: relative;
        }
        
        .section-tabs button.active::after {
          content: '';
          position: absolute;
          bottom: -16px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #4361ee;
        }
        
        .fullscreen-button {
          background-color: #000;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        
        .fullscreen-button:hover {
          background-color: #333;
        }
        
        .exit-fullscreen-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          z-index: 100;
          transition: background-color 0.3s;
        }
        
        .exit-fullscreen-button:hover {
          background-color: #000;
        }
        
        /* Content Area */
        .content-area {
          flex: 1;
          padding: 30px;
          position: relative;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .layout-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e0e0f0;
            padding: 10px 0;
          }
          
          .sidebar-nav {
            flex-direction: row;
            overflow-x: auto;
            padding: 0 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;