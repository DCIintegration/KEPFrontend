// pages/hours.js
import { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function HoursTrackingPage() {
  const [viewMode, setViewMode] = useState('areas'); // areas o empleados
  
  // Datos de muestra para áreas
  const areasData = [
    { name: 'Ingeniería', hours: 120 },
    { name: 'Sistemas', hours: 85 },
    { name: 'Diseño', hours: 95 },
    { name: 'Administración', hours: 75 }
  ];
  
  // Datos de muestra para empleados
  const empleadosData = [
    { id: 1, name: 'Empleado 1', hours: 45 },
    { id: 2, name: 'Empleado 2', hours: 40 },
    { id: 3, name: 'Empleado 3', hours: 37 }
  ];

  return (
    <Layout title="Control de Horas | Portal KPIs">
      <div className="kpi-section">
        <h2>HORAS</h2>
        <h3>Seguimiento de horas por área o empleado</h3>
      </div>
      
      <div className="content-container">
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
          <div className="hours-list">
            <h1>Horas por Área</h1>
            
            <div className="areas-grid">
              {areasData.map((area, index) => (
                <div key={index} className="area-item">
                  <h2>{area.name}</h2>
                  <div className="hours-input-container">
                    <label>Horas</label>
                    <input 
                      type="number" 
                      defaultValue={area.hours}
                      className="hours-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="hours-list">
            <h1>Horas por Empleado</h1>
            
            {empleadosData.map((empleado, index) => (
              <div key={index} className="employee-container">
                <h2>Empleado {empleado.id}</h2>
                
                <div className="employee-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input 
                        type="text"
                        defaultValue={empleado.name}
                        className="text-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Horas</label>
                      <input 
                        type="number"
                        defaultValue={empleado.hours}
                        className="hours-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="add-button-container">
              <button className="add-employee-button">
                Agregar otro Empleado
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .kpi-section {
          margin-bottom: 20px;
        }
        
        .kpi-section h2 {
          font-size: 20px;
          color: #333;
          margin: 0 0 5px 0;
        }
        
        .kpi-section h3 {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: normal;
        }
        
        .content-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 20px;
        }
        
        .view-selector {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .view-selector button {
          background: none;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          color: #666;
          position: relative;
          transition: color 0.3s;
        }
        
        .view-selector button.active {
          color: #4361ee;
          font-weight: 500;
        }
        
        .view-selector button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #4361ee;
        }
        
        .hours-list h1 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }
        
        /* Areas Grid */
        .areas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .area-item {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
        }
        
        .area-item h2 {
          font-size: 18px;
          color: #333;
          margin-bottom: 15px;
        }
        
        .hours-input-container {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .hours-input-container label {
          font-size: 14px;
          color: #666;
        }
        
        .hours-input {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 16px;
        }
        
        /* Employee Form */
        .employee-container {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .employee-container h2 {
          font-size: 18px;
          color: #333;
          margin-bottom: 15px;
        }
        
        .employee-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .form-row {
          display: flex;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
        }
        
        .form-group label {
          font-size: 14px;
          color: #666;
        }
        
        .text-input {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .add-button-container {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }
        
        .add-employee-button {
          background-color: #000;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .add-employee-button:hover {
          background-color: #333;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
}