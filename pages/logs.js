// pages/logs.js with API integration
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import ApiService from '../api';

export default function LogsPage() {
  // Flag para indicar que no queremos mostrar el header en esta página
  const skipHeader = true;
  
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  // Fetch logs data from API
  useEffect(() => {
    if (!user) return;
    
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch logs from API
        const response = await ApiService.logs.getLogs();
        
        if (response && response.logs) {
          setLogsData(response.logs);
        } else {
          // Load sample data for demonstration
          loadSampleLogs();
        }
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError('No se pudieron cargar los logs. Por favor, intenta de nuevo más tarde.');
        
        // Load sample data for demonstration
        loadSampleLogs();
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [user]);
  
  // Load sample logs for demonstration
  const loadSampleLogs = () => {
    const sampleLogs = [
      { id: 1, timestamp: '25/03/2025 08:30:45', level: 'info', message: 'Sistema iniciado correctamente' },
      { id: 2, timestamp: '25/03/2025 09:15:22', level: 'warning', message: 'Uso de memoria elevado' },
      { id: 3, timestamp: '25/03/2025 10:20:18', level: 'error', message: 'Fallo en la conexión a la base de datos' },
      { id: 4, timestamp: '25/03/2025 11:05:37', level: 'success', message: 'Copia de seguridad completada' },
      { id: 5, timestamp: '24/03/2025 14:12:50', level: 'info', message: 'Usuario admin ha iniciado sesión' },
      { id: 6, timestamp: '24/03/2025 15:30:22', level: 'warning', message: 'Intento de acceso fallido' }
    ];
    
    setLogsData(sampleLogs);
  };
  
  // Filter logs based on search query
  const filteredLogs = logsData.filter(log => 
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.timestamp.includes(searchQuery)
  );
  
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
    <Layout title="Logs | Portal KPIs" skipHeader={skipHeader}>
      <div className="logs-page">
        <div className="logs-section">
          <div className="section-header">
            <h1>Historial de Logs</h1>
            
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar en logs..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Cargando logs...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setError(null)}>Cerrar</button>
            </div>
          )}

          <div className="logs-list">
            {filteredLogs.length === 0 ? (
              <div className="no-logs">
                <p>No se encontraron logs</p>
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="log-item">
                  <div className="log-header">
                    <div className="log-timestamp">{log.timestamp}</div>
                    <div className={`log-level ${log.level}`}>{log.level.toUpperCase()}</div>
                  </div>
                  <div className="log-message">{log.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .logs-page {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 100%;
          min-height: 500px;
          overflow: hidden;
        }
        
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
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
        
        .error-message {
          background-color: #ffe0e0;
          padding: 15px;
          margin: 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .error-message p {
          color: #e53e3e;
          margin: 0;
        }
        
        .error-message button {
          background-color: #e53e3e;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .no-logs {
          text-align: center;
          padding: 40px 0;
          color: #666;
        }

        .section-header {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .section-header h1 {
          font-size: 20px;
          color: #333;
          margin: 0 0 16px 0;
        }

        .search-container {
          display: flex;
          align-items: center;
        }

        .search-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
        }

        /* Logs Section */
        .logs-list {
          padding: 16px;
        }

        .log-item {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 12px;
          background-color: #fff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          align-items: center;
        }

        .log-timestamp {
          color: #666;
          font-size: 13px;
        }

        .log-level {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: white;
          text-transform: uppercase;
        }

        .log-level.info {
          background-color: #2196f3;
        }

        .log-level.warning {
          background-color: #ff9800;
        }

        .log-level.error {
          background-color: #f44336;
        }

        .log-level.success {
          background-color: #4caf50;
        }

        .log-message {
          font-size: 15px;
          color: #333;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .section-header {
            padding: 16px;
          }
        }
      `}</style>
    </Layout>
  );
}