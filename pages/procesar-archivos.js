import styles from '../styles/procesarArchivos.module.css';
import { useState } from 'react';
import Layout from '../components/Layout';

export default function ProcesarArchivosPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filesList = [
    { id: 1, name: 'Reporte_Mensual_Marzo.xlsx', type: 'excel', size: '2.3 MB', date: '25/03/2025' },
    { id: 2, name: 'Indicadores_Q1_2025.pdf', type: 'pdf', size: '4.3 MB', date: '24/03/2025' },
    { id: 3, name: 'Log_Sistema_24_03_2025.csv', type: 'csv', size: '1.2 MB', date: '24/03/2025' },
    { id: 4, name: 'Manual_Usuario_v2.1.docx', type: 'document', size: '8.3 MB', date: '22/03/2025' },
    { id: 5, name: 'Backup_Configuracion.zip', type: 'archive', size: '14.8 MB', date: '20/03/2025' }
  ];

  const showModal = () => {
    console.log('Mostrar modal');
  };

  return (
    <Layout title="Procesar Archivos | Portal KPIs">
      <div className={styles.kpiSection}>
        <h2>ARCHIVOS</h2>
        <h3>Centro de procesamiento de archivos</h3>
      </div>
      
      <div className={styles.filesPage}>
        <div className={styles.pageHeader}>
          <h1>Archivos</h1>
          <button className={styles.uploadButton} onClick={showModal}>Subir Archivo</button>
        </div>

        <div className={styles.searchBox}>
          <input type="text" placeholder="Buscar archivos..." className={styles.searchInput} />
        </div>

        <div className={styles.tabs}>
          {['all', 'documents', 'reports', 'other'].map(tab => (
            <button 
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.filesList}>
          <div className={styles.filesHeader}>
            <div className={styles.fileNameHeader}>Nombre</div>
            <div className={styles.fileTypeHeader}>Tipo</div>
            <div className={styles.fileSizeHeader}>Tamaño</div>
            <div className={styles.fileDateHeader}>Fecha</div>
            <div className={styles.fileActionsHeader}>Acciones</div>
          </div>

          {filesList.map(file => (
            <div key={file.id} className={styles.fileItem}>
              <div className={styles.fileName}>{file.name}</div>
              <div className={styles.fileType}>{file.type.toUpperCase()}</div>
              <div className={styles.fileSize}>{file.size}</div>
              <div className={styles.fileDate}>{file.date}</div>
              <div className={styles.fileActions}>
                <button className={styles.actionButton}>Descargar</button>
                <button className={styles.actionButton}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
