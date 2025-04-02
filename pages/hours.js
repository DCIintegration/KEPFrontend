// pages/dashboard.js
import styles from '../styles/hours.module.css';
import { useState } from 'react';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('horas'); // 'horas' o 'salarios'

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Portal de KPIs</h1>
        
        {/* Selector de Módulo */}
        <div className={styles.moduleSelector}>
          <div className={styles.buttons}>
            <button 
              className={`${styles.moduleButton} ${activeTab === 'horas' ? styles.active : ''}`}
              onClick={() => setActiveTab('horas')}
            >
              <span className={styles.icon}>⏱️</span>
              <span>Control de Horas</span>
            </button>
            
            <button 
              className={`${styles.moduleButton} ${activeTab === 'salarios' ? styles.active : ''}`}
              onClick={() => setActiveTab('salarios')}
            >
              <span className={styles.icon}>💰</span>
              <span>Control de Salarios</span>
            </button>
          </div>
        </div>
        
        {/* Contenido */}
        <div className={styles.content}>
          {activeTab === 'horas' && <HorasModule />}
          {activeTab === 'salarios' && <SalariosModule />}
        </div>
      </div>
      
    </Layout>
  );
}

function HorasModule() {
  const [viewMode, setViewMode] = useState('areas');
  
  // Datos iniciales para áreas
  const [areas, setAreas] = useState([
    { id: 1, nombre: 'Ingeniería', horas: 120, editable: false },
    { id: 2, nombre: 'Sistemas', horas: 85, editable: true },
    { id: 3, nombre: 'Diseño', horas: 95, editable: false },
    { id: 4, nombre: 'Administración', horas: 75, editable: true }
  ]);
  
  // Datos iniciales para empleados
  const [empleados, setEmpleados] = useState([
    { id: 1, nombre: 'Empleado 1', horas: 45, area: 'Ingeniería' },
    { id: 2, nombre: 'Empleado 2', horas: 40, area: 'Diseño' },
    { id: 3, nombre: 'Empleado 3', horas: 37, area: 'Ingeniería' },
    { id: 4, nombre: 'Empleado 4', horas: 38, area: 'Diseño' }
  ]);
  
  // Filtrar áreas no editables (las que necesitan desglose por empleado)
  const areasNoEditables = areas.filter(area => !area.editable);
  
  // Estado para el área seleccionada en la vista de empleados
  const [selectedArea, setSelectedArea] = useState('Ingeniería');
  
  // Filtrar empleados por área seleccionada
  const empleadosFiltrados = empleados.filter(emp => emp.area === selectedArea);
  
  // Función para actualizar horas de un área editable
  const updateAreaHoras = (id, nuevasHoras) => {
    setAreas(areas.map(area => 
      area.id === id ? {...area, horas: parseInt(nuevasHoras) || 0} : area
    ));
  };
  
  // Función para actualizar horas de un empleado
  const updateEmpleadoHoras = (id, nuevasHoras) => {
    const nuevoValor = parseInt(nuevasHoras) || 0;
    
    // Actualizar empleado
    const nuevosEmpleados = empleados.map(emp => 
      emp.id === id ? {...emp, horas: nuevoValor} : emp
    );
    setEmpleados(nuevosEmpleados);
    
    // Actualizar áreas automáticas (no editables)
    setAreas(areas.map(area => {
      if (area.editable) return area;
      
      // Calcular suma de horas para el área
      const horasTotales = nuevosEmpleados
        .filter(emp => emp.area === area.nombre)
        .reduce((total, emp) => total + emp.horas, 0);
      
      return {...area, horas: horasTotales};
    }));
  };
  
  // Función para agregar un nuevo empleado
  const agregarEmpleado = () => {
    // Obtener el ID más alto actual y sumar 1
    const nuevoId = Math.max(...empleados.map(emp => emp.id)) + 1;
    
    // Crear nuevo empleado
    const nuevoEmpleado = {
      id: nuevoId,
      nombre: `Nuevo Empleado`,
      horas: 0,
      area: selectedArea
    };
    
    // Actualizar el estado con el nuevo empleado
    const nuevosEmpleados = [...empleados, nuevoEmpleado];
    setEmpleados(nuevosEmpleados);
  };

  return (
    <div>
      <h2 className={styles.moduleTitle}>Control de Horas</h2>
      
      <div className={styles.viewSelector}>
        <button 
          className={viewMode === 'areas' ? styles.active : ''}
          onClick={() => setViewMode('areas')}
        >
          Por Áreas
        </button>
        <button 
          className={viewMode === 'empleados' ? styles.active : ''}
          onClick={() => setViewMode('empleados')}
        >
          Por Empleados
        </button>
      </div>
      
      {viewMode === 'areas' ? (
        <div className={styles.areasContainer}>
          <h3 className={styles.sectionTitle}>Horas por Área</h3>
          
          <div className={styles.areasGrid}>
            {areas.map(area => (
              <div key={area.id} className={styles.areaCard}>
                <h4>{area.nombre}</h4>
                <div className={styles.inputGroup}>
                  <label>Horas Totales</label>
                  <input 
                    type="number"
                    value={area.horas}
                    onChange={(e) => area.editable && updateAreaHoras(area.id, e.target.value)}
                    disabled={!area.editable}
                    className={area.editable ? '' : styles.disabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.empleadosContainer}>
          <h3 className={styles.sectionTitle}>Horas por Empleado</h3>
          
          <div className={styles.areaSelector}>
            <label>Seleccionar área:</label>
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {areasNoEditables.map(area => (
                <option key={area.id} value={area.nombre}>{area.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.empleadosList}>
            {empleadosFiltrados.map(empleado => (
              <div key={empleado.id} className={styles.empleadoCard}>
                <h4>Empleado #{empleado.id}</h4>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Nombre</label>
                    <input 
                      type="text"
                      value={empleado.nombre}
                      onChange={(e) => {
                        setEmpleados(empleados.map(emp => 
                          emp.id === empleado.id ? {...emp, nombre: e.target.value} : emp
                        ));
                      }}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Horas</label>
                    <input 
                      type="number"
                      value={empleado.horas}
                      onChange={(e) => updateEmpleadoHoras(empleado.id, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              className={styles.addButton}
              onClick={agregarEmpleado}
            >
              + Agregar Empleado
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}

function SalariosModule() {
  const [viewMode, setViewMode] = useState('areas');
  
  // Datos iniciales para áreas
  const [areas, setAreas] = useState([
    { id: 1, nombre: 'Ingeniería', salario: 85000, editable: false },
    { id: 2, nombre: 'Sistemas', salario: 72000, editable: true },
    { id: 3, nombre: 'Diseño', salario: 68000, editable: false },
    { id: 4, nombre: 'Administración', salario: 60000, editable: true }
  ]);
  
  // Datos iniciales para empleados
  const [empleados, setEmpleados] = useState([
    { id: 1, nombre: 'Empleado 1', salario: 45000, area: 'Ingeniería' },
    { id: 2, nombre: 'Empleado 2', salario: 40000, area: 'Diseño' },
    { id: 3, nombre: 'Empleado 3', salario: 40000, area: 'Ingeniería' },
    { id: 4, nombre: 'Empleado 4', salario: 28000, area: 'Diseño' }
  ]);
  
  // Filtrar áreas no editables (las que necesitan desglose por empleado)
  const areasNoEditables = areas.filter(area => !area.editable);
  
  // Estado para el área seleccionada en la vista de empleados
  const [selectedArea, setSelectedArea] = useState('Ingeniería');
  
  // Filtrar empleados por área seleccionada
  const empleadosFiltrados = empleados.filter(emp => emp.area === selectedArea);
  
  // Función para actualizar salario de un área editable
  const updateAreaSalario = (id, nuevoSalario) => {
    setAreas(areas.map(area => 
      area.id === id ? {...area, salario: parseInt(nuevoSalario) || 0} : area
    ));
  };
  
  // Función para actualizar salario de un empleado
  const updateEmpleadoSalario = (id, nuevoSalario) => {
    const nuevoValor = parseInt(nuevoSalario) || 0;
    
    // Actualizar empleado
    const nuevosEmpleados = empleados.map(emp => 
      emp.id === id ? {...emp, salario: nuevoValor} : emp
    );
    setEmpleados(nuevosEmpleados);
    
    // Actualizar áreas automáticas (no editables)
    setAreas(areas.map(area => {
      if (area.editable) return area;
      
      // Calcular suma de salarios para el área
      const salarioTotal = nuevosEmpleados
        .filter(emp => emp.area === area.nombre)
        .reduce((total, emp) => total + emp.salario, 0);
      
      return {...area, salario: salarioTotal};
    }));
  };
  
  // Función para agregar un nuevo empleado
  const agregarEmpleado = () => {
    // Obtener el ID más alto actual y sumar 1
    const nuevoId = Math.max(...empleados.map(emp => emp.id)) + 1;
    
    // Crear nuevo empleado
    const nuevoEmpleado = {
      id: nuevoId,
      nombre: `Nuevo Empleado`,
      salario: 0,
      area: selectedArea
    };
    
    // Actualizar el estado con el nuevo empleado
    const nuevosEmpleados = [...empleados, nuevoEmpleado];
    setEmpleados(nuevosEmpleados);
  };

  return (
    <div>
      <h2 className={styles.moduleTitle}>Control de Salarios</h2>
      
      <div className={styles.viewSelector}>
        <button 
          className={viewMode === 'areas' ? styles.active : ''}
          onClick={() => setViewMode('areas')}
        >
          Por Áreas
        </button>
        <button 
          className={viewMode === 'empleados' ? styles.active : ''}
          onClick={() => setViewMode('empleados')}
        >
          Por Empleados
        </button>
      </div>
      
      {viewMode === 'areas' ? (
        <div className={styles.areasContainer}>
          <h3 className={styles.sectionTitle}>Salarios por Área</h3>
          
          <div className={styles.areasGrid}>
            {areas.map(area => (
              <div key={area.id} className={styles.areaCard}>
                <h4>{area.nombre}</h4>
                <div className={styles.inputGroup}>
                  <label>Salario Total</label>
                  <input 
                    type="number"
                    value={area.salario}
                    onChange={(e) => area.editable && updateAreaSalario(area.id, e.target.value)}
                    disabled={!area.editable}
                    className={area.editable ? '' : styles.disabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.empleadosContainer}>
          <h3 className={styles.sectionTitle}>Salarios por Empleado</h3>
          
          <div className={styles.areaSelector}>
            <label>Seleccionar área:</label>
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {areasNoEditables.map(area => (
                <option key={area.id} value={area.nombre}>{area.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.empleadosList}>
            {empleadosFiltrados.map(empleado => (
              <div key={empleado.id} className={styles.empleadoCard}>
                <h4>Empleado #{empleado.id}</h4>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Nombre</label>
                    <input 
                      type="text"
                      value={empleado.nombre}
                      onChange={(e) => {
                        setEmpleados(empleados.map(emp => 
                          emp.id === empleado.id ? {...emp, nombre: e.target.value} : emp
                        ));
                      }}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Salario</label>
                    <input 
                      type="number"
                      value={empleado.salario}
                      onChange={(e) => updateEmpleadoSalario(empleado.id, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              className={styles.addButton}
              onClick={agregarEmpleado}
            >
              + Agregar Empleado
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}
