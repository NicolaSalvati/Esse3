import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faChalkboardTeacher, faUsers, faIdCard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingStudents: 0,
    approvedStudents: 0
  });
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Ottieni tutti gli studenti
        const response = await axios.get('/auth/users?role=student');
        const students = response.data.data;
        
        // Calcola le statistiche
        const approved = students.filter(student => student.isApproved);
        const pending = students.filter(student => !student.isApproved);
        
        setStats({
          totalStudents: students.length,
          pendingStudents: pending.length,
          approvedStudents: approved.length
        });
        
        // Imposta gli studenti in attesa
        setPendingStudents(pending.slice(0, 5)); // Mostra solo i primi 5
        
      } catch (err) {
        console.error('Errore durante il recupero dei dati:', err);
        setError('Impossibile caricare i dati. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard py-5">
      <Container>
        <h1 className="mb-4 text-center animate-fadeInUp">
          <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
          Dashboard Amministratore
        </h1>
        
        <p className="text-center mb-5 animate-fadeInUp">
          Benvenuto, <strong>{user.name}</strong>. Gestisci gli studenti e le matricole dal tuo pannello di controllo.
        </p>
        
        {error && (
          <Alert variant="danger" className="animate-fadeInUp">
            {error}
          </Alert>
        )}
        
        {/* Statistiche */}
        <Row className="mb-5">
          <Col md={4} className="mb-4 mb-md-0">
            <div className="stat-card animate-fadeInUp">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <FontAwesomeIcon icon={faUsers} size="2x" className="text-primary" />
                </div>
                <div>
                  <div className="stat-value">{stats.totalStudents}</div>
                  <div className="stat-label">Studenti Totali</div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <div className="stat-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <FontAwesomeIcon icon={faCheckCircle} size="2x" className="text-success" />
                </div>
                <div>
                  <div className="stat-value">{stats.approvedStudents}</div>
                  <div className="stat-label">Studenti Approvati</div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col md={4}>
            <div className="stat-card animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <FontAwesomeIcon icon={faIdCard} size="2x" className="text-warning" />
                </div>
                <div>
                  <div className="stat-value">{stats.pendingStudents}</div>
                  <div className="stat-label">Studenti in Attesa</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Studenti in attesa */}
        <Row>
          <Col lg={12}>
            <Card className="shadow-sm dashboard-card animate-fadeInUp">
              <Card.Header className="dashboard-card-header">
                <h4 className="mb-0">Studenti in Attesa di Approvazione</h4>
              </Card.Header>
              <Card.Body>
                {pendingStudents.length === 0 ? (
                  <div className="text-center py-4">
                    <FontAwesomeIcon icon={faUserGraduate} size="3x" className="text-muted mb-3" />
                    <p>Nessuno studente in attesa di approvazione.</p>
                  </div>
                ) : (
                  <>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Email</th>
                          <th>Telefono</th>
                          <th>Stato</th>
                          <th>Azioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingStudents.map(student => (
                          <tr key={student._id} className="student-list-item">
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.telefono || 'Non specificato'}</td>
                            <td>
                              <Badge bg="warning">In attesa</Badge>
                            </td>
                            <td>
                              <Button 
                                as="a" 
                                href="/admin/matricole" 
                                variant="outline-primary" 
                                size="sm"
                                className="btn-animated"
                              >
                                Assegna Matricola
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    {stats.pendingStudents > 5 && (
                      <div className="text-center mt-3">
                        <Button 
                          as="a" 
                          href="/admin/matricole" 
                          variant="primary"
                          className="btn-animated hover-lift"
                        >
                          Visualizza tutti ({stats.pendingStudents})
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
