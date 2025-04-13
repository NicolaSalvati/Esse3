import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUniversity, faMapMarkerAlt, faHistory, faGraduationCap,
  faBuilding, faBook, faArrowRight, faGlobe, faUsers,
  faArrowLeft, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import '../styles/ImmersiveStyles.css';
import '../styles/CustomStyles.css';
import '../styles/UniversityInfo.css';

const UniversityInfo = () => {
  const [activeSection, setActiveSection] = useState('storia');
  const [visibleElements, setVisibleElements] = useState({});
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const campusesScrollRef = useRef(null);
  const coursesScrollRef = useRef(null);

  // Immagini per l'hero carousel
  const heroImages = [
    '/images/campus1.png',
    '/images/campus2.png',
    '/images/campus3.png',
    '/images/campus4.png',
    '/images/campus5.png',
    '/images/campus6.png'
  ];

  // Effetto per le animazioni di scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
            
            // Aggiungi classe di animazione
            if (entry.target.classList.contains('animate-element')) {
              entry.target.classList.add('animate-fadeIn');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-reveal, .animate-element');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Effetto per il cambio automatico dell'immagine hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Dati delle sedi
  const campuses = [
    {
      name: "Sede Centrale",
      address: "Via Amm. F. Acton, 38 - 80133 Napoli",
      description: "La sede centrale dell'Università Parthenope si trova nel cuore di Napoli, affacciata sul mare. Ospita la Presidenza, gli uffici amministrativi e alcune facoltà.",
      image: "/images/campus4.png",
      coordinates: { lat: 40.8350, lng: 14.2465 },
      courses: [
        "Economia Aziendale",
        "Economia e Commercio",
        "Management delle Imprese Internazionali",
        "Statistica e Informatica per la Gestione delle Imprese",
        "Giurisprudenza"
      ]
    },
    {
      name: "Sede di Villa Doria d'Angri",
      address: "Via Petrarca, 80 - 80122 Napoli",
      description: "Villa Doria d'Angri è una storica dimora nobiliare situata sulla collina di Posillipo, con una vista mozzafiato sul Golfo di Napoli. Ospita eventi, conferenze e alcune attività didattiche.",
      image: "/images/campus1.png",
      coordinates: { lat: 40.8308, lng: 14.2170 },
      courses: [
        "Management delle Imprese Turistiche",
        "Fashion, Art and Food Management",
        "Scienze della Comunicazione"
      ]
    },
    {
      name: "Polo di Ingegneria",
      address: "Centro Direzionale, Isola C4 - 80143 Napoli",
      description: "Il Polo di Ingegneria si trova nel moderno Centro Direzionale di Napoli e ospita i corsi di laurea in Ingegneria e Informatica, con laboratori all'avanguardia.",
      image: "/images/campus2.png",
      coordinates: { lat: 40.8531, lng: 14.2880 },
      courses: [
        "Ingegneria Gestionale",
        "Ingegneria Civile",
        "Ingegneria Informatica",
        "Ingegneria delle Tecnologie della Comunicazione",
        "Informatica"
      ]
    },
    {
      name: "Polo di Economia",
      address: "Via Generale Parisi, 13 - 80132 Napoli",
      description: "Il Polo di Economia ospita i corsi di laurea in Economia, Management e Scienze Aziendali, con moderne aule e spazi per lo studio.",
      image: "/images/campus6.png",
      coordinates: { lat: 40.8380, lng: 14.2520 },
      courses: [
        "Economia e Management",
        "Amministrazione e Consulenza Aziendale",
        "Management Pubblico",
        "Scienze dell'Amministrazione e dell'Organizzazione"
      ]
    },
    {
      name: "Sede Nola",
      address: "Via Nola, 26 - 80035 Nola (NA)",
      description: "La sede di Nola è un moderno complesso che ospita alcuni corsi di laurea e master, offrendo agli studenti dell'area nolana un punto di riferimento accademico di eccellenza.",
      image: "/images/campus5.png",
      coordinates: { lat: 40.9267, lng: 14.5267 },
      courses: [
        "Scienze Motorie",
        "Management dello Sport e delle Attività Motorie",
        "Economia delle Aziende Turistiche"
      ]
    },
    {
      name: "Sede Via Medina",
      address: "Via Medina, 40 - 80133 Napoli",
      description: "La sede di Via Medina, situata nel centro storico di Napoli, ospita alcuni dipartimenti e offre spazi per la didattica e la ricerca in un contesto ricco di storia e cultura.",
      image: "/images/campus3.png",
      coordinates: { lat: 40.8400, lng: 14.2520 },
      courses: [
        "Scienze Biologiche",
        "Scienze Nautiche ed Aeronautiche",
        "Scienze Ambientali",
        "Biologia per la Sostenibilità"
      ]
    }
  ];

  // Funzioni per lo scorrimento orizzontale
  const scrollCampuses = (direction) => {
    if (campusesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      campusesScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Funzione per lo scorrimento orizzontale dei corsi
  const scrollCourses = (direction) => {
    if (coursesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      coursesScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Funzione per inizializzare la mappa con i marker
  useEffect(() => {
    if (activeSection === 'sedi') {
      // Carica lo script di Google Maps solo quando necessario
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAGGwAa1xhc_Xalb2hpp94sn4yA8i9kJXc&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Definisci la funzione di callback globale
      window.initMap = function() {
        const mapElement = document.getElementById('campus-map');
        if (mapElement) {
          const map = new window.google.maps.Map(mapElement, {
            center: { lat: 40.8350, lng: 14.2465 }, // Centro di Napoli
            zoom: 12
          });
          
          // Aggiungi marker per ogni sede
          campuses.forEach(campus => {
            const marker = new window.google.maps.Marker({
              position: campus.coordinates,
              map: map,
              title: campus.name
            });
            
            // Aggiungi info window per ogni marker
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="max-width: 200px;">
                  <h5 style="margin: 0; padding: 5px 0;">${campus.name}</h5>
                  <p style="margin: 5px 0; font-size: 12px;">${campus.address}</p>
                </div>
              `
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          });
        }
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Rimuovi lo script quando il componente viene smontato
        document.head.removeChild(script);
        delete window.initMap;
      };
    }
  }, [activeSection]);

  return (
    <div className="university-info-page">
      {/* Hero Section con Carousel */}
      <section className="university-info-hero">
        <div className="hero-carousel">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentHeroImage ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <Container>
          <div className="hero-content">
            <h1 className="animate-element">Università degli Studi di Napoli Parthenope</h1>
            <p className="animate-element">Tradizione, Innovazione e Futuro nel cuore del Mediterraneo</p>
          </div>
        </Container>
      </section>

      {/* Navigation Tabs */}
      <section className="info-navigation">
        <Container>
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeSection === 'storia' ? 'active' : ''}`}
              onClick={() => setActiveSection('storia')}
            >
              <FontAwesomeIcon icon={faHistory} className="tab-icon" />
              <span>La Nostra Storia</span>
            </button>
            <button
              className={`nav-tab ${activeSection === 'sedi' ? 'active' : ''}`}
              onClick={() => setActiveSection('sedi')}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="tab-icon" />
              <span>Le Nostre Sedi</span>
            </button>
            <button
              className={`nav-tab ${activeSection === 'corsi' ? 'active' : ''}`}
              onClick={() => setActiveSection('corsi')}
            >
              <FontAwesomeIcon icon={faGraduationCap} className="tab-icon" />
              <span>I Nostri Corsi</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Storia Section */}
      <section className={`info-section ${activeSection === 'storia' ? 'active' : ''}`} id="storia">
        <Container>
          <div className="section-header">
            <h2 className="animate-element">La Nostra Storia</h2>
            <div className="section-divider"></div>
          </div>
          
          <Row className="align-items-center mb-5">
            <Col md={6} className="animate-element">
              <div className="history-content">
                <h3>Dalle origini ad oggi</h3>
                <p>
                  L'Università degli Studi di Napoli "Parthenope" ha una storia che affonda le sue radici nel lontano 1920, quando venne istituito il Regio Istituto Superiore Navale, con lo scopo di formare i quadri superiori della Marina Mercantile e Militare.
                </p>
                <p>
                  Nel 1999, l'Istituto Universitario Navale è stato trasformato in Università degli Studi di Napoli "Parthenope", ampliando la propria offerta formativa ben oltre l'ambito navale originario, per abbracciare discipline economiche, giuridiche, ingegneristiche e scientifiche.
                </p>
                <p>
                  Oggi l'Università Parthenope è un ateneo moderno e dinamico, che coniuga la tradizione con l'innovazione, offrendo percorsi formativi di eccellenza e promuovendo la ricerca scientifica in numerosi ambiti disciplinari.
                </p>
              </div>
            </Col>
            <Col md={6} className="animate-element">
              <div className="video-container">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/VIV2xFIhrAc"
                  title="Video Università Parthenope"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-5">
            <Col md={12} className="animate-element">
              <div className="history-timeline">
                <div className="timeline-item">
                  <div className="timeline-year">1920</div>
                  <div className="timeline-content">
                    <h4>Fondazione del Regio Istituto Superiore Navale</h4>
                    <p>Nasce a Napoli il Regio Istituto Superiore Navale, con lo scopo di formare i quadri superiori della Marina Mercantile e Militare.</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">1940</div>
                  <div className="timeline-content">
                    <h4>Trasformazione in Istituto Universitario Navale</h4>
                    <p>L'istituto viene trasformato in Istituto Universitario Navale, ampliando la propria offerta formativa.</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">1999</div>
                  <div className="timeline-content">
                    <h4>Nascita dell'Università Parthenope</h4>
                    <p>L'Istituto Universitario Navale diventa Università degli Studi di Napoli "Parthenope", con un'offerta formativa che spazia dalle scienze nautiche all'economia, dall'ingegneria al diritto.</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">2016</div>
                  <div className="timeline-content">
                    <h4>Riorganizzazione dei Dipartimenti</h4>
                    <p>L'Ateneo si riorganizza in cinque Dipartimenti, rafforzando la propria identità e migliorando l'offerta didattica e di ricerca.</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">Oggi</div>
                  <div className="timeline-content">
                    <h4>Un'università moderna e internazionale</h4>
                    <p>L'Università Parthenope è oggi un ateneo moderno, con oltre 13.000 studenti, impegnato nella ricerca scientifica e nell'innovazione didattica, con numerosi accordi internazionali e collaborazioni con il mondo delle imprese.</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sedi Section */}
      <section className={`info-section ${activeSection === 'sedi' ? 'active' : ''}`} id="sedi">
        <Container>
          <div className="section-header">
            <h2 className="animate-element">Le Nostre Sedi</h2>
            <div className="section-divider"></div>
          </div>
          
          <p className="section-intro animate-element">
            L'Università Parthenope è presente sul territorio napoletano con diverse sedi, ciascuna con caratteristiche uniche e dedicate a specifici ambiti di studio e ricerca.
          </p>
          
          <div className="horizontal-scroll-controls">
            <button className="scroll-button left" onClick={() => scrollCampuses('left')}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="horizontal-scroll-container" ref={campusesScrollRef}>
              {campuses.map((campus, index) => (
                <div className="campus-card animate-element" key={index}>
                  <div className="campus-image">
                    <img src={campus.image} alt={campus.name} />
                  </div>
                  <div className="campus-content">
                    <h3>{campus.name}</h3>
                    <p className="campus-address">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="address-icon" />
                      {campus.address}
                    </p>
                    <p className="campus-description">{campus.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scrollCampuses('right')}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          
          <div className="campus-map animate-element">
            <h3>Mappa delle Sedi</h3>
            <div className="map-container">
              {/* La mappa verrà inizializzata qui tramite JavaScript */}
              <div id="campus-map" style={{ width: '100%', height: '450px' }}></div>
              
              {/* Fallback per la mappa in caso di problemi con l'API */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3019.9538782046387!2d14.246525776068344!3d40.83499597137745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b0a3c35d5b7f9%3A0x3f6c01f0e032fccc!2sUniversit%C3%A0%20degli%20Studi%20di%20Napoli%20Parthenope!5e0!3m2!1sit!2sit!4v1681400292826!5m2!1sit!2sit"
                width="100%"
                height="450"
                style={{ border: 0, display: 'none' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa delle sedi dell'Università Parthenope"
                id="fallback-map"
              ></iframe>
            </div>
          </div>
        </Container>
      </section>

      {/* Corsi Section */}
      <section className={`info-section ${activeSection === 'corsi' ? 'active' : ''}`} id="corsi">
        <Container>
          <div className="section-header">
            <h2 className="animate-element">I Nostri Corsi</h2>
            <div className="section-divider"></div>
          </div>
          
          <p className="section-intro animate-element">
            L'Università Parthenope offre un'ampia gamma di corsi di laurea triennale, magistrale e dottorati di ricerca, organizzati nelle diverse sedi. Scopri l'offerta formativa completa e trova il percorso più adatto alle tue aspirazioni.
          </p>
          
          <div className="horizontal-scroll-controls">
            <button className="scroll-button left" onClick={() => scrollCourses('left')}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="horizontal-scroll-container" ref={coursesScrollRef}>
              {campuses.map((campus, index) => (
                <div className="campus-courses-card animate-element" key={index}>
                  <div className="campus-courses-header">
                    <div className="campus-icon">
                      <img src={campus.image} alt={campus.name} />
                    </div>
                    <h3>{campus.name}</h3>
                  </div>
                  <div className="campus-courses-content">
                    <ul className="courses-list">
                      {campus.courses.map((course, idx) => (
                        <li key={idx}>{course}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scrollCourses('right')}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          
          <div className="courses-cta animate-element">
            <h3>Pronto a iniziare il tuo percorso accademico?</h3>
            <p>Esplora tutti i nostri corsi di laurea e trova quello più adatto alle tue aspirazioni e ai tuoi obiettivi professionali.</p>
            <a href="/corsi" className="btn-courses">
              Esplora l'Offerta Formativa <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default UniversityInfo;
