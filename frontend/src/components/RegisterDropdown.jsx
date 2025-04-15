import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faCalculator, faCheck, faUniversity, faCalendarAlt, faUser, faIdCard, faGlobe, faMapMarkerAlt, faCity, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/RegisterDropdown.css';

// Database delle nazioni
const NAZIONI = [
  "AFGHANISTAN", "ALBANIA", "ALGERIA", "ANDORRA", "ANGOLA", "ANTIGUA E BARBUDA", "ARABIA SAUDITA",
  "ARGENTINA", "ARMENIA", "AUSTRALIA", "AUSTRIA", "AZERBAIGIAN", "BAHAMAS", "BAHREIN", "BANGLADESH",
  "BARBADOS", "BELGIO", "BELIZE", "BENIN", "BHUTAN", "BIELORUSSIA", "BOLIVIA", "BOSNIA ED ERZEGOVINA",
  "BOTSWANA", "BRASILE", "BRUNEI", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAMBOGIA", "CAMERUN",
  "CANADA", "CAPO VERDE", "CIAD", "CILE", "CINA", "CIPRO", "CITTA DEL VATICANO", "COLOMBIA", "COMORE",
  "CONGO", "COREA DEL NORD", "COREA DEL SUD", "COSTA D'AVORIO", "COSTA RICA", "CROAZIA", "CUBA",
  "DANIMARCA", "DOMINICA", "ECUADOR", "EGITTO", "EL SALVADOR", "EMIRATI ARABI UNITI", "ERITREA",
  "ESTONIA", "ETIOPIA", "FIJI", "FILIPPINE", "FINLANDIA", "FRANCIA", "GABON", "GAMBIA", "GEORGIA",
  "GERMANIA", "GHANA", "GIAMAICA", "GIAPPONE", "GIBUTI", "GIORDANIA", "GRECIA", "GRENADA", "GUATEMALA",
  "GUINEA", "GUINEA BISSAU", "GUINEA EQUATORIALE", "GUYANA", "HAITI", "HONDURAS", "INDIA", "INDONESIA",
  "IRAN", "IRAQ", "IRLANDA", "ISLANDA", "ISRAELE", "ITALIA", "KAZAKISTAN", "KENYA", "KIRGHIZISTAN",
  "KIRIBATI", "KUWAIT", "LAOS", "LESOTHO", "LETTONIA", "LIBANO", "LIBERIA", "LIBIA", "LIECHTENSTEIN",
  "LITUANIA", "LUSSEMBURGO", "MACEDONIA", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVE", "MALI",
  "MALTA", "MAROCCO", "MAURITANIA", "MAURITIUS", "MESSICO", "MICRONESIA", "MOLDAVIA", "MONACO",
  "MONGOLIA", "MONTENEGRO", "MOZAMBICO", "MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NICARAGUA", "NIGER",
  "NIGERIA", "NORVEGIA", "NUOVA ZELANDA", "OMAN", "PAESI BASSI", "PAKISTAN", "PALAU", "PANAMA",
  "PAPUA NUOVA GUINEA", "PARAGUAY", "PERU", "POLONIA", "PORTOGALLO", "QATAR", "REGNO UNITO",
  "REPUBBLICA CECA", "REPUBBLICA CENTRAFRICANA", "REPUBBLICA DEMOCRATICA DEL CONGO",
  "REPUBBLICA DOMINICANA", "ROMANIA", "RUANDA", "RUSSIA", "SAINT KITTS E NEVIS", "SAINT LUCIA",
  "SAINT VINCENT E GRENADINE", "SAMOA", "SAN MARINO", "SAO TOME E PRINCIPE", "SENEGAL", "SERBIA",
  "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SIRIA", "SLOVACCHIA", "SLOVENIA", "SOMALIA", "SPAGNA",
  "SRI LANKA", "STATI UNITI", "SUDAFRICA", "SUDAN", "SUDAN DEL SUD", "SURINAME", "SVEZIA", "SVIZZERA",
  "SWAZILAND", "TAGIKISTAN", "TAIWAN", "TANZANIA", "THAILANDIA", "TIMOR ORIENTALE", "TOGO", "TONGA",
  "TRINIDAD E TOBAGO", "TUNISIA", "TURCHIA", "TURKMENISTAN", "TUVALU", "UCRAINA", "UGANDA", "UNGHERIA",
  "URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIETNAM", "YEMEN", "ZAMBIA", "ZIMBABWE"
];

// Database delle province italiane
const PROVINCE_ITALIANE = [
  "AGRIGENTO", "ALESSANDRIA", "ANCONA", "AOSTA", "AREZZO", "ASCOLI PICENO", "ASTI", "AVELLINO", "BARI",
  "BARLETTA-ANDRIA-TRANI", "BELLUNO", "BENEVENTO", "BERGAMO", "BIELLA", "BOLOGNA", "BOLZANO", "BRESCIA",
  "BRINDISI", "CAGLIARI", "CALTANISSETTA", "CAMPOBASSO", "CASERTA", "CATANIA", "CATANZARO", "CHIETI",
  "COMO", "COSENZA", "CREMONA", "CROTONE", "CUNEO", "ENNA", "FERMO", "FERRARA", "FIRENZE", "FOGGIA",
  "FORLI'-CESENA", "FROSINONE", "GENOVA", "GORIZIA", "GROSSETO", "IMPERIA", "ISERNIA", "LA SPEZIA",
  "L'AQUILA", "LATINA", "LECCE", "LECCO", "LIVORNO", "LODI", "LUCCA", "MACERATA", "MANTOVA",
  "MASSA-CARRARA", "MATERA", "MESSINA", "MILANO", "MODENA", "MONZA E DELLA BRIANZA", "NAPOLI", "NOVARA",
  "NUORO", "ORISTANO", "PADOVA", "PALERMO", "PARMA", "PAVIA", "PERUGIA", "PESARO E URBINO", "PESCARA",
  "PIACENZA", "PISA", "PISTOIA", "PORDENONE", "POTENZA", "PRATO", "RAGUSA", "RAVENNA", "REGGIO CALABRIA",
  "REGGIO EMILIA", "RIETI", "RIMINI", "ROMA", "ROVIGO", "SALERNO", "SASSARI", "SAVONA", "SIENA",
  "SIRACUSA", "SONDRIO", "SUD SARDEGNA", "TARANTO", "TERAMO", "TERNI", "TORINO", "TRAPANI", "TRENTO",
  "TREVISO", "TRIESTE", "UDINE", "VARESE", "VENEZIA", "VERBANO-CUSIO-OSSOLA", "VERCELLI", "VERONA",
  "VIBO VALENTIA", "VICENZA", "VITERBO"
];

