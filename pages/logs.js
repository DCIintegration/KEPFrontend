// pages/logs.js
import { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState('logs');

  // Datos simulados de logs - mínimos y simplificados
  const logsData = [
    { id: 1, timestamp: '25/03/2025 08:30:45', level: 'info', message: 'Sistema iniciado correctamente' },
    { id: 2, timestamp: '25/03/2025 09:15:22', level: 'warning', message: 'Uso de memoria elevado' },
    { id: 3, timestamp: '25/03/2025 10:20:18', level: 'error', message: 'Fallo en la conexión a la base de datos' },
    { id: 4, timestamp: '25/03/2025 11:05:37', level: 'success', message: 'Copia de seguridad completada' },
    { id: 5, timestamp: '24/03/2025 14:12:50', level: 'info', message: 'Usuario admin ha iniciado sesión' },
    { id: 6, timestamp: '24/03/2025 15:30:22', level: 'warning', message: 'Intento de acceso fallido' }
  ];

  // Datos simulados de issues activos - mínimos y simplificados
  const issuesList = [
    { id: 'FID-123', title: 'Error de autenticación en API', priority: 'High' },
    { id: 'FID-122', title: 'Actualizar dependencias', priority: 'Low' },
    { id: 'FID-121', title: 'Optimización de consultas SQL', priority: 'Medium' }
  ];

  return (
    <Layout title="Logs & Issues | Portal KPIs">
      <div className="kpi-section">
        <h2>LOGS</h2>
        <h3>Centro de monitoreo de actividad</h3>
      </div>
      
      <div className="logs-page">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            Historial de Logs
          </button>
          <button
            className={`tab-button ${activeTab === 'active-issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('active-issues')}
          >
            Issues Activos
          </button>
          <button
            className={`tab-button ${activeTab === 'file-upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('file-upload')}
          >
            Subir Archivos
          </button>
        </div>

        {activeTab === 'logs' && (
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
        )}

        {activeTab === 'active-issues' && (
          <div className="issues-section">
            <div className="section-header">
              <h1>Issues Activos</h1>
              
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar tickets..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="issues-list">
              {issuesList.map(issue => (
                <div key={issue.id} className="issue-item">
                  <div className="issue-id">{issue.id}</div>
                  <div className="issue-title">{issue.title}</div>
                  <div className={`issue-priority ${issue.priority.toLowerCase()}`}>
                    {issue.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'file-upload' && (
          <div className="upload-section">
            <div className="section-header">
              <h1>Subir Archivos</h1>
            </div>
            
            <div className="upload-area">
              <div className="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3>Arrastra y suelta archivos aquí</h3>
              <p>o</p>
              <div className="file-input-container">
                <input 
                  type="file" 
                  id="file-input" 
                  className="file-input" 
                  multiple 
                />
                <label htmlFor="file-input" className="file-input-label">
                  Seleccionar Archivos
                </label>
              </div>
            </div>
            
            <div className="recent-files">
              <h3>Archivos Recientes</h3>
              <div className="file-list">
                <div className="file-item">
                  <div className="file-name">Reporte_Marzo_2025.xlsx</div>
                  <div className="file-size">256 KB</div>
                  <div className="file-date">25/03/2025</div>
                </div>
                <div className="file-item">
                  <div className="file-name">Logs_Sistema_24_03_2025.csv</div>
                  <div className="file-size">1.2 MB</div>
                  <div className="file-date">24/03/2025</div>
                </div>
              </div>
            </div>
          </div>
        )}
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

        .tab-navigation {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          background-color: #f8f8f8;
        }

        .tab-button {
          padding: 14px 20px;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .tab-button:hover {
          color: #4361ee;
        }

        .tab-button.active {
          color: #4361ee;
        }

        .tab-button.active:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #4361ee;
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

        /* Issues Section */
        .issues-list {
          padding: 16px;
        }

        .issue-item {
          display: flex;
          align-items: center;
          padding: 16px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          margin-bottom: 12px;
          background-color: #fff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .issue-id {
          width: 90px;
          color: #666;
          font-size: 14px;
        }

        .issue-title {
          flex: 1;
          font-weight: 500;
          font-size: 15px;
        }

        .issue-priority {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: white;
          text-transform: uppercase;
        }

        .issue-priority.high {
          background-color: #f44336;
        }

        .issue-priority.medium {
          background-color: #ff9800;
        }

        .issue-priority.low {
          background-color: #4caf50;
        }

        /* Upload Section */
        .upload-section {
          padding: 0 0 24px 0;
        }

        .upload-area {
          margin: 20px;
          border: 2px dashed #e0e0e0;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          transition: border-color 0.3s;
        }

        .upload-area:hover {
          border-color: #4361ee;
        }

        .upload-icon {
          color: #4361ee;
          margin-bottom: 16px;
        }

        .upload-area h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #333;
        }

        .upload-area p {
          margin: 0 0 16px 0;
          color: #666;
        }

        .file-input-container {
          position: relative;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          width: 0.1px;
          height: 0.1px;
          overflow: hidden;
        }

        .file-input-label {
          padding: 10px 20px;
          background-color: #4361ee;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: inline-block;
          transition: background-color 0.3s;
        }

        .file-input-label:hover {
          background-color: #3a56d4;
        }

        /* Recent files */
        .recent-files {
          margin: 20px;
        }

        .recent-files h3 {
          font-size: 18px;
          color: #333;
          margin: 0 0 16px 0;
        }

        .file-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 6px;
          background-color: #f9f9f9;
          border: 1px solid #e0e0e0;
        }

        .file-name {
          font-size: 15px;
          color: #333;
          flex: 1;
        }

        .file-size, .file-date {
          font-size: 13px;
          color: #666;
          margin-left: 16px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .tab-button {
            padding: 12px 16px;
            font-size: 14px;
          }

          .section-header {
            padding: 16px;
          }

          .file-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .file-size, .file-date {
            margin-left: 0;
            margin-top: 4px;
          }

          .upload-area {
            padding: 20px;
          }
        }
      `}</style>
    </Layout>
  );
}