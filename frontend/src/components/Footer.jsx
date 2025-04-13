import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhone, faEnvelope, faGlobe, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="modern-footer-redesigned">
      {/* Rimossa la footer-wave come richiesto dall'utente */}
      
      <Container className="footer-container">
        <div className="footer-row">
          <div className="footer-col">
            <div className="footer-logo-area">
              <img src="https://via.placeholder.com/200x80/003366/ffffff?text=Parthenope" alt="Logo Università Parthenope" className="footer-logo" />
              <p className="footer-tagline">
                L'Università degli Studi di Napoli "Parthenope" è un'istituzione accademica con una lunga tradizione nell'istruzione superiore, focalizzata sulla ricerca e sulla formazione di qualità.
              </p>
            </div>
            <div className="footer-social">
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3 className="footer-heading">Link Utili</h3>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Chi Siamo
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Offerta Formativa
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Ricerca
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Servizi agli Studenti
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Orientamento
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Mobilità Internazionale
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3 className="footer-heading">Risorse</h3>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Biblioteca
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  E-Learning
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Calendario Accademico
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Bandi e Concorsi
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Albo Pretorio
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#" className="footer-link">
                  <FontAwesomeIcon icon={faChevronRight} className="footer-link-icon" />
                  Amministrazione Trasparente
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3 className="footer-heading">Contatti</h3>
            <ul className="contact-list">
              <li className="contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                <div className="contact-text">
                  Via Amm. F. Acton, 38 - 80133 Napoli (NA), Italia
                </div>
              </li>
              <li className="contact-item">
                <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                <div className="contact-text">
                  +39 081 123 4567
                </div>
              </li>
              <li className="contact-item">
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                <div className="contact-text">
                  info@uniparthenope.it
                </div>
              </li>
              <li className="contact-item">
                <FontAwesomeIcon icon={faGlobe} className="contact-icon" />
                <div className="contact-text">
                  www.uniparthenope.it
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      
      <Container>
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Università degli Studi di Napoli "Parthenope". Tutti i diritti riservati.
          </p>
          <div className="footer-nav">
            <a href="#" className="footer-nav-link">Privacy Policy</a>
            <a href="#" className="footer-nav-link">Cookie Policy</a>
            <a href="#" className="footer-nav-link">Note Legali</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
