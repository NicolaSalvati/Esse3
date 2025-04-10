import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faBook, faCalendarAlt, faIdCard } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/auth/me');
        setStudentData(response.data.data);
      } catch (err) {
        console.error('Errore durante il recupero dei dati dello studente:', err);
        setError('Impossibile caricare i dati. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="student-dashboard py-5">
      <Container>
        <h1 className="mb-4 text-center animate-fadeInUp">
          <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
          Dashboard Studente
        </h1>
        
        <p className="text-center mb-5 animate-fadeInUp">
          Benvenuto, <strong>{user.name}</strong>. Gestisci il tuo percorso accademico dal tuo pannello di controllo.
        </p>
        
        {error && (
          <Alert variant="danger" className="animate-fadeInUp">
            {error}
          </Alert>
        )}
        
        {studentData && (
          <>
            {/* Informazioni Studente */}
            <Row className="mb-5">
              <Col lg={12}>
                <Card className="shadow-sm dashboard-card animate-fadeInUp">
                  <Card.Header className="dashboard-card-header">
                    <h4 className="mb-0">Informazioni Personali</h4>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Nome:</strong> {studentData.name}</p>
                        <p><strong>Email:</strong> {studentData.email}</p>
                        <p><strong>Telefono:</strong> {studentData.telefono || 'Non specificato'}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Matricola:</strong> {studentData.matricola}</p>
                        <p><strong>Stato:</strong> {studentData.isApproved ? 
                          <Badge bg="success">Approvato</Badge> : 
                          <Badge bg="warning">In attesa di approvazione</Badge>}
                        </p>
                        <p><strong>Anno di corso:</strong> {studentData.anno}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Stato Iscrizione */}
            <Row className="mb-5">
              <Col lg={12}>
                <Card className="shadow-sm dashboard-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  <Card.Header className="dashboard-card-header">
                    <h4 className="mb-0">Stato Iscrizione</h4>
                  </Card.Header>
                  <Card.Body>
                    {!studentData.isApproved ? (
                      <Alert variant="warning">
                        <FontAwesomeIcon icon={faIdCard} className="me-2" />
                        La tua iscrizione è in attesa di approvazione. Un amministratore ti assegnerà presto una matricola.
                      </Alert>
                    ) : (
                      <div className="text-center py-4">
                        <FontAwesomeIcon icon={faUserGraduate} size="3x" className="text-success mb-3" />
                        <h4>Iscrizione Confermata</h4>
                        <p>Sei ufficialmente iscritto all'università con matricola <strong>{studentData.matricola}</strong>.</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Corsi e Attività */}
            {studentData.isApproved && (
              <Row>
                <Col lg={6} className="mb-4">
                  <Card className="shadow-sm dashboard-card animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <Card.Header className="dashboard-card-header">
                      <h4 className="mb-0">
                        <FontAwesomeIcon icon={faBook} className="me-2" />
                        I Tuoi Corsi
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className="text-center py-4">
                        <p>I tuoi corsi saranno visualizzati qui una volta che saranno disponibili.</p>
                        <Button variant="primary" className="btn-animated hover-lift">
                          Esplora Catalogo Corsi
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col lg={6}>
                  <Card className="shadow-sm dashboard-card animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                    <Card.Header className="dashboard-card-header">
                      <h4 className="mb-0">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Prossimi Esami
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className="text-center py-4">
                        <p>I tuoi prossimi esami saranno visualizzati qui una volta che saranno disponibili.</p>
                        <Button variant="primary" className="btn-animated hover-lift">
                          Calendario Esami
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default StudentDashboard;
