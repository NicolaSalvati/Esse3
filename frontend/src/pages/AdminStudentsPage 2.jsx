import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Tabs, Tab, Alert, Spinner, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faSearch, faEye, faEdit, faTrash, faGraduationCap, faFilter, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/AdminStudentsPage.css';

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [facolta, setFacolta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacolta, setSelectedFacolta] = useState('');
  const [selectedCorso, setSelectedCorso] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchFacolta();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/users?role=student`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setStudents(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Errore durante il recupero degli studenti');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchFacolta = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/facolta`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setFacolta(response.data.data);
    } catch (err) {
      console.error('Errore durante il recupero delle facoltà:', err);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleCloseModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.matricola && student.matricola.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFacolta = !selectedFacolta || 
      (student.corso && student.corso.dipartimento === selectedFacolta);
    
    const matchesCorso = !selectedCorso || 
      (student.corso && student.corso._id === selectedCorso);
    
    return matchesSearch && matchesFacolta && matchesCorso;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'corso') {
      aValue = a.corso ? a.corso.nome : '';
      bValue = b.corso ? b.corso.nome : '';
    }
    
    if (!aValue) return 1;
    if (!bValue) return -1;
    
    if (typeof aValue === 'string') {
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    } else {
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} />;
    return sortDirection === 'asc' ? 
      <FontAwesomeIcon icon={faSortUp} /> : 
      <FontAwesomeIcon icon={faSortDown} />;
  };

  const getStudentsByFacolta = () => {
    const studentsByFacolta = {};
    
    facolta.forEach(f => {
      studentsByFacolta[f.nome] = students.filter(student => 
        student.corso && 
        f.corsi.some(corso => corso._id === student.corso._id)
      );
    });
    
    return studentsByFacolta;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="admin-students-page py-4">
      <Container>
        <h2 className="page-title mb-4">
          <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
          Gestione Studenti
        </h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Tabs defaultActiveKey="list" id="students-tabs" className="mb-4">
          <Tab eventKey="list" title="Lista Studenti">
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-light">
                <Row className="align-items-center">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faSearch} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Cerca per nome, email o matricola..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Select
                        value={selectedFacolta}
                        onChange={(e) => {
                          setSelectedFacolta(e.target.value);
                          setSelectedCorso('');
                        }}
                      >
                        <option value="">Tutte le Facoltà</option>
                        {facolta.map(f => (
                          <option key={f._id} value={f.nome}>{f.nome}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Select
                        value={selectedCorso}
                        onChange={(e) => setSelectedCorso(e.target.value)}
                        disabled={!selectedFacolta}
                      >
                        <option value="">Tutti i Corsi</option>
                        {selectedFacolta && 
                          facolta
                            .find(f => f.nome === selectedFacolta)?.corsi
                            .map(corso => (
                              <option key={corso._id} value={corso._id}>
                                {corso.nome}
                              </option>
                            ))
                        }
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th onClick={() => handleSort('matricola')} className="sortable-header">
                          Matricola {getSortIcon('matricola')}
                        </th>
                        <th onClick={() => handleSort('name')} className="sortable-header">
                          Nome {getSortIcon('name')}
                        </th>
                        <th onClick={() => handleSort('email')} className="sortable-header">
                          Email {getSortIcon('email')}
                        </th>
                        <th onClick={() => handleSort('corso')} className="sortable-header">
                          Corso di Laurea {getSortIcon('corso')}
                        </th>
                        <th onClick={() => handleSort('anno')} className="sortable-header">
                          Anno {getSortIcon('anno')}
                        </th>
                        <th className="text-center">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedStudents.length > 0 ? (
                        sortedStudents.map(student => (
                          <tr key={student._id}>
                            <td>{student.matricola || 'Non assegnata'}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.corso ? student.corso.nome : 'Non assegnato'}</td>
                            <td>{student.anno || 1}</td>
                            <td className="text-center">
                              <Button
                                variant="info"
                                size="sm"
                                className="me-2"
                                onClick={() => handleViewStudent(student)}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                as="a"
                                href={`/admin/matricole?id=${student._id}`}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            Nessuno studente trovato
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Totale: {filteredStudents.length} studenti</span>
                </div>
              </Card.Footer>
            </Card>
          </Tab>
          
          <Tab eventKey="byFacolta" title="Studenti per Facoltà">
            <div className="facolta-students-container">
              {facolta.map(f => {
                const facultyStudents = students.filter(student => 
                  student.corso && 
                  f.corsi.some(corso => corso._id === student.corso._id)
                );
                
                return (
                  <Card key={f._id} className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">
                        <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                        {f.nome} ({facultyStudents.length} studenti)
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {facultyStudents.length > 0 ? (
                        <div className="table-responsive">
                          <Table hover className="mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>Matricola</th>
                                <th>Nome</th>
                                <th>Corso di Laurea</th>
                                <th>Anno</th>
                                <th className="text-center">Azioni</th>
                              </tr>
                            </thead>
                            <tbody>
                              {facultyStudents.map(student => (
                                <tr key={student._id}>
                                  <td>{student.matricola || 'Non assegnata'}</td>
                                  <td>{student.name}</td>
                                  <td>{student.corso ? student.corso.nome : 'Non assegnato'}</td>
                                  <td>{student.anno || 1}</td>
                                  <td className="text-center">
                                    <Button
                                      variant="info"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleViewStudent(student)}
                                    >
                                      <FontAwesomeIcon icon={faEye} />
                                    </Button>
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      className="me-2"
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
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          Nessuno studente iscritto a questa facoltà
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </Tab>
        </Tabs>
        
        {/* Modal per visualizzare i dettagli dello studente */}
        <Modal show={showStudentModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
              Dettagli Studente
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedStudent && (
              <div className="student-details">
                <Row className="mb-4">
                  <Col md={6}>
                    <h5 className="text-primary mb-3">Informazioni Personali</h5>
                    <Table className="table-borderless">
                      <tbody>
                        <tr>
                          <th width="40%">Nome Completo:</th>
                          <td>{selectedStudent.name}</td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{selectedStudent.email}</td>
                        </tr>
                        <tr>
                          <th>Matricola:</th>
                          <td>{selectedStudent.matricola || 'Non assegnata'}</td>
                        </tr>
                        <tr>
                          <th>Telefono:</th>
                          <td>{selectedStudent.telefono || 'Non specificato'}</td>
                        </tr>
                        <tr>
                          <th>Indirizzo:</th>
                          <td>{selectedStudent.indirizzo || 'Non specificato'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h5 className="text-primary mb-3">Informazioni Accademiche</h5>
                    <Table className="table-borderless">
                      <tbody>
                        <tr>
                          <th width="40%">Corso di Laurea:</th>
                          <td>{selectedStudent.corso ? selectedStudent.corso.nome : 'Non assegnato'}</td>
                        </tr>
                        <tr>
                          <th>Facoltà:</th>
                          <td>
                            {selectedStudent.corso ? 
                              facolta.find(f => 
                                f.corsi.some(c => c._id === selectedStudent.corso._id)
                              )?.nome || 'Non trovata' 
                              : 'Non assegnata'}
                          </td>
                        </tr>
                        <tr>
                          <th>Anno di Corso:</th>
                          <td>{selectedStudent.anno || 1}</td>
                        </tr>
                        <tr>
                          <th>Stato Account:</th>
                          <td>
                            {selectedStudent.isApproved ? 
                              <span className="text-success">Approvato</span> : 
                              <span className="text-warning">In attesa di approvazione</span>}
                          </td>
                        </tr>
                        <tr>
                          <th>Data Registrazione:</th>
                          <td>{new Date(selectedStudent.createdAt).toLocaleDateString()}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Chiudi
            </Button>
            {selectedStudent && (
              <Button 
                variant="primary" 
                as="a" 
                href={`/admin/matricole?id=${selectedStudent._id}`}
              >
                <FontAwesomeIcon icon={faEdit} className="me-1" />
                Modifica
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminStudentsPage;
