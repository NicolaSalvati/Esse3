import React, { useState, useRef } from 'react';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import '../styles/Step3.css';

// Componente Step3 - Dati Personali
// Adattato per integrarsi con l'interfaccia dell'applicazione dell'utente
const Step3 = ({ onNext, onPrevious }) => {
  // Riferimenti per garantire la fluidità dei campi di input
  const nomeRef = useRef(null);
  const cognomeRef = useRef(null);
  const dataNascitaRef = useRef(null);
  
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    dataNascita: '16/01/1953',
    sesso: 'Maschio',
    primaCittadinanza: 'ITALIA',
    nazione: 'ITALIA',
    provincia: 'Brindisi',
    comuneCitta: 'Mesagne',
    codiceFiscale: 'RZZPRN53A16F152K'
  });
  
  // Stato per gli errori di validazione
  const [errors, setErrors] = useState({});
  
  // Funzione per gestire il cambiamento nei campi di input mantenendo il focus
  const handleInputChangeWithFocus = (e) => {
    const { name, value } = e.target;
    
    // Aggiorna i dati del form
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Rimuovi l'errore quando l'utente inizia a digitare
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  // Funzione per gestire il submit del form
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validazione dei dati
    let isValid = true;
    let newErrors = {};
    
    if (!formData.nome) {
      newErrors.nome = 'Il nome è obbligatorio';
      isValid = false;
    }
    
    if (!formData.cognome) {
      newErrors.cognome = 'Il cognome è obbligatorio';
      isValid = false;
    }
    
    if (!formData.dataNascita) {
      newErrors.dataNascita = 'La data di nascita è obbligatoria';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (isValid && onNext) {
      onNext();
    }
    
    return isValid;
  };
  
  return (
    <Container className="step3-container">
      {/* Intestazione */}
      <div className="step3-header">
        <h4 className="step3-title">Registrazione: Dati personali</h4>
        <p className="step3-description">
          In questa pagina viene visualizzato il modulo per l'inserimento o la modifica dei dati personali e del luogo di nascita dell'utente.
        </p>
      </div>
      
      {/* Form */}
      <div className="step3-form-container">
        <div className="step3-form-header">Dati personali</div>
        
        <Form onSubmit={handleSubmit} className="step3-form">
          {/* Nome */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Nome*
            </Form.Label>
            <Col sm="8">
              <Form.Control
                ref={nomeRef}
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChangeWithFocus}
                isInvalid={!!errors.nome}
                autoComplete="off"
                className="step3-input"
              />
              <Form.Control.Feedback type="invalid">
                {errors.nome}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          
          {/* Cognome */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Cognome*
            </Form.Label>
            <Col sm="8">
              <Form.Control
                ref={cognomeRef}
                type="text"
                name="cognome"
                value={formData.cognome}
                onChange={handleInputChangeWithFocus}
                isInvalid={!!errors.cognome}
                autoComplete="off"
                className="step3-input"
              />
              <Form.Control.Feedback type="invalid">
                {errors.cognome}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          
          {/* Data Nascita */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Data Nascita*
            </Form.Label>
            <Col sm="8">
              <div className="date-input-container">
                <Form.Control
                  ref={dataNascitaRef}
                  type="text"
                  name="dataNascita"
                  value={formData.dataNascita}
                  onChange={handleInputChangeWithFocus}
                  isInvalid={!!errors.dataNascita}
                  autoComplete="off"
                  className="step3-input"
                />
                <span className="calendar-icon">📅</span>
              </div>
              <Form.Text className="date-format-hint">
                (gg/MM/yyyy)
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.dataNascita}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          
          {/* Sesso */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Sesso*
            </Form.Label>
            <Col sm="8">
              <div className="gender-options">
                <Form.Check
                  inline
                  type="radio"
                  label="Maschio"
                  name="sesso"
                  id="sesso-maschio"
                  value="Maschio"
                  checked={formData.sesso === 'Maschio'}
                  onChange={handleInputChangeWithFocus}
                  className="gender-option"
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Femmina"
                  name="sesso"
                  id="sesso-femmina"
                  value="Femmina"
                  checked={formData.sesso === 'Femmina'}
                  onChange={handleInputChangeWithFocus}
                  className="gender-option"
                />
              </div>
            </Col>
          </Form.Group>
          
          {/* Prima cittadinanza */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Prima cittadinanza*
            </Form.Label>
            <Col sm="8">
              <Form.Select
                name="primaCittadinanza"
                value={formData.primaCittadinanza}
                onChange={handleInputChangeWithFocus}
                className="step3-select"
              >
                <option value="ITALIA">ITALIA</option>
                <option value="FRANCIA">FRANCIA</option>
                <option value="GERMANIA">GERMANIA</option>
                <option value="SPAGNA">SPAGNA</option>
                <option value="REGNO UNITO">REGNO UNITO</option>
              </Form.Select>
            </Col>
          </Form.Group>
          
          {/* Nazione */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Nazione*
            </Form.Label>
            <Col sm="8">
              <Form.Select
                name="nazione"
                value={formData.nazione}
                onChange={handleInputChangeWithFocus}
                className="step3-select"
              >
                <option value="ITALIA">ITALIA</option>
                <option value="FRANCIA">FRANCIA</option>
                <option value="GERMANIA">GERMANIA</option>
                <option value="SPAGNA">SPAGNA</option>
                <option value="REGNO UNITO">REGNO UNITO</option>
              </Form.Select>
            </Col>
          </Form.Group>
          
          {/* Provincia */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Provincia*
            </Form.Label>
            <Col sm="8">
              <Form.Select
                name="provincia"
                value={formData.provincia}
                onChange={handleInputChangeWithFocus}
                className="step3-select"
              >
                <option value="Brindisi">Brindisi</option>
                <option value="Roma">Roma</option>
                <option value="Milano">Milano</option>
                <option value="Napoli">Napoli</option>
                <option value="Torino">Torino</option>
              </Form.Select>
            </Col>
          </Form.Group>
          
          {/* Comune/Città */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Comune/Città*
            </Form.Label>
            <Col sm="8">
              <Form.Select
                name="comuneCitta"
                value={formData.comuneCitta}
                onChange={handleInputChangeWithFocus}
                className="step3-select"
              >
                <option value="Mesagne">Mesagne</option>
                <option value="Brindisi">Brindisi</option>
                <option value="Roma">Roma</option>
                <option value="Milano">Milano</option>
                <option value="Napoli">Napoli</option>
              </Form.Select>
            </Col>
          </Form.Group>
          
          {/* Codice Fiscale */}
          <Form.Group as={Row} className="step3-form-group">
            <Form.Label column sm="4" className="step3-label">
              Codice Fiscale*
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                name="codiceFiscale"
                value={formData.codiceFiscale}
                readOnly
                className="step3-input fiscal-code"
              />
              <Form.Text className="fiscal-code-hint">
                (calcolato se non indicato)
              </Form.Text>
            </Col>
          </Form.Group>
        </Form>
      </div>
      
      {/* Pulsanti */}
      <div className="step3-buttons">
        <Button
          variant="outline-secondary"
          onClick={onPrevious}
          className="step3-button-back"
        >
          Indietro
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="step3-button-next"
        >
          Avanti
        </Button>
      </div>
    </Container>
  );
};

export default Step3;
