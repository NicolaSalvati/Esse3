import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faCalculator, faUserPlus, faCheck, faIdCard, faInfoCircle, faUser, faAddressCard, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

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
  "VITERBO": "M082", "MESAGNE": "F152"
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

// Lista delle cittadinanze
const CITTADINANZE = [
  "Italiana", "Afghana", "Albanese", "Algerina", "Andorrana", "Angolana", "Antiguana", "Argentina",
  "Armena", "Australiana", "Austriaca", "Azera", "Bahamense", "Bahreinita", "Bangladese", "Barbadiana",
  "Belga", "Beliziana", "Beninese", "Bhutanese", "Bielorussa", "Boliviana", "Bosniaca", "Botswana",
  "Brasiliana", "Bruneiana", "Bulgara", "Burkinabé", "Burundese", "Cambogiana", "Camerunense", "Canadese",
  "Capoverdiana", "Ciadiana", "Cilena", "Cinese", "Cipriota", "Colombiana", "Comoriana", "Congolese",
  "Nordcoreana", "Sudcoreana", "Ivoriana", "Costaricana", "Croata", "Cubana", "Danese", "Dominicana",
  "Ecuadoriana", "Egiziana", "Salvadoregna", "Emiratina", "Eritrea", "Estone", "Etiope", "Figiana",
  "Filippina", "Finlandese", "Francese", "Gabonese", "Gambiana", "Georgiana", "Tedesca", "Ghanese",
  "Giamaicana", "Giapponese", "Gibutiana", "Giordana", "Greca", "Grenadina", "Guatemalteca", "Guineana",
  "Guineana-Bissau", "Equatoguineana", "Guyanese", "Haitiana", "Honduregna", "Indiana", "Indonesiana",
  "Iraniana", "Irachena", "Irlandese", "Islandese", "Israeliana", "Italiana", "Kazaka", "Keniota",
  "Kirghisa", "Kiribatiana", "Kuwaitiana", "Laotiana", "Lesothiana", "Lettone", "Libanese", "Liberiana",
  "Libica", "Liechtensteiniana", "Lituana", "Lussemburghese", "Macedone", "Malgascia", "Malawiana",
  "Malese", "Maldiviana", "Maliana", "Maltese", "Marocchina", "Mauritana", "Mauriziana", "Messicana",
  "Micronesiana", "Moldava", "Monegasca", "Mongola", "Montenegrina", "Mozambicana", "Birmana", "Namibiana",
  "Nauruana", "Nepalese", "Nicaraguense", "Nigerina", "Nigeriana", "Norvegese", "Neozelandese", "Omanita",
  "Olandese", "Pakistana", "Paluana", "Panamense", "Papuana", "Paraguaiana", "Peruviana", "Polacca",
  "Portoghese", "Qatariota", "Britannica", "Ceca", "Centrafricana", "Congolese", "Dominicana", "Rumena",
  "Ruandese", "Russa", "Kittitiana e Nevisiana", "Luciana", "Vincentina", "Samoana", "Sammarinese",
  "Sãotomense", "Senegalese", "Serba", "Seychellese", "Sierraleonese", "Singaporiana", "Siriana",
  "Slovacca", "Slovena", "Somala", "Spagnola", "Srilankese", "Statunitense", "Sudafricana", "Sudanese",
  "Sudsudanese", "Surinamese", "Svedese", "Svizzera", "Swati", "Tagika", "Taiwanese", "Tanzaniana",
  "Thailandese", "Est-timorese", "Togolese", "Tongana", "Trinidadiana", "Tunisina", "Turca", "Turkmena",
  "Tuvaluana", "Ucraina", "Ugandese", "Ungherese", "Uruguaiana", "Uzbeka", "Vanuatuana", "Venezuelana",
  "Vietnamita", "Yemenita", "Zambiana", "Zimbabwese"
];

// Lista delle province italiane
const PROVINCE_ITALIANE = [
  "Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno", "Asti", "Avellino", "Bari",
  "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia",
  "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Caserta", "Catania", "Catanzaro", "Chieti",
  "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia",
  "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "L'Aquila",
  "La Spezia", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova",
  "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "Monza e Brianza", "Napoli", "Novara",
  "Nuoro", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "Pesaro e Urbino", "Pescara",
  "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "Reggio Calabria",
  "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Sassari", "Savona", "Siena",
  "Siracusa", "Sondrio", "Sud Sardegna", "Taranto", "Teramo", "Terni", "Torino", "Trapani", "Trento",
  "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona",
  "Vibo Valentia", "Vicenza", "Viterbo"
];

