import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

// Evento personalizzato per la comunicazione tra dropdown
const TOGGLE_REGISTER_EVENT = 'toggleRegisterDropdown';
const TOGGLE_LOGIN_EVENT = 'toggleLoginDropdown';

const LoginDropdown = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validated, setValidated] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { login, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  // Gestione del cambiamento degli input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Resetta gli errori quando l'utente inizia a digitare
    if (localError) setLocalError('');
    if (authError) setError(null);
  };

  // Gestione dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Validazione lato client
    if (!formData.email || !formData.password) {
      setLocalError('Inserisci email e password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, message, user } = await login(formData.email, formData.password);
      
      if (success) {
        // Chiudi il dropdown
        setShowDropdown(false);
        
        // Reindirizza in base al ruolo dell'utente restituito dalla risposta
        if (user.role === 'student') {
          navigate('/student');
        } else if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'superadmin') {
          navigate('/superadmin');
        } else {
          navigate('/');
        }
      } else {
        setLocalError(message);
      }
    } catch (error) {
      setLocalError('Errore durante il login. Riprova più tardi.');
      console.error('Errore durante il login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestione del click sul link "Accedi"
  const handleLoginClick = (e) => {
    e.preventDefault();
    // Prima di cambiare lo stato del dropdown corrente, invia un evento per chiudere tutti gli altri
    const closeEvent = new CustomEvent('CLOSE_ALL_DROPDOWNS', { detail: { except: 'login' } });
    window.dispatchEvent(closeEvent);
    setShowDropdown(!showDropdown);
  };

  // Gestione del click sul link "Registrati qui"
  const handleRegisterClick = (e) => {
    e.preventDefault();
    // Chiudi il dropdown di login
    setShowDropdown(false);
    // Invia evento per aprire il dropdown di registrazione
    const event = new CustomEvent(TOGGLE_REGISTER_EVENT);
    window.dispatchEvent(event);
  };

  // Gestione del click sul link "Password dimenticata?"
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    // Chiudi il dropdown di login
    setShowDropdown(false);
    // Reindirizza alla pagina di recupero password
    navigate('/reset-password');
  };

  // Gestione del click fuori dal dropdown per chiuderlo
  const handleClickOutside = (e) => {
    if (showDropdown && !e.target.closest('.login-dropdown')) {
      setShowDropdown(false);
    }
  };

  // Ascolta l'evento per aprire il dropdown di login
  useEffect(() => {
    const handleToggleLogin = () => {
      setShowDropdown(true);
    };
    
    window.addEventListener(TOGGLE_LOGIN_EVENT, handleToggleLogin);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener(TOGGLE_LOGIN_EVENT, handleToggleLogin);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ascolta l'evento per chiudere tutti i dropdown tranne quello specificato
  useEffect(() => {
    const handleCloseAllDropdowns = (e) => {
      if (e.detail.except !== 'login') {
        setShowDropdown(false);
      }
    };
    
    window.addEventListener('CLOSE_ALL_DROPDOWNS', handleCloseAllDropdowns);
    
    return () => {
      window.removeEventListener('CLOSE_ALL_DROPDOWNS', handleCloseAllDropdowns);
    };
  }, []);

  return (
    <div className="login-dropdown">
      <a 
        href="#" 
        className="nav-link-modern" 
        onClick={handleLoginClick}
      >
        <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
        Accedi
      </a>

      {showDropdown && (
        <div className="dropdown-menu-custom login-dropdown-menu p-3 animate-fadeInDown show">
          <div className="text-center mb-3">
            <h5 className="dropdown-header-title">
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
              Accesso
            </h5>
          </div>
          
          {(localError || authError) && (
            <Alert variant="danger" className="py-2 animate-fadeInUp">
              <small>{localError || authError}</small>
            </Alert>
          )}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Inserisci la tua email"
                required
                className="hover-glow form-control-sm"
                size="sm"
              />
              <Form.Control.Feedback type="invalid">
                <small>Inserisci un indirizzo email valido</small>
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small">
                <FontAwesomeIcon icon={faLock} className="me-2" />
                Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Inserisci la tua password"
                required
                className="hover-glow form-control-sm"
                size="sm"
              />
              <Form.Control.Feedback type="invalid">
                <small>La password è obbligatoria</small>
              </Form.Control.Feedback>
            </Form.Group>
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                className="btn-animated hover-lift btn-sm"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    <small>Accesso in corso...</small>
                  </>
                ) : (
                  <small>Accedi</small>
                )}
              </Button>
            </div>
            
            <div className="text-center mt-2">
              <small>
                <a href="#" className="text-secondary" onClick={handleForgotPasswordClick}>
                  <FontAwesomeIcon icon={faKey} className="me-1" />
                  Password dimenticata?
                </a>
              </small>
            </div>
          </Form>
          
          <div className="dropdown-divider my-3"></div>
          
          <div className="text-center">
            <small>
              Non hai un account?{' '}
              <a href="#" className="text-primary" onClick={handleRegisterClick}>
                Registrati qui
              </a>
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginDropdown;
