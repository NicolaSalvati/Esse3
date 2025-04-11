import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUserGraduate, faGraduationCap, faCheck, faTimes, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/AdminDashboard.css';

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
      setError('Errore durante il recupero dei dati della dashboard');
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
    <div className="admin-dashboard py-4">
      <Container>
        <h2 className="page-title mb-4">
          <FontAwesomeIcon icon={faCog} className="me-2" />
          Dashboard Amministratore
        </h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row className="stats-cards mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card bg-primary text-white">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faUserGraduate} size="2x" />
                </div>
                <div className="stat-content ms-3">
                  <h3 className="stat-value">{stats.totalStudents}</h3>
                  <div className="stat-label">Studenti Totali</div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-primary-dark text-white">
                <a href="/admin/students" className="text-white text-decoration-none">
                  Visualizza Tutti <i className="fas fa-arrow-right ms-1"></i>
                </a>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card bg-warning text-white">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faGraduationCap} size="2x" />
                </div>
                <div className="stat-content ms-3">
                  <h3 className="stat-value">{stats.pendingRequests}</h3>
                  <div className="stat-label">Richieste in Attesa</div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-warning-dark text-white">
                <a href="/admin/immatricolazione" className="text-white text-decoration-none">
                  Gestisci Richieste <i className="fas fa-arrow-right ms-1"></i>
                </a>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card bg-success text-white">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faGraduationCap} size="2x" />
                </div>
                <div className="stat-content ms-3">
                  <h3 className="stat-value">{stats.totalCourses}</h3>
                  <div className="stat-label">Corsi di Laurea</div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-success-dark text-white">
                <a href="/admin/facolta" className="text-white text-decoration-none">
                  Gestisci Corsi <i className="fas fa-arrow-right ms-1"></i>
                </a>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card bg-info text-white">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faGraduationCap} size="2x" />
                </div>
                <div className="stat-content ms-3">
                  <h3 className="stat-value">{stats.totalFacolta}</h3>
                  <div className="stat-label">Facoltà</div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-info-dark text-white">
                <a href="/admin/facolta" className="text-white text-decoration-none">
                  Gestisci Facoltà <i className="fas fa-arrow-right ms-1"></i>
                </a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Studenti Recenti</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {recentStudents.length > 0 ? (
                  <Table hover responsive className="mb-0">
                    <thead className="table-light">
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
                          <td>{student.matricola || 'Non assegnata'}</td>
                          <td>{student.corso ? student.corso.nome : 'Non assegnato'}</td>
                          <td>
                            <Button
                              variant="info"
                              size="sm"
                              className="me-1"
                              as="a"
                              href={`/admin/students?id=${student._id}`}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
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
                  <div className="text-center py-4">
                    Nessuno studente registrato recentemente
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-light">
                <Button
                  variant="primary"
                  size="sm"
                  as="a"
                  href="/admin/students"
                  className="w-100"
                >
                  Visualizza Tutti gli Studenti
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Richieste di Immatricolazione in Attesa</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {pendingRequests.length > 0 ? (
                  <Table hover responsive className="mb-0">
                    <thead className="table-light">
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
                              className="me-1"
                              as="a"
                              href={`/admin/immatricolazione?id=${request._id}`}
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              as="a"
                              href={`/admin/immatricolazione?id=${request._id}&reject=true`}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    Nessuna richiesta di immatricolazione in attesa
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-light">
                <Button
                  variant="primary"
                  size="sm"
                  as="a"
                  href="/admin/immatricolazione"
                  className="w-100"
                >
                  Gestisci Tutte le Richieste
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
