import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faIdCard, faHome, faPassport, faGraduationCap, faMoneyBill, faUsers, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ImmatricolazionePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [corsiDiLaurea, setCorsiDiLaurea] = useState([]);
  const [formData, setFormData] = useState({
    // Dati Anagrafici
    nome: '',
    cognome: '',
    sesso: '',
    codiceFiscale: '',
    dataNascita: '',
    luogoNascita: '',
    provinciaNascita: '',
    statoNascita: 'Italia',
    cittadinanza: 'Italiana',
    statoCivile: '',
    
    // Dati di Residenza
    indirizzo: '',
    comune: '',
    cap: '',
    provincia: '',
    stato: 'Italia',
    telefono: '',
    cellulare: '',
    email: '',
    
    // Dati di Domicilio
    domicilioUguale: true,
    domicilioIndirizzo: '',
    domicilioComune: '',
    domicilioCap: '',
    domicilioProvincia: '',
    domicilioStato: 'Italia',
    
    // Documento di Riconoscimento
    tipoDocumento: '',
    numeroDocumento: '',
    rilasciatoDa: '',
    dataRilascio: '',
    dataScadenza: '',
    documentoValido: true,
    
    // Titolo di Studio
    tipoDiploma: '',
    istitutoScolastico: '',
    comuneIstituto: '',
    provinciaIstituto: '',
    statoIstituto: 'Italia',
    annoConseguimento: '',
    votoConseguito: '',
    dataConseguimento: '',
    
    // Altri Dati
    iban: '',
    invalidita: false,
    percentualeInvalidita: '',
    iscrizionePregressa: false,
    abbreviazioneCarriera: false,
    corsoLaurea: '',
    linguaStraniera: 'Inglese',
    
    // Dati Familiari
    codiceFiscaleGenitore1: '',
    nomeGenitore1: '',
    cognomeGenitore1: '',
    occupazioneGenitore1: '',
    codiceFiscaleGenitore2: '',
    nomeGenitore2: '',
    cognomeGenitore2: '',
    occupazioneGenitore2: '',
    componentiNucleoFamiliare: '3',
    isee: '',
    
    // Documenti
    fotoTessera: null,
    scansioneCodiceFiscale: null,
    scansioneDocumento: null,
    ricevutaPagamento: null,
    certificatoDiploma: null
  });
  
  // Schemi di validazione per ogni step
  const validationSchemas = [
    // Step 1: Dati Anagrafici
    Yup.object({
      nome: Yup.string().required('Il nome è obbligatorio'),
      cognome: Yup.string().required('Il cognome è obbligatorio'),
      sesso: Yup.string().required('Il sesso è obbligatorio'),
      codiceFiscale: Yup.string()
        .required('Il codice fiscale è obbligatorio')
        .matches(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/, 'Codice fiscale non valido'),
      dataNascita: Yup.date().required('La data di nascita è obbligatoria'),
      luogoNascita: Yup.string().required('Il luogo di nascita è obbligatorio'),
      provinciaNascita: Yup.string().required('La provincia di nascita è obbligatoria'),
      statoNascita: Yup.string().required('Lo stato di nascita è obbligatorio'),
      cittadinanza: Yup.string().required('La cittadinanza è obbligatoria'),
      statoCivile: Yup.string().required('Lo stato civile è obbligatorio')
    }),
    
    // Step 2: Dati di Residenza
    Yup.object({
      indirizzo: Yup.string().required('L\'indirizzo è obbligatorio'),
      comune: Yup.string().required('Il comune è obbligatorio'),
      cap: Yup.string()
        .required('Il CAP è obbligatorio')
        .matches(/^[0-9]{5}$/, 'CAP non valido'),
      provincia: Yup.string().required('La provincia è obbligatoria'),
      stato: Yup.string().required('Lo stato è obbligatorio'),
      cellulare: Yup.string()
        .required('Il cellulare è obbligatorio')
        .matches(/^[0-9]{10}$/, 'Numero di cellulare non valido'),
      email: Yup.string()
        .email('Email non valida')
        .required('L\'email è obbligatoria')
    }),
    
    // Step 3: Dati di Domicilio
    Yup.object({
      domicilioUguale: Yup.boolean(),
      domicilioIndirizzo: Yup.string().when('domicilioUguale', {
        is: false,
        then: Yup.string().required('L\'indirizzo di domicilio è obbligatorio')
      }),
      domicilioComune: Yup.string().when('domicilioUguale', {
        is: false,
        then: Yup.string().required('Il comune di domicilio è obbligatorio')
      }),
      domicilioCap: Yup.string().when('domicilioUguale', {
        is: false,
        then: Yup.string()
          .required('Il CAP di domicilio è obbligatorio')
          .matches(/^[0-9]{5}$/, 'CAP non valido')
      }),
      domicilioProvincia: Yup.string().when('domicilioUguale', {
        is: false,
        then: Yup.string().required('La provincia di domicilio è obbligatoria')
      }),
      domicilioStato: Yup.string().when('domicilioUguale', {
        is: false,
        then: Yup.string().required('Lo stato di domicilio è obbligatorio')
      })
    }),
    
    // Step 4: Documento di Riconoscimento
    Yup.object({
      tipoDocumento: Yup.string().required('Il tipo di documento è obbligatorio'),
      numeroDocumento: Yup.string().required('Il numero di documento è obbligatorio'),
      rilasciatoDa: Yup.string().required('L\'ente di rilascio è obbligatorio'),
      dataRilascio: Yup.date().required('La data di rilascio è obbligatoria'),
      dataScadenza: Yup.date()
        .required('La data di scadenza è obbligatoria')
        .min(new Date(), 'Il documento deve essere in corso di validità')
    }),
    
    // Step 5: Titolo di Studio
    Yup.object({
      tipoDiploma: Yup.string().required('Il tipo di diploma è obbligatorio'),
      istitutoScolastico: Yup.string().required('L\'istituto scolastico è obbligatorio'),
      comuneIstituto: Yup.string().required('Il comune dell\'istituto è obbligatorio'),
      provinciaIstituto: Yup.string().required('La provincia dell\'istituto è obbligatoria'),
      statoIstituto: Yup.string().required('Lo stato dell\'istituto è obbligatorio'),
      annoConseguimento: Yup.number()
        .required('L\'anno di conseguimento è obbligatorio')
        .min(1950, 'Anno non valido')
        .max(new Date().getFullYear(), 'Anno non valido'),
      votoConseguito: Yup.string().required('Il voto conseguito è obbligatorio'),
      dataConseguimento: Yup.date().required('La data di conseguimento è obbligatoria')
    }),
    
    // Step 6: Altri Dati
    Yup.object({
      iban: Yup.string().matches(/^IT[0-9]{2}[A-Z][0-9]{10}[0-9A-Z]{12}$/, 'IBAN non valido').nullable(),
      corsoLaurea: Yup.string().required('Il corso di laurea è obbligatorio'),
      linguaStraniera: Yup.string().required('La lingua straniera è obbligatoria')
    }),
    
    // Step 7: Dati Familiari
    Yup.object({
      codiceFiscaleGenitore1: Yup.string()
        .required('Il codice fiscale del primo genitore è obbligatorio')
        .matches(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/, 'Codice fiscale non valido'),
      nomeGenitore1: Yup.string().required('Il nome del primo genitore è obbligatorio'),
      cognomeGenitore1: Yup.string().required('Il cognome del primo genitore è obbligatorio'),
      componentiNucleoFamiliare: Yup.number()
        .required('Il numero di componenti del nucleo familiare è obbligatorio')
        .min(1, 'Deve essere almeno 1')
    }),
    
    // Step 8: Documenti
    Yup.object({
      fotoTessera: Yup.mixed().required('La foto tessera è obbligatoria'),
      scansioneCodiceFiscale: Yup.mixed().required('La scansione del codice fiscale è obbligatoria'),
      scansioneDocumento: Yup.mixed().required('La scansione del documento è obbligatoria')
    })
  ];
  
  useEffect(() => {
    // Carica i corsi di laurea
    const fetchCorsiDiLaurea = async () => {
      try {
        const response = await axios.get('/api/v1/corsi');
        setCorsiDiLaurea(response.data.data);
      } catch (error) {
        console.error('Errore durante il recupero dei corsi di laurea:', error);
        // Dati di esempio in caso di errore
        setCorsiDiLaurea([
          { _id: '1', nome: 'Informatica', facolta: { nome: 'Scienze' } },
          { _id: '2', nome: 'Economia Aziendale', facolta: { nome: 'Economia' } },
          { _id: '3', nome: 'Ingegneria Informatica', facolta: { nome: 'Ingegneria' } },
          { _id: '4', nome: 'Scienze Nautiche', facolta: { nome: 'Scienze e Tecnologie' } },
          { _id: '5', nome: 'Giurisprudenza', facolta: { nome: 'Giurisprudenza' } }
        ]);
      }
    };
    
    fetchCorsiDiLaurea();
    
    // Se l'utente è già autenticato, precompila alcuni campi
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        nome: user.name.split(' ')[0] || '',
        cognome: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  const handleNext = (values) => {
    setFormData(values);
    setActiveStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Crea un FormData per inviare anche i file
      const formDataToSend = new FormData();
      
      // Aggiungi tutti i campi del form
      Object.keys(values).forEach(key => {
        if (key === 'fotoTessera' || key === 'scansioneCodiceFiscale' || key === 'scansioneDocumento' || 
            key === 'ricevutaPagamento' || key === 'certificatoDiploma') {
          if (values[key]) {
            formDataToSend.append(key, values[key]);
          }
        } else {
          formDataToSend.append(key, values[key]);
        }
      });
      
      // Invia la richiesta di immatricolazione
      const response = await axios.post('/api/v1/immatricolazioni', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Richiesta di immatricolazione inviata con successo! Attendi l\'approvazione dell\'amministratore.');
      
      // Reindirizza alla dashboard dopo 3 secondi
      setTimeout(() => {
        navigate('/student');
      }, 3000);
    } catch (error) {
      console.error('Errore durante l\'invio della richiesta di immatricolazione:', error);
      
      let errorMessage = 'Si è verificato un errore durante l\'invio della richiesta di immatricolazione. Riprova più tardi.';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e, setFieldValue) => {
    const { name, files } = e.target;
    setFieldValue(name, files[0]);
  };
  
  // Componente per lo stepper personalizzato
  const CustomStepper = () => {
    const steps = [
      { label: 'Dati Anagrafici', icon: faUserGraduate },
      { label: 'Residenza', icon: faHome },
      { label: 'Domicilio', icon: faHome },
      { label: 'Documento', icon: faIdCard },
      { label: 'Titolo di Studio', icon: faGraduationCap },
      { label: 'Altri Dati', icon: faMoneyBill },
      { label: 'Dati Familiari', icon: faUsers },
      { label: 'Documenti', icon: faFileUpload }
    ];
    
    return (
      <div className="stepper-container mb-4">
        <div className="stepper">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
              onClick={() => index < activeStep && setActiveStep(index)}
            >
              <div className="step-number">
                <FontAwesomeIcon icon={step.icon} />
              </div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Componenti per i vari step
  const renderStepContent = (step, formikProps) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formikProps;
    
    switch (step) {
      case 0: // Dati Anagrafici
        return (
          <Card className="glass-card-blue shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                Dati Anagrafici
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={values.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.nome && !!errors.nome}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nome}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cognome *</Form.Label>
                    <Form.Control
                      type="text"
                      name="cognome"
                      value={values.cognome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cognome && !!errors.cognome}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cognome}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sesso *</Form.Label>
                    <Form.Select
                      name="sesso"
                      value={values.sesso}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.sesso && !!errors.sesso}
                      className="glass-input"
                    >
                      <option value="">Seleziona...</option>
                      <option value="M">Maschile</option>
                      <option value="F">Femminile</option>
                      <option value="A">Altro</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.sesso}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Codice Fiscale *</Form.Label>
                    <Form.Control
                      type="text"
                      name="codiceFiscale"
                      value={values.codiceFiscale}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.codiceFiscale && !!errors.codiceFiscale}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.codiceFiscale}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data di Nascita *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataNascita"
                      value={values.dataNascita}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.dataNascita && !!errors.dataNascita}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dataNascita}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Luogo di Nascita (Comune) *</Form.Label>
                    <Form.Control
                      type="text"
                      name="luogoNascita"
                      value={values.luogoNascita}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.luogoNascita && !!errors.luogoNascita}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.luogoNascita}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Provincia di Nascita *</Form.Label>
                    <Form.Control
                      type="text"
                      name="provinciaNascita"
                      value={values.provinciaNascita}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.provinciaNascita && !!errors.provinciaNascita}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.provinciaNascita}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stato di Nascita *</Form.Label>
                    <Form.Control
                      type="text"
                      name="statoNascita"
                      value={values.statoNascita}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.statoNascita && !!errors.statoNascita}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.statoNascita}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cittadinanza *</Form.Label>
                    <Form.Control
                      type="text"
                      name="cittadinanza"
                      value={values.cittadinanza}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cittadinanza && !!errors.cittadinanza}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cittadinanza}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stato Civile *</Form.Label>
                    <Form.Select
                      name="statoCivile"
                      value={values.statoCivile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.statoCivile && !!errors.statoCivile}
                      className="glass-input"
                    >
                      <option value="">Seleziona...</option>
                      <option value="Celibe/Nubile">Celibe/Nubile</option>
                      <option value="Coniugato/a">Coniugato/a</option>
                      <option value="Separato/a">Separato/a</option>
                      <option value="Divorziato/a">Divorziato/a</option>
                      <option value="Vedovo/a">Vedovo/a</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.statoCivile}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
        
      case 1: // Dati di Residenza
        return (
          <Card className="glass-card-blue shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Dati di Residenza
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Indirizzo *</Form.Label>
                    <Form.Control
                      type="text"
                      name="indirizzo"
                      value={values.indirizzo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.indirizzo && !!errors.indirizzo}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.indirizzo}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Comune *</Form.Label>
                    <Form.Control
                      type="text"
                      name="comune"
                      value={values.comune}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.comune && !!errors.comune}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.comune}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CAP *</Form.Label>
                    <Form.Control
                      type="text"
                      name="cap"
                      value={values.cap}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cap && !!errors.cap}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cap}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Provincia *</Form.Label>
                    <Form.Control
                      type="text"
                      name="provincia"
                      value={values.provincia}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.provincia && !!errors.provincia}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.provincia}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stato *</Form.Label>
                    <Form.Control
                      type="text"
                      name="stato"
                      value={values.stato}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.stato && !!errors.stato}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.stato}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefono</Form.Label>
                    <Form.Control
                      type="text"
                      name="telefono"
                      value={values.telefono}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.telefono && !!errors.telefono}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.telefono}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cellulare *</Form.Label>
                    <Form.Control
                      type="text"
                      name="cellulare"
                      value={values.cellulare}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cellulare && !!errors.cellulare}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cellulare}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && !!errors.email}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
        
      case 2: // Dati di Domicilio
        return (
          <Card className="glass-card-blue shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Dati di Domicilio
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="domicilioUguale"
                      name="domicilioUguale"
                      label="Il domicilio coincide con la residenza"
                      checked={values.domicilioUguale}
                      onChange={handleChange}
                      className="mb-3"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {!values.domicilioUguale && (
                <>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Indirizzo *</Form.Label>
                        <Form.Control
                          type="text"
                          name="domicilioIndirizzo"
                          value={values.domicilioIndirizzo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.domicilioIndirizzo && !!errors.domicilioIndirizzo}
                          className="glass-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.domicilioIndirizzo}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Comune *</Form.Label>
                        <Form.Control
                          type="text"
                          name="domicilioComune"
                          value={values.domicilioComune}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.domicilioComune && !!errors.domicilioComune}
                          className="glass-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.domicilioComune}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CAP *</Form.Label>
                        <Form.Control
                          type="text"
                          name="domicilioCap"
                          value={values.domicilioCap}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.domicilioCap && !!errors.domicilioCap}
                          className="glass-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.domicilioCap}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Provincia *</Form.Label>
                        <Form.Control
                          type="text"
                          name="domicilioProvincia"
                          value={values.domicilioProvincia}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.domicilioProvincia && !!errors.domicilioProvincia}
                          className="glass-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.domicilioProvincia}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Stato *</Form.Label>
                        <Form.Control
                          type="text"
                          name="domicilioStato"
                          value={values.domicilioStato}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.domicilioStato && !!errors.domicilioStato}
                          className="glass-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.domicilioStato}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        );
        
      case 3: // Documento di Riconoscimento
        return (
          <Card className="glass-card-blue shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faIdCard} className="me-2" />
                Documento di Riconoscimento
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo di Documento *</Form.Label>
                    <Form.Select
                      name="tipoDocumento"
                      value={values.tipoDocumento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.tipoDocumento && !!errors.tipoDocumento}
                      className="glass-input"
                    >
                      <option value="">Seleziona...</option>
                      <option value="Carta d'Identità">Carta d'Identità</option>
                      <option value="Passaporto">Passaporto</option>
                      <option value="Patente">Patente</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.tipoDocumento}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Numero Documento *</Form.Label>
                    <Form.Control
                      type="text"
                      name="numeroDocumento"
                      value={values.numeroDocumento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.numeroDocumento && !!errors.numeroDocumento}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.numeroDocumento}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rilasciato Da *</Form.Label>
                    <Form.Control
                      type="text"
                      name="rilasciatoDa"
                      value={values.rilasciatoDa}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.rilasciatoDa && !!errors.rilasciatoDa}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.rilasciatoDa}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data di Rilascio *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataRilascio"
                      value={values.dataRilascio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.dataRilascio && !!errors.dataRilascio}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dataRilascio}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data di Scadenza *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataScadenza"
                      value={values.dataScadenza}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.dataScadenza && !!errors.dataScadenza}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dataScadenza}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
        
      case 4: // Titolo di Studio
        return (
          <Card className="glass-card-blue shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                Titolo di Studio
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo di Diploma *</Form.Label>
                    <Form.Select
                      name="tipoDiploma"
                      value={values.tipoDiploma}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.tipoDiploma && !!errors.tipoDiploma}
                      className="glass-input"
                    >
                      <option value="">Seleziona...</option>
                      <option value="Diploma di Maturità Scientifica">Diploma di Maturità Scientifica</option>
                      <option value="Diploma di Maturità Classica">Diploma di Maturità Classica</option>
                      <option value="Diploma di Maturità Linguistica">Diploma di Maturità Linguistica</option>
                      <option value="Diploma di Maturità Artistica">Diploma di Maturità Artistica</option>
                      <option value="Diploma di Maturità Tecnica">Diploma di Maturità Tecnica</option>
                      <option value="Diploma di Maturità Professionale">Diploma di Maturità Professionale</option>
                      <option value="Altro">Altro</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.tipoDiploma}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Istituto Scolastico *</Form.Label>
                    <Form.Control
                      type="text"
                      name="istitutoScolastico"
                      value={values.istitutoScolastico}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.istitutoScolastico && !!errors.istitutoScolastico}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.istitutoScolastico}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Comune dell'Istituto *</Form.Label>
                    <Form.Control
                      type="text"
                      name="comuneIstituto"
                      value={values.comuneIstituto}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.comuneIstituto && !!errors.comuneIstituto}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.comuneIstituto}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Provincia dell'Istituto *</Form.Label>
                    <Form.Control
                      type="text"
                      name="provinciaIstituto"
                      value={values.provinciaIstituto}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.provinciaIstituto && !!errors.provinciaIstituto}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.provinciaIstituto}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Anno di Conseguimento *</Form.Label>
                    <Form.Control
                      type="number"
                      name="annoConseguimento"
                      value={values.annoConseguimento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.annoConseguimento && !!errors.annoConseguimento}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.annoConseguimento}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Voto Conseguito *</Form.Label>
                    <Form.Control
                      type="text"
                      name="votoConseguito"
                      value={values.votoConseguito}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.votoConseguito && !!errors.votoConseguito}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.votoConseguito}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data di Conseguimento *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataConseguimento"
                      value={values.dataConseguimento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.dataConseguimento && !!errors.dataConseguimento}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dataConseguimento}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
        
      case 5: // Altri Dati
        return (
          <Card className="glass-card-blue shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faMoneyBill} className="me-2" />
                Altri Dati
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>IBAN (opzionale)</Form.Label>
                    <Form.Control
                      type="text"
                      name="iban"
                      value={values.iban}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.iban && !!errors.iban}
                      className="glass-input"
                    />
                    <Form.Text className="text-muted">
                      Formato: IT00X0000000000000000000000
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.iban}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="invalidita"
                      name="invalidita"
                      label="Invalidità"
                      checked={values.invalidita}
                      onChange={handleChange}
                      className="mb-3"
                    />
                  </Form.Group>
                </Col>
                {values.invalidita && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Percentuale Invalidità</Form.Label>
                      <Form.Control
                        type="number"
                        name="percentualeInvalidita"
                        value={values.percentualeInvalidita}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.percentualeInvalidita && !!errors.percentualeInvalidita}
                        className="glass-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.percentualeInvalidita}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                )}
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="iscrizionePregressa"
                      name="iscrizionePregressa"
                      label="Iscrizione pregressa ad altro corso di laurea"
                      checked={values.iscrizionePregressa}
                      onChange={handleChange}
                      className="mb-3"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="abbreviazioneCarriera"
                      name="abbreviazioneCarriera"
                      label="Richiesta abbreviazione carriera"
                      checked={values.abbreviazioneCarriera}
                      onChange={handleChange}
                      className="mb-3"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Corso di Laurea *</Form.Label>
                    <Form.Select
                      name="corsoLaurea"
                      value={values.corsoLaurea}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.corsoLaurea && !!errors.corsoLaurea}
                      className="glass-input"
                    >
                      <option value="">Seleziona...</option>
                      {corsiDiLaurea.map(corso => (
                        <option key={corso._id} value={corso._id}>
                          {corso.nome} - {corso.facolta.nome}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.corsoLaurea}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lingua Straniera *</Form.Label>
                    <Form.Select
                      name="linguaStraniera"
                      value={values.linguaStraniera}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.linguaStraniera && !!errors.linguaStraniera}
                      className="glass-input"
                    >
                      <option value="Inglese">Inglese</option>
                      <option value="Francese">Francese</option>
                      <option value="Spagnolo">Spagnolo</option>
                      <option value="Tedesco">Tedesco</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.linguaStraniera}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
        
      case 6: // Dati Familiari
        return (
          <Card className="glass-card-blue shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Dati Familiari
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Codice Fiscale Genitore 1 *</Form.Label>
                    <Form.Control
                      type="text"
                      name="codiceFiscaleGenitore1"
                      value={values.codiceFiscaleGenitore1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.codiceFiscaleGenitore1 && !!errors.codiceFiscaleGenitore1}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.codiceFiscaleGenitore1}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Codice Fiscale Genitore 2 (opzionale)</Form.Label>
                    <Form.Control
                      type="text"
                      name="codiceFiscaleGenitore2"
                      value={values.codiceFiscaleGenitore2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.codiceFiscaleGenitore2 && !!errors.codiceFiscaleGenitore2}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.codiceFiscaleGenitore2}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Genitore 1 *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nomeGenitore1"
                      value={values.nomeGenitore1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.nomeGenitore1 && !!errors.nomeGenitore1}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nomeGenitore1}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Genitore 2 (opzionale)</Form.Label>
                    <Form.Control
                      type="text"
                      name="nomeGenitore2"
                      value={values.nomeGenitore2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.nomeGenitore2 && !!errors.nomeGenitore2}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nomeGenitore2}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cognome Genitore 1 *</Form.Label>
                    <Form.Control
                      type="text"
                      name="cognomeGenitore1"
                      value={values.cognomeGenitore1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cognomeGenitore1 && !!errors.cognomeGenitore1}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cognomeGenitore1}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cognome Genitore 2 (opzionale)</Form.Label>
                    <Form.Control
                      type="text"
                      name="cognomeGenitore2"
                      value={values.cognomeGenitore2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cognomeGenitore2 && !!errors.cognomeGenitore2}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cognomeGenitore2}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Occupazione Genitore 1 (opzionale)</Form.Label>
                    <Form.Control
                      type="text"
                      name="occupazioneGenitore1"
                      value={values.occupazioneGenitore1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.occupazioneGenitore1 && !!errors.occupazioneGenitore1}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.occupazioneGenitore1}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Occupazione Genitore 2 (opzionale)</Form.Label>
                    <Form.Control
                      type="text"
                      name="occupazioneGenitore2"
                      value={values.occupazioneGenitore2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.occupazioneGenitore2 && !!errors.occupazioneGenitore2}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.occupazioneGenitore2}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Componenti Nucleo Familiare *</Form.Label>
                    <Form.Control
                      type="number"
                      name="componentiNucleoFamiliare"
                      value={values.componentiNucleoFamiliare}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.componentiNucleoFamiliare && !!errors.componentiNucleoFamiliare}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.componentiNucleoFamiliare}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ISEE (opzionale)</Form.Label>
                    <Form.Control
                      type="text"
                      name="isee"
                      value={values.isee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.isee && !!errors.isee}
                      className="glass-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.isee}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
        
      case 7: // Documenti
        return (
          <Card className="glass-card-blue shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faFileUpload} className="me-2" />
                Documenti
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Foto Tessera *</Form.Label>
                    <Form.Control
                      type="file"
                      name="fotoTessera"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      onBlur={handleBlur}
                      isInvalid={touched.fotoTessera && !!errors.fotoTessera}
                      className="glass-input"
                    />
                    <Form.Text className="text-muted">
                      Formato: JPG, PNG. Dimensione massima: 2MB.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.fotoTessera}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Scansione Codice Fiscale *</Form.Label>
                    <Form.Control
                      type="file"
                      name="scansioneCodiceFiscale"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      onBlur={handleBlur}
                      isInvalid={touched.scansioneCodiceFiscale && !!errors.scansioneCodiceFiscale}
                      className="glass-input"
                    />
                    <Form.Text className="text-muted">
                      Formato: PDF, JPG, PNG. Dimensione massima: 2MB.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.scansioneCodiceFiscale}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Scansione Documento *</Form.Label>
                    <Form.Control
                      type="file"
                      name="scansioneDocumento"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      onBlur={handleBlur}
                      isInvalid={touched.scansioneDocumento && !!errors.scansioneDocumento}
                      className="glass-input"
                    />
                    <Form.Text className="text-muted">
                      Formato: PDF, JPG, PNG. Dimensione massima: 2MB.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.scansioneDocumento}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ricevuta Pagamento (opzionale)</Form.Label>
                    <Form.Control
                      type="file"
                      name="ricevutaPagamento"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      onBlur={handleBlur}
                      isInvalid={touched.ricevutaPagamento && !!errors.ricevutaPagamento}
                      className="glass-input"
                    />
                    <Form.Text className="text-muted">
                      Formato: PDF, JPG, PNG. Dimensione massima: 2MB.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.ricevutaPagamento}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Certificato Diploma (opzionale)</Form.Label>
                    <Form.Control
                      type="file"
                      name="certificatoDiploma"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      onBlur={handleBlur}
                      isInvalid={touched.certificatoDiploma && !!errors.certificatoDiploma}
                      className="glass-input"
                    />
                    <Form.Text className="text-muted">
                      Formato: PDF, JPG, PNG. Dimensione massima: 2MB.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.certificatoDiploma}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">
        <FontAwesomeIcon icon={faIdCard} className="me-2 text-primary" />
        Richiesta di Immatricolazione
      </h1>
      
      <p className="text-center mb-5">
        Compila il form seguente per richiedere l'immatricolazione all'Università Parthenope di Napoli.
        La tua richiesta sarà valutata dall'amministrazione.
      </p>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          <strong>Errore!</strong> {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          <strong>Successo!</strong> {success}
        </Alert>
      )}
      
      <CustomStepper />
      
      <Formik
        initialValues={formData}
        validationSchema={validationSchemas[activeStep]}
        onSubmit={(values) => {
          if (activeStep === validationSchemas.length - 1) {
            handleSubmit(values);
          } else {
            handleNext(values);
          }
        }}
      >
        {(formikProps) => (
          <Form onSubmit={formikProps.handleSubmit}>
            {renderStepContent(activeStep, formikProps)}
            
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={activeStep === 0 || isLoading}
                className="glass-btn"
              >
                Indietro
              </Button>
              
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                className="glass-btn"
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Caricamento...
                  </>
                ) : activeStep === validationSchemas.length - 1 ? (
                  'Invia Richiesta'
                ) : (
                  'Avanti'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ImmatricolazionePage;
