// pages/dashboard.js
import { useState } from 'react';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('horas'); // 'horas' o 'salarios'

  return (
    <Layout>
      <div className="container">
        <h1 className="title">Portal de KPIs</h1>
        
        {/* Selector de Módulo */}
        <div className="module-selector">
          <div className="buttons">
            <button 
              className={`module-button ${activeTab === 'horas' ? 'active' : ''}`}
              onClick={() => setActiveTab('horas')}
            >
              <span className="icon">⏱️</span>
              <span>Control de Horas</span>
            </button>
            
            <button 
              className={`module-button ${activeTab === 'salarios' ? 'active' : ''}`}
              onClick={() => setActiveTab('salarios')}
            >
              <span className="icon">💰</span>
              <span>Control de Salarios</span>
            </button>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="content">
          {activeTab === 'horas' && <HorasModule />}
          {activeTab === 'salarios' && <SalariosModule />}
        </div>
      </div>
      
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .title {
          font-size: 28px;
          margin-bottom: 20px;
          color: #333;
        }
        
        .module-selector {
          margin-bottom: 30px;
        }
        
        .buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        
        .module-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 120px;
          border-radius: 10px;
          border: 2px solid #e1e1e1;
          background-color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .module-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .module-button.active {
          border-color: #4361ee;
          background-color: #f0f4ff;
        }
        
        .icon {
          font-size: 28px;
          margin-bottom: 8px;
        }
        
        .content {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 30px;
        }
        
        @media (max-width: 600px) {
          .buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
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

  return (
    <div>
      <h2>Control de Horas</h2>
      
      <div className="view-selector">
        <button 
          className={viewMode === 'areas' ? 'active' : ''}
          onClick={() => setViewMode('areas')}
        >
          Por Áreas
        </button>
        <button 
          className={viewMode === 'empleados' ? 'active' : ''}
          onClick={() => setViewMode('empleados')}
        >
          Por Empleados
        </button>
      </div>
      
      {viewMode === 'areas' ? (
        <div className="areas-container">
          <h3>Horas por Área</h3>
          
          <div className="areas-grid">
            {areas.map(area => (
              <div key={area.id} className="area-card">
                <h4>{area.nombre}</h4>
                <div className="input-group">
                  <label>Horas Totales</label>
                  <input 
                    type="number"
                    value={area.horas}
                    onChange={(e) => area.editable && updateAreaHoras(area.id, e.target.value)}
                    disabled={!area.editable}
                    className={area.editable ? '' : 'disabled'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empleados-container">
          <h3>Horas por Empleado</h3>
          
          <div className="area-selector">
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
          
          <div className="empleados-list">
            {empleadosFiltrados.map(empleado => (
              <div key={empleado.id} className="empleado-card">
                <h4>Empleado #{empleado.id}</h4>
                <div className="form-row">
                  <div className="input-group">
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
                  <div className="input-group">
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
            
            <button className="add-button">
              + Agregar Empleado
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }
        
        h3 {
          font-size: 20px;
          margin-bottom: 20px;
          color: #555;
        }
        
        .view-selector {
          display: flex;
          margin-bottom: 30px;
          border-bottom: 1px solid #e1e1e1;
        }
        
        .view-selector button {
          background: none;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          position: relative;
        }
        
        .view-selector button.active {
          color: #4361ee;
          font-weight: 500;
        }
        
        .view-selector button.active:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #4361ee;
        }
        
        .areas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .area-card {
          border: 1px solid #e1e1e1;
          border-radius: 8px;
          padding: 20px;
          transition: box-shadow 0.3s;
        }
        
        .area-card:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          margin-top: 15px;
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
        
        .input-group input.disabled {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .area-selector {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          gap: 10px;
        }
        
        .area-selector select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          min-width: 200px;
        }
        
        .empleado-card {
          border: 1px solid #e1e1e1;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .form-row {
          display: flex;
          gap: 20px;
        }
        
        .form-row .input-group {
          flex: 1;
        }
        
        .add-button {
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.3s;
        }
        
        .add-button:hover {
          background-color: #3651d4;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }
        }
      `}</style>
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

  return (
    <div>
      <h2>Control de Salarios</h2>
      
      <div className="view-selector">
        <button 
          className={viewMode === 'areas' ? 'active' : ''}
          onClick={() => setViewMode('areas')}
        >
          Por Áreas
        </button>
        <button 
          className={viewMode === 'empleados' ? 'active' : ''}
          onClick={() => setViewMode('empleados')}
        >
          Por Empleados
        </button>
      </div>
      
      {viewMode === 'areas' ? (
        <div className="areas-container">
          <h3>Salarios por Área</h3>
          
          <div className="areas-grid">
            {areas.map(area => (
              <div key={area.id} className="area-card">
                <h4>{area.nombre}</h4>
                <div className="input-group">
                  <label>Salario Total</label>
                  <input 
                    type="number"
                    value={area.salario}
                    onChange={(e) => area.editable && updateAreaSalario(area.id, e.target.value)}
                    disabled={!area.editable}
                    className={area.editable ? '' : 'disabled'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empleados-container">
          <h3>Salarios por Empleado</h3>
          
          <div className="area-selector">
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
          
          <div className="empleados-list">
            {empleadosFiltrados.map(empleado => (
              <div key={empleado.id} className="empleado-card">
                <h4>Empleado #{empleado.id}</h4>
                <div className="form-row">
                  <div className="input-group">
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
                  <div className="input-group">
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
            
            <button className="add-button">
              + Agregar Empleado
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }
        
        h3 {
          font-size: 20px;
          margin-bottom: 20px;
          color: #555;
        }
        
        .view-selector {
          display: flex;
          margin-bottom: 30px;
          border-bottom: 1px solid #e1e1e1;
        }
        
        .view-selector button {
          background: none;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          position: relative;
        }
        
        .view-selector button.active {
          color: #4361ee;
          font-weight: 500;
        }
        
        .view-selector button.active:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #4361ee;
        }
        
        .areas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .area-card {
          border: 1px solid #e1e1e1;
          border-radius: 8px;
          padding: 20px;
          transition: box-shadow 0.3s;
        }
        
        .area-card:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          margin-top: 15px;
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
        
        .input-group input.disabled {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .area-selector {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          gap: 10px;
        }
        
        .area-selector select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          min-width: 200px;
        }
        
        .empleado-card {
          border: 1px solid #e1e1e1;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .form-row {
          display: flex;
          gap: 20px;
        }
        
        .form-row .input-group {
          flex: 1;
        }
        
        .add-button {
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.3s;
        }
        
        .add-button:hover {
          background-color: #3651d4;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}