// Database delle città italiane (esempio con alcune città per provincia)
const CITTA_ITALIANE = {
  "AGRIGENTO": ["AGRIGENTO", "LICATA", "SCIACCA", "CANICATTÌ", "FAVARA"],
  "ALESSANDRIA": ["ALESSANDRIA", "CASALE MONFERRATO", "NOVI LIGURE", "TORTONA", "ACQUI TERME"],
  "ANCONA": ["ANCONA", "SENIGALLIA", "JESI", "FABRIANO", "OSIMO"],
  "AOSTA": ["AOSTA", "SAINT-VINCENT", "CHATILLON", "SARRE", "GRESSAN"],
  "AREZZO": ["AREZZO", "CORTONA", "SANSEPOLCRO", "MONTEVARCHI", "SAN GIOVANNI VALDARNO"],
  "ASCOLI PICENO": ["ASCOLI PICENO", "SAN BENEDETTO DEL TRONTO", "GROTTAMMARE", "FOLIGNANO", "MONTEPRANDONE"],
  "ASTI": ["ASTI", "NIZZA MONFERRATO", "CANELLI", "SAN DAMIANO D'ASTI", "COSTIGLIOLE D'ASTI"],
  "AVELLINO": ["AVELLINO", "ARIANO IRPINO", "MONTELLA", "SOLOFRA", "MERCOGLIANO"],
  "BARI": ["BARI", "ALTAMURA", "MONOPOLI", "BITONTO", "MOLFETTA"],
  "BARLETTA-ANDRIA-TRANI": ["BARLETTA", "ANDRIA", "TRANI", "BISCEGLIE", "CANOSA DI PUGLIA"],
  "BELLUNO": ["BELLUNO", "FELTRE", "SEDICO", "PONTE NELLE ALPI", "SANTA GIUSTINA"],
  "BENEVENTO": ["BENEVENTO", "MONTESARCHIO", "SAN GIORGIO DEL SANNIO", "TELESE TERME", "AIROLA"],
  "BERGAMO": ["BERGAMO", "TREVIGLIO", "SERIATE", "DALMINE", "ROMANO DI LOMBARDIA"],
  "BIELLA": ["BIELLA", "COSSATO", "VIGLIANO BIELLESE", "CANDELO", "VALDILANA"],
  "BOLOGNA": ["BOLOGNA", "IMOLA", "CASALECCHIO DI RENO", "SAN LAZZARO DI SAVENA", "VALSAMOGGIA"],
  "BOLZANO": ["BOLZANO", "MERANO", "BRESSANONE", "LAIVES", "BRUNICO"],
  "BRESCIA": ["BRESCIA", "DESENZANO DEL GARDA", "MONTICHIARI", "LUMEZZANE", "ROVATO"],
  "BRINDISI": ["BRINDISI", "FASANO", "OSTUNI", "FRANCAVILLA FONTANA", "MESAGNE"],
  "CAGLIARI": ["CAGLIARI", "QUARTU SANT'ELENA", "SELARGIUS", "ASSEMINI", "CAPOTERRA"],
  "CALTANISSETTA": ["CALTANISSETTA", "GELA", "NISCEMI", "SAN CATALDO", "MAZZARINO"],
  "CAMPOBASSO": ["CAMPOBASSO", "TERMOLI", "BOJANO", "LARINO", "CAMPOMARINO"],
  "CASERTA": ["CASERTA", "AVERSA", "MARCIANISE", "MADDALONI", "SANTA MARIA CAPUA VETERE"],
  "CATANIA": ["CATANIA", "ACIREALE", "MISTERBIANCO", "PATERNÒ", "CALTAGIRONE"],
  "CATANZARO": ["CATANZARO", "LAMEZIA TERME", "SOVERATO", "SELLIA MARINA", "BORGIA"],
  "CHIETI": ["CHIETI", "VASTO", "LANCIANO", "FRANCAVILLA AL MARE", "ORTONA"],
  "COMO": ["COMO", "CANTÙ", "MARIANO COMENSE", "ERBA", "OLGIATE COMASCO"],
  "COSENZA": ["COSENZA", "CORIGLIANO-ROSSANO", "RENDE", "CASTROVILLARI", "PAOLA"],
  "CREMONA": ["CREMONA", "CREMA", "CASALMAGGIORE", "SORESINA", "CASTELLEONE"],
  "CROTONE": ["CROTONE", "CIRÒ MARINA", "ISOLA DI CAPO RIZZUTO", "CUTRO", "PETILIA POLICASTRO"],
  "CUNEO": ["CUNEO", "ALBA", "BRA", "FOSSANO", "MONDOVÌ"],
  "ENNA": ["ENNA", "PIAZZA ARMERINA", "NICOSIA", "LEONFORTE", "AGIRA"],
  "FERMO": ["FERMO", "PORTO SANT'ELPIDIO", "SANT'ELPIDIO A MARE", "PORTO SAN GIORGIO", "MONTEGRANARO"],
  "FERRARA": ["FERRARA", "CENTO", "COMACCHIO", "ARGENTA", "COPPARO"],
  "FIRENZE": ["FIRENZE", "EMPOLI", "SCANDICCI", "SESTO FIORENTINO", "CAMPI BISENZIO"],
  "FOGGIA": ["FOGGIA", "CERIGNOLA", "MANFREDONIA", "SAN SEVERO", "LUCERA"],
  "FORLI'-CESENA": ["FORLÌ", "CESENA", "CESENATICO", "SAVIGNANO SUL RUBICONE", "FORLIMPOPOLI"],
  "FROSINONE": ["FROSINONE", "CASSINO", "SORA", "ALATRI", "ANAGNI"],
  "GENOVA": ["GENOVA", "RAPALLO", "CHIAVARI", "SESTRI LEVANTE", "LAVAGNA"],
  "GORIZIA": ["GORIZIA", "MONFALCONE", "RONCHI DEI LEGIONARI", "GRADISCA D'ISONZO", "CORMONS"],
  "GROSSETO": ["GROSSETO", "FOLLONICA", "ORBETELLO", "CASTIGLIONE DELLA PESCAIA", "MASSA MARITTIMA"],
  "IMPERIA": ["IMPERIA", "SANREMO", "VENTIMIGLIA", "TAGGIA", "BORDIGHERA"],
  "ISERNIA": ["ISERNIA", "VENAFRO", "AGNONE", "SESTO CAMPANO", "FROSOLONE"],
  "LA SPEZIA": ["LA SPEZIA", "SARZANA", "ARCOLA", "SANTO STEFANO DI MAGRA", "LERICI"],
  "L'AQUILA": ["L'AQUILA", "AVEZZANO", "SULMONA", "CELANO", "TAGLIACOZZO"],
  "LATINA": ["LATINA", "APRILIA", "TERRACINA", "FORMIA", "CISTERNA DI LATINA"],
  "LECCE": ["LECCE", "NARDÒ", "GALATINA", "TRICASE", "CASARANO"],
  "LECCO": ["LECCO", "MERATE", "CALOLZIOCORTE", "CASATENOVO", "MANDELLO DEL LARIO"],
  "LIVORNO": ["LIVORNO", "PIOMBINO", "CECINA", "ROSIGNANO MARITTIMO", "PORTOFERRAIO"],
  "LODI": ["LODI", "CODOGNO", "CASALPUSTERLENGO", "SANT'ANGELO LODIGIANO", "LODI VECCHIO"],
  "LUCCA": ["LUCCA", "VIAREGGIO", "CAPANNORI", "CAMAIORE", "PIETRASANTA"],
  "MACERATA": ["MACERATA", "CIVITANOVA MARCHE", "RECANATI", "TOLENTINO", "POTENZA PICENA"],
  "MANTOVA": ["MANTOVA", "CASTIGLIONE DELLE STIVIERE", "SUZZARA", "VIADANA", "PORTO MANTOVANO"],
  "MASSA-CARRARA": ["MASSA", "CARRARA", "MONTIGNOSO", "AULLA", "PONTREMOLI"],
  "MATERA": ["MATERA", "POLICORO", "PISTICCI", "BERNALDA", "MONTESCAGLIOSO"],
  "MESSINA": ["MESSINA", "BARCELLONA POZZO DI GOTTO", "MILAZZO", "PATTI", "CAPO D'ORLANDO"],
  "MILANO": ["MILANO", "SESTO SAN GIOVANNI", "CINISELLO BALSAMO", "LEGNANO", "RHO"],
  "MODENA": ["MODENA", "CARPI", "SASSUOLO", "FORMIGINE", "CASTELFRANCO EMILIA"],
  "MONZA E DELLA BRIANZA": ["MONZA", "SEREGNO", "LISSONE", "DESIO", "CESANO MADERNO"],
  "NAPOLI": ["NAPOLI", "GIUGLIANO IN CAMPANIA", "TORRE DEL GRECO", "POZZUOLI", "CASORIA"],
  "NOVARA": ["NOVARA", "BORGOMANERO", "TRECATE", "GALLIATE", "ARONA"],
  "NUORO": ["NUORO", "SINISCOLA", "MACOMER", "DORGALI", "OROSEI"],
  "ORISTANO": ["ORISTANO", "TERRALBA", "CABRAS", "BOSA", "MARRUBIU"],
  "PADOVA": ["PADOVA", "ALBIGNASEGO", "SELVAZZANO DENTRO", "ABANO TERME", "VIGONZA"],
  "PALERMO": ["PALERMO", "BAGHERIA", "CARINI", "MONREALE", "PARTINICO"],
  "PARMA": ["PARMA", "FIDENZA", "SALSOMAGGIORE TERME", "COLLECCHIO", "NOCETO"],
  "PAVIA": ["PAVIA", "VIGEVANO", "VOGHERA", "MORTARA", "STRADELLA"],
  "PERUGIA": ["PERUGIA", "FOLIGNO", "CITTÀ DI CASTELLO", "SPOLETO", "ASSISI"],
  "PESARO E URBINO": ["PESARO", "FANO", "URBINO", "FERMIGNANO", "FOSSOMBRONE"],
  "PESCARA": ["PESCARA", "MONTESILVANO", "SPOLTORE", "CITTÀ SANT'ANGELO", "PENNE"],
  "PIACENZA": ["PIACENZA", "FIORENZUOLA D'ARDA", "CASTEL SAN GIOVANNI", "ROTTOFRENO", "PODENZANO"],
  "PISA": ["PISA", "CASCINA", "SAN GIULIANO TERME", "PONTEDERA", "SAN MINIATO"],
  "PISTOIA": ["PISTOIA", "MONTECATINI TERME", "QUARRATA", "MONSUMMANO TERME", "PESCIA"],
  "PORDENONE": ["PORDENONE", "SACILE", "CORDENONS", "AZZANO DECIMO", "FIUME VENETO"],
  "POTENZA": ["POTENZA", "MELFI", "LAVELLO", "RIONERO IN VULTURE", "VENOSA"],
  "PRATO": ["PRATO", "MONTEMURLO", "CARMIGNANO", "POGGIO A CAIANO", "VAIANO"],
  "RAGUSA": ["RAGUSA", "VITTORIA", "MODICA", "COMISO", "POZZALLO"],
  "RAVENNA": ["RAVENNA", "FAENZA", "LUGO", "CERVIA", "RUSSI"],
  "REGGIO CALABRIA": ["REGGIO CALABRIA", "GIOIA TAURO", "PALMI", "SIDERNO", "VILLA SAN GIOVANNI"],
  "REGGIO EMILIA": ["REGGIO EMILIA", "CORREGGIO", "SCANDIANO", "CASALGRANDE", "RUBIERA"],
  "RIETI": ["RIETI", "FARA IN SABINA", "CITTADUCALE", "CONTIGLIANO", "POGGIO MIRTETO"],
  "RIMINI": ["RIMINI", "RICCIONE", "SANTARCANGELO DI ROMAGNA", "BELLARIA-IGEA MARINA", "CORIANO"],
  "ROMA": ["ROMA", "GUIDONIA MONTECELIO", "FIUMICINO", "POMEZIA", "TIVOLI"],
  "ROVIGO": ["ROVIGO", "ADRIA", "LENDINARA", "PORTO VIRO", "OCCHIOBELLO"],
  "SALERNO": ["SALERNO", "BATTIPAGLIA", "NOCERA INFERIORE", "SCAFATI", "CAVA DE' TIRRENI"],
  "SASSARI": ["SASSARI", "ALGHERO", "PORTO TORRES", "OZIERI", "SORSO"],
  "SAVONA": ["SAVONA", "ALBENGA", "CAIRO MONTENOTTE", "VARAZZE", "FINALE LIGURE"],
  "SIENA": ["SIENA", "POGGIBONSI", "COLLE DI VAL D'ELSA", "MONTEPULCIANO", "CHIANCIANO TERME"],
  "SIRACUSA": ["SIRACUSA", "AUGUSTA", "AVOLA", "NOTO", "LENTINI"],
  "SONDRIO": ["SONDRIO", "MORBEGNO", "TIRANO", "LIVIGNO", "CHIAVENNA"],
  "SUD SARDEGNA": ["CARBONIA", "IGLESIAS", "GUSPINI", "VILLACIDRO", "SANT'ANTIOCO"],
  "TARANTO": ["TARANTO", "MARTINA FRANCA", "MASSAFRA", "GROTTAGLIE", "MANDURIA"],
  "TERAMO": ["TERAMO", "GIULIANOVA", "ROSETO DEGLI ABRUZZI", "ATRI", "SILVI"],
  "TERNI": ["TERNI", "ORVIETO", "NARNI", "AMELIA", "ACQUASPARTA"],
  "TORINO": ["TORINO", "MONCALIERI", "COLLEGNO", "RIVOLI", "NICHELINO"],
  "TRAPANI": ["TRAPANI", "MARSALA", "MAZARA DEL VALLO", "ALCAMO", "CASTELVETRANO"],
  "TRENTO": ["TRENTO", "ROVERETO", "PERGINE VALSUGANA", "ARCO", "RIVA DEL GARDA"],
  "TREVISO": ["TREVISO", "CONEGLIANO", "CASTELFRANCO VENETO", "MONTEBELLUNA", "VITTORIO VENETO"],
  "TRIESTE": ["TRIESTE", "MUGGIA", "DUINO-AURISINA", "SAN DORLIGO DELLA VALLE", "SGONICO"],
  "UDINE": ["UDINE", "CODROIPO", "LATISANA", "CERVIGNANO DEL FRIULI", "GEMONA DEL FRIULI"],
  "VARESE": ["VARESE", "BUSTO ARSIZIO", "GALLARATE", "SARONNO", "CASSANO MAGNAGO"],
  "VENEZIA": ["VENEZIA", "CHIOGGIA", "SAN DONÀ DI PIAVE", "MIRA", "MIRANO"],
  "VERBANO-CUSIO-OSSOLA": ["VERBANIA", "DOMODOSSOLA", "OMEGNA", "GRAVELLONA TOCE", "VILLADOSSOLA"],
  "VERCELLI": ["VERCELLI", "BORGOSESIA", "SANTHIÀ", "CRESCENTINO", "GATTINARA"],
  "VERONA": ["VERONA", "VILLAFRANCA DI VERONA", "SAN BONIFACIO", "LEGNAGO", "SAN GIOVANNI LUPATOTO"],
  "VIBO VALENTIA": ["VIBO VALENTIA", "TROPEA", "SERRA SAN BRUNO", "NICOTERA", "MILETO"],
  "VICENZA": ["VICENZA", "BASSANO DEL GRAPPA", "SCHIO", "VALDAGNO", "ARZIGNANO"],
  "VITERBO": ["VITERBO", "CIVITA CASTELLANA", "TARQUINIA", "VETRALLA", "MONTEFIASCONE"]
};

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