// Funzione per formattare la data nel formato gg/MM/yyyy
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Funzione per convertire la data dal formato gg/MM/yyyy a yyyy-MM-dd
const parseDate = (dateString) => {
  if (!dateString) return '';
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return dateString;
  
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  
  return `${year}-${month}-${day}`;
};

// Funzione per estrarre informazioni dal codice fiscale
const extractInfoFromFiscalCode = (fiscalCode) => {
  if (!fiscalCode || fiscalCode.length !== 16) {
    return null;
  }

  try {
    // Estrai anno di nascita (posizioni 7-8)
    const yearCode = fiscalCode.substring(6, 8);
    let year = parseInt(yearCode, 10);
    // Determina il secolo (1900 o 2000)
    const currentYear = new Date().getFullYear();
    const century = year > (currentYear % 100) ? 1900 : 2000;
    year += century;

    // Estrai mese di nascita (posizione 9)
    const monthCode = fiscalCode.charAt(8);
    const monthMap = {
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'H': 5,
      'L': 6, 'M': 7, 'P': 8, 'R': 9, 'S': 10, 'T': 11
    };
    const month = monthMap[monthCode];

    // Estrai giorno di nascita e genere (posizioni 10-11)
    let day = parseInt(fiscalCode.substring(9, 11), 10);
    // Se il giorno è > 40, la persona è di sesso femminile
    const gender = day > 40 ? 'F' : 'M';
    if (day > 40) {
      day -= 40;
    }

    // Crea la data di nascita
    const birthDate = new Date(year, month, day);
    const formattedBirthDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Estrai codice catastale (posizioni 12-15)
    const placeCode = fiscalCode.substring(11, 15);
    
    // Determina se il luogo di nascita è in Italia o all'estero
    let birthPlace = null;
    let isItalian = false;
    let province = '';
    let city = '';
    
    if (placeCode.startsWith('Z')) {
      // Codice di una nazione estera
      birthPlace = CODICI_A_NAZIONI[placeCode] || null;
    } else {
      // Codice di un comune italiano
      city = CODICI_A_COMUNI[placeCode] || null;
      birthPlace = 'ITALIA';
      isItalian = true;
      
      // Cerca la provincia in base al comune
      // Nota: questa è una semplificazione, in un'implementazione reale
      // dovresti avere una mappatura comune -> provincia
      if (city === 'ROMA') province = 'Roma';
      else if (city === 'MILANO') province = 'Milano';
      else if (city === 'NAPOLI') province = 'Napoli';
      else if (city === 'TORINO') province = 'Torino';
      else if (city === 'AOSTA') province = 'Aosta';
      else if (city === 'MESAGNE') province = 'Brindisi';
      else if (city === 'PALERMO') province = 'Palermo';
      else province = '';
    }

    return {
      birthDate: formattedBirthDate,
      gender,
      nation: birthPlace,
      isItalian,
      province,
      city
    };
  } catch (error) {
    console.error("Errore nell'estrazione delle informazioni dal codice fiscale:", error);
    return null;
  }
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
    const monthCodes = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
    return monthCodes[month];
  };
  
  // Funzione per ottenere il codice del giorno
  const getDayCode = (birthDate, gender) => {
    const date = new Date(birthDate);
    let day = date.getDate();
    
    // Per le femmine, aggiungi 40 al giorno
    if (gender === 'F') {
      day += 40;
    }
    
    // Formatta il giorno come stringa di 2 cifre
    return day.toString().padStart(2, '0');
  };
  
  // Funzione per ottenere il codice del luogo di nascita
  const getPlaceCode = (birthPlace) => {
    // Controlla se il luogo di nascita è un comune italiano
    const communeCode = COMUNI_ITALIANI[birthPlace.toUpperCase()];
    if (communeCode) {
      return communeCode;
    }
    
    // Controlla se il luogo di nascita è una nazione estera
    const nationCode = NAZIONI_ESTERE[birthPlace.toUpperCase()];
    if (nationCode) {
      return nationCode;
    }
    
    // Se non è stato trovato un codice, restituisci un valore di default
    return "Z000";
  };
  
  // Funzione per calcolare il carattere di controllo
  const getControlChar = (code) => {
    const evenMap = {
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
      'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
      'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
    };
    
    const oddMap = {
      '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
      'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
      'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
      'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
    };
    
    let sum = 0;
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      if (i % 2 === 0) {
        sum += oddMap[char];
      } else {
        sum += evenMap[char];
      }
    }
    
    const remainder = sum % 26;
    const controlChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return controlChars[remainder];
  };
  
  try {
    // Ottieni i codici per ogni parte del codice fiscale
    const lastNameCode = getLastNameCode(lastName);
    const firstNameCode = getFirstNameCode(firstName);
    const yearCode = getYearCode(birthDate);
    const monthCode = getMonthCode(birthDate);
    const dayCode = getDayCode(birthDate, gender);
    const placeCode = getPlaceCode(birthPlace);
    
    // Combina i codici per formare il codice fiscale senza il carattere di controllo
    const partialCode = lastNameCode + firstNameCode + yearCode + monthCode + dayCode + placeCode;
    
    // Calcola il carattere di controllo
    const controlChar = getControlChar(partialCode);
    
    // Restituisci il codice fiscale completo
    return partialCode + controlChar;
  } catch (error) {
    console.error("Errore nel calcolo del codice fiscale:", error);
    return null;
  }
};

