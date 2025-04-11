import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validated, setValidated] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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

  return (
    <div className="login-page py-5 bg-gradient-animated">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-lg animate-fadeInUp">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Accesso
                </h2>
              </Card.Header>
              
              <Card.Body className="p-4">
                {(localError || authError) && (
                  <Alert variant="danger" className="animate-fadeInUp">
                    {localError || authError}
                  </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
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
                      className="hover-glow"
                    />
                    <Form.Control.Feedback type="invalid">
                      Inserisci un indirizzo email valido
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>
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
                      className="hover-glow"
                    />
                    <Form.Control.Feedback type="invalid">
                      La password è obbligatoria
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isLoading}
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
                          Accesso in corso...
                        </>
                      ) : (
                        'Accedi'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              
              <Card.Footer className="text-center py-3 bg-light">
                <div className="small">
                  Non hai un account?{' '}
                  <Link to="/register" className="text-primary">
                    Registrati qui
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

export default LoginPage;
