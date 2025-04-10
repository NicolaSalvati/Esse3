import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faPhone, faHome, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';

const RegisterPage = () => {
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    telefono: Yup.string()
      .matches(/^[0-9+\s-]{8,15}$/, 'Inserisci un numero di telefono valido'),
    indirizzo: Yup.string()
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
      setLocalError('Errore durante la registrazione. Riprova più tardi.');
      console.error('Errore durante la registrazione:', error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page py-5 bg-gradient-animated">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={7}>
            <Card className="shadow-lg border-0 rounded-lg animate-fadeInUp">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                  Registrazione
                </h2>
              </Card.Header>
              
              <Card.Body className="p-4">
                {(localError || authError) && (
                  <Alert variant="danger" className="animate-fadeInUp">
                    {localError || authError}
                  </Alert>
                )}
                
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    telefono: '',
                    indirizzo: ''
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
                    <Form noValidate onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FontAwesomeIcon icon={faUser} className="me-2" />
                              Nome completo
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Inserisci il tuo nome completo"
                              isInvalid={touched.name && !!errors.name}
                              className="hover-glow"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
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
                              className="hover-glow"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
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
                              className="hover-glow"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.password}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
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
                              className="hover-glow"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.confirmPassword}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FontAwesomeIcon icon={faPhone} className="me-2" />
                              Telefono (opzionale)
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="telefono"
                              value={values.telefono}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Inserisci il tuo numero di telefono"
                              isInvalid={touched.telefono && !!errors.telefono}
                              className="hover-glow"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.telefono}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FontAwesomeIcon icon={faHome} className="me-2" />
                              Indirizzo (opzionale)
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="indirizzo"
                              value={values.indirizzo}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Inserisci il tuo indirizzo"
                              isInvalid={touched.indirizzo && !!errors.indirizzo}
                              className="hover-glow"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.indirizzo}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="d-grid mt-4">
                        <Button 
                          variant="primary" 
                          type="submit" 
                          disabled={isSubmitting || isLoading}
                          className="btn-animated hover-lift"
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
                              Registrazione in corso...
                            </>
                          ) : (
                            'Registrati'
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
              
              <Card.Footer className="text-center py-3 bg-light">
                <div className="small">
                  Hai già un account?{' '}
                  <Link to="/login" className="text-primary">
                    Accedi qui
                  </Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
