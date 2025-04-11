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
            console.log('Token non valido o scaduto, effettuo logout');
            clearAuthData();
            navigate('/login');
          }
          return Promise.reject(error);
        }
      );
    };
    
    setupAxiosInterceptors();
  }, [token, navigate]);

  // Funzione per pulire tutti i dati di autenticazione
  const clearAuthData = () => {
    // Rimuovi tutti i dati di sessione dal localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    // Pulisci anche eventuali altri dati di sessione
    sessionStorage.clear();
    
    // Resetta lo stato
    setToken(null);
    setUser(null);
    setError(null);
  };

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
            console.log('Token scaduto, effettuo logout');
            clearAuthData();
            return;
          }
          
          // Verifica che l'ID utente nel token corrisponda all'ID salvato
          const savedUserId = localStorage.getItem('userId');
          const savedUserEmail = localStorage.getItem('userEmail');
          
          if (decoded.id !== savedUserId) {
            console.error('ID utente nel token non corrisponde all\'ID salvato');
            clearAuthData();
            return;
          }
          
          // Token valido, ottieni i dati dell'utente
          try {
            const response = await axios.get('/auth/me');
            
            // Verifica che l'ID utente nei dati corrisponda all'ID nel token
            if (response.data.data._id !== decoded.id) {
              console.error('ID utente nei dati non corrisponde all\'ID nel token');
              clearAuthData();
              return;
            }
            
            // Verifica che l'email nei dati corrisponda all'email salvata
            if (response.data.data.email !== savedUserEmail) {
              console.error('Email utente nei dati non corrisponde all\'email salvata');
              clearAuthData();
              return;
            }
            
            // Assicuriamoci che i dati dell'utente siano aggiornati
            setUser(response.data.data);
            console.log('Utente verificato:', response.data.data.email, 'Ruolo:', response.data.data.role);
          } catch (error) {
            console.error('Errore durante il recupero dei dati utente:', error);
            clearAuthData();
            return;
          }
        } catch (error) {
          console.error('Errore durante la verifica del token:', error);
          clearAuthData();
        }
      }
      setLoading(false);
    };
    
    verifyToken();
  }, [token]);

  // Funzione di login
  const login = async (email, password) => {
    try {
      // Prima di effettuare un nuovo login, assicuriamoci di pulire qualsiasi dato di sessione precedente
      clearAuthData();
      
      setError(null);
      const response = await axios.post('/auth/login', { email, password });
      
      const { token, refreshToken, user } = response.data;
      
      // Salva il token e i dati utente nel localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      
      // Aggiorna lo stato con i dati dell'utente dalla risposta
      setToken(token);
      setUser(user);
      
      console.log('Login effettuato come:', user.email, 'Ruolo:', user.role, 'ID:', user.id);
      
      return { success: true, user, message: 'Login effettuato con successo' };
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
      console.log('Dati di registrazione inviati:', userData);
      const response = await axios.post('/auth/register', userData);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      
      let errorMessage = 'Errore durante la registrazione. Verifica i dati inseriti e riprova.';
      
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
    // Pulisci tutti i dati di autenticazione
    clearAuthData();
    
    // Reindirizza alla pagina di login
    window.location.href = '/login';
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
