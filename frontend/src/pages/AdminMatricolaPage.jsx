import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faIdCard, faCheck, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';

const AdminMatricolaPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [matricola, setMatricola] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { user } = useAuth();

  // Carica gli studenti in attesa di approvazione
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/auth/users?role=student');
        // Filtra gli studenti non approvati o con matricola "PENDING"
        const pendingStudents = response.data.data.filter(
          student => !student.isApproved || student.matricola === 'PENDING'
        );
        setStudents(pendingStudents);
        setFilteredStudents(pendingStudents);
      } catch (err) {
        console.error('Errore durante il recupero degli studenti:', err);
        setError('Impossibile caricare gli studenti. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filtra gli studenti in base al termine di ricerca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        student => 
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Genera una matricola nel formato richiesto (0124XXXXXX)
  const generateMatricola = () => {
    const prefix = '0124';
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${prefix}${randomDigits}`;
  };

  // Seleziona uno studente
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setMatricola(generateMatricola());
    setError(null);
    setSuccess(null);
  };

  // Assegna la matricola allo studente selezionato
  const handleAssignMatricola = async () => {
    if (!selectedStudent) {
      setError('Seleziona uno studente prima di assegnare una matricola.');
      return;
    }

    if (!matricola || !matricola.startsWith('0124') || matricola.length !== 10) {
      setError('La matricola deve iniziare con 0124 e avere 10 caratteri in totale.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`/auth/assignmatricola/${selectedStudent._id}`, { matricola });
      
      // Aggiorna la lista degli studenti
      setStudents(prevStudents => 
        prevStudents.filter(student => student._id !== selectedStudent._id)
      );
      
      setSuccess(`Matricola ${matricola} assegnata con successo a ${selectedStudent.name}.`);
      setSelectedStudent(null);
      setMatricola('');
    } catch (err) {
      console.error('Errore durante l\'assegnazione della matricola:', err);
      setError(err.response?.data?.message || 'Errore durante l\'assegnazione della matricola. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-matricola-page py-5">
      <Container>
        <h1 className="mb-4 text-center">
          <FontAwesomeIcon icon={faIdCard} className="me-2" />
          Gestione Matricole
        </h1>
        
        <p className="text-center mb-5">
          Assegna le matricole agli studenti in attesa di approvazione.
        </p>
        
        {error && (
          <Alert variant="danger" className="animate-fadeInUp">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="animate-fadeInUp">
            {success}
          </Alert>
        )}
        
        <Row>
          <Col lg={7} className="mb-4 mb-lg-0">
            <Card className="shadow-sm matricola-card animate-fadeInLeft">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Studenti in attesa</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Cerca per nome o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="ps-4 hover-glow"
                    />
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="position-absolute text-muted" 
                      style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                </Form.Group>
                
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Caricamento studenti...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon={faUserGraduate} size="3x" className="text-muted mb-3" />
                    <p>Nessuno studente in attesa di approvazione.</p>
                  </div>
                ) : (
                  <div className="student-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Email</th>
                          <th>Stato</th>
                          <th>Azioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map(student => (
                          <tr 
                            key={student._id} 
                            className={`student-list-item ${selectedStudent?._id === student._id ? 'selected' : ''}`}
                          >
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>
                              {student.isApproved ? (
                                <Badge bg="success">Approvato</Badge>
                              ) : (
                                <Badge bg="warning">In attesa</Badge>
                              )}
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleSelectStudent(student)}
                                className="btn-animated"
                              >
                                Seleziona
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={5}>
            <Card className="shadow-sm matricola-card animate-fadeInRight">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Assegna Matricola</h4>
              </Card.Header>
              <Card.Body>
                {selectedStudent ? (
                  <div>
                    <div className="mb-4">
                      <h5>Studente selezionato:</h5>
                      <p className="mb-1"><strong>Nome:</strong> {selectedStudent.name}</p>
                      <p className="mb-1"><strong>Email:</strong> {selectedStudent.email}</p>
                      <p className="mb-3"><strong>Telefono:</strong> {selectedStudent.telefono || 'Non specificato'}</p>
                    </div>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Matricola</Form.Label>
                      <Form.Control
                        type="text"
                        value={matricola}
                        onChange={(e) => setMatricola(e.target.value)}
                        placeholder="Inserisci o genera una matricola"
                        className="hover-glow"
                      />
                      <Form.Text className="text-muted">
                        La matricola deve iniziare con 0124 e avere 10 caratteri in totale.
                      </Form.Text>
                    </Form.Group>
                    
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        onClick={handleAssignMatricola}
                        disabled={loading}
                        className="btn-animated hover-lift"
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Assegnazione in corso...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                            Assegna Matricola
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => {
                          setSelectedStudent(null);
                          setMatricola('');
                          setError(null);
                          setSuccess(null);
                        }}
                        disabled={loading}
                        className="btn-animated"
                      >
                        <FontAwesomeIcon icon={faTimes} className="me-2" />
                        Annulla
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon={faIdCard} size="3x" className="text-muted mb-3" />
                    <p>Seleziona uno studente dalla lista per assegnare una matricola.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminMatricolaPage;
