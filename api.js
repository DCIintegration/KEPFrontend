// api.js - Servicio para comunicarse con la API del backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Servicio para gestionar la autenticación y las solicitudes a la API
 */
const ApiService = {
  /**
   * Realizar una solicitud a la API
   * @param {string} url - URL del endpoint
   * @param {Object} options - Opciones de la solicitud
   * @returns {Promise} Promesa con la respuesta
   */
  async fetchApi(url, options = {}) {
    // Obtener el token del almacenamiento local
    const token = localStorage.getItem('authToken');
    
    // Configuración por defecto
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Añadir token de autenticación si existe
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Combinar opciones predeterminadas con las proporcionadas
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);
      
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      // Parsear la respuesta según el tipo de contenido
      const data = isJson ? await response.json() : await response.text();
      
      // Si la respuesta no es exitosa, lanzar un error
      if (!response.ok) {
        throw new Error(isJson && data.error ? data.error : 'Error en la solicitud');
      }
      
      return data;
    } catch (error) {
      console.error('Error en la solicitud API:', error);
      throw error;
    }
  },
  
  /**
   * Iniciar sesión
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise} Promesa con la respuesta del login
   */
  async login(email, password) {
    const response = await this.fetchApi('/custom_auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Guardar el token y la información del usuario
    if (response && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // En un caso real, también se podría realizar una solicitud al backend
    // para invalidar el token en el servidor
  },
  
  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} Verdadero si el usuario está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },
  
  /**
   * Obtener el usuario actual
   * @returns {Object|null} Información del usuario o null si no está autenticado
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Servicios específicos para los diferentes endpoints
  
  // Endpoints relacionados con Dashboards
  dashboard: {
    getMainDashboard() {
      return ApiService.fetchApi('/dashboard/');
    },
    getKpiDetails(kpiId) {
      return ApiService.fetchApi(`/dashboard/kpi/${kpiId}/`);
    }
  },
  
  // Endpoints relacionados con Horas
  hours: {
    updateMetrics(data) {
      return ApiService.fetchApi('/hours/update/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },
  
  // Endpoints relacionados con Logs
  logs: {
    getLogs() {
      return ApiService.fetchApi('/proyectos/logs/');
    },
    getLogDetails(logId) {
      return ApiService.fetchApi(`/proyectos/logs/${logId}/`);
    }
  },
  
  // Endpoints relacionados con Archivos
  files: {
    uploadExcelLog(formData) {
      return ApiService.fetchApi('/proyectos/logs/upload/excel/', {
        method: 'POST',
        headers: {
          // No incluir Content-Type aquí, fetch lo establecerá con el boundary correcto
        },
        body: formData,
      });
    }
  }
};

export default ApiService;