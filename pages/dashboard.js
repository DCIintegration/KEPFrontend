import styles from '../styles/dashboard.module.css';
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
  
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setIsAuthChecking(false);
    }, 100);
    
    return () => clearTimeout(checkAuth);
  }, []);
  
  useEffect(() => {
    if (!isAuthChecking && !user) {
      router.push('/login');
    }
  }, [user, router, isAuthChecking]);

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
  
  const generateRandomData = (rows, columns) => {
    const data = [];
    const headers = [];
    
    if (activeSection === 'kpis') {
      headers.push('Métrica', 'Actual', 'Objetivo', 'Variación', 'Estado');
    } else if (activeSection === 'admin') {
      headers.push('Departamento', 'Presupuesto', 'Gastos', 'Restante', 'Porcentaje');
    } else if (activeSection === 'engineering') {
      headers.push('Proyecto', 'Progreso', 'Horas', 'Equipo', 'Deadline');
    }
    
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
  
  const renderTable = () => {
    const { headers, data } = generateRandomData(8, 5);
    
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
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
                  <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  if (!user || isAuthChecking) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }
  
  return (
    <Layout title="Panel de Control">
      <div className={styles.tabsContainer}>
        <div className={`${styles.tab} ${activeSection === 'kpis' ? styles.active : ''}`} onClick={() => changeSection('kpis')}>KPIs</div>
        <div className={`${styles.tab} ${activeSection === 'admin' ? styles.active : ''}`} onClick={() => changeSection('admin')}>Administración</div>
        <div className={`${styles.tab} ${activeSection === 'engineering' ? styles.active : ''}`} onClick={() => changeSection('engineering')}>Ingeniería</div>
      </div>
      
      <div className={`${styles.sectionContainer} ${animating ? styles.fadeOut : styles.fadeIn}`}>
        <h2>{activeSection.toUpperCase()}</h2>
        <div className={styles.contentContainer}>{renderTable()}</div>
      </div>
    </Layout>
  );
}