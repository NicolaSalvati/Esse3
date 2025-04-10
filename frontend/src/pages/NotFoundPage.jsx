import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0 rounded-lg animate-fadeInUp">
              <Card.Body className="text-center p-5">
                <div className="not-found-code">404</div>
                <FontAwesomeIcon icon={faExclamationTriangle} size="4x" className="text-warning mb-4" />
                <h2 className="not-found-message">Pagina non trovata</h2>
                <p className="mb-4">
                  La pagina che stai cercando non esiste o è stata spostata.
                </p>
                <Link to="/" className="btn btn-primary btn-lg btn-animated hover-lift">
                  Torna alla Home
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFoundPage;
