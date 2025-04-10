import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// Crea il contesto di autenticazione
const AuthContext = createContext();

// Provider del contesto di autenticazione
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configura l'interceptor di Axios per aggiungere il token alle richieste
  useEffect(() => {
    const setupAxiosInterceptors = () => {
      axios.defaults.baseURL = 'http://localhost:3010/api/v1';
      
      // Interceptor per aggiungere il token alle richieste
      axios.interceptors.request.use(
        (config) => {
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
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 401) {
            // Token scaduto o non valido
            logout();
            navigate('/login');
          }
          return Promise.reject(error);
        }
      );
    };
    
    setupAxiosInterceptors();
  }, [token, navigate]);

  // Verifica il token all'avvio dell'applicazione
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Verifica se il token è scaduto
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token scaduto
            logout();
          } else {
            // Token valido, ottieni i dati dell'utente
            const response = await axios.get('/auth/me');
            setUser(response.data.data);
          }
        } catch (error) {
          console.error('Errore durante la verifica del token:', error);
          logout();
        }
      }
      setLoading(false);
    };
    
    verifyToken();
  }, [token]);

  // Funzione di login
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/auth/login', { email, password });
      
      const { token, refreshToken, user } = response.data;
      
      // Salva il token nel localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Aggiorna lo stato
      setToken(token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Errore durante il login:', error);
      
      let errorMessage = 'Errore durante il login. Riprova più tardi.';
      
      if (error.response) {
        // Il server ha risposto con un codice di errore
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // La richiesta è stata effettuata ma non è stata ricevuta alcuna risposta
        errorMessage = 'Impossibile connettersi al server. Verifica la tua connessione internet.';
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Funzione di registrazione
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/auth/register', userData);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      
      let errorMessage = 'Errore durante la registrazione. Riprova più tardi.';
      
      if (error.response) {
        // Il server ha risposto con un codice di errore
        errorMessage = error.response.data.message || errorMessage;
        
        // Se ci sono errori di validazione
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
        }
      } else if (error.request) {
        // La richiesta è stata effettuata ma non è stata ricevuta alcuna risposta
        errorMessage = 'Impossibile connettersi al server. Verifica la tua connessione internet.';
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Funzione di logout
  const logout = () => {
    // Rimuovi il token dal localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Resetta lo stato
    setToken(null);
    setUser(null);
    
    // Reindirizza alla pagina di login
    navigate('/login');
  };

  // Verifica se l'utente è autenticato
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Verifica se l'utente ha un ruolo specifico
  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto di autenticazione
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
  }
  return context;
};

export default AuthContext;
