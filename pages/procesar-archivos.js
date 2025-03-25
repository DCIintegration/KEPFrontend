// pages/procesar-archivos.js
import { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function ProcesarArchivosPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Datos simulados de archivos - mínimos y simplificados
  const filesList = [
    { id: 1, name: 'Reporte_Mensual_Marzo.xlsx', type: 'excel', size: '2.3 MB', date: '25/03/2025' },
    { id: 2, name: 'Indicadores_Q1_2025.pdf', type: 'pdf', size: '4.3 MB', date: '24/03/2025' },
    { id: 3, name: 'Log_Sistema_24_03_2025.csv', type: 'csv', size: '1.2 MB', date: '24/03/2025' },
    { id: 4, name: 'Manual_Usuario_v2.1.docx', type: 'document', size: '8.3 MB', date: '22/03/2025' },
    { id: 5, name: 'Backup_Configuracion.zip', type: 'archive', size: '14.8 MB', date: '20/03/2025' }
  ];

  // Función simple para mostrar el modal (sin implementación completa)
  const showModal = () => {
    console.log('Mostrar modal');
    // Aquí implementarías la lógica para mostrar el modal
  };

  return (
    <Layout title="Procesar Archivos | Portal KPIs">
      <div className="kpi-section">
        <h2>ARCHIVOS</h2>
        <h3>Centro de procesamiento de archivos</h3>
      </div>
      
      <div className="files-page">
        <div className="page-header">
          <div className="header-left">
            <h1>Archivos</h1>
          </div>
          <button className="upload-button" onClick={showModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Subir Archivo
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar archivos..."
            className="search-input"
          />
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Todos
          </button>
          <button 
            className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documentos
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reportes
          </button>
          <button 
            className={`tab ${activeTab === 'other' ? 'active' : ''}`}
            onClick={() => setActiveTab('other')}
          >
            Otros
          </button>
        </div>

        <div className="files-list">
          <div className="files-header">
            <div className="file-name-header">Nombre</div>
            <div className="file-type-header">Tipo</div>
            <div className="file-size-header">Tamaño</div>
            <div className="file-date-header">Fecha</div>
            <div className="file-actions-header">Acciones</div>
          </div>

          {filesList.map(file => (
            <div key={file.id} className="file-item">
              <div className="file-name">
                <div className="file-icon">
                  {file.type === 'excel' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10793F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  )}
                  {file.type === 'pdf' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  )}
                  {file.type === 'document' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2980B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  )}
                  {file.type === 'csv' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E44AD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  )}
                  {file.type === 'archive' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F39C12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <rect x="8" y="12" width="8" height="6" rx="1"></rect>
                    </svg>
                  )}
                </div>
                {file.name}
              </div>
              <div className="file-type">{file.type.toUpperCase()}</div>
              <div className="file-size">{file.size}</div>
              <div className="file-date">{file.date}</div>
              <div className="file-actions">
                <button className="action-button" title="Descargar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
                <button className="action-button" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="upload-modal" style={{ display: 'none' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Subir Archivos</h2>
              <button className="close-button">×</button>
            </div>
            <div className="modal-body">
              <div className="upload-area">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <h3>Arrastra archivos aquí</h3>
                <p>o</p>
                <button className="select-files-button">Seleccionar Archivos</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .files-page {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          min-height: 500px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-left h1 {
          font-size: 20px;
          color: #333;
          margin: 0;
        }

        .upload-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .upload-button:hover {
          background-color: #3a56d4;
        }

        .search-box {
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 20px;
        }

        .tab {
          padding: 10px 16px;
          background: none;
          border: none;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          position: relative;
        }

        .tab.active {
          color: #4361ee;
          font-weight: 500;
        }

        .tab.active:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #4361ee;
        }

        .files-list {
          width: 100%;
        }

        .files-header {
          display: flex;
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          font-weight: 500;
          color: #666;
          font-size: 14px;
          background-color: #f9f9f9;
        }

        .file-name-header {
          flex: 1;
        }

        .file-type-header {
          width: 80px;
        }

        .file-size-header {
          width: 80px;
        }

        .file-date-header {
          width: 100px;
        }

        .file-actions-header {
          width: 80px;
          text-align: right;
        }

        .file-item {
          display: flex;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
          transition: background-color 0.2s;
        }

        .file-item:hover {
          background-color: #f9f9f9;
        }

        .file-name {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .file-icon {
          display: flex;
          margin-right: 8px;
        }

        .file-type {
          width: 80px;
          font-size: 12px;
          color: #666;
        }

        .file-size {
          width: 80px;
          font-size: 13px;
          color: #666;
        }

        .file-date {
          width: 100px;
          font-size: 13px;
          color: #666;
        }

        .file-actions {
          width: 80px;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .action-button {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .action-button:hover {
          background-color: #f0f0f0;
          color: #333;
        }

        /* Upload Modal */
        .upload-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          border-radius: 8px;
          width: 500px;
          max-width: 90%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          padding: 16px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
        }

        .upload-area {
          border: 2px dashed #e0e0e0;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          transition: border-color 0.3s;
        }

        .upload-area:hover {
          border-color: #4361ee;
        }

        .upload-area svg {
          color: #4361ee;
          margin-bottom: 16px;
        }

        .upload-area h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #333;
        }

        .upload-area p {
          margin: 0 0 16px 0;
          color: #666;
        }

        .select-files-button {
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .select-files-button:hover {
          background-color: #3a56d4;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .files-header {
            display: none; /* Hide header on mobile */
          }

          .file-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 16px;
            gap: 8px;
          }

          .file-name {
            margin-bottom: 4px;
          }

          .file-type, .file-size, .file-date {
            width: auto;
            margin-right: 16px;
          }

          .file-actions {
            width: 100%;
            justify-content: flex-start;
            margin-top: 8px;
          }
        }
      `}</style>
    </Layout>
  );
}