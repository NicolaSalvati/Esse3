import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faCalculator } from '@fortawesome/free-solid-svg-icons';

// Database dei codici catastali dei comuni italiani e delle nazioni estere
const COMUNI_ITALIANI = {
  "AGRIGENTO": "A089", "ALESSANDRIA": "A182", "ANCONA": "A271", "AOSTA": "A326", "AREZZO": "A390",
  "ASCOLI PICENO": "A462", "ASTI": "A479", "AVELLINO": "A509", "BARI": "A662", "BARLETTA": "A669",
  "BELLUNO": "A757", "BENEVENTO": "A783", "BERGAMO": "A794", "BIELLA": "A859", "BOLOGNA": "A944",
  "BOLZANO": "A952", "BRESCIA": "B157", "BRINDISI": "B180", "CAGLIARI": "B354", "CALTANISSETTA": "B429",
  "CAMPOBASSO": "B519", "CASERTA": "B963", "CATANIA": "C351", "CATANZARO": "C352", "CHIETI": "C632",
  "COMO": "C933", "COSENZA": "D086", "CREMONA": "D150", "CROTONE": "D122", "CUNEO": "D205",
  "ENNA": "C342", "FERMO": "D542", "FERRARA": "D548", "FIRENZE": "D612", "FOGGIA": "D643",
  "FORLI": "D704", "FROSINONE": "D810", "GENOVA": "D969", "GORIZIA": "E098", "GROSSETO": "E202",
  "IMPERIA": "E290", "ISERNIA": "E335", "L'AQUILA": "A345", "LA SPEZIA": "E463", "LATINA": "E472",
  "LECCE": "E506", "LECCO": "E507", "LIVORNO": "E625", "LODI": "E648", "LUCCA": "E715",
  "MACERATA": "E783", "MANTOVA": "E897", "MASSA": "F023", "MATERA": "F052", "MESSINA": "F158",
  "MILANO": "F205", "MODENA": "F257", "MONZA": "F704", "NAPOLI": "F839", "NOVARA": "F952",
  "NUORO": "F979", "ORISTANO": "G113", "PADOVA": "G224", "PALERMO": "G273", "PARMA": "G337",
  "PAVIA": "G388", "PERUGIA": "G478", "PESARO": "G479", "PESCARA": "G482", "PIACENZA": "G535",
  "PISA": "G702", "PISTOIA": "G713", "PORDENONE": "G888", "POTENZA": "G942", "PRATO": "G999",
  "RAGUSA": "H163", "RAVENNA": "H199", "REGGIO CALABRIA": "H224", "REGGIO EMILIA": "H223", "RIETI": "H282",
  "RIMINI": "H294", "ROMA": "H501", "ROVIGO": "H620", "SALERNO": "H703", "SASSARI": "I452",
  "SAVONA": "I480", "SIENA": "I726", "SIRACUSA": "I754", "SONDRIO": "I829", "TARANTO": "L049",
  "TERAMO": "L103", "TERNI": "L117", "TORINO": "L219", "TRAPANI": "L331", "TRENTO": "L378",
  "TREVISO": "L407", "TRIESTE": "L424", "UDINE": "L483", "VARESE": "L682", "VENEZIA": "L736",
  "VERBANIA": "L746", "VERCELLI": "L750", "VERONA": "L781", "VIBO VALENTIA": "F537", "VICENZA": "L840",
  "VITERBO": "M082"
};

