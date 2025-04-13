import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faUserPlus, faUserGraduate, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Evento personalizzato per la comunicazione tra dropdown
const TOGGLE_REGISTER_EVENT = 'toggleRegisterDropdown';
const TOGGLE_LOGIN_EVENT = 'toggleLoginDropdown';

const RegisterDropdown = () => {
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { register, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  // Schema di validazione con Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Il nome è obbligatorio')
      .min(2, 'Il nome deve contenere almeno 2 caratteri'),
    email: Yup.string()
      .email('Inserisci un indirizzo email valido')
      .required('L\'email è obbligatoria'),
    password: Yup.string()
      .required('La password è obbligatoria')
      .min(6, 'La password deve contenere almeno 6 caratteri'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Le password non corrispondono')
      .required('Conferma la password'),
    role: Yup.string()
      .required('Seleziona il tuo ruolo')
      .oneOf(['student', 'teacher'], 'Seleziona un ruolo valido')
  });

  // Gestione dell'invio del form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setLocalError('');
    if (authError) setError(null);

    try {
      // Rimuovi confirmPassword prima di inviare i dati
      const { confirmPassword, ...userData } = values;
      
      const { success, message, data } = await register(userData);
      
      if (success) {
        resetForm();
        setShowDropdown(false);
        // Mostra messaggio di successo e reindirizza alla pagina di login
        navigate('/login', { 
          state: { 
            successMessage: 'Registrazione completata con successo. Attendi l\'approvazione dell\'amministratore.' 
          } 
        });
      } else {
        setLocalError(message);
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      setLocalError('Si è verificato un errore di connessione. Verifica la tua connessione internet e riprova.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Gestione del click sul link "Registrati"
  const handleRegisterClick = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  // Gestione del click sul link "Accedi qui"
  const handleLoginClick = (e) => {
    e.preventDefault();
    // Chiudi il dropdown di registrazione
    setShowDropdown(false);
    // Invia evento per aprire il dropdown di login
    const event = new CustomEvent(TOGGLE_LOGIN_EVENT);
    window.dispatchEvent(event);
  };

  // Gestione del click fuori dal dropdown per chiuderlo
  const handleClickOutside = (e) => {
    if (showDropdown && !e.target.closest('.register-dropdown')) {
      setShowDropdown(false);
    }
  };

  // Ascolta l'evento per aprire il dropdown di registrazione
  useEffect(() => {
    const handleToggleRegister = () => {
      setShowDropdown(true);
    };
    
    window.addEventListener(TOGGLE_REGISTER_EVENT, handleToggleRegister);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener(TOGGLE_REGISTER_EVENT, handleToggleRegister);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="register-dropdown">
      <a 
        href="#" 
        className="nav-link-modern" 
        onClick={handleRegisterClick}
      >
        <FontAwesomeIcon icon={faUserPlus} className="me-1" />
        Registrati
      </a>

      {showDropdown && (
        <div className="dropdown-menu-custom register-dropdown-menu p-3 animate-fadeInDown show">
          <div className="text-center mb-3">
            <h5 className="dropdown-header-title">
              <FontAwesomeIcon icon={faUserPlus} className="me-2" />
              Registrazione
            </h5>
          </div>
          
          {(localError || authError) && (
            <Alert variant="danger" className="py-2 animate-fadeInUp">
              <small>{localError || authError}</small>
            </Alert>
          )}
          
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: 'student'
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <Form noValidate onSubmit={handleSubmit} className="compact-form">
                <Form.Group className="mb-2">
                  <Form.Label className="small">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Nome completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Inserisci il tuo nome"
                    isInvalid={touched.name && !!errors.name}
                    className="hover-glow form-control-sm"
                    size="sm"
                  />
                  <Form.Control.Feedback type="invalid">
                    <small>{errors.name}</small>
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label className="small">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Inserisci la tua email"
                    isInvalid={touched.email && !!errors.email}
                    className="hover-glow form-control-sm"
                    size="sm"
                  />
                  <Form.Control.Feedback type="invalid">
                    <small>{errors.email}</small>
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label className="small">
                    <FontAwesomeIcon icon={faLock} className="me-2" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Inserisci la password"
                    isInvalid={touched.password && !!errors.password}
                    className="hover-glow form-control-sm"
                    size="sm"
                  />
                  <Form.Control.Feedback type="invalid">
                    <small>{errors.password}</small>
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label className="small">
                    <FontAwesomeIcon icon={faLock} className="me-2" />
                    Conferma Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Conferma la password"
                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                    className="hover-glow form-control-sm"
                    size="sm"
                  />
                  <Form.Control.Feedback type="invalid">
                    <small>{errors.confirmPassword}</small>
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="small">
                    <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                    Ruolo
                  </Form.Label>
                  <div className="d-flex">
                    <div className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="role"
                        id="roleStudent"
                        value="student"
                        checked={values.role === 'student'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label small" htmlFor="roleStudent">
                        <FontAwesomeIcon icon={faUserGraduate} className="me-1" />
                        Studente
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="role"
                        id="roleTeacher"
                        value="teacher"
                        checked={values.role === 'teacher'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label small" htmlFor="roleTeacher">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="me-1" />
                        Insegnante
                      </label>
                    </div>
                  </div>
                  {touched.role && errors.role && (
                    <div className="text-danger mt-1">
                      <small>{errors.role}</small>
                    </div>
                  )}
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isSubmitting || isLoading}
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
                        <small>Registrazione in corso...</small>
                      </>
                    ) : (
                      <small>Registrati</small>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          
          <div className="dropdown-divider my-3"></div>
          
          <div className="text-center">
            <small>
              Hai già un account?{' '}
              <a href="#" className="text-primary" onClick={handleLoginClick}>
                Accedi qui
              </a>
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterDropdown;
