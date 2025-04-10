import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faCog, faUsers, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="superadmin-dashboard py-5">
      <Container>
        <h1 className="mb-4 text-center animate-fadeInUp">
          <FontAwesomeIcon icon={faUserShield} className="me-2" />
          Dashboard Super Amministratore
        </h1>
        
        <p className="text-center mb-5 animate-fadeInUp">
          Benvenuto, <strong>{user.name}</strong>. Gestisci l'intero sistema universitario dal tuo pannello di controllo.
        </p>
        
        <Row>
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm dashboard-card animate-fadeInUp hover-lift">
              <Card.Body className="text-center p-4">
                <div className="dashboard-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <Card.Title>Gestione Utenti</Card.Title>
                <Card.Text>
                  Gestisci tutti gli utenti del sistema, inclusi studenti, docenti e amministratori.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm dashboard-card animate-fadeInUp hover-lift" style={{ animationDelay: '0.2s' }}>
              <Card.Body className="text-center p-4">
                <div className="dashboard-icon">
                  <FontAwesomeIcon icon={faUserGraduate} />
                </div>
                <Card.Title>Gestione Corsi</Card.Title>
                <Card.Text>
                  Crea, modifica ed elimina corsi di laurea e assegna docenti ai corsi.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm dashboard-card animate-fadeInUp hover-lift" style={{ animationDelay: '0.4s' }}>
              <Card.Body className="text-center p-4">
                <div className="dashboard-icon">
                  <FontAwesomeIcon icon={faUserShield} />
                </div>
                <Card.Title>Gestione Ruoli</Card.Title>
                <Card.Text>
                  Assegna e modifica i ruoli degli utenti nel sistema universitario.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm dashboard-card animate-fadeInUp hover-lift" style={{ animationDelay: '0.6s' }}>
              <Card.Body className="text-center p-4">
                <div className="dashboard-icon">
                  <FontAwesomeIcon icon={faCog} />
                </div>
                <Card.Title>Impostazioni</Card.Title>
                <Card.Text>
                  Configura le impostazioni globali del sistema universitario.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col lg={12}>
            <Card className="shadow-sm dashboard-card animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <Card.Header className="dashboard-card-header">
                <h4 className="mb-0">Attività Recenti</h4>
              </Card.Header>
              <Card.Body>
                <p className="text-center py-4">
                  Le attività recenti saranno visualizzate qui una volta disponibili.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SuperAdminDashboard;
