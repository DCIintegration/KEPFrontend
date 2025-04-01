import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeSection, setActiveSection] = useState('kpis');
  const [animating, setAnimating] = useState(false);
  
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

  // Función para cambiar de sección con animación
  const changeSection = (section) => {
    if (section === activeSection || animating) return;
    
    setAnimating(true);
    setTimeout(() => {
      setActiveSection(section);
      setTimeout(() => {
        setAnimating(false);
      }, 500);
    }, 500);
  };
  
  // Generar datos aleatorios para tablas
  const generateRandomData = (rows, columns) => {
    const data = [];
    const headers = [];
    
    // Generar encabezados según la sección
    if (activeSection === 'kpis') {
      headers.push('Métrica', 'Actual', 'Objetivo', 'Variación', 'Estado');
    } else if (activeSection === 'admin') {
      headers.push('Departamento', 'Presupuesto', 'Gastos', 'Restante', 'Porcentaje');
    } else if (activeSection === 'engineering') {
      headers.push('Proyecto', 'Progreso', 'Horas', 'Equipo', 'Deadline');
    }
    
    // Generar filas aleatorias
    for (let i = 0; i < rows; i++) {
      const row = [];
      
      if (activeSection === 'kpis') {
        const actual = Math.floor(Math.random() * 100);
        const objetivo = Math.floor(70 + Math.random() * 30);
        const variacion = actual - objetivo;
        
        row.push(
          `KPI-${i + 1}`,
          `${actual}%`,
          `${objetivo}%`,
          `${variacion > 0 ? '+' : ''}${variacion}%`,
          variacion >= 0 ? 'Cumplido' : 'Pendiente'
        );
      } else if (activeSection === 'admin') {
        const presupuesto = Math.floor(10000 + Math.random() * 90000);
        const gastos = Math.floor(presupuesto * (0.3 + Math.random() * 0.7));
        const restante = presupuesto - gastos;
        const porcentaje = Math.floor((restante / presupuesto) * 100);
        
        row.push(
          `Depto-${i + 1}`,
          `$${presupuesto.toLocaleString()}`,
          `$${gastos.toLocaleString()}`,
          `$${restante.toLocaleString()}`,
          `${porcentaje}%`
        );
      } else if (activeSection === 'engineering') {
        const progreso = Math.floor(Math.random() * 100);
        const horas = Math.floor(40 + Math.random() * 160);
        
        row.push(
          `Proyecto-${i + 1}`,
          `${progreso}%`,
          `${horas}h`,
          `Equipo ${String.fromCharCode(65 + i)}`,
          `${Math.floor(1 + Math.random() * 28)}/${Math.floor(1 + Math.random() * 12)}/2025`
        );
      }
      
      data.push(row);
    }
    
    return { headers, data };
  };
  
  // Generar KPI bars para visualización
  const generateKpiBars = () => {
    const sections = [];
    
    for (let i = 0; i < 2; i++) {
      const rows = [];
      
      for (let j = 0; j < 4; j++) {
        rows.push(
          <div key={`kpi-${i}-${j}`} className="kpi-card">
            <div className="kpi-title">{`Indicador ${i * 4 + j + 1}`}</div>
            <div className="kpi-bars">
              <div className="bar bar-1" style={{ height: `${20 + Math.random() * 30}px` }}></div>
              <div className="bar bar-2" style={{ height: `${40 + Math.random() * 40}px` }}></div>
              <div className="bar bar-3" style={{ height: `${60 + Math.random() * 40}px` }}></div>
            </div>
            <div className="kpi-value">{`${Math.floor(75 + Math.random() * 20)}%`}</div>
          </div>
        );
      }
      
      sections.push(
        <div key={`section-${i}`} className="kpi-row">
          {rows}
        </div>
      );
    }
    
    return sections;
  };

  // Renderizar tabla según la sección activa
  const renderTable = () => {
    const { headers, data } = generateRandomData(8, 5);
    
    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={`header-${index}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`}>
                    {cellIndex === 4 && activeSection === 'kpis' ? (
                      <span className={`status ${cell === 'Cumplido' ? 'success' : 'warning'}`}>
                        {cell}
                      </span>
                    ) : cellIndex === 1 && activeSection === 'engineering' ? (
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: cell }}
                        ></div>
                        <span>{cell}</span>
                      </div>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Mostrar estado de carga durante la verificación de autenticación
  if (!user || isAuthChecking) {
    return (
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
    );
  }
  
  return (
    <Layout title={`${activeSection === 'kpis' ? 'KPIs' : activeSection === 'admin' ? 'Administración' : 'Ingeniería'} | Panel de Control`}>
      <div className="tabs-container">
        <div 
          className={`tab ${activeSection === 'kpis' ? 'active' : ''}`} 
          onClick={() => changeSection('kpis')}
        >
          KPIs Generales
        </div>
        <div 
          className={`tab ${activeSection === 'admin' ? 'active' : ''}`} 
          onClick={() => changeSection('admin')}
        >
          Administración
        </div>
        <div 
          className={`tab ${activeSection === 'engineering' ? 'active' : ''}`} 
          onClick={() => changeSection('engineering')}
        >
          Ingeniería
        </div>
      </div>
      
      <div className={`section-container ${animating ? 'fade-out' : 'fade-in'}`}>
        <div className="section-header">
          <h2>{activeSection === 'kpis' ? 'KPIs' : activeSection === 'admin' ? 'Administración' : 'Ingeniería'}</h2>
          <h3>
            {activeSection === 'kpis' 
              ? 'Indicadores de Productividad Generales' 
              : activeSection === 'admin' 
                ? 'Control de Presupuesto y Recursos' 
                : 'Seguimiento de Proyectos Técnicos'}
          </h3>
        </div>
        
        <div className="content-container">
          {activeSection === 'kpis' && (
            <>
              <div className="kpi-grid">
                {generateKpiBars()}
              </div>
              {renderTable()}
            </>
          )}
          
          {(activeSection === 'admin' || activeSection === 'engineering') && (
            renderTable()
          )}
        </div>
      </div>

      <style jsx>{`
        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .tab {
          padding: 12px 20px;
          background-color: #f1f5f9;
          border-radius: 8px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .tab:hover {
          background-color: #e2e8f0;
        }
        
        .tab.active {
          background-color: #4361ee;
          color: white;
        }
        
        .section-container {
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .fade-out {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .fade-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .section-header {
          margin-bottom: 20px;
        }
        
        .section-header h2 {
          font-size: 20px;
          color: #333;
          margin: 0 0 5px 0;
        }
        
        .section-header h3 {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: normal;
        }
        
        .content-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          min-height: 500px;
        }
        
        /* KPI Grid Layout */
        .kpi-grid {
          display: flex;
          flex-direction: column;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .kpi-row {
          display: flex;
          gap: 30px;
        }
        
        .kpi-card {
          flex: 1;
          height: 150px;
          background-color: #fff;
          border-radius: 4px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          position: relative;
        }
        
        .kpi-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .kpi-title {
          font-size: 14px;
          color: #64748b;
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
        }
        
        .kpi-value {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }
        
        .kpi-bars {
          display: flex;
          align-items: flex-end;
          gap: 15px;
          height: 60%;
        }
        
        .bar {
          width: 10px;
          border-radius: 2px 2px 0 0;
        }
        
        .bar-1 {
          background-color: #94a3b8;
        }
        
        .bar-2 {
          background-color: #64748b;
        }
        
        .bar-3 {
          background-color: #334155;
        }
        
        /* Table Styles */
        .table-container {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th, .data-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .data-table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #475569;
        }
        
        .data-table tr:hover {
          background-color: #f1f5f9;
        }
        
        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .status.success {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status.warning {
          background-color: #fff7ed;
          color: #c2410c;
        }
        
        .progress-bar-container {
          width: 100px;
          height: 12px;
          background-color: #f1f5f9;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background-color: #4361ee;
          border-radius: 6px;
        }
        
        .progress-bar-container span {
          position: absolute;
          top: -2px;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 10px;
          color: #fff;
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .kpi-row {
            flex-direction: column;
          }
          
          .tabs-container {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
}