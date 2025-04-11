// pages/metricas.js with API integration
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Head from 'next/head';
import ApiService from '../api';

export default function MetricasPage() {
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

  // Mostrar estado de carga durante la verificación de autenticación
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
    <Layout title="Métricas Laborales | Panel de Control">
      <div className="page-container">
        <div className="page-header">
          <h1>Métricas Laborales</h1>
          <p>Gestión de indicadores de rendimiento laboral</p>
        </div>
        
        <div className="content-container">
          <MetricasLaborales />
        </div>
      </div>
      
      <style jsx>{`
        .page-container {
          padding: 20px;
        }
        
        .page-header {
          margin-bottom: 30px;
        }
        
        .page-header h1 {
          font-size: 24px;
          color: #333;
          margin: 0 0 8px 0;
        }
        
        .page-header p {
          font-size: 16px;
          color: #666;
          margin: 0;
        }
        
        .content-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }
      `}</style>
    </Layout>
  );
}

// Componente de Métricas Laborales
function MetricasLaborales() {
  // Lista de áreas disponibles
  const areas = [
    { id: 'todas', nombre: 'Todas las áreas' },
    { id: 'ing', nombre: 'Ingeniería' },
    { id: 'dis', nombre: 'Diseño' },
    { id: 'adm', nombre: 'Administración' },
    { id: 'sis', nombre: 'Sistemas' }
  ];
  
  // Estado para el área seleccionada
  const [selectedArea, setSelectedArea] = useState('todas');
  
  // Datos iniciales vacíos de métricas por área
  const [metricasPorArea, setMetricasPorArea] = useState({
    'todas': {
      ingresoLaboralDirecto: 0,
      ingresoLaboralIndirecto: 0, 
      numeroTotalEmpleados: 0,
      ingresoLaboral: 0,
      cantidadEmpleadosFacturables: 0,
      horasLaboralesDirectas: 0,
      horasTotalesLaborales: 0,
      dolaresLaboralesDirectos: 0,
      dolaresTotalesLaborales: 0,
      costoLaboralDirecto: 0,
      ingresoTotal: 0
    }
  });
  
  // Estado para las métricas actuales
  const [metricas, setMetricas] = useState(metricasPorArea['todas']);
  
  // Estado para manejo de carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Cargar datos de métricas desde la API
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Llamada a la API para obtener métricas
        const response = await ApiService.hours.getMetrics();
        
        if (response && response.areas) {
          // Actualizar estado con los datos de la API
          setMetricasPorArea(response.areas);
          
          // Establecer métricas actuales según el área seleccionada
          if (response.areas[selectedArea]) {
            setMetricas(response.areas[selectedArea]);
          } else {
            setMetricas(response.areas['todas']);
          }
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('No se pudieron cargar los datos de métricas. Por favor, intenta de nuevo más tarde.');
        
        // Cargar datos de prueba para demostración en caso de error
        loadTestData();
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);
  
  // Función para cargar datos de prueba en caso de error o para demostración
  const loadTestData = () => {
    const testData = {
      'todas': {
        ingresoLaboralDirecto: 85000,
        ingresoLaboralIndirecto: 35000, 
        numeroTotalEmpleados: 25,
        ingresoLaboral: 120000,
        cantidadEmpleadosFacturables: 18,
        horasLaboralesDirectas: 2800,
        horasTotalesLaborales: 4000,
        dolaresLaboralesDirectos: 6000,
        dolaresTotalesLaborales: 15000,
        costoLaboralDirecto: 5000,
        ingresoTotal: 18000
      },
      'sis': {
        ingresoLaboralDirecto: 17000,
        ingresoLaboralIndirecto: 5000, 
        numeroTotalEmpleados: 4,
        ingresoLaboral: 22000,
        cantidadEmpleadosFacturables: 3,
        horasLaboralesDirectas: 400,
        horasTotalesLaborales: 640,
        dolaresLaboralesDirectos: 15000,
        dolaresTotalesLaborales: 22000,
        costoLaboralDirecto: 12000,
        ingresoTotal: 34000
      }
    };
    
    setMetricasPorArea(testData);
    setMetricas(testData[selectedArea]);
  };
  
  // Actualizar métricas al cambiar de área
  useEffect(() => {
    if (metricasPorArea[selectedArea]) {
      setMetricas({...metricasPorArea[selectedArea]});
    }
  }, [selectedArea, metricasPorArea]);

  // Actualizar el valor de una métrica
  const updateMetrica = (campo, valor) => {
    const nuevoValor = parseInt(valor) || 0;
    
    // Actualizar el estado local
    setMetricas({
      ...metricas,
      [campo]: nuevoValor
    });
    
    // También actualizar en el objeto de datos por área
    setMetricasPorArea({
      ...metricasPorArea,
      [selectedArea]: {
        ...metricasPorArea[selectedArea],
        [campo]: nuevoValor
      }
    });
  };
  
  // Función para reiniciar los valores
  const resetearValores = () => {
    // En caso de integración con API, podríamos recargar los datos originales
    // Por ahora, simplemente recargamos los valores actuales del área desde loadTestData
    loadTestData();
    setSaveSuccess(false);
  };
  
  // Función para guardar cambios (integrada con API)
  const guardarCambios = async () => {
    setLoading(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      // Preparar datos para enviar a la API
      const datosParaEnviar = {
        area: selectedArea,
        metricas: metricas
      };
      
      // Llamada a la API para actualizar métricas
      await ApiService.hours.updateMetrics(datosParaEnviar);
      
      // Mostrar mensaje de éxito
      setSaveSuccess(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving metrics:', err);
      setError('No se pudieron guardar los cambios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="metricas-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Procesando...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Cerrar</button>
        </div>
      )}
      
      {saveSuccess && (
        <div className="success-message">
          <p>Cambios guardados correctamente</p>
        </div>
      )}
      
      {/* Selector de área */}
      <div className="area-selector">
        <label htmlFor="area-select">Filtrar por área:</label>
        <select 
          id="area-select"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          disabled={loading}
        >
          {areas.map(area => (
            <option key={area.id} value={area.id}>{area.nombre}</option>
          ))}
        </select>
      </div>
      
      <div className="metricas-grid">
        <div className="metrica-card">
          <h4>Ingresos</h4>
          
          <div className="input-group">
            <label>Ingreso Laboral Directo</label>
            <input 
              type="number"
              value={metricas.ingresoLaboralDirecto}
              onChange={(e) => updateMetrica('ingresoLaboralDirecto', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Ingreso Laboral Indirecto</label>
            <input 
              type="number"
              value={metricas.ingresoLaboralIndirecto}
              onChange={(e) => updateMetrica('ingresoLaboralIndirecto', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Ingreso Laboral</label>
            <input 
              type="number"
              value={metricas.ingresoLaboral}
              onChange={(e) => updateMetrica('ingresoLaboral', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Ingreso Total</label>
            <input 
              type="number"
              value={metricas.ingresoTotal}
              onChange={(e) => updateMetrica('ingresoTotal', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="metrica-card">
          <h4>Empleados</h4>
          
          <div className="input-group">
            <label>Número Total de Empleados</label>
            <input 
              type="number"
              value={metricas.numeroTotalEmpleados}
              onChange={(e) => updateMetrica('numeroTotalEmpleados', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Cantidad de Empleados Facturables</label>
            <input 
              type="number"
              value={metricas.cantidadEmpleadosFacturables}
              onChange={(e) => updateMetrica('cantidadEmpleadosFacturables', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="metrica-card">
          <h4>Horas</h4>
          
          <div className="input-group">
            <label>Horas Laborales Directas</label>
            <input 
              type="number"
              value={metricas.horasLaboralesDirectas}
              onChange={(e) => updateMetrica('horasLaboralesDirectas', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Horas Totales Laborales</label>
            <input 
              type="number"
              value={metricas.horasTotalesLaborales}
              onChange={(e) => updateMetrica('horasTotalesLaborales', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="metrica-card">
          <h4>Costos</h4>
          
          <div className="input-group">
            <label>Dólares Laborales Directos</label>
            <input 
              type="number"
              value={metricas.dolaresLaboralesDirectos}
              onChange={(e) => updateMetrica('dolaresLaboralesDirectos', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Dólares Totales Laborales</label>
            <input 
              type="number"
              value={metricas.dolaresTotalesLaborales}
              onChange={(e) => updateMetrica('dolaresTotalesLaborales', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Costo Laboral Directo</label>
            <input 
              type="number"
              value={metricas.costoLaboralDirecto}
              onChange={(e) => updateMetrica('costoLaboralDirecto', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
      
      <div className="buttons-container">
        <button 
          className="save-button" 
          onClick={guardarCambios}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        <button 
          className="reset-button" 
          onClick={resetearValores}
          disabled={loading}
        >
          Reiniciar
        </button>
      </div>

      <div className="summary-container">
        <h3>Resumen de Métricas{selectedArea !== 'todas' ? ` - ${areas.find(a => a.id === selectedArea).nombre}` : ''}</h3>
        
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">Utilización de Empleados</div>
            <div className="summary-value">
              {metricas.numeroTotalEmpleados > 0 
                ? ((metricas.cantidadEmpleadosFacturables / metricas.numeroTotalEmpleados) * 100).toFixed(1) 
                : 0}%
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${metricas.numeroTotalEmpleados > 0 
                    ? ((metricas.cantidadEmpleadosFacturables / metricas.numeroTotalEmpleados) * 100) 
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">Utilización de Horas</div>
            <div className="summary-value">
              {metricas.horasTotalesLaborales > 0 
                ? ((metricas.horasLaboralesDirectas / metricas.horasTotalesLaborales) * 100).toFixed(1) 
                : 0}%
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${metricas.horasTotalesLaborales > 0 
                    ? ((metricas.horasLaboralesDirectas / metricas.horasTotalesLaborales) * 100) 
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">Margen Bruto</div>
            <div className="summary-value">
              {metricas.ingresoLaboral > 0 
                ? ((metricas.ingresoLaboral - metricas.dolaresTotalesLaborales) / metricas.ingresoLaboral * 100).toFixed(1) 
                : 0}%
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${metricas.ingresoLaboral > 0 
                    ? ((metricas.ingresoLaboral - metricas.dolaresTotalesLaborales) / metricas.ingresoLaboral * 100) 
                    : 0}%`,
                  backgroundColor: '#4ade80' 
                }}
              ></div>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">Ingresos por Empleado</div>
            <div className="summary-value">
              ${metricas.numeroTotalEmpleados > 0 
                ? Math.round(metricas.ingresoTotal / metricas.numeroTotalEmpleados).toLocaleString() 
                : 0}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabla comparativa de áreas */}
      {selectedArea === 'todas' && Object.keys(metricasPorArea).length > 1 && (
        <div className="comparison-container">
          <h3>Comparativa por Áreas</h3>
          <div className="table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Ingresos</th>
                  <th>Empleados</th>
                  <th>Facturables</th>
                  <th>Horas Directas</th>
                  <th>Costos</th>
                  <th>Margen</th>
                </tr>
              </thead>
              <tbody>
                {areas.filter(area => area.id !== 'todas' && metricasPorArea[area.id]).map(area => {
                  const areaData = metricasPorArea[area.id];
                  const margen = areaData.ingresoLaboral > 0 
                    ? ((areaData.ingresoLaboral - areaData.dolaresTotalesLaborales) / areaData.ingresoLaboral * 100).toFixed(1)
                    : 0;
                    
                  return (
                    <tr key={area.id}>
                      <td>{area.nombre}</td>
                      <td>${areaData.ingresoTotal.toLocaleString()}</td>
                      <td>{areaData.numeroTotalEmpleados}</td>
                      <td>{areaData.cantidadEmpleadosFacturables} ({areaData.numeroTotalEmpleados > 0 ? ((areaData.cantidadEmpleadosFacturables / areaData.numeroTotalEmpleados) * 100).toFixed(0) : 0}%)</td>
                      <td>{areaData.horasLaboralesDirectas.toLocaleString()}</td>
                      <td>${areaData.dolaresTotalesLaborales.toLocaleString()}</td>
                      <td>
                        <span className={parseFloat(margen) > 30 ? 'success' : parseFloat(margen) > 15 ? 'warning' : 'danger'}>
                          {margen}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .metricas-container {
          margin-top: 20px;
          position: relative;
        }
        
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
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
        
        .success-message {
          background-color: #d4edda;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .success-message p {
          color: #155724;
          margin: 0;
        }
        
        .area-selector {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 8px;
        }
        
        .area-selector label {
          font-weight: 500;
          color: #475569;
        }
        
        .area-selector select {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          min-width: 200px;
        }
        
        .metricas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .metrica-card {
          border: 1px solid #e1e1e1;
          border-radius: 8px;
          padding: 20px;
          transition: box-shadow 0.3s;
        }
        
        .metrica-card:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .metrica-card h4 {
          font-size: 18px;
          margin-bottom: 15px;
          color: #4361ee;
          padding-bottom: 8px;
          border-bottom: 1px solid #e1e1e1;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }
        
        .input-group label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .input-group input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        
        .buttons-container {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .save-button {
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .save-button:hover {
          background-color: #3651d4;
        }
        
        .save-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }
        
        .reset-button {
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .reset-button:hover {
          background-color: #e2e8f0;
        }
        
        .reset-button:disabled {
          background-color: #f1f5f9;
          color: #a0aec0;
          cursor: not-allowed;
        }
        
        .summary-container {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 24px;
          margin-top: 20px;
          margin-bottom: 30px;
        }
        
        .summary-container h3 {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .summary-item {
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .summary-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }
        
        .summary-value {
          font-size: 22px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }
        
        .progress-bar {
          height: 8px;
          background-color: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background-color: #4361ee;
          border-radius: 4px;
        }
        
        /* Estilos para la tabla comparativa */
        .comparison-container {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 24px;
          margin-top: 20px;
        }
        
        .comparison-container h3 {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
        }
        
        .comparison-table th,
        .comparison-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .comparison-table th {
          background-color: #f1f5f9;
          font-weight: 600;
          color: #475569;
        }
        
        .comparison-table tr:hover {
          background-color: #f8fafc;
        }
        
        .success {
          color: #16a34a;
        }
        
        .warning {
          color: #ca8a04;
        }
        
        .danger {
          color: #dc2626;
        }
        
        @media (max-width: 768px) {
          .metricas-grid,
          .summary-grid {
            grid-template-columns: 1fr;
          }
          
          .buttons-container {
            flex-direction: column;
          }
          
          .save-button,
          .reset-button {
            width: 100%;
          }
          
          .area-selector {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .area-selector select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
} 75000,
        dolaresTotalesLaborales: 110000,
        costoLaboralDirecto: 65000,
        ingresoTotal: 150000
      },
      'ing': {
        ingresoLaboralDirecto: 45000,
        ingresoLaboralIndirecto: 15000, 
        numeroTotalEmpleados: 12,
        ingresoLaboral: 60000,
        cantidadEmpleadosFacturables: 10,
        horasLaboralesDirectas: 1600,
        horasTotalesLaborales: 1920,
        dolaresLaboralesDirectos: 42000,
        dolaresTotalesLaborales: 55000,
        costoLaboralDirecto: 38000,
        ingresoTotal: 72000
      },
      'dis': {
        ingresoLaboralDirecto: 15000,
        ingresoLaboralIndirecto: 8000, 
        numeroTotalEmpleados: 5,
        ingresoLaboral: 23000,
        cantidadEmpleadosFacturables: 3,
        horasLaboralesDirectas: 480,
        horasTotalesLaborales: 800,
        dolaresLaboralesDirectos: 12000,
        dolaresTotalesLaborales: 18000,
        costoLaboralDirecto: 10000,
        ingresoTotal: 26000
      },
      'adm': {
        ingresoLaboralDirecto: 8000,
        ingresoLaboralIndirecto: 7000, 
        numeroTotalEmpleados: 4,
        ingresoLaboral: 15000,
        cantidadEmpleadosFacturables: 2,
        horasLaboralesDirectas: 320,
        horasTotalesLaborales: 640,
        dolaresLaboralesDirectos: