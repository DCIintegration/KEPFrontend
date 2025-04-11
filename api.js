const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Iniciar sesión
 * @param {string} email - Correo electrónico
 * @param {string} password - Contraseña
 * @returns {Promise} Promesa con la respuesta del login
 */
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/custom_auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    console.log(`Respuesta del servidor: Status ${response.status}`);
    
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    // Parsear la respuesta según el tipo de contenido
    const data = isJson ? await response.json() : await response.text();
    
    if (!response.ok) {
      console.error('Error en respuesta:', data);
      throw new Error(isJson && data.error ? data.error : 'Error en la autenticación');
    }
    
    // Guardar el token y la información del usuario
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

export default { login };