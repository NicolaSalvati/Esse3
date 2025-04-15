import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap, faUniversity, faBookOpen, faUserGraduate,
  faChalkboardTeacher, faCalendarAlt, faArrowRight, faArrowLeft,
  faMapMarkerAlt, faPhone, faEnvelope, faGlobe, faBuilding,
  faChevronRight, faUsers, faAward, faSchool, faClock,
  faBrain, faFlask, faLaptopCode, faHandshake, faLightbulb,
  faSearch, faGlobeEurope, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import UniversityStatistics from '../components/UniversityStatistics';
import { Link } from 'react-router-dom';
import '../styles/ModernHome.css';
import '../styles/CustomStyles.css';
import '../styles/EnhancedAnimations.css';
import '../styles/ImmersiveStyles.css';

// Componente principale della homepage
const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleElements, setVisibleElements] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Immagini per il carosello
  const carouselImages = [
    '/images/campus1.png',
    '/images/campus2.png',
    '/images/campus3.png',
    '/images/campus4.png',
    '/images/campus5.png',
    '/images/campus6.png'
  ];

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

  // Effetto per il cambio automatico delle slide del carosello
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000); // Cambia slide ogni 5 secondi

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Funzione per lo scroll alla sezione successiva
  const scrollToNextSection = () => {
    const nextSection = document.querySelector('.quick-access');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      {/* INIZIO SEZIONE MODIFICATA: Hero Section con carosello di immagini */}
      <section className="fullscreen-carousel">
        <div className="carousel-container">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="blue-overlay"></div>
            </div>
          ))}
          
          <div className="carousel-content">
            <div className="university-label">UNIVERSITÀ DEGLI STUDI DI NAPOLI PARTHENOPE</div>
            
            <div className="welcome-message-container">
              <h1 className="welcome-message">
                <span className="welcome-line-1">Il tuo <span className="highlight">percorso</span> nel mondo</span>
                <span className="welcome-line-2">con la nostra storia di</span>
                <span className="welcome-line-3">Conoscenza</span>
              </h1>
              
              <p className="welcome-subtitle">
                L'innovazione, l'imprenditorialità, l'immaginazione. <span className="highlight-text">Preparare gli studenti al futuro è la nostra missione.</span>
              </p>
            </div>
            
            <div className="carousel-buttons">
              <a href="/university-info" className="carousel-button primary">
                <span className="button-label">Informazioni dell'Università</span>
                <span className="button-year">STORIA E TRADIZIONE</span>
                <span className="button-arrow"><FontAwesomeIcon icon={faArrowRight} /></span>
              </a>
              
              <a href="/corsi" className="carousel-button secondary">
                <span className="button-label">Scopri i nostri corsi</span>
                <span className="button-year">OFFERTA FORMATIVA 2025/2026</span>
                <span className="button-arrow"><FontAwesomeIcon icon={faArrowRight} /></span>
              </a>
            </div>
          </div>
          
          <div className="scroll-indicator" onClick={scrollToNextSection}>
            <div className="scroll-icon"></div>
            <span>Scorri per esplorare</span>
          </div>
        </div>
      </section>
      {/* FINE SEZIONE MODIFICATA */}

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
