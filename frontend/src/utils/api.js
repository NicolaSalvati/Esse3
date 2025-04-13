import axios from 'axios';

// Configurazione di base di Axios
const api = axios.create({
  baseURL: 'http://localhost:3010/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor per aggiungere il token di autenticazione
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire gli errori di risposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestione degli errori di rete
    if (!error.response) {
      console.error('Errore di rete:', error);
      return Promise.reject({
        message: 'Impossibile connettersi al server. Verifica la tua connessione internet.'
      });
    }
    
    // Gestione degli errori di autenticazione
    if (error.response.status === 401) {
      // Se il token è scaduto o non valido, reindirizza alla pagina di login
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error.response.data);
  }
);

// Funzioni di autenticazione
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/updateprofile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/updatepassword', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Funzioni per la gestione degli utenti
export const userAPI = {
  getUsers: async (role) => {
    try {
      const url = role ? `/auth/users?role=${role}` : '/auth/users';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUser: async (id) => {
    try {
      const response = await api.get(`/auth/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/auth/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/auth/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  assignMatricola: async (id, matricola) => {
    try {
      const response = await api.put(`/auth/assignmatricola/${id}`, { matricola });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
