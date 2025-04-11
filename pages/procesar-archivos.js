// pages/procesar-archivos.js with API integration
import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import ApiService from '../api';

export default function ProcesarArchivosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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

  // Load files from API
  useEffect(() => {
    if (!user) return;
    
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get filter based on active tab
        const filter = activeTab !== 'all' ? { type: activeTab } : {};
        
        // Call API to get files
        const response = await ApiService.files.getFiles(filter);
        
        if (response && response.files) {
          setFilesList(response.files);
        } else {
          // Load sample data if no files or for demo purposes
          loadSampleFiles();
        }
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('No se pudieron cargar los archivos. Por favor, intenta de nuevo.');
        
        // Load sample data for demonstration
        loadSampleFiles();
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, [user, activeTab]);

  // Load sample files data for demonstration
  const loadSampleFiles = () => {
    const sampleFiles = [
      { id: 1, name: 'Reporte_Mensual_Marzo.xlsx', type: 'excel', size: '2.3 MB', date: '25/03/2025' },
      { id: 2, name: 'Indicadores_Q1_2025.pdf', type: 'pdf', size: '4.3 MB', date: '24/03/2025' },
      { id: 3, name: 'Log_Sistema_24_03_2025.csv', type: 'csv', size: '1.2 MB', date: '24/03/2025' },
      { id: 4, name: 'Manual_Usuario_v2.1.docx', type: 'document', size: '8.3 MB', date: '22/03/2025' },
      { id: 5, name: 'Backup_Configuracion.zip', type: 'archive', size: '14.8 MB', date: '20/03/2025' }
    ];
    
    // Filter based on active tab
    if (activeTab !== 'all') {
      const filteredFiles = sampleFiles.filter(file => {
        if (activeTab === 'documents') {
          return ['document', 'pdf'].includes(file.type);
        } else if (activeTab === 'reports') {
          return ['excel', 'csv'].includes(file.type);
        } else if (activeTab === 'other') {
          return !['document', 'pdf', 'excel', 'csv'].includes(file.type);
        }
        return true;
      });
      
      setFilesList(filteredFiles);
    } else {
      setFilesList(sampleFiles);
    }
  };

  // Filter files based on search query
  const filteredFiles = filesList.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file upload
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create FormData and append files
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      // Simulate progress (in a real app, you might get progress from the upload)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);
      
      // Upload files via API
      await ApiService.files.uploadFile(formData);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Close modal and refresh file list after short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setIsModalOpen(false);
        
        // Reload files list
        loadSampleFiles();
      }, 500);
      
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Error al subir los archivos. Por favor, intenta de nuevo.');
      setIsUploading(false);
    }
  };

  // Handle file download
  const handleDownload = async (fileId, fileName) => {
    try {
      // Call API to download file
      const blob = await ApiService.files.downloadFile(fileId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Error al descargar el archivo. Por favor, intenta de nuevo.');
    }
  };

  // Handle file deletion
  const handleDelete = async (fileId) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) return;
    
    try {
      // Call API to delete file
      await ApiService.files.deleteFile(fileId);
      
      // Update files list
      setFilesList(prevFiles => prevFiles.filter(file => file.id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Error al eliminar el archivo. Por favor, intenta de nuevo.');
    }
  };

  // Show loading screen during authentication check
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
    <Layout title="Procesar Archivos | Portal KPIs">
      <div className="kpi-section">
        <h2>ARCHIVOS</h2>
        <h3>Centro de procesamiento de archivos</h3>
      </div>
      
      <div className="files-page">
        {loading && !isUploading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Cargando archivos...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Cerrar</button>
          </div>
        )}
        
        <div className="page-header">
          <div className="header-left">
            <h1>Archivos</h1>
          </div>
          <button className="upload-button" onClick={() => setIsModalOpen(true)}>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="no-files">
              <p>No se encontraron archivos</p>
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
                  <button 
                    className="action-button" 
                    title="Descargar"
                    onClick={() => handleDownload(file.id, file.name)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                  <button 
                    className="action-button" 
                    title="Eliminar"
                    onClick={() => handleDelete(file.id)}
                  >
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

        {isModalOpen && (
          <div className="upload-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Subir Archivos</h2>
                <button 
                  className="close-button"
                  onClick={() => !isUploading && setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                {isUploading ? (
                  <div className="upload-progress">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p>{uploadProgress}% Completado</p>
                  </div>
                ) : (
                  <div className="upload-area">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      style={{ display: 'none' }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <h3>Arrastra archivos aquí</h3>
                    <p>o</p>
                    <button 
                      className="select-files-button"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Seleccionar Archivos
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
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
          border-radius: 8px;
          margin-bottom: 20px;
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

        .no-files {
          text-align: center;
          padding: 40px 0;
          color: #666;
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
        
        .upload-progress {
          padding: 20px;
          text-align: center;
        }
        
        .progress-bar-container {
          height: 8px;
          background-color: #e2e8f0;
          border-radius: 4px;
          margin-bottom: 10px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          height: 100%;
          background-color: #4361ee;
          border-radius: 4px;
          transition: width 0.3s ease;
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