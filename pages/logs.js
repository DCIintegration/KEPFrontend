import styles from '../styles/logs.module.css';
import { useState } from 'react';
import Layout from '../components/Layout';

export default function LogsPage() {
  const skipHeader = true;
  
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
      <div className={styles.logsPage}>
        <div className={styles.logsSection}>
          <div className={styles.sectionHeader}>
            <h1>Historial de Logs</h1>
            
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Buscar en logs..."
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.logsList}>
            {logsData.map(log => (
              <div key={log.id} className={styles.logItem}>
                <div className={styles.logHeader}>
                  <div className={styles.logTimestamp}>{log.timestamp}</div>
                  <div className={`${styles.logLevel} ${styles[log.level]}`}>
                    {log.level.toUpperCase()}
                  </div>
                </div>
                <div className={styles.logMessage}>{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
