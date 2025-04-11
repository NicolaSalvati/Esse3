import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faUniversity, faBookOpen, faUserGraduate, faChalkboardTeacher, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="hero-content animate-fadeInLeft">
              <h1 className="hero-title mb-4">Benvenuto su UniparthenopeHub</h1>
              <p className="hero-subtitle mb-4">
                Il portale ufficiale dell'Università Parthenope di Napoli per la gestione delle immatricolazioni e dei servizi agli studenti.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to="/immatricolazione" variant="light" size="lg" className="glass-btn">
                  <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                  Immatricolazione
                </Button>
                <Button as={Link} to="/login" variant="outline-light" size="lg" className="glass-btn">
                  Accedi
                </Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block animate-fadeInRight">
              <img src="/assets/images/university-illustration.svg" alt="Università Parthenope" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Annunci Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-3" />
              Annunci
            </h2>
            <p className="lead text-muted">Ultime novità e comunicazioni importanti</p>
          </div>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Body>
                  <h5 className="card-title fw-bold">Apertura Immatricolazioni A.A. 2025/2026</h5>
                  <p className="card-text">
                    Sono aperte le immatricolazioni per l'anno accademico 2025/2026. Scopri la nostra offerta formativa e inizia il tuo percorso universitario.
                  </p>
                  <div className="text-end">
                    <Button as={Link} to="/immatricolazione" variant="primary" className="glass-btn">
                      Immatricolati ora
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Pubblicato: 01/04/2025
                </Card.Footer>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Body>
                  <h5 className="card-title fw-bold">Nuovi Corsi di Laurea</h5>
                  <p className="card-text">
                    L'Università Parthenope amplia la sua offerta formativa con nuovi corsi di laurea in Intelligenza Artificiale e Scienze Ambientali Marine.
                  </p>
                  <div className="text-end">
                    <Button as={Link} to="/offerta-formativa" variant="primary" className="glass-btn">
                      Scopri di più
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Pubblicato: 15/03/2025
                </Card.Footer>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Body>
                  <h5 className="card-title fw-bold">Borse di Studio 2025</h5>
                  <p className="card-text">
                    Sono disponibili nuove borse di studio per merito e per reddito. Verifica i requisiti e presenta la tua domanda entro il 30 maggio.
                  </p>
                  <div className="text-end">
                    <Button as={Link} to="/borse-di-studio" variant="primary" className="glass-btn">
                      Verifica requisiti
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Pubblicato: 20/02/2025
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Offerta Formativa Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary">
              <FontAwesomeIcon icon={faBookOpen} className="me-3" />
              Offerta Formativa
            </h2>
            <p className="lead text-muted">Scopri i nostri corsi di laurea</p>
          </div>
          
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Facoltà di Scienze</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Informatica
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Scienze Biologiche
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Intelligenza Artificiale
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Scienze Ambientali
                    </li>
                  </ul>
                </Card.Body>
                <Card.Footer>
                  <Button as={Link} to="/facolta/scienze" variant="primary" className="glass-btn w-100">
                    Esplora Facoltà
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
            
            <Col lg={4} md={6} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Facoltà di Economia</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Economia Aziendale
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Economia e Commercio
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Management
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Finanza e Mercati
                    </li>
                  </ul>
                </Card.Body>
                <Card.Footer>
                  <Button as={Link} to="/facolta/economia" variant="primary" className="glass-btn w-100">
                    Esplora Facoltà
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
            
            <Col lg={4} md={6} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Facoltà di Ingegneria</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Ingegneria Informatica
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Ingegneria Civile
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Ingegneria Gestionale
                    </li>
                    <li className="mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                      Ingegneria Navale
                    </li>
                  </ul>
                </Card.Body>
                <Card.Footer>
                  <Button as={Link} to="/facolta/ingegneria" variant="primary" className="glass-btn w-100">
                    Esplora Facoltà
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Info Università Section */}
      <section className="university-info-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary">
              <FontAwesomeIcon icon={faUniversity} className="me-3" />
              Università Parthenope
            </h2>
            <p className="lead text-muted">Eccellenza nella formazione dal 1919</p>
          </div>
          
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="university-info-icon mb-3">
                    <FontAwesomeIcon icon={faUniversity} size="3x" />
                  </div>
                  <h5 className="card-title">Sedi</h5>
                  <p className="card-text">
                    Sede centrale: Via Acton, 38<br />
                    Sede di Ingegneria: Centro Direzionale<br />
                    Sede di Economia: Via Generale Parisi
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="university-info-icon mb-3">
                    <FontAwesomeIcon icon={faUserGraduate} size="3x" />
                  </div>
                  <h5 className="card-title">Studenti</h5>
                  <p className="card-text">
                    Oltre 16.000 studenti<br />
                    Più di 3.000 laureati all'anno<br />
                    Tasso di occupazione: 85%
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="university-info-icon mb-3">
                    <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
                  </div>
                  <h5 className="card-title">Docenti</h5>
                  <p className="card-text">
                    Oltre 300 docenti<br />
                    Rapporto docenti/studenti: 1:25<br />
                    Professori di fama internazionale
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <Card className="glass-card-blue shadow-sm h-100 hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="university-info-icon mb-3">
                    <FontAwesomeIcon icon={faBookOpen} size="3x" />
                  </div>
                  <h5 className="card-title">Offerta Formativa</h5>
                  <p className="card-text">
                    25 Corsi di Laurea Triennale<br />
                    18 Corsi di Laurea Magistrale<br />
                    12 Master e 5 Dottorati di Ricerca
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="text-center mt-4">
            <Button as={Link} to="/about" variant="primary" size="lg" className="glass-btn">
              Scopri di più sull'Università
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

// Aggiungo il componente Card che manca nell'import
const Card = ({ children, className, ...props }) => {
  return (
    <div className={`card ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

Card.Body = ({ children, className, ...props }) => {
  return (
    <div className={`card-body ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = ({ children, className, ...props }) => {
  return (
    <div className={`card-header ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = ({ children, className, ...props }) => {
  return (
    <div className={`card-footer ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default HomePage;
