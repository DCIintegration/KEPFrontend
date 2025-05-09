// api.js - Métodos para interactuar con la API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Función para refrescar el token
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No hay token de refresco disponible');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Error al refrescar el token');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    
    return data.access;
  } catch (error) {
    // Si falla el refresco, limpiar tokens y forzar re-login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
}

// Función auxiliar para peticiones autenticadas
async function authFetch(url, method = 'GET', body = null, retry = true) {
  let accessToken = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    
    // Si el token ha expirado (401) y tenemos un token de refresco
    if (response.status === 401 && retry && localStorage.getItem('refreshToken')) {
      try {
        // Intentar refrescar el token
        const newToken = await refreshToken();
        
        // Actualizar el token en los headers
        headers['Authorization'] = `Bearer ${newToken}`;
        options.headers = headers;
        
        // Reintentar la petición original con el nuevo token
        const newResponse = await fetch(`${API_BASE_URL}${url}`, options);
        
        const contentType = newResponse.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await newResponse.json() : await newResponse.text();
        
        if (!newResponse.ok) {
          throw new Error(isJson && data.error ? data.error : 'Error en la petición');
        }
        
        return data;
      } catch (refreshError) {
        // Si falla el refresco, redirigir a login
        window.location.href = '/login';
        throw new Error('Sesión expirada, por favor inicie sesión nuevamente');
      }
    }
    
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();
    
    if (!response.ok) {
      throw new Error(isJson && data.error ? data.error : 'Error en la petición');
    }
    
    return data;
  } catch (error) {
    console.error('Error en petición:', error);
    throw error;
  }
}

// Función de login
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la autenticación');
    }
    
    const data = await response.json();
    
    // Guardar tokens y datos de usuario
    if (data.access) {
      localStorage.setItem('accessToken', data.access);
    }
    
    if (data.refresh) {
      localStorage.setItem('refreshToken', data.refresh);
    }
    
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}
async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken"); 
  
  try {
    await fetch(`${API_BASE_URL}/custom_auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, 
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } catch (apiError) {
    console.error('Error al comunicar logout al servidor:', apiError);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  return { success: true };
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

// Nota: Verifica si este endpoint existe en tu backend
async function getUser(userID) {
  try {
    // Si no existe esta ruta específica, podrías obtener la información
    // del usuario desde viewUsers y filtrar por ID
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
    return await authFetch('/administracion/dashboard/');
  } catch (error) {
    console.error('Error al obtener dashboard administrativo:', error);
    throw error;
  }
}

async function getDepartamentoDetalles(id) {
  try {
    return await authFetch(`/administracion/departamentos/${id}/`);
  } catch (error) {
    console.error('Error al obtener detalles del departamento:', error);
    throw error;
  }
}

async function getEmpleadoDetalles(id) {
  try {
    return await authFetch(`/administracion/empleados/${id}/`);
  } catch (error) {
    console.error('Error al obtener detalles del empleado:', error);
    throw error;
  }
}

async function modificarDatosEmpleado(id, datos) {
  try {
    return await authFetch(`/administracion/empleados/${id}/modificar/`, 'POST', datos);
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
    return await authFetch('/dashboard/');
  } catch (error) {
    console.error('Error al obtener dashboard principal:', error);
    throw error;
  }
}

async function createKPI(kpiData) {
  try {
    return await authFetch('/dashboard/kpi/create/', 'POST', kpiData);
  } catch (error) {
    console.error('Error al crear KPI:', error);
    throw error;
  }
}

async function updateKPI(id, kpiData) {
  try {
    return await authFetch(`/dashboard/kpi/${id}/update/`, 'PUT', kpiData);
  } catch (error) {
    console.error('Error al actualizar KPI:', error);
    throw error;
  }
}

async function deleteKPI(id) {
  try {
    return await authFetch(`/dashboard/kpi/${id}/delete/`, 'DELETE');
  } catch (error) {
    console.error('Error al eliminar KPI:', error);
    throw error;
  }
}

async function getKPIDetails(id) {
  try {
    return await authFetch(`/dashboard/kpi/${id}/`);
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
    return await authFetch('/proyectos/logs/');
  } catch (error) {
    console.error('Error al obtener logs:', error);
    throw error;
  }
}

async function viewLogDetails(id) {
  try {
    return await authFetch(`/proyectos/logs/${id}/`);
  } catch (error) {
    console.error('Error al obtener detalles del log:', error);
    throw error;
  }
}

async function reportLog(id) {
  try {
    return await authFetch(`/proyectos/logs/${id}/report/`, 'POST');
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
    formData.append('file', excelFile); // Asegúrate de que el nombre del campo coincida con lo que espera el backend

    const response = await fetch(`${API_BASE_URL}/proyectos/logs/upload/excel/`, {
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
    return await authFetch('/proyectos/logs/upload/manual/', 'POST', logData);
  } catch (error) {
    console.error('Error al ingresar datos manualmente:', error);
    throw error;
  }
}

async function modifyLog(id, logData) {
  try {
    return await authFetch(`/proyectos/logs/${id}/modify/`, 'PUT', logData);
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