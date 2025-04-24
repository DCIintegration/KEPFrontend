import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import api from '../api';

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
  const [activeModule, setActiveModule] = useState('horas');
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [tableData, setTableData] = useState(null);
  
  // Datos de métricas por defecto (se usarán hasta que se carguen los datos reales)
  const defaultMetricas = {
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
  };

  // Estado para las métricas actuales
  const [metricas, setMetricas] = useState(defaultMetricas);

  // Cargar datos del dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Llamada a la API para obtener los datos del dashboard
        const data = await api.getMainDashboard();
        setDashboardData(data);
        
        // Si tenemos métricas en la respuesta, actualizamos el estado
        if (data && data.metricas) {
          setMetricas(data.metricas);
        }
        
        // Generar datos para la tabla
        generateTableData(activeSection);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeSection]);

  // Cambiar sección
  const changeSection = (section) => {
    if (section === activeSection || animating) return;
    
    setAnimating(true);
    setTimeout(() => {
      setActiveSection(section);
      generateTableData(section);
      setTimeout(() => {
        setAnimating(false);
      }, 500);
    }, 500);
  };

  // Función para cambiar módulo
  const changeModule = (module) => {
    setActiveModule(module);
  };

  // Función para generar datos de tabla según la sección activa
  const generateTableData = (section) => {
    const data = [];
    const headers = [];
    
    if (section === 'kpis') {
      headers.push('Métrica', 'Actual', 'Objetivo', 'Variación', 'Estado');
    } else if (section === 'admin') {
      headers.push('Departamento', 'Presupuesto', 'Gastos', 'Restante', 'Porcentaje');
    } else if (section === 'engineering') {
      headers.push('Proyecto', 'Progreso', 'Horas', 'Equipo', 'Deadline');
    }
    
    // Intentar usar datos de la API si están disponibles
    if (dashboardData && dashboardData.tableData && dashboardData.tableData[section]) {
      setTableData({
        headers: headers,
        data: dashboardData.tableData[section]
      });
      return;
    }
    
    // De lo contrario, generar datos simulados
    for (let i = 0; i < 8; i++) {
      const row = [];
      
      if (section === 'kpis') {
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
      } else if (section === 'admin') {
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
      } else if (section === 'engineering') {
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
  
  // Datos para el gráfico de tendencias (se usarán datos de la API si están disponibles)
  const datosTendencia = dashboardData && dashboardData.tendencias 
    ? dashboardData.tendencias 
    : [
        { mes: 'Ene', ingreso: 125000, horas: 3600 },
        { mes: 'Feb', ingreso: 130000, horas: 3700 },
        { mes: 'Mar', ingreso: 142000, horas: 3850 },
        { mes: 'Abr', ingreso: 135000, horas: 3750 },
        { mes: 'May', ingreso: 148000, horas: 3920 },
        { mes: 'Jun', ingreso: 150000, horas: 4000 }
      ];
  
  // Colores para los gráficos
  const colores = ['#4361ee', '#3f37c9', '#0096c7', '#0077b6', '#48cae4'];

  // Función para renderizar la tabla
  const renderTable = () => {
    if (loading) {
      return (
        <div className="tableContainer">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Cargando datos...
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="tableContainer">
          <div style={{ padding: '20px', textAlign: 'center', color: '#e53935' }}>
            {error}
          </div>
        </div>
      );
    }
    
    if (!tableData) {
      return (
        <div className="tableContainer">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            No hay datos disponibles
          </div>
        </div>
      );
    }
    
    const { headers, data } = tableData;
    
    return (
      <div className="tableContainer">
        <table className="dataTable">
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
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando datos del dashboard...</p>
        </div>
      );
    }
    
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
                    <span className="stat-value">
                      {metricas.numeroTotalEmpleados > 0 
                        ? ((metricas.cantidadEmpleadosFacturables / metricas.numeroTotalEmpleados) * 100).toFixed(1)
                        : 0}%
                    </span>
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
                    <span className="stat-value">
                      {metricas.horasTotalesLaborales > 0 
                        ? ((metricas.horasLaboralesDirectas / metricas.horasTotalesLaborales) * 100).toFixed(1)
                        : 0}%
                    </span>
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
                    <span className="stat-value">
                      {metricas.ingresoTotal > 0 
                        ? ((metricas.ingresoLaboral / metricas.ingresoTotal) * 100).toFixed(1)
                        : 0}%
                    </span>
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
                  <span className="financial-percent">
                    {metricas.ingresoTotal > 0 
                      ? (metricas.ingresoLaboralDirecto / metricas.ingresoTotal * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Ingreso Laboral Indirecto:</span>
                  <span className="financial-value">${formatoNumero(metricas.ingresoLaboralIndirecto)}</span>
                  <span className="financial-percent">
                    {metricas.ingresoTotal > 0 
                      ? (metricas.ingresoLaboralIndirecto / metricas.ingresoTotal * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Costo Laboral Directo:</span>
                  <span className="financial-value">${formatoNumero(metricas.costoLaboralDirecto)}</span>
                  <span className="financial-percent">
                    {metricas.dolaresTotalesLaborales > 0 
                      ? (metricas.costoLaboralDirecto / metricas.dolaresTotalesLaborales * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Dólares Laborales Totales:</span>
                  <span className="financial-value">${formatoNumero(metricas.dolaresTotalesLaborales)}</span>
                  <span className="financial-percent">100.0%</span>
                </div>
                <div className="financial-row total">
                  <span className="financial-label">Margen Bruto:</span>
                  <span className="financial-value">
                    ${formatoNumero(metricas.ingresoLaboral - metricas.dolaresTotalesLaborales)}
                  </span>
                  <span className="financial-percent">
                    {metricas.ingresoLaboral > 0 
                      ? ((metricas.ingresoLaboral - metricas.dolaresTotalesLaborales) / metricas.ingresoLaboral * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Módulos */}
        <div className="modules-container">
          <h3 className="modules-title">Gestión de Datos</h3>
          <div className="modules-grid">
            <Link href="/hours" className="module-card">
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
  
  // Si está cargando, mostrar indicador
  if (loading && !tableData) {
    return (
      <Layout title="Dashboard | Portal de KPIs">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </Layout>
    );
  }

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
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 60vh;
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
          height: 60vh;
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
      `}</style>
    </Layout>
  );
}