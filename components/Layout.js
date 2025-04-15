// components/Layout.js - Actualización para hacer la sidebar fija
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

const Layout = ({ children, title = 'Portal KPIs', hideHeader = false }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState('generales');
  const contentRef = React.useRef(null);
  
  // Determinar vista activa basada en la ruta
  const getActiveView = () => {
    const path = router.pathname;
    if (path.includes('logs')) return 'logs';
    if (path.includes('procesar-archivos')) return 'files';
    if (path.includes('hours') || path.includes('actualizar-metricas')) return 'hours';
    return 'kpis';
  };
  
  const activeView = getActiveView();
  
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
      const element = contentRef.current;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Portal de KPIs y métricas" />
        <link rel="icon" href="/DCIlogo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/DCIlogo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/DCIlogo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/DCIlogo.png" />
      </Head>

      {/* Mostramos el Header solo si hideHeader es false */}
      {!hideHeader && <Header />}
      
      <div className={`kpi-dashboard ${isFullscreen ? 'fullscreen' : ''}`}>
        {/* Sidebar - no aparece en fullscreen */}
        {!isFullscreen && (
          <div className="sidebar fixed-sidebar">
            <div className="sidebar-content">
              <div className="app-title">KPIs app</div>
              
              <div className="sidebar-divider">Discover</div>
              
              <nav className="sidebar-nav">
                <a 
                  href="/dashboard" 
                  className={`nav-item ${activeView === 'kpis' ? 'active' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>KPIs</span>
                </a>
                
                <a 
                  href="/hours" 
                  className={`nav-item ${activeView === 'hours' ? 'active' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Actualizar métricas</span>
                </a>
                
                <a 
                  href="/logs" 
                  className={`nav-item ${activeView === 'logs' ? 'active' : ''}`}
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
                  href="/procesar-archivos" 
                  className={`nav-item ${activeView === 'files' ? 'active' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  <span>Procesar Archivos</span>
                </a>
              </nav>
            </div>
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
            
            {/* Contenido de la página */}
            {children}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .kpi-dashboard {
          display: flex;
          min-height: 100vh;
          background-color: #fff;
          transition: background-color 0.3s;
        }
        
        .kpi-dashboard.fullscreen {
          min-height: 100vh;
          width: 100vw;
        }
        
        /* Sidebar Styles */
        .sidebar {
          width: 200px;
          background-color: #fff;
          border-right: 1px solid #e0e0f0;
          padding: 0;
          transition: width 0.3s;
        }
        
        .fixed-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          overflow-y: auto;
        }
        
        .sidebar-content {
          padding: 20px 0;
          height: 100%;
          display: flex;
          flex-direction: column;
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
          margin-left: 200px; /* Mismo ancho que la sidebar */
        }
        
        .main-content.fullscreen-content {
          width: 100vw;
          margin-left: 0;
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
          .sidebar {
            width: 100%;
            position: relative;
            height: auto;
          }
          
          .fixed-sidebar {
            position: relative;
            height: auto;
          }
          
          .sidebar-nav {
            flex-direction: row;
            overflow-x: auto;
            padding: 0 10px;
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .kpi-dashboard {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default Layout;