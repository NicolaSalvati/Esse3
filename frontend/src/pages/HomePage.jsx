import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, faUniversity, faBookOpen, faUserGraduate, 
  faChalkboardTeacher, faCalendarAlt, faArrowRight, faArrowLeft,
  faMapMarkerAlt, faPhone, faEnvelope, faGlobe, faBuilding,
  faChevronRight, faUsers, faAward, faSchool, faClock,
  faBrain, faFlask, faLaptopCode, faHandshake
} from '@fortawesome/free-solid-svg-icons';
import UniversityStatistics from '../components/UniversityStatistics';
import { Link } from 'react-router-dom';
import '../styles/ModernHome.css';
import '../styles/CustomStyles.css';
import '../styles/EnhancedAnimations.css';

// Componente per le stelle scintillanti
const StarryBackground = () => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const starCount = 50;
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${Math.random() * 3 + 1}px`,
          duration: `${Math.random() * 3 + 2}s`,
          delay: `${Math.random() * 2}s`
        });
      }
      
      setStars(newStars);
    };
    
    generateStars();
  }, []);
  
  return (
    <div className="hero-stars">
      {stars.map(star => (
        <div 
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.duration,
            animationDelay: star.delay,
            '--duration': star.duration
          }}
        />
      ))}
    </div>
  );
};

// Componente principale della homepage
const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleElements, setVisibleElements] = useState({});
  const heroRef = useRef(null);
  
  // Effetto per rilevare lo scroll e aggiornare la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Effetto per le animazioni della hero section
  useEffect(() => {
    if (heroRef.current) {
      const heroElements = heroRef.current.querySelectorAll('.animate-element');
      heroElements.forEach((el, index) => {
        el.style.animationDelay = `${0.3 * (index + 1)}s`;
        el.classList.add('animate-fadeIn');
      });
      
      // Crea stelle scintillanti
      const createStars = () => {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'hero-stars';
        
        for (let i = 0; i < 50; i++) {
          const star = document.createElement('div');
          star.className = 'star';
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 100}%`;
          star.style.width = `${Math.random() * 3 + 1}px`;
          star.style.height = star.style.width;
          star.style.animationDuration = `${Math.random() * 3 + 2}s`;
          star.style.animationDelay = `${Math.random() * 2}s`;
          star.style.setProperty('--duration', star.style.animationDuration);
          
          starsContainer.appendChild(star);
        }
        
        heroRef.current.appendChild(starsContainer);
      };
      
      createStars();
    }
  }, []);

  // Dati di esempio per le notizie
  const newsData = [
    {
      title: "Bando per la selezione di collaborazioni part-time A.A. 2023/2024",
      excerpt: "IX° avviso di convocazione per la selezione di collaborazioni part-time per l'anno accademico 2023/2024.",
      date: "11 Aprile 2025",
      image: "https://via.placeholder.com/600x400/003366/ffffff?text=Bando+Part-Time",
      link: "/news/1"
    },
    {
      title: "Elezioni RSU del 14-15 e 16 aprile 2025",
      excerpt: "Si terranno nei giorni 14, 15 e 16 aprile 2025 le elezioni per il rinnovo delle Rappresentanze Sindacali Unitarie.",
      date: "9 Aprile 2025",
      image: "https://via.placeholder.com/600x400/003366/ffffff?text=Elezioni+RSU",
      link: "/news/2"
    },
    {
      title: "Apertura Immatricolazioni A.A. 2025/2026",
      excerpt: "Sono aperte le immatricolazioni per l'anno accademico 2025/2026. Scopri la nostra offerta formativa.",
      date: "1 Aprile 2025",
      image: "https://via.placeholder.com/600x400/003366/ffffff?text=Immatricolazioni",
      link: "/news/3"
    }
  ];

  // Dati per i servizi rapidi
  const quickServices = [
    {
      icon: faCalendarAlt,
      title: "Calendario Esami",
      description: "Consulta il calendario degli esami e prenota il tuo appello",
      link: "/calendario-esami"
    },
    {
      icon: faBookOpen,
      title: "Offerta Formativa",
      description: "Esplora i corsi di laurea e l'offerta formativa completa",
      link: "/offerta-formativa"
    },
    {
      icon: faUsers,
      title: "Orientamento",
      description: "Servizi di orientamento per le future matricole",
      link: "/orientamento"
    },
    {
      icon: faAward,
      title: "Borse di Studio",
      description: "Informazioni su borse di studio e agevolazioni",
      link: "/borse-di-studio"
    },
    {
      icon: faSchool,
      title: "Segreteria",
      description: "Contatta la segreteria studenti per informazioni",
      link: "/segreteria"
    },
    {
      icon: faGlobe,
      title: "Mobilità Internazionale",
      description: "Scopri le opportunità di studio all'estero e i programmi di scambio",
      link: "/mobilita"
    },
    {
      icon: faUserGraduate,
      title: "Career Service",
      description: "Trova stage, tirocini e opportunità di lavoro per il tuo futuro professionale",
      link: "/career"
    },
    {
      icon: faUniversity,
      title: "Biblioteca Digitale",
      description: "Accedi a migliaia di risorse digitali, e-book, riviste e articoli scientifici",
      link: "/biblioteca"
    }
  ];

  return (
    <div className="modern-home">
      {/* Hero Section con animazioni avanzate - Rimossa hero-wave come richiesto */}
      <section className="hero-section-animated" ref={heroRef}>
        <div className="hero-particles"></div>
        <StarryBackground />
        <Container>
          <div className="row align-items-center">
            <div className="col-lg-7 hero-content">
              <h1 className="hero-title animate-element">
                <span className="text-highlight">Benvenuto</span> all'Università Parthenope
              </h1>
              <p className="hero-subtitle animate-element">
                Un'istituzione accademica d'eccellenza con una lunga tradizione nell'istruzione superiore, 
                focalizzata sulla ricerca e sulla formazione di qualità.
              </p>
              <div className="hero-features animate-element">
                <div className="hero-feature">
                  <div className="hero-feature-icon">
                    <FontAwesomeIcon icon={faUserGraduate} />
                  </div>
                  <div className="hero-feature-text">Eccellenza Accademica</div>
                </div>
                <div className="hero-feature">
                  <div className="hero-feature-icon">
                    <FontAwesomeIcon icon={faGlobe} />
                  </div>
                  <div className="hero-feature-text">Prospettiva Internazionale</div>
                </div>
                <div className="hero-feature">
                  <div className="hero-feature-icon">
                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                  </div>
                  <div className="hero-feature-text">Docenti Qualificati</div>
                </div>
              </div>
              <div className="hero-buttons animate-element">
                <a href="/offerta-formativa" className="btn btn-primary-modern me-3">
                  Scopri i Corsi
                </a>
                <a href="/about" className="btn btn-outline-modern">
                  Chi Siamo
                </a>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block hero-image animate-element">
              <div className="hero-image-container">
                <img 
                  src="https://via.placeholder.com/600x400/003366/ffffff?text=Università+Parthenope" 
                  alt="Università Parthenope" 
                  className="img-fluid rounded shadow-lg"
                />
                <div className="hero-image-decoration"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Accesso Rapido ai Servizi con animazioni avanzate */}
      <section className="quick-access py-5">
        <Container>
          <h2 className="text-center section-title mb-5">Accesso Rapido ai Servizi</h2>
          <div className="services-grid">
            {quickServices.map((service, index) => (
              <div className="service-card-enhanced" key={index}>
                <div className="service-icon-container">
                  <FontAwesomeIcon icon={service.icon} className="service-icon-enhanced" />
                </div>
                <h3 className="service-title-enhanced">{service.title}</h3>
                <p className="service-description-enhanced">
                  {service.description}
                </p>
                <Link to={service.link} className="service-link-enhanced">
                  Scopri di più <FontAwesomeIcon icon={faArrowRight} className="service-link-icon ms-1" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Offerta Formativa con animazioni avanzate */}
      <section className="courses-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Offerta Formativa</h2>
            <p className="lead text-muted">
              Scopri i percorsi formativi offerti dall'Università Parthenope per costruire il tuo futuro accademico e professionale.
            </p>
          </div>
          
          <div className="courses-preview">
            <div className="row">
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="course-preview-card-enhanced">
                  <div className="course-preview-icon-container">
                    <FontAwesomeIcon icon={faGraduationCap} className="course-preview-icon-enhanced" />
                  </div>
                  <h3 className="course-preview-title-enhanced">Lauree Triennali</h3>
                  <p className="course-preview-count-enhanced">25 corsi disponibili</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="course-preview-card-enhanced">
                  <div className="course-preview-icon-container">
                    <FontAwesomeIcon icon={faUniversity} className="course-preview-icon-enhanced" />
                  </div>
                  <h3 className="course-preview-title-enhanced">Lauree Magistrali</h3>
                  <p className="course-preview-count-enhanced">18 corsi disponibili</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="course-preview-card-enhanced">
                  <div className="course-preview-icon-container">
                    <FontAwesomeIcon icon={faBookOpen} className="course-preview-icon-enhanced" />
                  </div>
                  <h3 className="course-preview-title-enhanced">Master</h3>
                  <p className="course-preview-count-enhanced">12 corsi disponibili</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="course-preview-card-enhanced">
                  <div className="course-preview-icon-container">
                    <FontAwesomeIcon icon={faAward} className="course-preview-icon-enhanced" />
                  </div>
                  <h3 className="course-preview-title-enhanced">Dottorati</h3>
                  <p className="course-preview-count-enhanced">8 corsi disponibili</p>
                </div>
              </div>
            </div>
            <div className="courses-button-container text-center mt-4">
              <Link to="/offerta-formativa" className="btn-courses-enhanced">
                Esplora Tutti i Corsi <FontAwesomeIcon icon={faArrowRight} className="btn-courses-icon ms-2" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Statistiche Università */}
      <UniversityStatistics />

      {/* Eventi in Evidenza con animazioni avanzate */}
      <section className="events-section-enhanced">
        <Container>
          <div className="events-header">
            <h2 className="events-title">Eventi in Evidenza</h2>
            <p className="events-subtitle">
              Scopri gli eventi più importanti organizzati dall'Università Parthenope.
            </p>
          </div>
          
          <div className="events-preview">
            <div className="row">
              {newsData.slice(0, 3).map((event, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <div className="event-preview-card-enhanced">
                    <div className="event-preview-image-enhanced">
                      <img src={event.image} alt={event.title} />
                      <div className="event-preview-date-enhanced">{event.date}</div>
                    </div>
                    <div className="event-preview-content-enhanced">
                      <h3 className="event-preview-title-enhanced">{event.title}</h3>
                      <p className="event-preview-excerpt-enhanced">{event.excerpt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="events-button-container">
              <Link to="/eventi" className="btn-events-enhanced">
                Tutti gli Eventi <FontAwesomeIcon icon={faArrowRight} className="btn-events-icon ms-2" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
