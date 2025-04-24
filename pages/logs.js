// pages/logs.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api';

export default function LogsPage() {
  // Flag para indicar que no queremos mostrar el header en esta página
  const skipHeader = true;
  
  // Estado para los logs
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar logs desde la API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await api.viewLogs();
        if (data && Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error("Error al cargar logs:", err);
        setError("No se pudieron cargar los logs. Por favor, intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);
  
  // Filtrar logs basado en el término de búsqueda
  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    
    // Buscar en el mensaje y nivel del log
    return (
      (log.message && log.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.level && log.level.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  // Mostrar mensaje de carga
  if (loading) {
    return (
      <Layout title="Logs | Portal KPIs" skipHeader={skipHeader}>
        <div className="logs-page">
          <div className="loading-message">
            Cargando logs...
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
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .loading-message {
            color: #666;
            font-size: 16px;
          }
        `}</style>
      </Layout>
    );
  }
  
  // Mostrar mensaje de error
  if (error) {
    return (
      <Layout title="Logs | Portal KPIs" skipHeader={skipHeader}>
        <div className="logs-page">
          <div className="error-message">
            {error}
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
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .error-message {
            color: #e53935;
            font-size: 16px;
          }
        `}</style>
      </Layout>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="logs-list">
            {filteredLogs.length === 0 ? (
              <div className="no-logs-message">
                No se encontraron registros de logs
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

        .no-logs-message {
          text-align: center;
          padding: 40px 0;
          color: #666;
          font-size: 16px;
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