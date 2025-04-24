// pages/procesar-archivos.js
import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import api from '../api';

export default function ProcesarArchivosPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Cargar archivos (esta función es simulada ya que la API proporcionada no tiene un endpoint específico para listar archivos)
  // En una implementación real, se usaría un endpoint específico para obtener la lista de archivos
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        // Simulación de carga de archivos (en una implementación real, esto sería una llamada a la API)
        setTimeout(() => {
          const dummyFiles = [
            { id: 1, name: 'Reporte_Mensual_Marzo.xlsx', type: 'excel', size: '2.3 MB', date: '25/03/2025' },
            { id: 2, name: 'Indicadores_Q1_2025.pdf', type: 'pdf', size: '4.3 MB', date: '24/03/2025' },
            { id: 3, name: 'Log_Sistema_24_03_2025.csv', type: 'csv', size: '1.2 MB', date: '24/03/2025' },
            { id: 4, name: 'Manual_Usuario_v2.1.docx', type: 'document', size: '8.3 MB', date: '22/03/2025' },
            { id: 5, name: 'Backup_Configuracion.zip', type: 'archive', size: '14.8 MB', date: '20/03/2025' }
          ];
          setFiles(dummyFiles);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error al cargar archivos:', err);
        setError('No se pudieron cargar los archivos. Por favor, intenta nuevamente más tarde.');
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Filtrar archivos basado en el término de búsqueda y la pestaña activa
  const filteredFiles = files.filter(file => {
    // Filtrar por término de búsqueda
    const matchesSearch = !searchTerm || 
      (file.name && file.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtrar por categoría (tab)
    let matchesTab = true;
    if (activeTab !== 'all') {
      const categoryMap = {
        'documents': ['document', 'pdf'],
        'reports': ['excel', 'csv'],
        'other': ['archive']
      };
      
      matchesTab = categoryMap[activeTab] && categoryMap[activeTab].includes(file.type);
    }
    
    return matchesSearch && matchesTab;
  });

  // Manejar la selección de archivos
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Manejar la subida de archivos (los Excel se procesarán con la API, otros tipos se simularán)
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      
      // Si es un archivo Excel, usamos la API para procesarlo
      if (selectedFile.name.toLowerCase().endsWith('.xlsx') || 
          selectedFile.name.toLowerCase().endsWith('.xls')) {
        await api.uploadExcelLog(selectedFile);
        alert('Archivo Excel procesado correctamente');
      } else {
        // Simulamos la carga para otros tipos de archivos
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`Archivo ${selectedFile.name} subido correctamente`);
      }
      
      // Añadir el archivo a la lista (en una implementación real, se recargarían los archivos desde la API)
      const newFile = {
        id: files.length + 1,
        name: selectedFile.name,
        type: getFileType(selectedFile.name),
        size: formatFileSize(selectedFile.size),
        date: new Date().toLocaleDateString('es-ES')
      };
      
      setFiles([newFile, ...files]);
      setSelectedFile(null);
      setShowModal(false);
      
      // Limpiar el input de archivos
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error('Error al subir archivo:', err);
      alert(`Error al subir el archivo: ${err.message || 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  // Determinar el tipo de archivo basado en la extensión
  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    const typeMap = {
      'xlsx': 'excel',
      'xls': 'excel',
      'pdf': 'pdf',
      'csv': 'csv',
      'doc': 'document',
      'docx': 'document',
      'zip': 'archive',
      'rar': 'archive'
    };
    
    return typeMap[extension] || 'other';
  };

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Simular la descarga de un archivo
  const handleDownload = (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      alert(`Descargando: ${file.name}`);
    }
  };

  // Simular la eliminación de un archivo
  const handleDelete = (fileId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este archivo?');
    
    if (confirmDelete) {
      setFiles(files.filter(f => f.id !== fileId));
    }
  };

  // Mostrar mensaje de carga
  if (loading) {
    return (
      <Layout title="Procesar Archivos | Portal KPIs">
        <div className="kpi-section">
          <h2>ARCHIVOS</h2>
          <h3>Centro de procesamiento de archivos</h3>
        </div>
        
        <div className="files-page loading-container">
          <div className="loading-message">Cargando archivos...</div>
        </div>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
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
      <Layout title="Procesar Archivos | Portal KPIs">
        <div className="kpi-section">
          <h2>ARCHIVOS</h2>
          <h3>Centro de procesamiento de archivos</h3>
        </div>
        
        <div className="files-page error-container">
          <div className="error-message">{error}</div>
        </div>
        
        <style jsx>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
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
          <button className="upload-button" onClick={() => setShowModal(true)}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

          {filteredFiles.length === 0 ? (
            <div className="no-files-message">
              No se encontraron archivos
            </div>
          ) : (
            filteredFiles.map(file => (
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
                  <button className="action-button" title="Descargar" onClick={() => handleDownload(file.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                  <button className="action-button" title="Eliminar" onClick={() => handleDelete(file.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de subida de archivos */}
        <div className="upload-modal" style={{ display: showModal ? 'flex' : 'none' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Subir Archivos</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="upload-area" 
                   onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                
                {selectedFile ? (
                  <div className="selected-file">
                    <h3>Archivo seleccionado:</h3>
                    <p className="file-name">{selectedFile.name}</p>
                    <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                  </div>
                ) : (
                  <>
                    <h3>Arrastra archivos aquí</h3>
                    <p>o</p>
                  </>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileSelect}
                />
                
                {!selectedFile && (
                  <button className="select-files-button" onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current && fileInputRef.current.click();
                  }}>
                    Seleccionar Archivos
                  </button>
                )}
                
                {selectedFile && (
                  <div className="upload-actions">
                    <button 
                      className="upload-button-modal" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpload();
                      }}
                      disabled={uploading}
                    >
                      {uploading ? 'Procesando...' : 'Subir Archivo'}
                    </button>
                    <button 
                      className="cancel-button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      disabled={uploading}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
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
          position: relative;
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

        .no-files-message {
          text-align: center;
          padding: 40px 0;
          color: #666;
          font-size: 14px;
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

        .selected-file {
          margin-bottom: 20px;
        }

        .selected-file .file-name {
          font-weight: 500;
          margin: 8px 0;
          display: block;
        }

        .selected-file .file-size {
          color: #666;
          width: auto;
          display: block;
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

        .upload-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }

        .upload-button-modal {
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .upload-button-modal:hover:not(:disabled) {
          background-color: #3a56d4;
        }

        .upload-button-modal:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .cancel-button {
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cancel-button:hover:not(:disabled) {
          background-color: #e2e8f0;
        }

        .cancel-button:disabled {
          color: #cbd5e1;
          border-color: #e2e8f0;
          cursor: not-allowed;
        }

        /* Responsive Adjustments */
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
            width: 100%;
          }

          .file-type, .file-size, .file-date {
            width: auto;
            margin-right: 16px;
            font-size: 12px;
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