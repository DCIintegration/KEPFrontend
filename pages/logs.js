// pages/logs.js
import { useState } from 'react';
import Layout from '../components/Layout';

export default function LogsPage() {
  // Flag para indicar que no queremos mostrar el header en esta página
  const skipHeader = true;
  
  // Datos simulados de logs - mínimos y simplificados
  const logsData = [
    { id: 1, timestamp: '25/03/2025 08:30:45', level: 'info', message: 'Sistema iniciado correctamente' },
    { id: 2, timestamp: '25/03/2025 09:15:22', level: 'warning', message: 'Uso de memoria elevado' },
    { id: 3, timestamp: '25/03/2025 10:20:18', level: 'error', message: 'Fallo en la conexión a la base de datos' },
    { id: 4, timestamp: '25/03/2025 11:05:37', level: 'success', message: 'Copia de seguridad completada' },
    { id: 5, timestamp: '24/03/2025 14:12:50', level: 'info', message: 'Usuario admin ha iniciado sesión' },
    { id: 6, timestamp: '24/03/2025 15:30:22', level: 'warning', message: 'Intento de acceso fallido' }
  ];

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
              />
            </div>
          </div>

          <div className="logs-list">
            {logsData.map(log => (
              <div key={log.id} className="log-item">
                <div className="log-header">
                  <div className="log-timestamp">{log.timestamp}</div>
                  <div className={`log-level ${log.level}`}>{log.level.toUpperCase()}</div>
                </div>
                <div className="log-message">{log.message}</div>
              </div>
            ))}
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