import React from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faHeart } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer bg-dark text-white py-4 mt-auto">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-3 mb-md-0">
            <FontAwesomeIcon icon={faGraduationCap} size="lg" className="me-2 logo-icon" />
            <span className="fw-bold">ESSE3 Portal</span>
          </div>
          
          <div className="text-center mb-3 mb-md-0">
            <p className="mb-0">
              Sistema di Segreteria Studenti Universitaria
            </p>
          </div>
          
          <div className="text-center">
            <p className="mb-0">
              &copy; {currentYear} ESSE3 Portal. Tutti i diritti riservati.
            </p>
            <p className="mb-0 small">
              Creato con <FontAwesomeIcon icon={faHeart} className="text-danger mx-1" /> per l'università
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
