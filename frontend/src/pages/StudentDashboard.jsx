import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faBook, faCalendarAlt, faGraduationCap, faUniversity, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';
import axios from 'axios';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showImmatricolazioneModal, setShowImmatricolazioneModal] = useState(false);
  const [corsiDiLaurea, setCorsiDiLaurea] = useState([]);
  const [immatricolazioneForm, setImmatricolazioneForm] = useState({
    corso: '',
    annoAccademico: '2025/2026'
  });

  useEffect(() => {
    fetchStudentData();
    fetchCorsiDiLaurea();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(''); // Resetta l'errore all'inizio della richiesta
      
      // Fetch student details
      const response = await axios.get('/api/v1/auth/me');
      
      setStudentData(response.data.data);
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
      
      // Tenta di recuperare i dati dell'utente dal contesto di autenticazione
      if (user) {
        setStudentData(user);
      }
    }
  };

  const fetchCorsiDiLaurea = async () => {
    try {
      const response = await axios.get('/api/v1/corsi');
      setCorsiDiLaurea(response.data.data);
    } catch (err) {
      console.error('Errore durante il recupero dei corsi di laurea:', err);
      // Dati di esempio in caso di errore
      setCorsiDiLaurea([
        { _id: '1', nome: 'Informatica', facolta: { nome: 'Scienze' } },
        { _id: '2', nome: 'Economia Aziendale', facolta: { nome: 'Economia' } },
        { _id: '3', nome: 'Ingegneria Informatica', facolta: { nome: 'Ingegneria' } }
      ]);
    }
  };

  const handleImmatricolazioneChange = (e) => {
    const { name, value } = e.target;
    setImmatricolazioneForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImmatricolazioneSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/v1/auth/updateprofile', {
        corso: immatricolazioneForm.corso
      });
      
      setStudentData(response.data.data);
      setShowImmatricolazioneModal(false);
      
      // Mostra un messaggio di successo
      setError('');
      alert('Richiesta di immatricolazione inviata con successo! Attendi l\'approvazione dell\'amministratore.');
    } catch (err) {
      console.error('Errore durante l\'immatricolazione:', err);
      alert('Si è verificato un errore durante l\'invio della richiesta di immatricolazione. Riprova più tardi.');
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
        
        {/* Banner Università Parthenope */}
        <Card className="mb-4 bg-primary text-white shadow-sm">
          <Card.Body className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUniversity} size="3x" className="me-3" />
            <div>
              <h4 className="mb-1">Università degli Studi di Napoli "Parthenope"</h4>
              <p className="mb-0">Benvenuto nel portale ufficiale per la gestione della tua carriera universitaria</p>
            </div>
          </Card.Body>
        </Card>
        
        {/* Sezione Immatricolazione */}
        {(!studentData?.corso || studentData?.matricola === 'PENDING') && (
          <Card className="mb-4 border-warning shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Completa la tua Immatricolazione
              </h5>
            </Card.Header>
            <Card.Body>
              <p>Per completare il processo di immatricolazione, seleziona il tuo corso di laurea e invia la richiesta.</p>
              <Button 
                variant="warning" 
                onClick={() => setShowImmatricolazioneModal(true)}
              >
                Procedi con l'Immatricolazione
              </Button>
            </Card.Body>
          </Card>
        )}
        
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
                    <div className="info-value">{user?.matricola === 'PENDING' ? 'In attesa di assegnazione' : user?.matricola || 'Non assegnata'}</div>
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
                      <p className="timeline-text">Hai effettuato l'accesso al portale UniparthenopeHub.</p>
                      <span className="timeline-date">Oggi</span>
                    </div>
                  </div>
                  
                  {user?.matricola && user?.matricola !== 'PENDING' ? (
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
                      <p className="timeline-text">Hai completato la registrazione al portale UniparthenopeHub.</p>
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
        
        {/* Informazioni sull'Università Parthenope */}
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faUniversity} className="me-2" />
              Università degli Studi di Napoli "Parthenope"
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 className="mb-3">Chi Siamo</h6>
                <p>
                  L'Università degli Studi di Napoli "Parthenope" è un'istituzione accademica con una lunga tradizione 
                  nell'istruzione superiore. Fondata nel 1919 come Regio Istituto Superiore Navale, è oggi un'università 
                  moderna che offre una vasta gamma di corsi di laurea in diverse discipline.
                </p>
                <h6 className="mb-3 mt-4">Contatti</h6>
                <ul className="list-unstyled">
                  <li><strong>Indirizzo:</strong> Via Amm. F. Acton, 38 - 80133 Napoli</li>
                  <li><strong>Telefono:</strong> +39 081 5475111</li>
                  <li><strong>Email:</strong> info@uniparthenope.it</li>
                  <li><strong>Sito Web:</strong> www.uniparthenope.it</li>
                </ul>
              </Col>
              <Col md={6}>
                <h6 className="mb-3">Le Nostre Sedi</h6>
                <ul>
                  <li><strong>Sede Centrale:</strong> Via Amm. F. Acton, 38 - 80133 Napoli</li>
                  <li><strong>Sede di Villa Doria d'Angri:</strong> Via Petrarca, 80 - 80122 Napoli</li>
                  <li><strong>Centro Direzionale:</strong> Isola C4 - 80143 Napoli</li>
                  <li><strong>Sede di Nola:</strong> Via S. Gennaro, 30 - 80035 Nola (NA)</li>
                  <li><strong>Sede di Torre Annunziata:</strong> Via Spalatorie, 1 - 80058 Torre Annunziata (NA)</li>
                </ul>
                <h6 className="mb-3 mt-4">Orari Segreteria Studenti</h6>
                <ul className="list-unstyled">
                  <li><strong>Lunedì, Mercoledì, Venerdì:</strong> 9:00 - 12:00</li>
                  <li><strong>Martedì, Giovedì:</strong> 9:00 - 12:00 e 14:30 - 16:00</li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      
      {/* Modal per l'immatricolazione */}
      <Modal show={showImmatricolazioneModal} onHide={() => setShowImmatricolazioneModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Richiesta di Immatricolazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleImmatricolazioneSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Corso di Laurea</Form.Label>
              <Form.Select 
                name="corso" 
                value={immatricolazioneForm.corso} 
                onChange={handleImmatricolazioneChange}
                required
              >
                <option value="">Seleziona un corso di laurea</option>
                {corsiDiLaurea.map(corso => (
                  <option key={corso._id} value={corso._id}>
                    {corso.nome} - {corso.facolta?.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Anno Accademico</Form.Label>
              <Form.Control 
                type="text" 
                name="annoAccademico" 
                value={immatricolazioneForm.annoAccademico} 
                onChange={handleImmatricolazioneChange}
                disabled
              />
              <Form.Text className="text-muted">
                L'anno accademico corrente è preimpostato.
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowImmatricolazioneModal(false)}>
                Annulla
              </Button>
              <Button variant="primary" type="submit">
                Invia Richiesta
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
