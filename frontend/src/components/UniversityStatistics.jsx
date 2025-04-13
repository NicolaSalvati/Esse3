import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGraduationCap, faUniversity, faGlobe } from '@fortawesome/free-solid-svg-icons';
import CountUp from 'react-countup';
import '../styles/CustomStyles.css';

const UniversityStatistics = () => {
  return (
    <section className="stats-section-improved">
      <Container className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title">Università Parthenope in Numeri</h2>
          <p className="stats-subtitle">
            Scopri i numeri che raccontano la nostra eccellenza accademica e il nostro impatto sulla comunità.
          </p>
        </div>
        
        <div className="stats-grid-improved">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-number">
              <CountUp end={12000} duration={2.5} separator="." />+
            </div>
            <div className="stat-label">Studenti</div>
            <p className="stat-description">
              Studenti iscritti ai nostri corsi di laurea triennale, magistrale e dottorato.
            </p>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <div className="stat-number">
              <CountUp end={63} duration={2.5} />
            </div>
            <div className="stat-label">Corsi di Laurea</div>
            <p className="stat-description">
              Corsi di laurea triennale, magistrale, master e dottorati di ricerca.
            </p>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUniversity} />
            </div>
            <div className="stat-number">
              <CountUp end={7} duration={2.5} />
            </div>
            <div className="stat-label">Dipartimenti</div>
            <p className="stat-description">
              Dipartimenti che coprono diverse aree disciplinari e di ricerca.
            </p>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <div className="stat-number">
              <CountUp end={120} duration={2.5} />+
            </div>
            <div className="stat-label">Partner Internazionali</div>
            <p className="stat-description">
              Università e istituzioni partner in tutto il mondo per scambi e collaborazioni.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UniversityStatistics;