const NAZIONI_ESTERE = {
  "AFGHANISTAN": "Z200", "ALBANIA": "Z100", "ALGERIA": "Z301", "ANDORRA": "Z101", "ANGOLA": "Z302",
  "ANTIGUA E BARBUDA": "Z532", "ARABIA SAUDITA": "Z203", "ARGENTINA": "Z600", "ARMENIA": "Z138", "AUSTRALIA": "Z700",
  "AUSTRIA": "Z102", "AZERBAIGIAN": "Z141", "BAHAMAS": "Z502", "BAHREIN": "Z204", "BANGLADESH": "Z249",
  "BARBADOS": "Z503", "BELGIO": "Z103", "BELIZE": "Z512", "BENIN": "Z314", "BHUTAN": "Z205",
  "BIELORUSSIA": "Z139", "BOLIVIA": "Z601", "BOSNIA ED ERZEGOVINA": "Z153", "BOTSWANA": "Z303", "BRASILE": "Z602",
  "BRUNEI": "Z206", "BULGARIA": "Z104", "BURKINA FASO": "Z354", "BURUNDI": "Z305", "CAMBOGIA": "Z208",
  "CAMERUN": "Z306", "CANADA": "Z401", "CAPO VERDE": "Z307", "CIAD": "Z308", "CILE": "Z603",
  "CINA": "Z210", "CIPRO": "Z211", "CITTA DEL VATICANO": "Z106", "COLOMBIA": "Z604", "COMORE": "Z310",
  "CONGO": "Z311", "COREA DEL NORD": "Z214", "COREA DEL SUD": "Z213", "COSTA D'AVORIO": "Z313", "COSTA RICA": "Z506",
  "CROAZIA": "Z149", "CUBA": "Z504", "DANIMARCA": "Z107", "DOMINICA": "Z508", "ECUADOR": "Z605",
  "EGITTO": "Z336", "EL SALVADOR": "Z519", "EMIRATI ARABI UNITI": "Z215", "ERITREA": "Z368", "ESTONIA": "Z144",
  "ETIOPIA": "Z315", "FIJI": "Z704", "FILIPPINE": "Z216", "FINLANDIA": "Z109", "FRANCIA": "Z110",
  "GABON": "Z316", "GAMBIA": "Z317", "GEORGIA": "Z147", "GERMANIA": "Z112", "GHANA": "Z318",
  "GIAMAICA": "Z507", "GIAPPONE": "Z219", "GIBUTI": "Z361", "GIORDANIA": "Z220", "GRECIA": "Z115",
  "GRENADA": "Z524", "GUATEMALA": "Z509", "GUINEA": "Z319", "GUINEA BISSAU": "Z320", "GUINEA EQUATORIALE": "Z321",
  "GUYANA": "Z606", "HAITI": "Z510", "HONDURAS": "Z511", "INDIA": "Z222", "INDONESIA": "Z223",
  "IRAN": "Z224", "IRAQ": "Z225", "IRLANDA": "Z116", "ISLANDA": "Z117", "ISRAELE": "Z226",
  "ITALIA": "Z127", "KAZAKISTAN": "Z142", "KENYA": "Z322", "KIRGHIZISTAN": "Z143", "KIRIBATI": "Z731",
  "KUWAIT": "Z227", "LAOS": "Z228", "LESOTHO": "Z323", "LETTONIA": "Z145", "LIBANO": "Z229",
  "LIBERIA": "Z324", "LIBIA": "Z326", "LIECHTENSTEIN": "Z119", "LITUANIA": "Z146", "LUSSEMBURGO": "Z120",
  "MACEDONIA": "Z148", "MADAGASCAR": "Z327", "MALAWI": "Z328", "MALAYSIA": "Z230", "MALDIVE": "Z232",
  "MALI": "Z329", "MALTA": "Z121", "MAROCCO": "Z330", "MAURITANIA": "Z331", "MAURITIUS": "Z332",
  "MESSICO": "Z514", "MICRONESIA": "Z732", "MOLDAVIA": "Z140", "MONACO": "Z122", "MONGOLIA": "Z233",
  "MONTENEGRO": "Z156", "MOZAMBICO": "Z333", "MYANMAR": "Z234", "NAMIBIA": "Z334", "NAURU": "Z715",
  "NEPAL": "Z235", "NICARAGUA": "Z515", "NIGER": "Z335", "NIGERIA": "Z336", "NORVEGIA": "Z123",
  "NUOVA ZELANDA": "Z719", "OMAN": "Z237", "PAESI BASSI": "Z126", "PAKISTAN": "Z236", "PALAU": "Z734",
  "PANAMA": "Z516", "PAPUA NUOVA GUINEA": "Z730", "PARAGUAY": "Z608", "PERU": "Z609", "POLONIA": "Z127",
  "PORTOGALLO": "Z128", "QATAR": "Z238", "REGNO UNITO": "Z114", "REPUBBLICA CECA": "Z156", "REPUBBLICA CENTRAFRICANA": "Z309",
  "REPUBBLICA DEMOCRATICA DEL CONGO": "Z312", "REPUBBLICA DOMINICANA": "Z505", "ROMANIA": "Z129", "RUANDA": "Z338",
  "RUSSIA": "Z154", "SAINT KITTS E NEVIS": "Z525", "SAINT LUCIA": "Z527", "SAINT VINCENT E GRENADINE": "Z526",
  "SAMOA": "Z724", "SAN MARINO": "Z130", "SAO TOME E PRINCIPE": "Z341", "SENEGAL": "Z343", "SERBIA": "Z158",
  "SEYCHELLES": "Z342", "SIERRA LEONE": "Z344", "SINGAPORE": "Z248", "SIRIA": "Z240", "SLOVACCHIA": "Z155",
  "SLOVENIA": "Z150", "SOMALIA": "Z345", "SPAGNA": "Z131", "SRI LANKA": "Z209", "STATI UNITI": "Z404",
  "SUDAFRICA": "Z347", "SUDAN": "Z348", "SUDAN DEL SUD": "Z907", "SURINAME": "Z610", "SVEZIA": "Z132",
  "SVIZZERA": "Z133", "SWAZILAND": "Z349", "TAGIKISTAN": "Z152", "TAIWAN": "Z217", "TANZANIA": "Z357",
  "THAILANDIA": "Z241", "TIMOR ORIENTALE": "Z242", "TOGO": "Z351", "TONGA": "Z726", "TRINIDAD E TOBAGO": "Z612",
  "TUNISIA": "Z352", "TURCHIA": "Z243", "TURKMENISTAN": "Z151", "TUVALU": "Z727", "UCRAINA": "Z138",
  "UGANDA": "Z353", "UNGHERIA": "Z134", "URUGUAY": "Z611", "UZBEKISTAN": "Z135", "VANUATU": "Z728",
  "VENEZUELA": "Z614", "VIETNAM": "Z251", "YEMEN": "Z246", "ZAMBIA": "Z355", "ZIMBABWE": "Z337"
};

