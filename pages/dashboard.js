import styles from '../styles/dashboard.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Importación dinámica para evitar errores de SSR con Recharts
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('kpis');
  const [activeModule, setActiveModule] = useState('horas'); // 'horas', 'salarios', o 'metricas'
  const [animating, setAnimating] = useState(false);
  
  // Datos de métricas
  const [metricas, setMetricas] = useState({
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
  });

  // Eliminamos la verificación de autenticación que causa problemas

  const changeSection = (section) => {
    if (section === activeSection || animating) return;
    
    setAnimating(true);
    setTimeout(() => {
      setActiveSection(section);
      setTimeout(() => {
        setAnimating(false);
      }, 500);
    }, 500);
  };

  // Función para cambiar módulo
  const changeModule = (module) => {
    setActiveModule(module);
  };
  
  // Formatear números con comas para miles
  const formatoNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Datos para el gráfico de empleados
  const datosEmpleados = [
    { name: 'Facturables', valor: metricas.cantidadEmpleadosFacturables },
    { name: 'No Facturables', valor: metricas.numeroTotalEmpleados - metricas.cantidadEmpleadosFacturables }
  ];
  
  // Datos para el gráfico de horas
  const datosHoras = [
    { name: 'Horas Directas', valor: metricas.horasLaboralesDirectas },
    { name: 'Horas Indirectas', valor: metricas.horasTotalesLaborales - metricas.horasLaboralesDirectas }
  ];
  
  // Datos para el gráfico de ingresos
  const datosIngresos = [
    { name: 'Laboral Directo', valor: metricas.ingresoLaboralDirecto },
    { name: 'Laboral Indirecto', valor: metricas.ingresoLaboralIndirecto },
    { name: 'Otros', valor: metricas.ingresoTotal - metricas.ingresoLaboral }
  ];
  
  // Datos para el gráfico de tendencias
  const datosTendencia = [
    { mes: 'Ene', ingreso: 125000, horas: 3600 },
    { mes: 'Feb', ingreso: 130000, horas: 3700 },
    { mes: 'Mar', ingreso: 142000, horas: 3850 },
    { mes: 'Abr', ingreso: 135000, horas: 3750 },
    { mes: 'May', ingreso: 148000, horas: 3920 },
    { mes: 'Jun', ingreso: 150000, horas: 4000 }
  ];
  
  // Colores para los gráficos
  const colores = ['#4361ee', '#3f37c9', '#0096c7', '#0077b6', '#48cae4'];
  
  // Paso 1: Define un estado para los datos de la tabla
  const [tableData, setTableData] = useState(null);

  // Paso 2: Utiliza useEffect para generar los datos solo en el cliente
  useEffect(() => {
    // Esta función solo se ejecutará en el cliente
    const generateTableData = () => {
      const data = [];
      const headers = [];
      
      if (activeSection === 'kpis') {
        headers.push('Métrica', 'Actual', 'Objetivo', 'Variación', 'Estado');
      } else if (activeSection === 'admin') {
        headers.push('Departamento', 'Presupuesto', 'Gastos', 'Restante', 'Porcentaje');
      } else if (activeSection === 'engineering') {
        headers.push('Proyecto', 'Progreso', 'Horas', 'Equipo', 'Deadline');
      }
      
      for (let i = 0; i < 8; i++) {
        const row = [];
        
        if (activeSection === 'kpis') {
          const actual = Math.floor(Math.random() * 100);
          const objetivo = Math.floor(70 + Math.random() * 30);
          const variacion = actual - objetivo;
          
          row.push(
            `KPI-${i + 1}`,
            `${actual}%`,
            `${objetivo}%`,
            `${variacion > 0 ? '+' : ''}${variacion}%`,
            variacion >= 0 ? 'Cumplido' : 'Pendiente'
          );
        } else if (activeSection === 'admin') {
          const presupuesto = Math.floor(10000 + Math.random() * 90000);
          const gastos = Math.floor(presupuesto * (0.3 + Math.random() * 0.7));
          const restante = presupuesto - gastos;
          const porcentaje = Math.floor((restante / presupuesto) * 100);
          
          row.push(
            `Depto-${i + 1}`,
            `$${presupuesto.toLocaleString()}`,
            `$${gastos.toLocaleString()}`,
            `$${restante.toLocaleString()}`,
            `${porcentaje}%`
          );
        } else if (activeSection === 'engineering') {
          const progreso = Math.floor(Math.random() * 100);
          const horas = Math.floor(40 + Math.random() * 160);
          
          row.push(
            `Proyecto-${i + 1}`,
            `${progreso}%`,
            `${horas}h`,
            `Equipo ${String.fromCharCode(65 + i)}`,
            `${Math.floor(1 + Math.random() * 28)}/${Math.floor(1 + Math.random() * 12)}/2025`
          );
        }
        
        data.push(row);
      }
      
      setTableData({ headers, data });
    };
    
    // Generar los datos cuando cambie la sección activa
    generateTableData();
  }, [activeSection]);

  // Paso 3: Mantén la función generateRandomData vacía o elimínala
  // (para mantener compatibilidad con otras partes del código que puedan llamarla)
  const generateRandomData = () => {
    return { headers: [], data: [] };
  };

  // Paso 4: Modifica la función renderTable
  const renderTable = () => {
    // Para el renderizado en el servidor o antes de que se ejecute el efecto
    if (typeof window === 'undefined' || !tableData) {
      return (
        <div className={styles.tableContainer}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Cargando datos...
          </div>
        </div>
      );
    }
    
    const { headers, data } = tableData;
    
    return (
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={`header-${index}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Renderizar el módulo del Portal de KPIs
  const renderKPIPortal = () => {
    return (
      <div className="kpi-dashboard">
        <h2 className="dashboard-title">Dashboard de Métricas Laborales</h2>
        
        <div className="stats-container">
          <div className="stats-row">
            {/* Empleados */}
            <div className="stats-card">
              <h3 className="card-title">Empleados</h3>
              <div className="stat-details">
                <div className="stat-summary">
                  <div className="stat-item">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">{formatoNumero(metricas.numeroTotalEmpleados)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Facturables:</span>
                    <span className="stat-value">{formatoNumero(metricas.cantidadEmpleadosFacturables)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">% Facturables:</span>
                    <span className="stat-value">{((metricas.cantidadEmpleadosFacturables / metricas.numeroTotalEmpleados) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={datosEmpleados}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {datosEmpleados.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}`, 'Cantidad']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Horas */}
            <div className="stats-card">
              <h3 className="card-title">Horas</h3>
              <div className="stat-details">
                <div className="stat-summary">
                  <div className="stat-item">
                    <span className="stat-label">Horas Directas:</span>
                    <span className="stat-value">{formatoNumero(metricas.horasLaboralesDirectas)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Horas Totales:</span>
                    <span className="stat-value">{formatoNumero(metricas.horasTotalesLaborales)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">% Utilización:</span>
                    <span className="stat-value">{((metricas.horasLaboralesDirectas / metricas.horasTotalesLaborales) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={datosHoras}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {datosHoras.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${formatoNumero(value)} horas`, 'Cantidad']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Ingresos */}
            <div className="stats-card">
              <h3 className="card-title">Ingresos</h3>
              <div className="stat-details">
                <div className="stat-summary">
                  <div className="stat-item">
                    <span className="stat-label">Ingreso Laboral:</span>
                    <span className="stat-value">${formatoNumero(metricas.ingresoLaboral)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ingreso Total:</span>
                    <span className="stat-value">${formatoNumero(metricas.ingresoTotal)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">% del Total:</span>
                    <span className="stat-value">{((metricas.ingresoLaboral / metricas.ingresoTotal) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={datosIngresos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${formatoNumero(value)}`, 'Ingreso']} />
                      <Bar dataKey="valor" fill="#8884d8">
                        {datosIngresos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tendencias y Resumen Financiero */}
        <div className="stats-container">
          <div className="stats-row">
            {/* Tendencias */}
            <div className="stats-card wide">
              <h3 className="card-title">Tendencias (6 meses)</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={datosTendencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [
                      name === 'ingreso' ? `$${formatoNumero(value)}` : `${formatoNumero(value)} h`,
                      name === 'ingreso' ? 'Ingreso' : 'Horas'
                    ]} />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="ingreso" 
                      stroke={colores[0]} 
                      activeDot={{ r: 8 }}
                      name="Ingreso" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="horas" 
                      stroke={colores[1]}
                      name="Horas" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Resumen Financiero */}
            <div className="stats-card medium">
              <h3 className="card-title">Resumen Financiero</h3>
              <div className="financial-summary">
                <div className="financial-row">
                  <span className="financial-label">Ingreso Laboral Directo:</span>
                  <span className="financial-value">${formatoNumero(metricas.ingresoLaboralDirecto)}</span>
                  <span className="financial-percent">{(metricas.ingresoLaboralDirecto / metricas.ingresoTotal * 100).toFixed(1)}%</span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Ingreso Laboral Indirecto:</span>
                  <span className="financial-value">${formatoNumero(metricas.ingresoLaboralIndirecto)}</span>
                  <span className="financial-percent">{(metricas.ingresoLaboralIndirecto / metricas.ingresoTotal * 100).toFixed(1)}%</span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Costo Laboral Directo:</span>
                  <span className="financial-value">${formatoNumero(metricas.costoLaboralDirecto)}</span>
                  <span className="financial-percent">{(metricas.costoLaboralDirecto / metricas.dolaresTotalesLaborales * 100).toFixed(1)}%</span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Dólares Laborales Totales:</span>
                  <span className="financial-value">${formatoNumero(metricas.dolaresTotalesLaborales)}</span>
                  <span className="financial-percent">100.0%</span>
                </div>
                <div className="financial-row total">
                  <span className="financial-label">Margen Bruto:</span>
                  <span className="financial-value">${formatoNumero(metricas.ingresoLaboral - metricas.dolaresTotalesLaborales)}</span>
                  <span className="financial-percent">{((metricas.ingresoLaboral - metricas.dolaresTotalesLaborales) / metricas.ingresoLaboral * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Módulos */}
        <div className="modules-container">
          <h3 className="modules-title">Gestión de Datos</h3>
          <div className="modules-grid">
            <Link href="/horas" className="module-card">
                <div className="module-icon">⏱️</div>
                <div className="module-name">Control de Horas</div>
            </Link>
            <Link href="/salarios" className="module-card">
                <div className="module-icon">💰</div>
                <div className="module-name">Control de Salarios</div>
            </Link>
            <Link href="/metricas" className="module-card">
                <div className="module-icon">📊</div>
                <div className="module-name">Métricas Laborales</div>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  // Modificación: Siempre renderizar el contenido, sin verificar la autenticación
  return (
    <Layout title={`${activeSection === 'kpis' ? 'KPIs' : activeSection === 'admin' ? 'Administración' : activeSection === 'engineering' ? 'Ingeniería' : 'Portal de KPIs'} | Panel de Control`}>
      <div className="tabs-container">
        <div 
          className={`tab ${activeSection === 'kpis' ? 'active' : ''}`} 
          onClick={() => changeSection('kpis')}
        >
          KPIs Generales
        </div>
        <div 
          className={`tab ${activeSection === 'admin' ? 'active' : ''}`} 
          onClick={() => changeSection('admin')}
        >
          Administración
        </div>
        <div 
          className={`tab ${activeSection === 'engineering' ? 'active' : ''}`} 
          onClick={() => changeSection('engineering')}
        >
          Ingeniería
        </div>
        <div 
          className={`tab ${activeSection === 'portal' ? 'active' : ''}`} 
          onClick={() => changeSection('portal')}
        >
          Portal de KPIs
        </div>
      </div>
      
      <div className={`section-container ${animating ? 'fade-out' : 'fade-in'}`}>
        <div className="section-header">
          <h2>
            {activeSection === 'kpis' ? 'KPIs' : 
             activeSection === 'admin' ? 'Administración' : 
             activeSection === 'engineering' ? 'Ingeniería' : 
             'Portal de KPIs'}
          </h2>
          <h3>
            {activeSection === 'kpis' ? 'Indicadores de Productividad Generales' : 
             activeSection === 'admin' ? 'Control de Presupuesto y Recursos' : 
             activeSection === 'engineering' ? 'Seguimiento de Proyectos Técnicos' : 
             'Centro de Control Operativo'}
          </h3>
        </div>
        
        <div className="content-container">
          {activeSection === 'kpis' && (
            <>
              <div className="kpi-grid">
                {/* Se mantienen tus KPI bars actuales */}
                <div className="kpi-row">
                  <div className="kpi-card">
                    <div className="kpi-title">Indicador 1</div>
                    <div className="kpi-bars">
                      <div className="bar bar-1" style={{ height: '28px' }}></div>
                      <div className="bar bar-2" style={{ height: '45px' }}></div>
                      <div className="bar bar-3" style={{ height: '65px' }}></div>
                    </div>
                    <div className="kpi-value">82%</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-title">Indicador 2</div>
                    <div className="kpi-bars">
                      <div className="bar bar-1" style={{ height: '25px' }}></div>
                      <div className="bar bar-2" style={{ height: '60px' }}></div>
                      <div className="bar bar-3" style={{ height: '75px' }}></div>
                    </div>
                    <div className="kpi-value">88%</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-title">Indicador 3</div>
                    <div className="kpi-bars">
                      <div className="bar bar-1" style={{ height: '30px' }}></div>
                      <div className="bar bar-2" style={{ height: '50px' }}></div>
                      <div className="bar bar-3" style={{ height: '70px' }}></div>
                    </div>
                    <div className="kpi-value">79%</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-title">Indicador 4</div>
                    <div className="kpi-bars">
                      <div className="bar bar-1" style={{ height: '22px' }}></div>
                      <div className="bar bar-2" style={{ height: '42px' }}></div>
                      <div className="bar bar-3" style={{ height: '80px' }}></div>
                    </div>
                    <div className="kpi-value">93%</div>
                  </div>
                </div>
                <div className="kpi-row">
                  <div className="kpi-card">
                    <div className="kpi-title">Indicador 5</div>
                    <div className="kpi-bars">
                      <div className="bar bar-1" style={{ height: '35px' }}></div>
                      <div className="bar bar-2" style={{ height: '55px' }}></div>
                      <div className="bar bar-3" style={{ height: '68px' }}></div>
                    </div>
                    <div className="kpi-value">76%</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-title">Indicador 6</div>
                    <div className="kpi-bars">
                      <div className="bar bar-1" style={{ height: '40px' }}></div>
                      <div className="bar bar-2" style={{ height: '65px' }}></div>
                      <div className="bar bar-3" style={{ height: '85px' }}></div>
                    </div>
                    <div className="kpi-value">91%</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-title">Indicador 7</div>
                    <div className="kpi-bars">
                      <div className="bar bar-1" style={{ height: '32px' }}></div>
                      <div className="bar bar-2" style={{ height: '48px' }}></div>
                      <div className="bar bar-3" style={{ height: '72px' }}></div>
                    </div>
                    <div className="kpi-value">84%</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-title">Indicador 8</div>
                    <div className="kpi-bars">
                      <div className="bar bar-1" style={{ height: '38px' }}></div>
                      <div className="bar bar-2" style={{ height: '58px' }}></div>
                      <div className="bar bar-3" style={{ height: '78px' }}></div>
                    </div>
                    <div className="kpi-value">89%</div>
                  </div>
                </div>
              </div>
              {renderTable()}
            </>
          )}
          
          {(activeSection === 'admin' || activeSection === 'engineering') && (
            renderTable()
          )}
          
          {activeSection === 'portal' && (
            renderKPIPortal()
          )}
        </div>
      </div>

      <style jsx>{`
        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .tab {
          padding: 12px 20px;
          background-color: #f1f5f9;
          border-radius: 8px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .tab:hover {
          background-color: #e2e8f0;
        }
        
        .tab.active {
          background-color: #4361ee;
          color: white;
        }
        
        .section-container {
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .fade-out {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .fade-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .section-header {
          margin-bottom: 20px;
        }
        
        .section-header h2 {
          font-size: 20px;
          color: #333;
          margin: 0 0 5px 0;
        }
        
        .section-header h3 {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: normal;
        }
        
        .content-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          min-height: 500px;
        }
        
        /* KPI Grid Layout (sección original) */
        .kpi-grid {
          display: flex;
          flex-direction: column;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .kpi-row {
          display: flex;
          gap: 30px;
        }
        
        .kpi-card {
          flex: 1;
          height: 150px;
          background-color: #fff;
          border-radius: 4px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          position: relative;
        }
        
        .kpi-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .kpi-title {
          font-size: 14px;
          color: #64748b;
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
        }
        
        .kpi-value {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }
        
        .kpi-bars {
          display: flex;
          align-items: flex-end;
          gap: 15px;
          height: 60%;
        }
        
        .bar {
          width: 10px;
          border-radius: 2px 2px 0 0;
        }
        
        .bar-1 {
          background-color: #94a3b8;
        }
        
        .bar-2 {
          background-color: #64748b;
        }
        
        .bar-3 {
          background-color: #334155;
        }
        
        /* Table Styles */
        .table-container {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th, .data-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .data-table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #475569;
        }
        
        .data-table tr:hover {
          background-color: #f1f5f9;
        }
        
        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .status.success {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status.warning {
          background-color: #fff7ed;
          color: #c2410c;
        }
        
        .progress-bar-container {
          width: 100px;
          height: 12px;
          background-color: #f1f5f9;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background-color: #4361ee;
          border-radius: 6px;
        }
        
        .progress-bar-container span {
          position: absolute;
          top: -2px;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 10px;
          color: #fff;
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        }
        
        /* Portal de KPIs (dashboard de visualización) */
        .kpi-dashboard {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .dashboard-title {
          font-size: 24px;
          color: #334155;
          margin-bottom: 5px;
        }
        
        .stats-container {
          width: 100%;
          margin-bottom: 15px;
        }
        
        .stats-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .stats-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 20px;
          flex: 1;
          min-width: 280px;
          border-top: 4px solid #4361ee;
        }
        
        .stats-card.wide {
          flex: 2;
          min-width: 580px;
        }
        
        .stats-card.medium {
          flex: 1.2;
          min-width: 380px;
        }
        
        .card-title {
          font-size: 18px;
          color: #334155;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .stat-details {
          display: flex;
          flex-direction: column;
          height: calc(100% - 45px);
        }
        
        .stat-summary {
          margin-bottom: 15px;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .stat-label {
          color: #64748b;
          font-size: 14px;
        }
        
        .stat-value {
          color: #334155;
          font-weight: 600;
          font-size: 14px;
        }
        
        .chart-container {
          flex-grow: 1;
          width: 100%;
          min-height: 180px;
        }
        
        /* Estilos para el resumen financiero */
        .financial-summary {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .financial-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .financial-row.total {
          font-weight: 600;
          border-top: 2px solid #e2e8f0;
          margin-top: 10px;
          padding-top: 10px;
        }
        
        .financial-label {
          color: #475569;
        }
        
        .financial-value {
          color: #1e293b;
          text-align: right;
        }
        
        .financial-percent {
          color: #4361ee;
          text-align: right;
        }
        
        /* Estilos para los módulos */
        .modules-container {
          margin-top: 20px;
        }
        
        .modules-title {
          font-size: 18px;
          color: #334155;
          margin-bottom: 20px;
        }
        
        .modules-grid {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        
        .module-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 20px;
          width: 180px;
          height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        
        .module-card:hover {
          border-color: #4361ee;
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .module-icon {
          font-size: 32px;
          margin-bottom: 15px;
        }
        
        .module-name {
          font-size: 16px;
          color: #334155;
          font-weight: 500;
          text-align: center;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 1024px) {
          .stats-card.wide,
          .stats-card.medium {
            flex: 1 1 100%;
            min-width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          .kpi-row {
            flex-direction: column;
          }
          
          .tabs-container {
            flex-direction: column;
          }
          
          .stats-row {
            flex-direction: column;
          }
          
          .modules-grid {
            flex-direction: column;
            align-items: center;
          }
          
          .module-card {
            width: 100%;
            max-width: 280px;
          }
        }
      `}</style>
    </Layout>
  );
}