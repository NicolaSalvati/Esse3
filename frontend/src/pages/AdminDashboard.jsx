import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUserGraduate, faGraduationCap, faCheck, faTimes, faEdit, faEye, faUsers, faUniversity, faBookOpen, faChartLine } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingRequests: 0,
    totalCourses: 0,
    totalFacolta: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(''); // Resetta l'errore all'inizio della richiesta
      const token = localStorage.getItem('token');
      
      // Fetch statistics
      const statsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Fetch recent students
      const studentsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/users?role=student&limit=5&sort=-createdAt`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Fetch pending immatricolazione requests
      const requestsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/immatricolazione?status=pending&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setStats({
        totalStudents: statsResponse.data.totalStudents || 0,
        pendingRequests: statsResponse.data.pendingRequests || 0,
        totalCourses: statsResponse.data.totalCourses || 0,
        totalFacolta: statsResponse.data.totalFacolta || 0
      });
      
      setRecentStudents(studentsResponse.data.data || []);
      setPendingRequests(requestsResponse.data.data || []);
      setLoading(false);
    } catch (err) {
      let errorMessage = 'Si è verificato un problema temporaneo. Ricarica la pagina per riprovare.';
      if (err.response) {
        // Il server ha risposto con un codice di errore
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        // La richiesta è stata effettuata ma non è stata ricevuta alcuna risposta
        errorMessage = 'Impossibile connettersi al server. Verifica la tua connessione internet.';
      }
      setError(errorMessage);
      setLoading(false);
      console.error('Errore durante il recupero dei dati:', err);
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
    <div className="admin-dashboard py-5">
      <Container>
        <div className="mb-5 text-center">
          <h1 className="display-4 fw-bold text-primary mb-3">
            <FontAwesomeIcon icon={faChartLine} className="me-3" />
            Dashboard Amministratore
          </h1>
          <p className="lead text-muted">
            Gestisci studenti, richieste di immatricolazione, corsi e facoltà dell'Università Parthenope
          </p>
        </div>
        
        {error && (
          <Alert variant="danger" className="glass-card-blue mb-4">
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            {error}
          </Alert>
        )}
        
        <Row className="stats-cards mb-5 animate-fadeInUp">
          <Col md={3} sm={6} className="mb-4">
            <Card className="glass-card-blue shadow-sm hover-lift h-100">
              <Card.Body className="text-center p-4">
                <div className="stat-icon bg-primary text-white rounded-circle p-3 mx-auto mb-3">
                  <FontAwesomeIcon icon={faUserGraduate} size="2x" />
                </div>
                <h3 className="stat-value display-5 fw-bold">{stats.totalStudents}</h3>
                <div className="stat-label text-muted mb-3">Studenti Totali</div>
                <Button
                  variant="primary"
                  size="sm"
                  as="a"
                  href="/admin/students"
                  className="glass-btn w-100"
                >
                  Visualizza Tutti
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-4">
            <Card className="glass-card-blue shadow-sm hover-lift h-100">
              <Card.Body className="text-center p-4">
                <div className="stat-icon bg-warning text-white rounded-circle p-3 mx-auto mb-3">
                  <FontAwesomeIcon icon={faGraduationCap} size="2x" />
                </div>
                <h3 className="stat-value display-5 fw-bold">{stats.pendingRequests}</h3>
                <div className="stat-label text-muted mb-3">Richieste in Attesa</div>
                <Button
                  variant="warning"
                  size="sm"
                  as="a"
                  href="/admin/immatricolazione"
                  className="glass-btn w-100"
                >
                  Gestisci Richieste
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-4">
            <Card className="glass-card-blue shadow-sm hover-lift h-100">
              <Card.Body className="text-center p-4">
                <div className="stat-icon bg-success text-white rounded-circle p-3 mx-auto mb-3">
                  <FontAwesomeIcon icon={faBookOpen} size="2x" />
                </div>
                <h3 className="stat-value display-5 fw-bold">{stats.totalCourses}</h3>
                <div className="stat-label text-muted mb-3">Corsi di Laurea</div>
                <Button
                  variant="success"
                  size="sm"
                  as="a"
                  href="/admin/corsi"
                  className="glass-btn w-100"
                >
                  Gestisci Corsi
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-4">
            <Card className="glass-card-blue shadow-sm hover-lift h-100">
              <Card.Body className="text-center p-4">
                <div className="stat-icon bg-info text-white rounded-circle p-3 mx-auto mb-3">
                  <FontAwesomeIcon icon={faUniversity} size="2x" />
                </div>
                <h3 className="stat-value display-5 fw-bold">{stats.totalFacolta}</h3>
                <div className="stat-label text-muted mb-3">Facoltà</div>
                <Button
                  variant="info"
                  size="sm"
                  as="a"
                  href="/admin/facolta"
                  className="glass-btn w-100"
                >
                  Gestisci Facoltà
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="animate-fadeInUp">
          <Col lg={6} className="mb-4">
            <Card className="glass-card-blue shadow-sm h-100">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Studenti Recenti
                </h5>
                <Badge bg="light" text="dark" pill>
                  {recentStudents.length}
                </Badge>
              </Card.Header>
              <Card.Body className="p-0">
                {recentStudents.length > 0 ? (
                  <Table hover responsive className="glass-table mb-0">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Matricola</th>
                        <th>Corso</th>
                        <th>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentStudents.map(student => (
                        <tr key={student._id}>
                          <td>{student.name}</td>
                          <td>
                            {student.matricola ? (
                              <Badge bg="success" pill>{student.matricola}</Badge>
                            ) : (
                              <Badge bg="secondary" pill>Non assegnata</Badge>
                            )}
                          </td>
                          <td>{student.corso ? student.corso.nome : 'Non assegnato'}</td>
                          <td>
                            <Button
                              variant="info"
                              size="sm"
                              className="glass-btn me-1"
                              as="a"
                              href={`/admin/students?id=${student._id}`}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="glass-btn"
                              as="a"
                              href={`/admin/matricole?id=${student._id}`}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon={faUsers} size="3x" className="text-muted mb-3" />
                    <p className="text-muted">Nessuno studente registrato recentemente</p>
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-light">
                <Button
                  variant="primary"
                  size="sm"
                  as="a"
                  href="/admin/students"
                  className="glass-btn w-100"
                >
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Visualizza Tutti gli Studenti
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col lg={6} className="mb-4">
            <Card className="glass-card-blue shadow-sm h-100">
              <Card.Header className="bg-warning text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                  Richieste di Immatricolazione
                </h5>
                <Badge bg="light" text="dark" pill>
                  {pendingRequests.length}
                </Badge>
              </Card.Header>
              <Card.Body className="p-0">
                {pendingRequests.length > 0 ? (
                  <Table hover responsive className="glass-table mb-0">
                    <thead>
                      <tr>
                        <th>Studente</th>
                        <th>Corso</th>
                        <th>Data</th>
                        <th>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map(request => (
                        <tr key={request._id}>
                          <td>{request.student.name}</td>
                          <td>{request.corso.nome}</td>
                          <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Button
                              variant="success"
                              size="sm"
                              className="glass-btn me-1"
                              as="a"
                              href={`/admin/immatricolazione?id=${request._id}`}
                              title="Approva"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="glass-btn"
                              as="a"
                              href={`/admin/immatricolazione?id=${request._id}&reject=true`}
                              title="Rifiuta"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon={faGraduationCap} size="3x" className="text-muted mb-3" />
                    <p className="text-muted">Nessuna richiesta di immatricolazione in attesa</p>
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-light">
                <Button
                  variant="warning"
                  size="sm"
                  as="a"
                  href="/admin/immatricolazione"
                  className="glass-btn w-100"
                >
                  <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                  Gestisci Tutte le Richieste
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        
        <Row className="mt-4 animate-fadeInUp">
          <Col>
            <Card className="glass-card-blue shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  Azioni Rapide
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} sm={6} className="mb-3">
                    <Button
                      variant="primary"
                      className="glass-btn w-100 py-3"
                      as="a"
                      href="/admin/students/new"
                    >
                      <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                      Nuovo Studente
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button
                      variant="success"
                      className="glass-btn w-100 py-3"
                      as="a"
                      href="/admin/corsi/new"
                    >
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Nuovo Corso
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button
                      variant="info"
                      className="glass-btn w-100 py-3"
                      as="a"
                      href="/admin/facolta/new"
                    >
                      <FontAwesomeIcon icon={faUniversity} className="me-2" />
                      Nuova Facoltà
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button
                      variant="warning"
                      className="glass-btn w-100 py-3"
                      as="a"
                      href="/admin/reports"
                    >
                      <FontAwesomeIcon icon={faChartLine} className="me-2" />
                      Statistiche
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
