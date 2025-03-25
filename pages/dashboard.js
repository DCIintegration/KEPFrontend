import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
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
  
  // Generate dummy KPI bars for visualization
  const generateKpiBars = () => {
    const sections = [];
    
    for (let i = 0; i < 2; i++) {
      const rows = [];
      
      for (let j = 0; j < 4; j++) {
        rows.push(
          <div key={`kpi-${i}-${j}`} className="kpi-card">
            <div className="kpi-bars">
              <div className="bar bar-1" style={{ height: `${20 + Math.random() * 30}px` }}></div>
              <div className="bar bar-2" style={{ height: `${40 + Math.random() * 40}px` }}></div>
              <div className="bar bar-3" style={{ height: `${60 + Math.random() * 40}px` }}></div>
            </div>
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
  
  // Show loading state during authentication check
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
    <Layout title="KPIs | Panel de Control">
      <div className="kpi-section">
        <h2>KPIS</h2>
        <h3>Indicadores de Productividad Generales</h3>
      </div>
      
      <div className="kpis-container">
        <div className="kpi-grid">
          {generateKpiBars()}
        </div>
      </div>

      <style jsx>{`
        .kpi-section {
          margin-bottom: 20px;
        }
        
        .kpi-section h2 {
          font-size: 20px;
          color: #333;
          margin: 0 0 5px 0;
        }
        
        .kpi-section h3 {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: normal;
        }
        
        .kpis-container {
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
          align-items: flex-end;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          position: relative;
        }
        
        .kpi-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .kpi-bars {
          display: flex;
          align-items: flex-end;
          gap: 15px;
          height: 100%;
        }
        
        .bar {
          width: 10px;
          background-color: #333;
          border-radius: 2px 2px 0 0;
        }
        
        .bar-1 {
          height: 40px;
        }
        
        .bar-2 {
          height: 60px;
        }
        
        .bar-3 {
          height: 80px;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .kpi-row {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
}