// Funzione completa per calcolare il codice fiscale
const calculateFiscalCode = (firstName, lastName, birthDate, gender, birthPlace) => {
  // Funzione per normalizzare una stringa (rimuovere spazi, accenti, ecc.)
  const normalizeString = (str) => {
    return str.toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z]/g, "");
  };

  // Funzione per ottenere il codice del cognome
  const getLastNameCode = (lastName) => {
    const normalized = normalizeString(lastName);
    
    // Estrai le consonanti e le vocali
    const consonants = normalized.replace(/[AEIOU]/g, "");
    const vowels = normalized.replace(/[^AEIOU]/g, "");
    
    // Combina consonanti e vocali, prendi i primi 3 caratteri
    let code = consonants + vowels;
    code = code.substring(0, 3);
    
    // Se il cognome è troppo corto, aggiungi X
    while (code.length < 3) {
      code += "X";
    }
    
    return code;
  };
  
  // Funzione per ottenere il codice del nome
  const getFirstNameCode = (firstName) => {
    const normalized = normalizeString(firstName);
    
    // Estrai le consonanti e le vocali
    const consonants = normalized.replace(/[AEIOU]/g, "");
    const vowels = normalized.replace(/[^AEIOU]/g, "");
    
    // Se ci sono almeno 4 consonanti, prendi la 1ª, 3ª e 4ª
    if (consonants.length >= 4) {
      return consonants[0] + consonants[2] + consonants[3];
    }
    
    // Se ci sono 3 consonanti, prendile tutte
    if (consonants.length === 3) {
      return consonants;
    }
    
    // Altrimenti, combina consonanti e vocali
    let code = consonants + vowels;
    code = code.substring(0, 3);
    
    // Se il nome è troppo corto, aggiungi X
    while (code.length < 3) {
      code += "X";
    }
    
    return code;
  };
  
  // Funzione per ottenere il codice dell'anno
  const getYearCode = (birthDate) => {
    const date = new Date(birthDate);
    const year = date.getFullYear().toString();
    return year.substring(2);
  };
  
  // Funzione per ottenere il codice del mese
  const getMonthCode = (birthDate) => {
    const date = new Date(birthDate);
    const month = date.getMonth();
    const monthCodes = "ABCDEHLMPRST";
    return monthCodes[month];
  };
  
  // Funzione per ottenere il codice del giorno
  const getDayCode = (birthDate, gender) => {
    const date = new Date(birthDate);
    let day = date.getDate();
    
    // Per le donne, aggiungi 40 al giorno
    if (gender.toUpperCase() === "F") {
      day += 40;
    }
    
    // Formatta il giorno come stringa di 2 cifre
    return day.toString().padStart(2, "0");
  };
  
  // Funzione per ottenere il codice del comune/stato estero
  const getPlaceCode = (birthPlace) => {
    // Normalizza il nome del luogo
    const normalizedPlace = birthPlace.toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    // Cerca prima nei comuni italiani
    if (COMUNI_ITALIANI[normalizedPlace]) {
      return COMUNI_ITALIANI[normalizedPlace];
    }
    
    // Poi cerca nelle nazioni estere
    if (NAZIONI_ESTERE[normalizedPlace]) {
      return NAZIONI_ESTERE[normalizedPlace];
    }
    
    // Se non trovato, restituisci un placeholder
    console.warn(`Codice catastale non trovato per: ${birthPlace}`);
    return "XXXX";
  };
  
  // Funzione corretta per calcolare il carattere di controllo
  const getControlChar = (partialCode) => {
    // Tabella di conversione per i caratteri in posizione dispari (1-based index)
    const oddValues = {
      '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
      'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
      'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
      'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
    };
    
    // Tabella di conversione per i caratteri in posizione pari (1-based index)
    const evenValues = {
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
      'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
      'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
    };
    
    // Calcola la somma dei valori
    let sum = 0;
    for (let i = 0; i < partialCode.length; i++) {
      const char = partialCode[i];
      
      // In JavaScript, gli indici sono 0-based, ma l'algoritmo del codice fiscale usa indici 1-based
      // Quindi i caratteri in posizione pari (0, 2, 4...) nell'indice 0-based sono in realtà
      // in posizione dispari (1, 3, 5...) nell'indice 1-based
      if (i % 2 === 0) { // Posizione dispari (1, 3, 5...) nell'indice 1-based
        sum += oddValues[char];
      } else { // Posizione pari (2, 4, 6...) nell'indice 1-based
        sum += evenValues[char];
      }
    }
    
    // Calcola il resto della divisione per 26
    const remainder = sum % 26;
    
    // Converti il resto in una lettera (A=0, B=1, ..., Z=25)
    return String.fromCharCode(65 + remainder);
  };
  
  try {
    // Calcola le parti del codice fiscale
    const lastNameCode = getLastNameCode(lastName);
    const firstNameCode = getFirstNameCode(firstName);
    const yearCode = getYearCode(birthDate);
    const monthCode = getMonthCode(birthDate);
    const dayCode = getDayCode(birthDate, gender);
    const placeCode = getPlaceCode(birthPlace);
    
    // Combina le parti per ottenere il codice parziale
    const partialCode = lastNameCode + firstNameCode + yearCode + monthCode + dayCode + placeCode;
    
    // Calcola il carattere di controllo
    const controlChar = getControlChar(partialCode);
    
    // Restituisci il codice fiscale completo
    return partialCode + controlChar;
  } catch (error) {
    console.error("Errore nel calcolo del codice fiscale:", error);
    return "Errore nel calcolo";
  }
};

