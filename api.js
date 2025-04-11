// api.js - Updated service for the backend API

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
    // this.fetchApi('/custom_auth/logout/', { method: 'POST' });
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
    /**
     * Obtener datos del dashboard principal
     * @returns {Promise} Promesa con los datos del dashboard
     */
    getMainDashboard() {
      return ApiService.fetchApi('/dashboard/');
    },
    
    /**
     * Obtener detalles de un KPI específico
     * @param {string|number} kpiId - ID del KPI
     * @returns {Promise} Promesa con los detalles del KPI
     */
    getKpiDetails(kpiId) {
      return ApiService.fetchApi(`/dashboard/kpi/${kpiId}/`);
    }
  },
  
  // Endpoints relacionados con Horas
  hours: {
    /**
     * Obtener métricas de horas
     * @returns {Promise} Promesa con las métricas
     */
    getMetrics() {
      return ApiService.fetchApi('/hours/metrics/');
    },
    
    /**
     * Actualizar métricas
     * @param {Object} data - Datos de las métricas a actualizar
     * @returns {Promise} Promesa con la respuesta
     */
    updateMetrics(data) {
      return ApiService.fetchApi('/hours/update/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },
  
  // Endpoints relacionados con Logs
  logs: {
    /**
     * Obtener lista de logs
     * @param {Object} filters - Filtros para los logs
     * @returns {Promise} Promesa con la lista de logs
     */
    getLogs(filters = {}) {
      const queryParams = new URLSearchParams();
      
      // Añadir filtros a los parámetros de consulta
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return ApiService.fetchApi(`/logs/${queryString}`);
    },
    
    /**
     * Obtener detalles de un log específico
     * @param {string|number} logId - ID del log
     * @returns {Promise} Promesa con los detalles del log
     */
    getLogDetails(logId) {
      return ApiService.fetchApi(`/logs/${logId}/`);
    }
  },
  
  // Endpoints relacionados con Archivos
  files: {
    /**
     * Obtener lista de archivos
     * @param {Object} filters - Filtros para los archivos
     * @returns {Promise} Promesa con la lista de archivos
     */
    getFiles(filters = {}) {
      const queryParams = new URLSearchParams();
      
      // Añadir filtros a los parámetros de consulta
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return ApiService.fetchApi(`/files/${queryString}`);
    },
    
    /**
     * Subir un archivo
     * @param {FormData} formData - Datos del formulario con el archivo
     * @returns {Promise} Promesa con la respuesta
     */
    uploadFile(formData) {
      return ApiService.fetchApi('/files/upload/', {
        method: 'POST',
        headers: {
          // No incluir Content-Type aquí, fetch lo establecerá con el boundary correcto
        },
        body: formData,
      });
    },
    
    /**
     * Descargar un archivo
     * @param {string|number} fileId - ID del archivo
     * @returns {Promise} Promesa con el blob del archivo
     */
    downloadFile(fileId) {
      return fetch(`${API_BASE_URL}/files/download/${fileId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      }).then(response => {
        if (!response.ok) {
          throw new Error('Error al descargar el archivo');
        }
        return response.blob();
      });
    },
    
    /**
     * Eliminar un archivo
     * @param {string|number} fileId - ID del archivo
     * @returns {Promise} Promesa con la respuesta
     */
    deleteFile(fileId) {
      return ApiService.fetchApi(`/files/${fileId}/`, {
        method: 'DELETE',
      });
    }
  },
  
  // Endpoints relacionados con el perfil de usuario
  user: {
    /**
     * Obtener perfil del usuario
     * @returns {Promise} Promesa con los datos del perfil
     */
    getProfile() {
      return ApiService.fetchApi('/user/profile/');
    },
    
    /**
     * Actualizar perfil del usuario
     * @param {Object} data - Datos del perfil a actualizar
     * @returns {Promise} Promesa con la respuesta
     */
    updateProfile(data) {
      return ApiService.fetchApi('/user/profile/', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    
    /**
     * Cambiar contraseña
     * @param {string} oldPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise} Promesa con la respuesta
     */
    changePassword(oldPassword, newPassword) {
      return ApiService.fetchApi('/user/change-password/', {
        method: 'POST',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
    }
  }
};

export default ApiService;