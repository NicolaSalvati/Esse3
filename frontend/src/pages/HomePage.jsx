import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faUserGraduate, faChalkboardTeacher, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="animate-fadeInLeft">
                <h1 className="display-4 fw-bold mb-4">Benvenuto nel Portale ESSE3</h1>
                <p className="lead mb-4">
                  Il sistema di gestione universitaria completo per studenti, docenti e amministratori.
                  Accedi a tutti i servizi universitari in un unico portale.
                </p>
                {!isAuthenticated() ? (
                  <div className="d-flex flex-wrap gap-3">
                    <Button 
                      as={Link} 
                      to="/login" 
                      variant="light" 
                      size="lg"
                      className="btn-animated hover-lift"
                    >
                      Accedi
                    </Button>
                    <Button 
                      as={Link} 
                      to="/register" 
                      variant="outline-light" 
                      size="lg"
                      className="btn-animated hover-lift"
                    >
                      Registrati
                    </Button>
                  </div>
                ) : (
                  <Button 
                    as={Link} 
                    to={user.role === 'student' ? '/student' : user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/'}
                    variant="light" 
                    size="lg"
                    className="btn-animated hover-lift"
                  >
                    Vai alla Dashboard
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image-container animate-fadeInRight">
                <div className="hero-image-wrapper">
                  <FontAwesomeIcon icon={faUniversity} size="8x" className="hero-icon" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <h2 className="text-center mb-5 section-title animate-fadeInUp">I Nostri Servizi</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm hover-lift animate-fadeInUp feature-card">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon-wrapper mb-3">
                    <FontAwesomeIcon icon={faUserGraduate} size="3x" className="text-primary" />
                  </div>
                  <Card.Title className="mb-3">Per gli Studenti</Card.Title>
                  <Card.Text>
                    Accedi al tuo profilo, visualizza il tuo piano di studi, iscriviti agli esami e controlla i tuoi risultati accademici.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm hover-lift animate-fadeInUp feature-card" style={{ animationDelay: '0.2s' }}>
                <Card.Body className="text-center p-4">
                  <div className="feature-icon-wrapper mb-3">
                    <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" className="text-primary" />
                  </div>
                  <Card.Title className="mb-3">Per i Docenti</Card.Title>
                  <Card.Text>
                    Gestisci i tuoi corsi, carica materiale didattico, registra le presenze e inserisci i voti degli esami.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm hover-lift animate-fadeInUp feature-card" style={{ animationDelay: '0.4s' }}>
                <Card.Body className="text-center p-4">
                  <div className="feature-icon-wrapper mb-3">
                    <FontAwesomeIcon icon={faGraduationCap} size="3x" className="text-primary" />
                  </div>
                  <Card.Title className="mb-3">Per l'Amministrazione</Card.Title>
                  <Card.Text>
                    Gestisci iscrizioni, assegna matricole, monitora le carriere degli studenti e genera report statistici.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section bg-gradient-secondary text-white py-5">
        <Container className="text-center">
          <div className="animate-fadeInUp">
            <h2 className="mb-4">Pronto a iniziare?</h2>
            <p className="lead mb-4">
              Accedi al tuo account o registrati per utilizzare tutti i servizi del portale ESSE3.
            </p>
            {!isAuthenticated() ? (
              <div className="d-flex justify-content-center flex-wrap gap-3">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="light" 
                  size="lg"
                  className="btn-animated hover-lift"
                >
                  Accedi
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="outline-light" 
                  size="lg"
                  className="btn-animated hover-lift"
                >
                  Registrati
                </Button>
              </div>
            ) : (
              <Button 
                as={Link} 
                to={user.role === 'student' ? '/student' : user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/'}
                variant="light" 
                size="lg"
                className="btn-animated hover-lift"
              >
                Vai alla Dashboard
              </Button>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
