import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer mt-auto py-5">
      <Container>
        <Row className="footer-content">
          <Col lg={4} md={6} className="mb-4">
            <div className="mb-4">
              <h3 className="text-white d-flex align-items-center">
                <FontAwesomeIcon icon={faGraduationCap} size="lg" className="me-2" />
                UniparthenopeHub
              </h3>
              <p className="text-white-50">
                Il portale ufficiale dell'Università Parthenope di Napoli per la gestione delle immatricolazioni e dei servizi agli studenti.
              </p>
            </div>
            <div className="footer-social">
              <a href="https://facebook.com" className="footer-social-icon" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://twitter.com" className="footer-social-icon" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://instagram.com" className="footer-social-icon" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://linkedin.com" className="footer-social-icon" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-heading text-white">Link Rapidi</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/immatricolazione" className="footer-link">Immatricolazione</a></li>
              <li><a href="/login" className="footer-link">Accedi</a></li>
              <li><a href="/register" className="footer-link">Registrati</a></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-heading text-white">Corsi di Laurea</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Informatica</a></li>
              <li><a href="#" className="footer-link">Economia Aziendale</a></li>
              <li><a href="#" className="footer-link">Ingegneria Informatica</a></li>
              <li><a href="#" className="footer-link">Scienze Nautiche</a></li>
              <li><a href="#" className="footer-link">Giurisprudenza</a></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-heading text-white">Contatti</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                <span className="text-white-50">Via Acton, 38, 80133 Napoli NA</span>
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
                <span className="text-white-50">+39 081 123 4567</span>
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                <span className="text-white-50">info@uniparthenope.it</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <p className="mb-0">
            &copy; {currentYear} UniparthenopeHub - Università degli Studi di Napoli "Parthenope". Tutti i diritti riservati.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