// Funzione per calcolare il codice fiscale
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
  
  // Funzione per calcolare il carattere di controllo
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

// Funzione per estrarre informazioni dal codice fiscale
const extractInfoFromFiscalCode = (fiscalCode) => {
  if (!fiscalCode || fiscalCode.length !== 16) {
    return null;
  }

  try {
    // Estrai le parti del codice fiscale
    const yearCode = fiscalCode.substring(6, 8);
    const monthCode = fiscalCode.substring(8, 9);
    const dayCode = parseInt(fiscalCode.substring(9, 11));
    const placeCode = fiscalCode.substring(11, 15);

    // Determina il sesso
    const isFemale = dayCode > 40;
    const actualDay = isFemale ? dayCode - 40 : dayCode;
    const gender = isFemale ? "Femmina" : "Maschio";

    // Determina l'anno di nascita (assumendo che sia nel 1900 o 2000)
    const currentYear = new Date().getFullYear();
    const century = parseInt(yearCode) + 2000 > currentYear ? 1900 : 2000;
    const year = century + parseInt(yearCode);

    // Determina il mese di nascita
    const monthCodes = "ABCDEHLMPRST";
    const month = monthCodes.indexOf(monthCode);

    // Crea la data di nascita in formato italiano
    const birthDate = new Date(year, month, actualDay);
    const formattedBirthDate = `${actualDay.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;

    // Trova il luogo di nascita dal codice
    let birthPlace = null;
    let provincia = null;
    let nazione = "ITALIA";

    // Cerca nei comuni italiani
    for (const [comune, code] of Object.entries(COMUNI_ITALIANI)) {
      if (code === placeCode) {
        birthPlace = comune;
        // Trova la provincia del comune
        for (const [prov, comuni] of Object.entries(CITTA_ITALIANE)) {
          if (comuni.includes(comune)) {
            provincia = prov;
            break;
          }
        }
        break;
      }
    }

    // Se non trovato nei comuni italiani, cerca nelle nazioni estere
    if (!birthPlace) {
      for (const [country, code] of Object.entries(NAZIONI_ESTERE)) {
        if (code === placeCode) {
          birthPlace = country;
          nazione = country;
          provincia = null;
          break;
        }
      }
    }

    return {
      gender,
      birthDate: formattedBirthDate,
      birthPlace,
      provincia,
      nazione,
      codiceFiscale: fiscalCode
    };
  } catch (error) {
    console.error("Errore nell'estrazione delle informazioni dal codice fiscale:", error);
    return null;
  }
};

// Componente per il dropdown con ricerca
const SearchableDropdown = ({ options, value, onChange, placeholder, icon, tabIndex }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Filtra le opzioni in base al termine di ricerca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);
  
  // Chiudi il dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Gestisci il cambiamento nel campo di ricerca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Gestisci la selezione di un'opzione
  const handleOptionSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };
  
  // Toggle del dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      // Focus sul campo di ricerca quando si apre il dropdown
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  // Gestisci la pressione del tasto Tab
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && !isOpen) {
      // Permetti la navigazione normale con Tab quando il dropdown è chiuso
      return;
    }
    
    if (e.key === 'Tab' && isOpen) {
      // Chiudi il dropdown quando si preme Tab e il dropdown è aperto
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <div className="dropdown-search" ref={dropdownRef}>
      <div className="input-with-icon">
        <input
          type="text"
          className="form-control input-animated"
          value={value}
          onClick={toggleDropdown}
          placeholder={placeholder}
          readOnly
          tabIndex={tabIndex}
          onKeyDown={handleKeyDown}
        />
        <span className="input-icon">
          {icon}
        </span>
      </div>
      
      {isOpen && (
        <div className="dropdown-list">
          <div className="p-2">
            <input
              ref={searchInputRef}
              type="text"
              className="form-control"
              placeholder="Cerca..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`dropdown-item ${option === value ? 'active' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="dropdown-item">Nessun risultato trovato</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principale RegisterDropdown
const RegisterDropdown = () => {
  // Stato per il dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Stato per lo step corrente
  const [currentStep, setCurrentStep] = useState(1);
  
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    fiscalCode: '',
    isForeigner: false,
    // Dati personali (Step 3)
    nome: '',
    cognome: '',
    dataNascita: '',
    sesso: 'Maschio',
    primaCittadinanza: 'ITALIA',
    nazione: 'ITALIA',
    provincia: '',
    comuneCitta: '',
    codiceFiscale: ''
  });
  
  // Stato per le città disponibili in base alla provincia selezionata
  const [cittaDisponibili, setCittaDisponibili] = useState([]);
  
  // Stato per il modal del calcolatore
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Riferimento al dropdown
  const dropdownRef = useRef(null);
  
  // Riferimenti per garantire la fluidità dei campi di input nel PersonalDataStep
  const nomeRef = useRef(null);
  const cognomeRef = useRef(null);
  const dataNascitaRef = useRef(null);
  
  // Stato per gli errori di validazione
  const [errors, setErrors] = useState({});
  
  // Stato per tenere traccia del campo attualmente in focus
  const [activeField, setActiveField] = useState(null);
  
  // Numero totale di step
  const totalSteps = 12;
  
  // Effetto per aggiornare le città disponibili quando cambia la provincia
  useEffect(() => {
    if (formData.provincia && CITTA_ITALIANE[formData.provincia]) {
      setCittaDisponibili(CITTA_ITALIANE[formData.provincia]);
    } else {
      setCittaDisponibili([]);
    }
  }, [formData.provincia]);
  
  // Toggle del dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setCurrentStep(1);
      // Reset dei dati del form quando si apre il dropdown
      resetFormData();
    }
  };
  
  // Previeni la chiusura del dropdown quando si clicca all'interno
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };
  
  // Funzione per andare allo step successivo con animazione
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Funzione per tornare allo step precedente con animazione
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Reset dei dati del form quando si torna indietro
      resetFormData();
    }
  };
  
  // Funzione per aggiornare i dati del form
  const updateFormData = (newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };
  
  // Funzione per resettare i dati del form
  const resetFormData = () => {
    setFormData({
      fiscalCode: '',
      isForeigner: false,
      nome: '',
      cognome: '',
      dataNascita: '',
      sesso: 'Maschio',
      primaCittadinanza: 'ITALIA',
      nazione: 'ITALIA',
      provincia: '',
      comuneCitta: '',
      codiceFiscale: ''
    });
    setErrors({});
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
    const handleCalculate = () => {
      if (validateCalculatorData()) {
        const fiscalCode = calculateFiscalCode(
          calculatorData.firstName,
          calculatorData.lastName,
          calculatorData.birthDate,
          calculatorData.gender,
          calculatorData.birthPlace
        );
        
        updateFormData({ fiscalCode });
        closeCalculator();
      }
    };

    return (
      <Modal show={showCalculator} onHide={closeCalculator} centered className="calculator-modal">
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faCalculator} className="me-2" />
            Calcolo Codice Fiscale
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={calculatorData.firstName}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.firstName}
                    className="input-animated"
                    tabIndex={1}
                  />
                  <Form.Control.Feedback type="invalid">
                    {calculatorErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={calculatorData.lastName}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.lastName}
                    className="input-animated"
                    tabIndex={2}
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
                  <Form.Label className="fw-bold">Data di Nascita</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={calculatorData.birthDate}
                    onChange={handleCalculatorChange}
                    isInvalid={!!calculatorErrors.birthDate}
                    className="input-animated"
                    tabIndex={3}
                  />
                  <Form.Control.Feedback type="invalid">
                    {calculatorErrors.birthDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Sesso</Form.Label>
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
                      tabIndex={4}
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
                      tabIndex={5}
                    />
                  </div>
                  {calculatorErrors.gender && (
                    <div className="text-danger small mt-1">{calculatorErrors.gender}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Luogo di Nascita (Comune o Stato Estero)</Form.Label>
              <Form.Control
                type="text"
                name="birthPlace"
                value={calculatorData.birthPlace}
                onChange={handleCalculatorChange}
                isInvalid={!!calculatorErrors.birthPlace}
                placeholder="Es. Roma, Milano, Germania, Francia"
                className="input-animated"
                tabIndex={6}
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
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeCalculator}
            tabIndex={8}
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={handleCalculate}
            tabIndex={7}
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
    
    // Genera gli step circles
    const renderStepCircles = () => {
      const circles = [];
      for (let i = 1; i <= totalSteps; i++) {
        const isActive = i <= currentStep;
        const isCurrent = i === currentStep;
        
        circles.push(
          <div
            key={i}
            className={`step-circle ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
            title={`Step ${i} di ${totalSteps}`}
          >
            <span>{i}</span>
          </div>
        );
      }
      return circles;
    };

    return (
      <div className="step-indicator">
        <div className="step-info">
          <span className="current-step">Step {currentStep}</span>
          <span className="total-steps">di {totalSteps}</span>
        </div>
        
        <div className="progress mb-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        
        <div className="step-circles-container">
          {renderStepCircles()}
        </div>
      </div>
    );
  };
  
  // Componente per il primo step: Informativa sulla Privacy
  const PrivacyNoticeStep = () => {
    return (
      <div className="step-content">
        <h4 className="step-title">
          <FontAwesomeIcon icon={faUniversity} className="me-2" />
          Informativa sulla Privacy
        </h4>
        <div className="privacy-notice">
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
              className="privacy-link"
              onClick={(e) => e.stopPropagation()}
              tabIndex={1}
            >
              Leggi l'informativa
            </a>
          </p>
          <p className="small text-muted mb-0">
            Proseguendo con la registrazione, confermi di aver letto e compreso l'informativa sulla privacy.
          </p>
        </div>
        
        <div className="buttons-container">
          <div></div> {/* Placeholder per allineare il pulsante a destra */}
          <button
            className="btn-next"
            onClick={goToNextStep}
            tabIndex={2}
          >
            <span className="me-2">Avanti</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    );
  };
  
  // Componente per il secondo step: Codice Fiscale
  const FiscalCodeStep = () => {
    // Funzione per gestire il cambiamento nel campo del codice fiscale
    const handleFiscalCodeChange = (e) => {
      updateFormData({ fiscalCode: e.target.value });
      
      // Rimuovi l'errore quando l'utente inizia a digitare
      if (errors.fiscalCode) {
        setErrors(prevErrors => ({
          ...prevErrors,
          fiscalCode: null
        }));
      }
    };
    
    // Funzione per gestire il cambiamento nel checkbox dello studente straniero
    const handleForeignerChange = (e) => {
      const isChecked = e.target.checked;
      updateFormData({
        isForeigner: isChecked,
        fiscalCode: isChecked ? '' : formData.fiscalCode
      });
      
      // Rimuovi l'errore quando l'utente cambia lo stato del checkbox
      if (errors.fiscalCode) {
        setErrors(prevErrors => ({
          ...prevErrors,
          fiscalCode: null
        }));
      }
    };
    
    // Funzione per validare il codice fiscale
    const validateFiscalCode = () => {
      // Se l'utente ha dichiarato di essere uno studente straniero, non è necessario il codice fiscale
      if (formData.isForeigner) {
        return true;
      }
      
      // Altrimenti, verifica che il codice fiscale sia stato inserito
      if (!formData.fiscalCode.trim()) {
        setErrors(prevErrors => ({
          ...prevErrors,
          fiscalCode: 'Il codice fiscale è obbligatorio'
        }));
        return false;
      }
      
      // Verifica che il codice fiscale abbia il formato corretto (16 caratteri alfanumerici)
      const fiscalCodeRegex = /^[A-Z0-9]{16}$/i;
      if (!fiscalCodeRegex.test(formData.fiscalCode)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          fiscalCode: 'Il codice fiscale deve essere composto da 16 caratteri alfanumerici'
        }));
        return false;
      }
      
      return true;
    };
    
    // Funzione per gestire il submit del form
    const handleSubmit = (e) => {
      if (e) e.preventDefault();
      
      // Valida il codice fiscale
      if (validateFiscalCode()) {
        // Se l'utente ha inserito un codice fiscale, estrai le informazioni
        if (formData.fiscalCode && !formData.isForeigner) {
          const fiscalCodeInfo = extractInfoFromFiscalCode(formData.fiscalCode.toUpperCase());
          if (fiscalCodeInfo) {
            updateFormData({
              dataNascita: fiscalCodeInfo.birthDate,
              sesso: fiscalCodeInfo.gender,
              nazione: fiscalCodeInfo.nazione,
              provincia: fiscalCodeInfo.provincia,
              comuneCitta: fiscalCodeInfo.birthPlace,
              codiceFiscale: fiscalCodeInfo.codiceFiscale
            });
          }
        }
        
        goToNextStep();
      }
    };

    // Gestisci la pressione del tasto Tab
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        // Tab in avanti
        if (e.target.id === 'fiscalCode') {
          e.preventDefault();
          document.getElementById('isForeigner').focus();
        } else if (e.target.id === 'isForeigner') {
          e.preventDefault();
          document.getElementById('calcBtn') ?
            document.getElementById('calcBtn').focus() :
            document.getElementById('prevBtn').focus();
        } else if (e.target.id === 'calcBtn') {
          e.preventDefault();
          document.getElementById('prevBtn').focus();
        } else if (e.target.id === 'prevBtn') {
          e.preventDefault();
          document.getElementById('nextBtn').focus();
        }
      } else if (e.key === 'Tab' && e.shiftKey) {
        // Tab indietro
        if (e.target.id === 'nextBtn') {
          e.preventDefault();
          document.getElementById('prevBtn').focus();
        } else if (e.target.id === 'prevBtn') {
          e.preventDefault();
          document.getElementById('calcBtn') ?
            document.getElementById('calcBtn').focus() :
            document.getElementById('isForeigner').focus();
        } else if (e.target.id === 'calcBtn') {
          e.preventDefault();
          document.getElementById('isForeigner').focus();
        } else if (e.target.id === 'isForeigner') {
          e.preventDefault();
          document.getElementById('fiscalCode').focus();
        }
      }
    };

    return (
      <div className="step-content">
        <h4 className="step-title">
          <FontAwesomeIcon icon={faIdCard} className="me-2" />
          Codice Fiscale
        </h4>
        
        <p className="mb-3">Digitare il proprio codice fiscale e cliccare su procedi:</p>
        
        <div className="form-container">
          <div className="mb-3">
            <label htmlFor="fiscalCode" className="form-label fw-bold">Codice Fiscale</label>
            <input
              type="text"
              className={`form-control mb-2 input-animated ${errors.fiscalCode ? 'is-invalid' : ''}`}
              id="fiscalCode"
              value={formData.fiscalCode}
              onChange={handleFiscalCodeChange}
              disabled={formData.isForeigner}
              tabIndex={1}
              onKeyDown={handleKeyDown}
            />
            {errors.fiscalCode && (
              <div className="invalid-feedback">{errors.fiscalCode}</div>
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
                tabIndex={2}
                onKeyDown={handleKeyDown}
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
              className="btn-prev"
              onClick={openCalculator}
              id="calcBtn"
              tabIndex={3}
              onKeyDown={handleKeyDown}
            >
              <FontAwesomeIcon icon={faCalculator} className="me-2" />
              Calcolo codice fiscale
            </button>
          </div>
        )}
        
        <div className="buttons-container">
          <button
            type="button"
            className="btn-prev"
            onClick={goToPreviousStep}
            id="prevBtn"
            tabIndex={4}
            onKeyDown={handleKeyDown}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            <span>Indietro</span>
          </button>
          
          <button
            type="button"
            className="btn-next"
            onClick={handleSubmit}
            id="nextBtn"
            tabIndex={5}
            onKeyDown={handleKeyDown}
          >
            <span className="me-2">Avanti</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    );
  };
  
  // Componente per il terzo step: Dati Personali
  const PersonalDataStep = () => {
    // Funzione per gestire il focus sui campi di input
    const handleFocus = (fieldName) => {
      setActiveField(fieldName);
    };
    
    // Funzione per gestire la perdita del focus sui campi di input
    const handleBlur = () => {
      setActiveField(null);
    };
    
    // Funzione per gestire il cambiamento nei campi di input mantenendo il focus
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      
      // Aggiorna i dati del form
      updateFormData({ [name]: value });
      
      // Rimuovi l'errore quando l'utente inizia a digitare
      if (errors[name]) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: null
        }));
      }
    };
    
    // Funzione per gestire il cambiamento nei campi dropdown
    const handleDropdownChange = (name, value) => {
      updateFormData({ [name]: value });
      
      // Rimuovi l'errore quando l'utente seleziona un valore
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
      
      setErrors(newErrors);
      
      if (isValid) {
        goToNextStep();
      }
      
      return isValid;
    };
    
    // Effetto per mantenere il focus sul campo attivo
    useEffect(() => {
      if (activeField === 'nome' && nomeRef.current) {
        nomeRef.current.focus();
      } else if (activeField === 'cognome' && cognomeRef.current) {
        cognomeRef.current.focus();
      } else if (activeField === 'dataNascita' && dataNascitaRef.current) {
        dataNascitaRef.current.focus();
      }
    }, [activeField, formData]);

    // Gestisci la pressione del tasto Tab
    const handleKeyDown = (e, fieldName) => {
      if (e.key === 'Tab') {
        // Permetti la navigazione normale con Tab
        if (fieldName === 'nome' && !e.shiftKey) {
          // Da nome a cognome
          e.preventDefault();
          cognomeRef.current.focus();
        } else if (fieldName === 'cognome' && e.shiftKey) {
          // Da cognome a nome
          e.preventDefault();
          nomeRef.current.focus();
        }
      }
    };

    return (
      <div className="step-content">
        {/* Intestazione */}
        <h4 className="step-title">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Registrazione: Dati personali
        </h4>
        <p className="text-center text-muted mb-4">
          In questa pagina viene visualizzato il modulo per l'inserimento o la modifica dei dati personali e del luogo di nascita dell'utente.
        </p>
        
        {/* Form */}
        <div className="form-container">
          <h5 className="mb-4 pb-2 border-bottom">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Dati personali
          </h5>
          
          <form>
            {/* Nome */}
            <div className="form-group-row">
              <label htmlFor="nome" className="form-label">Nome*</label>
              <div className="form-input">
                <input
                  ref={nomeRef}
                  type="text"
                  className={`input-animated ${errors.nome ? 'is-invalid' : ''}`}
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('nome')}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, 'nome')}
                  autoComplete="off"
                  tabIndex={1}
                />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>
            </div>
            
            {/* Cognome */}
            <div className="form-group-row">
              <label htmlFor="cognome" className="form-label">Cognome*</label>
              <div className="form-input">
                <input
                  ref={cognomeRef}
                  type="text"
                  className={`input-animated ${errors.cognome ? 'is-invalid' : ''}`}
                  id="cognome"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('cognome')}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, 'cognome')}
                  autoComplete="off"
                  tabIndex={2}
                />
                {errors.cognome && <div className="invalid-feedback">{errors.cognome}</div>}
              </div>
            </div>
            
            {/* Data Nascita */}
            <div className="form-group-row">
              <label htmlFor="dataNascita" className="form-label">Data Nascita*</label>
              <div className="form-input">
                <div className="input-with-icon">
                  <input
                    ref={dataNascitaRef}
                    type="text"
                    className={`input-animated ${errors.dataNascita ? 'is-invalid' : ''}`}
                    id="dataNascita"
                    name="dataNascita"
                    value={formData.dataNascita}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('dataNascita')}
                    onBlur={handleBlur}
                    autoComplete="off"
                    readOnly={!formData.isForeigner && formData.codiceFiscale}
                    tabIndex={3}
                  />
                  <span className="input-icon">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </span>
                </div>
                <small className="text-muted">(gg/MM/yyyy)</small>
                {errors.dataNascita && <div className="invalid-feedback">{errors.dataNascita}</div>}
              </div>
            </div>
            
            {/* Sesso */}
            <div className="form-group-row">
              <label className="form-label">Sesso*</label>
              <div className="form-input">
                <div className="d-flex">
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sesso"
                      id="sesso-maschio"
                      value="Maschio"
                      checked={formData.sesso === 'Maschio'}
                      onChange={handleInputChange}
                      disabled={!formData.isForeigner && formData.codiceFiscale}
                      tabIndex={4}
                    />
                    <label className="form-check-label" htmlFor="sesso-maschio">Maschio</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sesso"
                      id="sesso-femmina"
                      value="Femmina"
                      checked={formData.sesso === 'Femmina'}
                      onChange={handleInputChange}
                      disabled={!formData.isForeigner && formData.codiceFiscale}
                      tabIndex={5}
                    />
                    <label className="form-check-label" htmlFor="sesso-femmina">Femmina</label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prima cittadinanza */}
            <div className="form-group-row">
              <label htmlFor="primaCittadinanza" className="form-label">Prima cittadinanza*</label>
              <div className="form-input">
                <SearchableDropdown
                  options={NAZIONI}
                  value={formData.primaCittadinanza}
                  onChange={(value) => handleDropdownChange('primaCittadinanza', value)}
                  placeholder="Seleziona cittadinanza"
                  icon={<FontAwesomeIcon icon={faGlobe} />}
                  tabIndex={6}
                />
              </div>
            </div>
            
            {/* Nazione */}
            <div className="form-group-row">
              <label htmlFor="nazione" className="form-label">Nazione*</label>
              <div className="form-input">
                <SearchableDropdown
                  options={NAZIONI}
                  value={formData.nazione}
                  onChange={(value) => handleDropdownChange('nazione', value)}
                  placeholder="Seleziona nazione"
                  icon={<FontAwesomeIcon icon={faGlobe} />}
                  disabled={!formData.isForeigner && formData.codiceFiscale}
                  tabIndex={7}
                />
              </div>
            </div>
            
            {/* Provincia */}
            <div className="form-group-row">
              <label htmlFor="provincia" className="form-label">Provincia*</label>
              <div className="form-input">
                <SearchableDropdown
                  options={PROVINCE_ITALIANE}
                  value={formData.provincia}
                  onChange={(value) => handleDropdownChange('provincia', value)}
                  placeholder="Seleziona provincia"
                  icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
                  disabled={!formData.isForeigner && formData.codiceFiscale}
                  tabIndex={8}
                />
              </div>
            </div>
            
            {/* Comune/Città */}
            <div className="form-group-row">
              <label htmlFor="comuneCitta" className="form-label">Comune/Città*</label>
              <div className="form-input">
                <SearchableDropdown
                  options={cittaDisponibili}
                  value={formData.comuneCitta}
                  onChange={(value) => handleDropdownChange('comuneCitta', value)}
                  placeholder="Seleziona comune/città"
                  icon={<FontAwesomeIcon icon={faCity} />}
                  disabled={!formData.isForeigner && formData.codiceFiscale}
                  tabIndex={9}
                />
              </div>
            </div>
            
            {/* Codice Fiscale */}
            <div className="form-group-row">
              <label htmlFor="codiceFiscale" className="form-label">Codice Fiscale*</label>
              <div className="form-input">
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="input-animated bg-light"
                    id="codiceFiscale"
                    name="codiceFiscale"
                    value={formData.codiceFiscale}
                    readOnly
                    tabIndex={10}
                  />
                  <span className="input-icon">
                    <FontAwesomeIcon icon={faIdCard} />
                  </span>
                </div>
                <small className="text-muted">(calcolato se non indicato)</small>
              </div>
            </div>
          </form>
        </div>
        
        {/* Pulsanti */}
        <div className="buttons-container">
          <button
            type="button"
            className="btn-prev"
            onClick={goToPreviousStep}
            tabIndex={11}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            <span>Indietro</span>
          </button>
          
          <button
            type="button"
            className="btn-next"
            onClick={handleSubmit}
            tabIndex={12}
          >
            <span className="me-2">Avanti</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    );
  };
  
  // Funzione per renderizzare lo step corrente
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PrivacyNoticeStep />;
      case 2:
        return <FiscalCodeStep />;
      case 3:
        return <PersonalDataStep />;
      default:
        return (
          <div className="step-content">
            <h4 className="step-title">
              <FontAwesomeIcon icon={faUniversity} className="me-2" />
              Step {currentStep}
            </h4>
            <p className="text-center text-muted">Questo step non è ancora implementato.</p>
            <div className="buttons-container">
              <button
                className="btn-prev"
                onClick={goToPreviousStep}
                tabIndex={1}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Indietro
              </button>
              <button
                className="btn-next"
                onClick={goToNextStep}
                tabIndex={2}
              >
                Avanti
                <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="register-dropdown-container">
      <button
        className="register-button"
        onClick={toggleDropdown}
      >
        Registrati
      </button>
      
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="dropdown-menu-custom"
          onClick={handleDropdownClick}
        >
          <StepIndicator />
          <TransitionGroup>
            <CSSTransition
              key={currentStep}
              timeout={300}
              classNames="step-transition"
            >
              {renderCurrentStep()}
            </CSSTransition>
          </TransitionGroup>
          <FiscalCodeCalculator />
        </div>
      )}
    </div>
  );
};

export default RegisterDropdown;
