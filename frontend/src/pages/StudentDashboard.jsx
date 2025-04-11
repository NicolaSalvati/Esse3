import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faBook, faCalendarAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';
import axios from 'axios';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch student details
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setStudentData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Errore durante il recupero dei dati dello studente');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="student-dashboard py-4">
      <Container>
        <h2 className="page-title mb-4">
          <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
          Dashboard Studente
        </h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row className="mb-4">
          <Col lg={4} md={6} className="mb-4">
            <Card className="student-info-card shadow-sm h-100">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                  Informazioni Personali
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="student-info">
                  <div className="student-info-item">
                    <div className="info-label">Nome Completo:</div>
                    <div className="info-value">{user?.name}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="info-label">Email:</div>
                    <div className="info-value">{user?.email}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="info-label">Matricola:</div>
                    <div className="info-value">{user?.matricola || 'Non assegnata'}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="info-label">Telefono:</div>
                    <div className="info-value">{user?.telefono || 'Non specificato'}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="info-label">Indirizzo:</div>
                    <div className="info-value">{user?.indirizzo || 'Non specificato'}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6} className="mb-4">
            <Card className="student-info-card shadow-sm h-100">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                  Informazioni Accademiche
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="student-info">
                  <div className="student-info-item">
                    <div className="info-label">Corso di Laurea:</div>
                    <div className="info-value">{user?.corso?.nome || 'Non assegnato'}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="info-label">Facoltà:</div>
                    <div className="info-value">{user?.corso?.facolta?.nome || 'Non assegnata'}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="info-label">Anno di Corso:</div>
                    <div className="info-value">{user?.anno || '1'}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="info-label">Stato Immatricolazione:</div>
                    <div className="info-value">
                      {user?.isApproved ? 
                        <span className="text-success">Approvata</span> : 
                        <span className="text-warning">In attesa di approvazione</span>}
                    </div>
                  </div>
                  <div className="student-info-item">
                    <div className="info-label">Data Immatricolazione:</div>
                    <div className="info-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Non disponibile'}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={12} className="mb-4">
            <Card className="student-info-card shadow-sm h-100">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Attività Recenti
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="activity-timeline">
                  <div className="timeline-item">
                    <div className="timeline-icon bg-primary">
                      <FontAwesomeIcon icon={faUserGraduate} />
                    </div>
                    <div className="timeline-content">
                      <h6 className="timeline-title">Accesso al Sistema</h6>
                      <p className="timeline-text">Hai effettuato l'accesso al sistema Esse3.</p>
                      <span className="timeline-date">Oggi</span>
                    </div>
                  </div>
                  
                  {user?.matricola ? (
                    <div className="timeline-item">
                      <div className="timeline-icon bg-success">
                        <FontAwesomeIcon icon={faGraduationCap} />
                      </div>
                      <div className="timeline-content">
                        <h6 className="timeline-title">Matricola Assegnata</h6>
                        <p className="timeline-text">Ti è stata assegnata la matricola: {user.matricola}</p>
                        <span className="timeline-date">
                          {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Data non disponibile'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="timeline-item">
                      <div className="timeline-icon bg-warning">
                        <FontAwesomeIcon icon={faGraduationCap} />
                      </div>
                      <div className="timeline-content">
                        <h6 className="timeline-title">Matricola in Attesa</h6>
                        <p className="timeline-text">La tua matricola non è ancora stata assegnata.</p>
                        <span className="timeline-date">In corso</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="timeline-item">
                    <div className="timeline-icon bg-info">
                      <FontAwesomeIcon icon={faBook} />
                    </div>
                    <div className="timeline-content">
                      <h6 className="timeline-title">Registrazione Completata</h6>
                      <p className="timeline-text">Hai completato la registrazione al portale Esse3.</p>
                      <span className="timeline-date">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Data non disponibile'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;