// Componente principale RegisterDropdown
const RegisterDropdown = () => {
  // Colori del tema dell'università
  const theme = {
    primary: '#0d6efd',       // Blu primario
    primaryDark: '#0a58ca',   // Blu scuro per hover
    secondary: '#6c757d',     // Grigio secondario
    light: '#f8f9fa',         // Sfondo chiaro
    white: '#ffffff',         // Bianco
    dark: '#343a40',          // Testo scuro
    border: '#dee2e6'         // Bordo
  };
  
  // Stato per il dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Stato per lo step corrente
  const [currentStep, setCurrentStep] = useState(1);
  
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    fiscalCode: '',
    isForeigner: false
  });
  
  // Stato per il modal del calcolatore
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Riferimento al dropdown
  const dropdownRef = useRef(null);
  
  // Numero totale di step
  const totalSteps = 12;
  
  // Toggle del dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setCurrentStep(1);
    }
  };
  
  // Previeni la chiusura del dropdown quando si clicca all'interno
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };
  
  // Funzione per andare allo step successivo
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Funzione per tornare allo step precedente
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Funzione per aggiornare i dati del form
  const updateFormData = (newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };
  
  // Funzione per aprire il calcolatore
  const openCalculator = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCalculator(true);
  };
  
  // Funzione per chiudere il calcolatore
  const closeCalculator = () => {
    setShowCalculator(false);
  };
  
  // Componente per il calcolatore del codice fiscale
  const FiscalCodeCalculator = () => {
    // Stato per i dati del calcolatore
    const [calculatorData, setCalculatorData] = useState({
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      birthPlace: ''
    });
    
    // Stato per gli errori del calcolatore
    const [calculatorErrors, setCalculatorErrors] = useState({});
    
    // Funzione per gestire il cambiamento nei campi del calcolatore
    const handleCalculatorChange = (e) => {
      const { name, value } = e.target;
      setCalculatorData({
        ...calculatorData,
        [name]: value
      });
      
      // Rimuovi l'errore quando l'utente inizia a digitare
      if (calculatorErrors[name]) {
        setCalculatorErrors({
          ...calculatorErrors,
          [name]: null
        });
      }
    };
    
    // Funzione per validare i dati del calcolatore
    const validateCalculatorData = () => {
      const newErrors = {};
      
      if (!calculatorData.firstName.trim()) {
        newErrors.firstName = 'Il nome è obbligatorio';
      }
      
      if (!calculatorData.lastName.trim()) {
        newErrors.lastName = 'Il cognome è obbligatorio';
      }
      
      if (!calculatorData.birthDate) {
        newErrors.birthDate = 'La data di nascita è obbligatoria';
      }
      
      if (!calculatorData.gender) {
        newErrors.gender = 'Il sesso è obbligatorio';
      }
      
      if (!calculatorData.birthPlace.trim()) {
        newErrors.birthPlace = 'Il luogo di nascita è obbligatorio';
      }
      
      setCalculatorErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    // Funzione per calcolare il codice fiscale
    const handleCalculate = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (validateCalculatorData()) {
        const fiscalCode = calculateFiscalCode(
          calculatorData.firstName,
          calculatorData.lastName,
          calculatorData.birthDate,
          calculatorData.gender,
          calculatorData.birthPlace
        );
        
        // Aggiorna il campo del codice fiscale nel form
        updateFormData({ fiscalCode });
        
        // Chiudi il modal
        closeCalculator();
      }
    };
    
    // Stili per il modal con tema dell'università
    const modalStyles = {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
      },
      content: {
        backgroundColor: theme.white,
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: 0,
      },
      header: {
        backgroundColor: theme.primary,
        color: theme.white,
        borderBottom: 'none',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        padding: '15px 20px',
      },
      body: {
        padding: '20px',
      },
      footer: {
        borderTop: `1px solid ${theme.border}`,
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
      },
      input: {
        border: `1px solid ${theme.border}`,
        borderRadius: '4px',
        padding: '8px 12px',
        width: '100%',
        fontSize: '14px',
      },
      label: {
        fontWeight: 'bold',
        marginBottom: '5px',
        color: theme.dark,
      },
      button: {
        primary: {
          backgroundColor: theme.primary,
          color: theme.white,
          border: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: theme.primaryDark,
          },
        },
        secondary: {
          backgroundColor: theme.secondary,
          color: theme.white,
          border: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        },
      },
    };
    
    return (
      <Modal
        show={showCalculator}
        onHide={closeCalculator}
        centered
        backdrop="static"
        size="lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Modal.Header closeButton style={modalStyles.header}>
          <Modal.Title>Calcolo Codice Fiscale</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyles.body}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={calculatorData.firstName}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.firstName}
                    style={{ borderColor: theme.border }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {calculatorErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={calculatorData.lastName}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.lastName}
                    style={{ borderColor: theme.border }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {calculatorErrors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Data di Nascita</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={calculatorData.birthDate}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.birthDate}
                    style={{ borderColor: theme.border }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {calculatorErrors.birthDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Sesso</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Maschio"
                      name="gender"
                      id="gender-male"
                      value="M"
                      checked={calculatorData.gender === 'M'}
                      onChange={handleCalculatorChange}
                      isInvalid={!!calculatorErrors.gender}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Femmina"
                      name="gender"
                      id="gender-female"
                      value="F"
                      checked={calculatorData.gender === 'F'}
                      onChange={handleCalculatorChange}
                      isInvalid={!!calculatorErrors.gender}
                    />
                  </div>
                  {calculatorErrors.gender && (
                    <div className="text-danger small mt-1">{calculatorErrors.gender}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Luogo di Nascita (Comune o Stato Estero)</Form.Label>
              <Form.Control
                type="text"
                name="birthPlace"
                value={calculatorData.birthPlace}
                onChange={handleCalculatorChange}
                isInvalid={!!calculatorErrors.birthPlace}
                placeholder="Es. Roma, Milano, Germania, Francia"
                style={{ borderColor: theme.border }}
              />
              <Form.Control.Feedback type="invalid">
                {calculatorErrors.birthPlace}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Inserisci il nome del comune italiano o dello stato estero di nascita
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={modalStyles.footer}>
          <Button
            variant="secondary"
            onClick={closeCalculator}
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={handleCalculate}
            style={{ backgroundColor: theme.primary }}
          >
            <FontAwesomeIcon icon={faCalculator} className="me-2" />
            Calcola Codice Fiscale
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  // Componente per l'indicatore di progresso
  const StepIndicator = () => {
    // Calcola la percentuale di completamento
    const progressPercentage = (currentStep / totalSteps) * 100;
    
    // Stile per l'indicatore di progresso
    const stepIndicatorStyle = {
      margin: '10px 0 20px 0',
      padding: '15px',
      backgroundColor: theme.light,
      borderRadius: '8px',
    };
    
    // Stile per le informazioni sullo step
    const stepInfoStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '5px',
    };
    
    // Stile per lo step corrente
    const currentStepStyle = {
      fontWeight: 'bold',
      color: theme.primary,
    };
    
    // Stile per il totale degli step
    const totalStepsStyle = {
      color: theme.secondary,
    };
    
    // Stile per il contenitore dei cerchi
    const stepCirclesContainerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
      position: 'relative',
      padding: '0 10px',
    };
    
    // Genera gli step circles
    const renderStepCircles = () => {
      const circles = [];
      for (let i = 1; i <= totalSteps; i++) {
        const isActive = i <= currentStep;
        const isCurrent = i === currentStep;
        
        // Stile per il cerchio
        const circleStyle = {
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: isActive ? theme.primary : '#e9ecef',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          color: isActive ? theme.white : theme.secondary,
          position: 'relative',
          zIndex: 2,
          transition: 'all 0.3s ease',
          transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
          boxShadow: isCurrent ? `0 0 0 3px rgba(13, 110, 253, 0.25)` : 'none',
        };
        
        circles.push(
          <div
            key={i}
            style={circleStyle}
            title={`Step ${i} di ${totalSteps}`}
          >
            <span>{i}</span>
          </div>
        );
      }
      return circles;
    };

    return (
      <div style={stepIndicatorStyle}>
        <div style={stepInfoStyle} className="mb-2">
          <span style={currentStepStyle}>Step {currentStep}</span>
          <span style={totalStepsStyle}>di {totalSteps}</span>
        </div>
        
        <div className="progress mb-3" style={{ height: '8px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progressPercentage}%`, backgroundColor: theme.primary }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        
        <div style={stepCirclesContainerStyle}>
          {renderStepCircles()}
        </div>
      </div>
    );
  };
  
  // Componente per il primo step: Informativa sulla Privacy
  const PrivacyNoticeStep = () => {
    // Stile per l'informativa sulla privacy
    const privacyNoticeStyle = {
      backgroundColor: theme.light,
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    };
    
    // Stile per il pulsante
    const buttonStyle = {
      transition: 'all 0.3s ease',
      transform: 'scale(1)',
      backgroundColor: theme.primary,
      color: theme.white,
      border: 'none',
    };
    
    // Stile per il pulsante al passaggio del mouse
    const buttonHoverStyle = {
      transform: 'scale(1.05)',
      backgroundColor: theme.primaryDark,
    };
    
    // Stato per il pulsante al passaggio del mouse
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    return (
      <div className="card border-0" style={{ backgroundColor: 'transparent' }}>
        <div className="card-body p-0">
          <div className="row mb-4">
            <div className="col">
              <h4 className="text-center mb-4" style={{ color: theme.primary }}>Informativa sulla Privacy</h4>
              <div style={privacyNoticeStyle}>
                <p className="mb-3">
                  Prima di proseguire ti invitiamo a prendere visione dell'informativa per gli studenti
                  all'atto della registrazione ai sensi del Regolamento UE 2016/679 del Parlamento Europeo
                  e del Consiglio del 27/04/2016.
                </p>
                <p className="mb-3">
                  <a
                    href="https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX%3A32016R0679"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.primary, fontWeight: 'bold', textDecoration: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Leggi l'informativa
                  </a>
                </p>
                <p className="small text-muted mb-0">
                  Proseguendo con la registrazione, confermi di aver letto e compreso l'informativa sulla privacy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="row mt-4">
            <div className="col d-flex justify-content-center">
              <button
                className="btn px-4 py-2 d-flex align-items-center"
                onClick={goToNextStep}
                style={{
                  ...buttonStyle,
                  ...(isButtonHovered ? buttonHoverStyle : {})
                }}
                onMouseOver={() => setIsButtonHovered(true)}
                onMouseOut={() => setIsButtonHovered(false)}
              >
                <span className="me-2">Avanti</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Componente per il secondo step: Codice Fiscale
  const FiscalCodeStep = () => {
    // Stile per il form container
    const formContainerStyle = {
      backgroundColor: theme.light,
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    };
    
    // Stile per i pulsanti
    const buttonStyles = {
      primary: {
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        backgroundColor: theme.primary,
        color: theme.white,
        border: 'none',
      },
      secondary: {
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        backgroundColor: 'transparent',
        color: theme.secondary,
        border: `1px solid ${theme.secondary}`,
      },
      calculator: {
        marginTop: '10px',
        marginBottom: '15px',
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.9rem',
        padding: '0.375rem 0.75rem',
        backgroundColor: 'transparent',
        color: theme.primary,
        border: `1px solid ${theme.primary}`,
      },
    };
    
    // Stile per i pulsanti al passaggio del mouse
    const buttonHoverStyles = {
      primary: {
        transform: 'scale(1.05)',
        backgroundColor: theme.primaryDark,
      },
      secondary: {
        transform: 'scale(1.05)',
        backgroundColor: 'rgba(108, 117, 125, 0.1)',
      },
    };
    
    // Stato per i pulsanti al passaggio del mouse
    const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);
    const [isNextButtonHovered, setIsNextButtonHovered] = useState(false);
    
    // Funzione per gestire il cambiamento nel campo del codice fiscale
    const handleFiscalCodeChange = (e) => {
      updateFormData({ fiscalCode: e.target.value });
    };
    
    // Funzione per gestire il cambiamento nel checkbox dello studente straniero
    const handleForeignerChange = (e) => {
      const isChecked = e.target.checked;
      updateFormData({
        isForeigner: isChecked,
        fiscalCode: isChecked ? '' : formData.fiscalCode
      });
    };
    
    // Funzione per gestire il submit del form
    const handleSubmit = (e) => {
      e.preventDefault();
      goToNextStep();
    };

    return (
      <div className="card border-0" style={{ backgroundColor: 'transparent' }}>
        <div className="card-body p-0">
          <h4 className="text-center mb-4" style={{ color: theme.primary }}>Codice Fiscale</h4>
          
          <form onSubmit={handleSubmit}>
            <p className="mb-3">Digitare il proprio codice fiscale e cliccare su procedi:</p>
            
            <div style={formContainerStyle}>
              <div className="mb-3">
                <label htmlFor="fiscalCode" className="form-label fw-bold">Codice Fiscale</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  id="fiscalCode"
                  value={formData.fiscalCode}
                  onChange={handleFiscalCodeChange}
                  disabled={formData.isForeigner}
                  style={{ borderColor: theme.border }}
                />
              </div>
              
              <div className="mb-0">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isForeigner"
                    checked={formData.isForeigner}
                    onChange={handleForeignerChange}
                  />
                  <label className="form-check-label" htmlFor="isForeigner">
                    Dichiaro di essere uno studente straniero senza Codice Fiscale Italiano
                  </label>
                </div>
              </div>
            </div>
            
            {!formData.isForeigner && (
              <div className="text-center">
                <button
                  type="button"
                  className="btn"
                  style={buttonStyles.calculator}
                  onClick={openCalculator}
                >
                  <FontAwesomeIcon icon={faCalculator} className="me-2" />
                  Calcolo codice fiscale
                </button>
              </div>
            )}
            
            <div className="row mt-4">
              <div className="col d-flex justify-content-between">
                <button
                  type="button"
                  className="btn px-4 py-2 d-flex align-items-center"
                  onClick={goToPreviousStep}
                  style={{
                    ...buttonStyles.secondary,
                    ...(isBackButtonHovered ? buttonHoverStyles.secondary : {})
                  }}
                  onMouseOver={() => setIsBackButtonHovered(true)}
                  onMouseOut={() => setIsBackButtonHovered(false)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  <span>Indietro</span>
                </button>
                
                <button
                  type="submit"
                  className="btn px-4 py-2 d-flex align-items-center"
                  style={{
                    ...buttonStyles.primary,
                    ...(isNextButtonHovered ? buttonHoverStyles.primary : {})
                  }}
                  onMouseOver={() => setIsNextButtonHovered(true)}
                  onMouseOut={() => setIsNextButtonHovered(false)}
                >
                  <span className="me-2">Avanti</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // Renderizza lo step corrente
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PrivacyNoticeStep />;
      case 2:
        return <FiscalCodeStep />;
      default:
        return <div>Step non implementato</div>;
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-primary btn-sm dropdown-toggle"
        type="button"
        onClick={toggleDropdown}
        aria-expanded={showDropdown}
      >
        <i className="fas fa-user-plus me-1"></i>
        Registrati
      </button>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="dropdown-menu dropdown-menu-end show"
          style={{
            backgroundColor: theme.white,
            width: '100%',
            minWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '15px',
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'absolute',
            right: '0',
            zIndex: 1000,
          }}
          onClick={handleDropdownClick}
        >
          <StepIndicator />
          {renderCurrentStep()}
          <FiscalCodeCalculator />
        </div>
      )}
    </div>
  );
};

export default RegisterDropdown;
