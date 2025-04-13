import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../styles/CustomStyles.css';
import '../styles/EnhancedAnimations.css';
import '../styles/DropdownStyles.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setIsSubmitting(true);
    setError('');
    
    // Simulazione dell'invio della richiesta di reset password
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      // Qui andrebbe implementata la vera logica di backend
    }, 1500);
  };

  return (
    <div className="reset-password-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #001a33, #003366)',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-4 animate-fadeInDown">
              <Link to="/" className="text-white text-decoration-none">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Torna alla Home
              </Link>
            </div>
            
            <Card className="animate-fadeInUp shadow-lg border-0" style={{
              borderRadius: '15px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
            }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="icon-circle mb-4" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e6f7ff, #ffffff)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                  }}>
                    <FontAwesomeIcon 
                      icon={faKey} 
                      size="2x" 
                      style={{
                        background: 'linear-gradient(135deg, #003366, #00a0e3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                      className="animate-pulse"
                    />
                  </div>
                  <h2 className="fw-bold" style={{ color: '#003366' }}>Recupero Password</h2>
                  <p className="text-muted">
                    Inserisci l'email associata al tuo account per ricevere le istruzioni per reimpostare la password.
                  </p>
                </div>
                
                {error && (
                  <Alert variant="danger" className="animate-fadeInUp">
                    {error}
                  </Alert>
                )}
                
                {showSuccess ? (
                  <div className="text-center animate-fadeInUp">
                    <div className="success-icon mb-3" style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e6f7ff, #ffffff)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 5px 15px rgba(0, 160, 227, 0.2)'
                    }}>
                      <FontAwesomeIcon 
                        icon={faPaperPlane} 
                        size="2x" 
                        style={{ color: '#00a0e3' }}
                        className="animate-pulse"
                      />
                    </div>
                    <Alert variant="success" className="border-0" style={{ background: 'rgba(25, 135, 84, 0.1)' }}>
                      <h5 className="alert-heading">Email inviata!</h5>
                      <p>
                        Abbiamo inviato le istruzioni per reimpostare la password all'indirizzo email fornito.
                        Controlla la tua casella di posta e segui le istruzioni.
                      </p>
                    </Alert>
                    <Button 
                      variant="outline-primary" 
                      className="mt-3 btn-animated hover-lift"
                      onClick={() => {
                        setShowSuccess(false);
                        setEmail('');
                        setValidated(false);
                      }}
                    >
                      Invia nuovamente
                    </Button>
                  </div>
                ) : (
                  <Form noValidate validated={validated} onSubmit={handleSubmit} className="animate-fadeInUp">
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: '#00a0e3' }} />
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Inserisci la tua email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="hover-glow form-control-lg"
                        style={{
                          borderRadius: '10px',
                          padding: '12px 15px',
                          border: '1px solid rgba(0, 51, 102, 0.2)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Inserisci un indirizzo email valido
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Inserisci l'email con cui ti sei registrato.
                      </Form.Text>
                    </Form.Group>
                    
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        size="lg"
                        disabled={isSubmitting}
                        className="btn-animated hover-lift"
                        style={{
                          background: 'linear-gradient(135deg, #003366, #00a0e3)',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '12px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Invio in corso...
                          </>
                        ) : (
                          <>
                            Reimposta Password
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
            
            <div className="text-center mt-4 text-white animate-fadeInUp">
              <p>
                Ricordi la tua password? <Link to="/" className="text-white fw-bold">Accedi</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;
