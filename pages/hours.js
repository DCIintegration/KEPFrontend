// pages/hours.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Head from 'next/head';
import api from '../api';

export default function HoursPage() {
  const { user } = useAuth();
  const router = useRouter();
  
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
  
  // Estados para gestión del componente
  const [selectedArea, setSelectedArea] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Datos de métricas por defecto (se usarán hasta que se carguen los datos reales)
  const defaultMetricasPorArea = {
    'todas': {
      ingresoLaboralDirecto: 85000,
      ingresoLaboralIndirecto: 35000, 
      numeroTotalEmpleados: 25,
      ingresoLaboral: 120000,
      cantidadEmpleadosFacturables: 18,
      horasLaboralesDirectas: 2800,
      horasTotalesLaborales: 4000,
      dolaresLaboralesDirectos: 75000,
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
  
  // Estados para las métricas
  const [metricasPorArea, setMetricasPorArea] = useState(defaultMetricasPorArea);
  const [metricas, setMetricas] = useState(defaultMetricasPorArea['todas']);
  const [originalMetricas, setOriginalMetricas] = useState(defaultMetricasPorArea);
  
  // Efecto para cargar las métricas desde la API
  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // En una implementación real, esta sería una llamada a la API
        // const response = await api.getMetricas();
        
        // Simulamos una respuesta de la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = defaultMetricasPorArea; // Aquí usaríamos los datos reales de la API
        
        // Guardar las métricas originales para poder resetear
        setOriginalMetricas(JSON.parse(JSON.stringify(response)));
        
        // Establecer las métricas por área y las métricas actuales
        setMetricasPorArea(response);
        setMetricas(response[selectedArea]);
      } catch (err) {
        console.error('Error al cargar métricas:', err);
        setError('No se pudieron cargar las métricas. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetricas();
  }, []);
  
  // Efecto para actualizar las métricas cuando cambia el área seleccionada
  useEffect(() => {
    if (metricasPorArea && metricasPorArea[selectedArea]) {
      setMetricas({...metricasPorArea[selectedArea]});
    }
  }, [selectedArea, metricasPorArea]);
  
  // Actualizar el valor de una métrica
  const updateMetrica = (campo, valor) => {
    const nuevoValor = parseInt(valor) || 0;
    
    // Actualizar el estado local de métricas
    setMetricas(prevMetricas => ({
      ...prevMetricas,
      [campo]: nuevoValor
    }));
    
    // Actualizar el objeto de métricas por área
    setMetricasPorArea(prevMetricasPorArea => ({
      ...prevMetricasPorArea,
      [selectedArea]: {
        ...prevMetricasPorArea[selectedArea],
        [campo]: nuevoValor
      }
    }));
  };
  
  // Función para reiniciar valores a los originales
  const resetearValores = () => {
    if (originalMetricas && originalMetricas[selectedArea]) {
      // Resetear a los valores originales
      setMetricas({...originalMetricas[selectedArea]});
      
      // Actualizar también en el objeto de métricas por área
      setMetricasPorArea(prevMetricasPorArea => ({
        ...prevMetricasPorArea,
        [selectedArea]: {...originalMetricas[selectedArea]}
      }));
    }
  };
  
  // Función para guardar los cambios
  const guardarCambios = async () => {
    try {
      setSaving(true);
      
      // Preparar los datos para enviar a la API
      const datosParaEnviar = {
        area: selectedArea,
        metricas: {...metricas}
      };
      
      // En una implementación real, haríamos la llamada a la API
      // await api.updateMetricas(datosParaEnviar);
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizar las métricas originales con los nuevos valores
      setOriginalMetricas(prevOriginalMetricas => ({
        ...prevOriginalMetricas,
        [selectedArea]: {...metricas}
      }));
      
      // Mostrar mensaje de éxito
      alert('Cambios guardados correctamente');
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      alert('Error al guardar los cambios. Por favor, intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };
  
  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando métricas...</p>
      </div>
    );
  }
  
  // Mostrar pantalla de error
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }
  
  return (
    <div className="metricas-container">
      {/* Selector de área */}
      <div className="area-selector">
        <label htmlFor="area-select">Filtrar por área:</label>
        <select 
          id="area-select"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          disabled={saving}
        >
          {areas.map(area => (
            <option key={area.id} value={area.id}>{area.nombre}</option>
          ))}
        </select>
      </div>
      
      {/* Grid de métricas */}
      <div className="metricas-grid">
        {/* Tarjeta de Ingresos */}
        <div className="metrica-card">
          <h4>Ingresos</h4>
          
          <div className="input-group">
            <label>Ingreso Laboral Directo</label>
            <input 
              type="number"
              value={metricas.ingresoLaboralDirecto}
              onChange={(e) => updateMetrica('ingresoLaboralDirecto', e.target.value)}
              disabled={saving}
            />
          </div>
          
          <div className="input-group">
            <label>Ingreso Laboral Indirecto</label>
            <input 
              type="number"
              value={metricas.ingresoLaboralIndirecto}
              onChange={(e) => updateMetrica('ingresoLaboralIndirecto', e.target.value)}
              disabled={saving}
            />
          </div>
          
          <div className="input-group">
            <label>Ingreso Laboral</label>
            <input 
              type="number"
              value={metricas.ingresoLaboral}
              onChange={(e) => updateMetrica('ingresoLaboral', e.target.value)}
              disabled={saving}
            />
          </div>
          
          <div className="input-group">
            <label>Ingreso Total</label>
            <input 
              type="number"
              value={metricas.ingresoTotal}
              onChange={(e) => updateMetrica('ingresoTotal', e.target.value)}
              disabled={saving}
            />
          </div>
        </div>
        
        {/* Tarjeta de Empleados */}
        <div className="metrica-card">
          <h4>Empleados</h4>
          
          <div className="input-group">
            <label>Número Total de Empleados</label>
            <input 
              type="number"
              value={metricas.numeroTotalEmpleados}
              onChange={(e) => updateMetrica('numeroTotalEmpleados', e.target.value)}
              disabled={saving}
            />
          </div>
          
          <div className="input-group">
            <label>Cantidad de Empleados Facturables</label>
            <input 
              type="number"
              value={metricas.cantidadEmpleadosFacturables}
              onChange={(e) => updateMetrica('cantidadEmpleadosFacturables', e.target.value)}
              disabled={saving}
            />
          </div>
        </div>
        
        {/* Tarjeta de Horas */}
        <div className="metrica-card">
          <h4>Horas</h4>
          
          <div className="input-group">
            <label>Horas Laborales Directas</label>
            <input 
              type="number"
              value={metricas.horasLaboralesDirectas}
              onChange={(e) => updateMetrica('horasLaboralesDirectas', e.target.value)}
              disabled={saving}
            />
          </div>
          
          <div className="input-group">
            <label>Horas Totales Laborales</label>
            <input 
              type="number"
              value={metricas.horasTotalesLaborales}
              onChange={(e) => updateMetrica('horasTotalesLaborales', e.target.value)}
              disabled={saving}
            />
          </div>
        </div>
        
        {/* Tarjeta de Costos */}
        <div className="metrica-card">
          <h4>Costos</h4>
          
          <div className="input-group">
            <label>Dólares Laborales Directos</label>
            <input 
              type="number"
              value={metricas.dolaresLaboralesDirectos}
              onChange={(e) => updateMetrica('dolaresLaboralesDirectos', e.target.value)}
              disabled={saving}
            />
          </div>
          
          <div className="input-group">
            <label>Dólares Totales Laborales</label>
            <input 
              type="number"
              value={metricas.dolaresTotalesLaborales}
              onChange={(e) => updateMetrica('dolaresTotalesLaborales', e.target.value)}
              disabled={saving}
            />
          </div>
          
          <div className="input-group">
            <label>Costo Laboral Directo</label>
            <input 
              type="number"
              value={metricas.costoLaboralDirecto}
              onChange={(e) => updateMetrica('costoLaboralDirecto', e.target.value)}
              disabled={saving}
            />
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="buttons-container">
        <button 
          className="save-button" 
          onClick={guardarCambios}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner"></span>
              <span>Guardando...</span>
            </>
          ) : 'Guardar Cambios'}
        </button>
        <button 
          className="reset-button" 
          onClick={resetearValores}
          disabled={saving}
        >
          Reiniciar
        </button>
      </div>

      {/* Resumen de métricas */}
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
      {selectedArea === 'todas' && (
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
                {areas.filter(area => area.id !== 'todas').map(area => {
                  const areaData = metricasPorArea[area.id];
                  const margen = areaData.ingresoLaboral > 0 
                    ? ((areaData.ingresoLaboral - areaData.dolaresTotalesLaborales) / areaData.ingresoLaboral * 100).toFixed(1)
                    : 0;
                    
                  return (
                    <tr key={area.id}>
                      <td>{area.nombre}</td>
                      <td>${areaData.ingresoTotal.toLocaleString()}</td>
                      <td>{areaData.numeroTotalEmpleados}</td>
                      <td>{areaData.cantidadEmpleadosFacturables} ({((areaData.cantidadEmpleadosFacturables / areaData.numeroTotalEmpleados) * 100).toFixed(0)}%)</td>
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
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #4361ee;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }
        
        .error-message {
          color: #e53935;
          margin-bottom: 16px;
        }
        
        .retry-button {
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
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
        
        .input-group input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
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
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .save-button:hover:not(:disabled) {
          background-color: #3651d4;
        }
        
        .save-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }
        
        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
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
        
        .reset-button:hover:not(:disabled) {
          background-color: #e2e8f0;
        }
        
        .reset-button:disabled {
          color: #cbd5e1;
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
        
        /* Responsive design */
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
          
          .comparison-table {
            font-size: 14px;
          }
          
          .comparison-table th,
          .comparison-table td {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
}