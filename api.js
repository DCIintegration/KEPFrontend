// api.js - Métodos para interactuar con la API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Función auxiliar para las peticiones autenticadas
async function authFetch(url, method = 'GET', body = null) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, options);
  
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  const data = isJson ? await response.json() : await response.text();
  
  if (!response.ok) {
    const errorMessage = isJson && data.error ? data.error : 'Error en la petición';
    throw new Error(errorMessage);
  }
  
  return data;
}

// -------------------------------------------
// MÉTODOS DE AUTENTICACIÓN
// -------------------------------------------

async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/custom_auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    const data = isJson ? await response.json() : await response.text();
    
    if (!response.ok) {
      throw new Error(isJson && data.error ? data.error : 'Error en la autenticación');
    }
    
    if (data && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

async function logout() {
  try {
    return await authFetch('/custom_auth/logout/', 'POST');
  } catch (error) {
    console.error('Error en logout:', error);
    throw error;
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

async function viewUsers() {
  try {
    return await authFetch('/custom_auth/view_users/');
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

async function createUser(userData) {
  try {
    return await authFetch('/custom_auth/create_user/', 'POST', userData);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

async function updateUser(id, userData) {
  try {
    return await authFetch(`/custom_auth/update_user/${id}/`, 'PUT', userData);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

async function deleteUser(id) {
  try {
    return await authFetch(`/custom_auth/delete_user/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

async function getUser(userID) {
  try {
    return await authFetch(`/custom_auth/user/${userID}/`);
  } catch (error) {
    console.error('Error en getUser:', error);
    throw error;
  }
}

// -------------------------------------------
// MÉTODOS DE ADMINISTRACIÓN
// -------------------------------------------

async function getDashboardAdministrativo() {
  try {
    return await authFetch('/administracion/dashboard_administrativo/');
  } catch (error) {
    console.error('Error al obtener dashboard administrativo:', error);
    throw error;
  }
}

async function getDepartamentoDetalles(id) {
  try {
    return await authFetch(`/administracion/departamento_detalles/${id}/`);
  } catch (error) {
    console.error('Error al obtener detalles del departamento:', error);
    throw error;
  }
}

async function getEmpleadoDetalles(id) {
  try {
    return await authFetch(`/administracion/empleado_detalles/${id}/`);
  } catch (error) {
    console.error('Error al obtener detalles del empleado:', error);
    throw error;
  }
}

async function modificarDatosEmpleado(id, datos) {
  try {
    return await authFetch(`/administracion/modificar_datos/${id}/`, 'PUT', datos);
  } catch (error) {
    console.error('Error al modificar datos del empleado:', error);
    throw error;
  }
}

// -------------------------------------------
// MÉTODOS DE DASHBOARD
// -------------------------------------------

async function getMainDashboard() {
  try {
    return await authFetch('/dashboard/main_dashboard/');
  } catch (error) {
    console.error('Error al obtener dashboard principal:', error);
    throw error;
  }
}

async function createKPI(kpiData) {
  try {
    return await authFetch('/dashboard/create_KPI/', 'POST', kpiData);
  } catch (error) {
    console.error('Error al crear KPI:', error);
    throw error;
  }
}

async function updateKPI(id, kpiData) {
  try {
    return await authFetch(`/dashboard/update_kpi/${id}/`, 'PUT', kpiData);
  } catch (error) {
    console.error('Error al actualizar KPI:', error);
    throw error;
  }
}

async function deleteKPI(id) {
  try {
    return await authFetch(`/dashboard/delete_kpi/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error al eliminar KPI:', error);
    throw error;
  }
}

async function getKPIDetails(id) {
  try {
    return await authFetch(`/dashboard/kpi_details/${id}/`);
  } catch (error) {
    console.error('Error al obtener detalles del KPI:', error);
    throw error;
  }
}

// -------------------------------------------
// MÉTODOS DE PROYECTOS
// -------------------------------------------

async function viewLogs() {
  try {
    return await authFetch('/proyectos/view_logs/');
  } catch (error) {
    console.error('Error al obtener logs:', error);
    throw error;
  }
}

async function viewLogDetails(id) {
  try {
    return await authFetch(`/proyectos/view_log_details/${id}/`);
  } catch (error) {
    console.error('Error al obtener detalles del log:', error);
    throw error;
  }
}

async function reportLog(reportData) {
  try {
    return await authFetch('/proyectos/report_log/', 'POST', reportData);
  } catch (error) {
    console.error('Error al reportar problemas con el log:', error);
    throw error;
  }
}

async function uploadExcelLog(excelFile) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    const formData = new FormData();
    formData.append('excel_file', excelFile);

    const response = await fetch(`${API_BASE_URL}/proyectos/upload_excel_log/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir archivo Excel');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al subir Excel para KPI:', error);
    throw error;
  }
}

async function uploadManualLog(logData) {
  try {
    return await authFetch('/proyectos/upload_manual_log/', 'POST', logData);
  } catch (error) {
    console.error('Error al ingresar datos manualmente:', error);
    throw error;
  }
}

async function modifyLog(id, logData) {
  try {
    return await authFetch(`/proyectos/modify_log/${id}/`, 'PUT', logData);
  } catch (error) {
    console.error('Error al modificar datos de registro:', error);
    throw error;
  }
}

// Exportar todos los métodos
export default {
  // Autenticación
  login,
  logout,
  viewUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  
  // Administración
  getDashboardAdministrativo,
  getDepartamentoDetalles,
  getEmpleadoDetalles,
  modificarDatosEmpleado,
  
  // Dashboard
  getMainDashboard,
  createKPI,
  updateKPI,
  deleteKPI,
  getKPIDetails,
  
  // Proyectos
  viewLogs,
  viewLogDetails,
  reportLog,
  uploadExcelLog,
  uploadManualLog,
  modifyLog,
};