// Mappatura inversa da codici a comuni e nazioni
const CODICI_A_COMUNI = Object.entries(COMUNI_ITALIANI).reduce((acc, [comune, codice]) => {
  acc[codice] = comune;
  return acc;
}, {});

const CODICI_A_NAZIONI = Object.entries(NAZIONI_ESTERE).reduce((acc, [nazione, codice]) => {
  acc[codice] = nazione;
  return acc;
}, {});

// Tema colori base senza animazioni
const theme = {
  primary: '#1e40af',
  white: '#ffffff',
  black: '#000000',
  gray: '#64748b',
  grayLight: '#e2e8f0',
  grayDark: '#334155',
};

const RegisterDropdown = () => {
  // Stato per il dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;
  
  // Stato per il calcolatore del codice fiscale
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    // Dati personali
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    citizenship: '',
    nation: '',
    province: '',
    city: '',
    
    // Codice fiscale
    fiscalCode: '',
    fiscalCodeCalculated: false,
    isForeigner: false
  });
  
  // Stato per gli errori del form
  const [formErrors, setFormErrors] = useState({});
  
  // Ref per il dropdown
  const dropdownRef = useRef(null);
  
  // Formatta la data di nascita per la visualizzazione
  const displayBirthDate = formData.birthDate ? formatDate(formData.birthDate) : '';
  
  // Funzione per aprire/chiudere il dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  // Effetto per chiudere il dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Effetto per estrarre informazioni dal codice fiscale
  useEffect(() => {
    if (formData.fiscalCode && formData.fiscalCode.length === 16 && !formData.isForeigner) {
      const info = extractInfoFromFiscalCode(formData.fiscalCode);
      if (info) {
        setFormData(prevData => ({
          ...prevData,
          birthDate: info.birthDate,
          gender: info.gender,
          nation: info.nation || 'ITALIA',
          province: info.province,
          city: info.city
        }));
      }
    }
  }, [formData.fiscalCode, formData.isForeigner]);
  
  // Funzione per gestire il cambiamento nei campi del form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Aggiorna direttamente lo stato formData con tutti i campi esistenti più il campo modificato
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Rimuovi gli errori per il campo aggiornato
    if (formErrors[name]) {
      setFormErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Funzione per aggiornare i dati del form
  const updateFormData = (newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };
  
  // Funzione per passare allo step successivo
  const goToNextStep = () => {
    // Validazione dei dati in base allo step corrente
    if (currentStep === 2) {
      // Validazione del codice fiscale
      const errors = {};
      
      if (!formData.isForeigner && (!formData.fiscalCode || formData.fiscalCode.length !== 16)) {
        errors.fiscalCode = 'Inserisci un codice fiscale valido di 16 caratteri';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    } else if (currentStep === 3) {
      // Validazione dei dati personali
      const errors = {};
      
      if (!formData.firstName) {
        errors.firstName = 'Il nome è obbligatorio';
      }
      
      if (!formData.lastName) {
        errors.lastName = 'Il cognome è obbligatorio';
      }
      
      if (!formData.birthDate) {
        errors.birthDate = 'La data di nascita è obbligatoria';
      }
      
      if (!formData.gender) {
        errors.gender = 'Il sesso è obbligatorio';
      }
      
      if (!formData.citizenship) {
        errors.citizenship = 'La cittadinanza è obbligatoria';
      }
      
      if (!formData.nation) {
        errors.nation = 'La nazione è obbligatoria';
      }
      
      if (formData.nation === 'ITALIA' && !formData.province) {
        errors.province = 'La provincia è obbligatoria';
      }
      
      if (formData.nation === 'ITALIA' && !formData.city) {
        errors.city = 'Il comune è obbligatorio';
      } else if (formData.nation !== 'ITALIA' && !formData.city) {
        errors.city = 'La città è obbligatoria';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }
    
    // Se la validazione passa, vai allo step successivo
    setCurrentStep(currentStep + 1);
    // Resetta gli errori
    setFormErrors({});
  };
  
  // Funzione per tornare allo step precedente
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Resetta gli errori
      setFormErrors({});
    }
  };
  
  // Funzione per aprire il calcolatore
  const openCalculator = (e) => {
    e.preventDefault();
    setShowCalculator(true);
  };
  
  // Funzione per chiudere il calcolatore
  const closeCalculator = () => {
    setShowCalculator(false);
  };
  
  // Funzione per gestire il cambiamento nel checkbox dello studente straniero
  const handleForeignerChange = (e) => {
    const isChecked = e.target.checked;
    updateFormData({
      isForeigner: isChecked,
      fiscalCode: isChecked ? '' : formData.fiscalCode
    });
  };
  
  // Componente per il terzo step: Dati Personali
  const PersonalDataStep = () => {
    // Funzione per gestire il submit del form
    const handleSubmit = (e) => {
      e.preventDefault();
      goToNextStep();
    };

    return (
      <div>
        <div className="bg-primary text-white p-3 rounded-top d-flex align-items-center" style={{ backgroundColor: theme.primary }}>
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <h5 className="mb-0">Dati Personali</h5>
        </div>
        <div className="p-4 border border-top-0 rounded-bottom">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Nome*</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Inserisci il tuo nome"
                    autoComplete="given-name"
                    isInvalid={!!formErrors.firstName}
                    disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Cognome*</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Inserisci il tuo cognome"
                    autoComplete="family-name"
                    isInvalid={!!formErrors.lastName}
                    disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Data Nascita*</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.birthDate}
                      disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                    />
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary"
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.birthDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Sesso*</Form.Label>
                  <div className="d-flex align-items-center gap-4 mt-2">
                    <Form.Check
                      inline
                      label="Maschio"
                      name="gender"
                      type="radio"
                      id="gender-m"
                      value="M"
                      checked={formData.gender === 'M'}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.gender}
                      disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                    />
                    <Form.Check
                      inline
                      label="Femmina"
                      name="gender"
                      type="radio"
                      id="gender-f"
                      value="F"
                      checked={formData.gender === 'F'}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.gender}
                      disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                      style={{ marginRight: '20px' }}
                    />
                  </div>
                  {formErrors.gender && (
                    <div className="text-danger small mt-1">{formErrors.gender}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Prima cittadinanza*</Form.Label>
                  <Form.Select
                    name="citizenship"
                    value={formData.citizenship}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.citizenship}
                  >
                    <option value="">Seleziona la cittadinanza</option>
                    {CITTADINANZE.map((cittadinanza, index) => (
                      <option key={index} value={cittadinanza}>{cittadinanza}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.citizenship}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Nazione*</Form.Label>
                  <Form.Select
                    name="nation"
                    value={formData.nation}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.nation}
                    disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                  >
                    <option value="">Seleziona la nazione</option>
                    <option value="ITALIA">ITALIA</option>
                    {Object.keys(NAZIONI_ESTERE).map((nazione, index) => (
                      <option key={index} value={nazione}>{nazione}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.nation}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {formData.nation === 'ITALIA' && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Provincia*</Form.Label>
                    <Form.Select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.province}
                      disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                    >
                      <option value="">Seleziona la provincia</option>
                      {PROVINCE_ITALIANE.map((provincia, index) => (
                        <option key={index} value={provincia}>{provincia}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.province}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Comune/Città*</Form.Label>
                    <Form.Select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.city}
                      disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                    >
                      <option value="">Seleziona il comune</option>
                      {Object.keys(COMUNI_ITALIANI).map((comune, index) => (
                        <option key={index} value={comune}>{comune}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {formData.nation !== 'ITALIA' && formData.nation !== '' && (
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Città non in elenco*</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Inserisci la città"
                      isInvalid={!!formErrors.city}
                      disabled={!formData.isForeigner && formData.fiscalCode.length === 16}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Codice Fiscale*</Form.Label>
              <Form.Control
                type="text"
                name="fiscalCode"
                value={formData.fiscalCode}
                readOnly
                className="bg-light"
                placeholder="PRCMSM56R25G273Y"
              />
              <Form.Text className="text-muted">(calcolato se non indicato)</Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-secondary"
                onClick={goToPreviousStep}
                className="d-flex align-items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Indietro</span>
              </Button>
              
              <Button
                variant="primary"
                type="submit"
                className="d-flex align-items-center gap-2"
                style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
              >
                <span>Avanti</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
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
      
      if (validateCalculatorData()) {
        const fiscalCode = calculateFiscalCode(
          calculatorData.firstName,
          calculatorData.lastName,
          calculatorData.birthDate,
          calculatorData.gender,
          calculatorData.birthPlace
        );
        
        // Aggiorna il campo del codice fiscale nel form
        updateFormData({
          fiscalCode,
          fiscalCodeCalculated: true,
          // Aggiorna anche i dati personali per lo step 3
          firstName: calculatorData.firstName,
          lastName: calculatorData.lastName,
          birthDate: calculatorData.birthDate,
          gender: calculatorData.gender
        });
        
        // Chiudi il modal
        closeCalculator();
      }
    };

    return (
      <Modal
        show={showCalculator}
        onHide={closeCalculator}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton style={{ backgroundColor: theme.primary, color: theme.white }}>
          <Modal.Title className="d-flex align-items-center">
            <FontAwesomeIcon icon={faCalculator} className="me-2" />
            Calcola Codice Fiscale
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={calculatorData.firstName}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.firstName}
                    placeholder="Inserisci il tuo nome"
                  />
                  <Form.Control.Feedback type="invalid">
                    {calculatorErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={calculatorData.lastName}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.lastName}
                    placeholder="Inserisci il tuo cognome"
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
                  <Form.Label>Data di Nascita</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={calculatorData.birthDate}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.birthDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {calculatorErrors.birthDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sesso</Form.Label>
                  <div className="d-flex gap-4 mt-2">
                    <Form.Check
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
                      type="radio"
                      label="Femmina"
                      name="gender"
                      id="gender-female"
                      value="F"
                      checked={calculatorData.gender === 'F'}
                      onChange={handleCalculatorChange}
                      isInvalid={!!calculatorErrors.gender}
                      style={{ marginRight: '20px' }}
                    />
                  </div>
                  {calculatorErrors.gender && (
                    <div className="text-danger small mt-2">{calculatorErrors.gender}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Luogo di Nascita (Comune o Stato Estero)</Form.Label>
              <Form.Control
                type="text"
                name="birthPlace"
                value={calculatorData.birthPlace}
                onChange={handleCalculatorChange}
                isInvalid={!!calculatorErrors.birthPlace}
                placeholder="Es. Roma, Milano, Germania, Francia"
              />
              <Form.Control.Feedback type="invalid">
                {calculatorErrors.birthPlace}
              </Form.Control.Feedback>
              <Form.Text className="text-muted mt-2 d-block">
                Inserisci il nome del comune italiano o dello stato estero di nascita
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={closeCalculator}
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={handleCalculate}
            style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
          >
            <FontAwesomeIcon icon={faCalculator} className="me-2" />
            Calcola Codice Fiscale
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  // Componente per il primo step: Informativa sulla Privacy
  const PrivacyNoticeStep = () => {
    return (
      <div>
        <div className="bg-primary text-white p-3 rounded-top d-flex align-items-center" style={{ backgroundColor: theme.primary }}>
          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
          <h5 className="mb-0">Informativa sulla Privacy</h5>
        </div>
        <div className="p-4 border border-top-0 rounded-bottom">
          <div className="mb-4 p-3 bg-light rounded border">
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
                className="fw-bold text-decoration-none"
                style={{ color: theme.primary }}
              >
                Leggi l'informativa
              </a>
            </p>
            <p className="small text-muted mb-0">
              Proseguendo con la registrazione, confermi di aver letto e compreso l'informativa sulla privacy.
            </p>
          </div>
          
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
              onClick={goToNextStep}
              style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
            >
              <span>Avanti</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Componente per il secondo step: Codice Fiscale
  const FiscalCodeStep = () => {
    // Funzione per gestire il submit del form
    const handleSubmit = (e) => {
      e.preventDefault();
      goToNextStep();
    };

    return (
      <div>
        <div className="bg-primary text-white p-3 rounded-top d-flex align-items-center" style={{ backgroundColor: theme.primary }}>
          <FontAwesomeIcon icon={faIdCard} className="me-2" />
          <h5 className="mb-0">Codice Fiscale</h5>
        </div>
        <div className="p-4 border border-top-0 rounded-bottom">
          <form onSubmit={handleSubmit}>
            <p className="mb-3">Inserisci il tuo codice fiscale o utilizza il calcolatore se non lo conosci:</p>
            
            <div className="p-3 bg-light rounded mb-4 border">
              <div className="mb-3">
                <label htmlFor="fiscalCode" className="form-label fw-bold mb-2">
                  Codice Fiscale
                </label>
                <input
                  type="text"
                  className={`form-control ${formErrors.fiscalCode ? 'is-invalid' : ''}`}
                  id="fiscalCode"
                  name="fiscalCode"
                  value={formData.fiscalCode}
                  onChange={handleInputChange}
                  disabled={formData.isForeigner}
                  placeholder="Inserisci il tuo codice fiscale"
                />
                {formErrors.fiscalCode && (
                  <div className="invalid-feedback">{formErrors.fiscalCode}</div>
                )}
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
              <div className="text-center mb-4">
                <button
                  type="button"
                  className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
                  onClick={openCalculator}
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  <FontAwesomeIcon icon={faCalculator} />
                  Calcola Codice Fiscale
                </button>
              </div>
            )}
            
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                onClick={goToPreviousStep}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Indietro</span>
              </button>
              
              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center gap-2"
                style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
              >
                <span>Avanti</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="position-relative d-inline-block">
      <button
        type="button"
        onClick={toggleDropdown}
        className="btn btn-primary d-flex align-items-center gap-2"
        style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
      >
        <FontAwesomeIcon icon={faUserPlus} />
        <span>Registrati</span>
      </button>
      
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="position-absolute start-0 mt-3 bg-white rounded shadow"
          style={{
            zIndex: 1000,
            width: '500px',
            maxWidth: '100vw',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="p-4">
            <div className="d-flex align-items-center mb-4">
              <FontAwesomeIcon icon={faAddressCard} className="me-2" style={{ fontSize: '1.25rem', color: theme.primary }} />
              <h4 className="mb-0 fw-bold" style={{ color: theme.primary }}>Registrazione della persona</h4>
            </div>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle me-2 text-white"
                    style={{
                      width: '32px',
                      height: '32px',
                      fontWeight: 'bold',
                      backgroundColor: theme.primary
                    }}
                  >
                    {currentStep}
                  </div>
                  <span className="fw-bold">Step {currentStep} di {totalSteps}</span>
                </div>
                <span className="badge rounded-pill" style={{ backgroundColor: theme.primary }}>
                  {Math.round((currentStep / totalSteps) * 100)}%
                </span>
              </div>
              
              <div className="progress mb-2" style={{ height: '8px', backgroundColor: theme.grayLight }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${(currentStep / totalSteps) * 100}%`,
                    backgroundColor: theme.primary
                  }}
                  aria-valuenow={(currentStep / totalSteps) * 100}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              
              <div className="d-flex justify-content-between">
                {Array.from({ length: 12 }).map((_, index) => {
                  const stepNumber = index + 1;
                  const isActive = stepNumber <= currentStep;
                  
                  return (
                    <div
                      key={stepNumber}
                      className={`rounded-circle ${isActive ? '' : 'bg-light border'}`}
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: isActive ? theme.primary : undefined
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
            
            {currentStep === 1 && <PrivacyNoticeStep />}
            {currentStep === 2 && <FiscalCodeStep />}
            {currentStep === 3 && <PersonalDataStep />}
            {/* Gli altri step verrebbero implementati qui */}
          </div>
        </div>
      )}
      
      <FiscalCodeCalculator />
    </div>
  );
};

export default RegisterDropdown;
