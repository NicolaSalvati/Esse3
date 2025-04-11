import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faIdCard, faGraduationCap, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    indirizzo: user?.indirizzo || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    // Reset form data when toggling edit mode
    if (!editing) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        indirizzo: user?.indirizzo || ''
      });
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Qui andrebbe la chiamata API per aggiornare il profilo
      // Per ora simuliamo un successo
      setSuccess('Profilo aggiornato con successo!');
      setEditing(false);
    } catch (err) {
      setError('Errore durante l\'aggiornamento del profilo. Riprova più tardi.');
    }
  };

  return (
    <div className="profile-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="profile-card shadow-lg border-0 rounded-lg">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Profilo Utente
                </h2>
              </Card.Header>
              
              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Tabs defaultActiveKey="info" id="profile-tabs" className="mb-4">
                  <Tab eventKey="info" title="Informazioni Personali">
                    <div className="profile-section">
                      {editing ? (
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nome Completo</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              disabled
                            />
                            <Form.Text className="text-muted">
                              L'email non può essere modificata.
                            </Form.Text>
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control
                              type="tel"
                              name="telefono"
                              value={formData.telefono}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Indirizzo</Form.Label>
                            <Form.Control
                              type="text"
                              name="indirizzo"
                              value={formData.indirizzo}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          
                          <div className="d-flex justify-content-end mt-4">
                            <Button 
                              variant="secondary" 
                              onClick={handleEditToggle} 
                              className="me-2"
                            >
                              <FontAwesomeIcon icon={faTimes} className="me-1" />
                              Annulla
                            </Button>
                            <Button 
                              variant="success" 
                              type="submit"
                            >
                              <FontAwesomeIcon icon={faSave} className="me-1" />
                              Salva
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <>
                          <div className="profile-info">
                            <div className="profile-info-item">
                              <div className="profile-info-label">
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                Nome Completo:
                              </div>
                              <div className="profile-info-value">{user?.name}</div>
                            </div>
                            
                            <div className="profile-info-item">
                              <div className="profile-info-label">
                                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                Email:
                              </div>
                              <div className="profile-info-value">{user?.email}</div>
                            </div>
                            
                            <div className="profile-info-item">
                              <div className="profile-info-label">
                                <FontAwesomeIcon icon={faIdCard} className="me-2" />
                                Matricola:
                              </div>
                              <div className="profile-info-value">{user?.matricola || 'Non assegnata'}</div>
                            </div>
                            
                            <div className="profile-info-item">
                              <div className="profile-info-label">
                                <FontAwesomeIcon icon={faPhone} className="me-2" />
                                Telefono:
                              </div>
                              <div className="profile-info-value">{user?.telefono || 'Non specificato'}</div>
                            </div>
                            
                            <div className="profile-info-item">
                              <div className="profile-info-label">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                                Indirizzo:
                              </div>
                              <div className="profile-info-value">{user?.indirizzo || 'Non specificato'}</div>
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-end mt-4">
                            <Button 
                              variant="primary" 
                              onClick={handleEditToggle}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-1" />
                              Modifica Profilo
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </Tab>
                  
                  {user?.role === 'student' && (
                    <Tab eventKey="academic" title="Informazioni Accademiche">
                      <div className="profile-section">
                        <div className="profile-info">
                          <div className="profile-info-item">
                            <div className="profile-info-label">
                              <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                              Corso di Laurea:
                            </div>
                            <div className="profile-info-value">{user?.corso || 'Non specificato'}</div>
                          </div>
                          
                          <div className="profile-info-item">
                            <div className="profile-info-label">
                              <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                              Anno di Corso:
                            </div>
                            <div className="profile-info-value">{user?.anno || '1'}</div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  )}
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
