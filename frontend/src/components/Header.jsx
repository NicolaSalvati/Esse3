import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faSignOutAlt, faUser, faUserGraduate, faCog, faList, faCaretDown, faIdCard, faUserCog, faInfo, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <Navbar bg="primary" variant="dark" expand="lg" className="navbar-animated glass-navbar py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faGraduationCap} size="lg" className="me-2 logo-icon" />
            <span className="fw-bold">UniparthenopeHub</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="nav-link-animated mx-1">Home</Nav.Link>
              
              {isAuthenticated() ? (
                <>
                  <div className="d-flex align-items-center ms-2">
                    <Nav.Link as={Link} to="/profile" className="text-white me-3 nav-link-animated">
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      {user.name}
                    </Nav.Link>
                    
                    {/* Menu per tutti gli utenti */}
                    <Dropdown className="me-2">
                      <Dropdown.Toggle variant="outline-light" size="sm" className="btn-animated glass-btn">
                        <FontAwesomeIcon icon={faUserGraduate} className="me-1" />
                        Menu <FontAwesomeIcon icon={faCaretDown} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="glass-dropdown">
                        <Dropdown.Item as={Link} to="/immatricolazione">
                          <FontAwesomeIcon icon={faIdCard} className="me-2" />
                          Immatricolazione
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/profile">
                          <FontAwesomeIcon icon={faUserCog} className="me-2" />
                          Gestione Profilo
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/info-universita">
                          <FontAwesomeIcon icon={faUniversity} className="me-2" />
                          Info Università
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    
                    {/* Menu Admin aggiuntivo */}
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <Dropdown className="me-2">
                        <Dropdown.Toggle variant="outline-light" size="sm" className="btn-animated glass-btn">
                          <FontAwesomeIcon icon={faCog} className="me-1" />
                          Admin <FontAwesomeIcon icon={faCaretDown} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="glass-dropdown">
                          <Dropdown.Item as={Link} to="/admin/immatricolazione">
                            <FontAwesomeIcon icon={faList} className="me-2" />
                            Richieste Immatricolazione
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/admin/matricole">
                            <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                            Gestione Matricole
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/admin/students">
                            <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                            Elenco Studenti
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/admin/facolta">
                            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                            Gestione Facoltà
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    
                    {/* Menu Teacher aggiuntivo */}
                    {user.role === 'teacher' && (
                      <Dropdown className="me-2">
                        <Dropdown.Toggle variant="outline-light" size="sm" className="btn-animated glass-btn">
                          <FontAwesomeIcon icon={faUserGraduate} className="me-1" />
                          Docente <FontAwesomeIcon icon={faCaretDown} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="glass-dropdown">
                          <Dropdown.Item as={Link} to="/teacher/courses">
                            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                            I Miei Corsi
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/teacher/students">
                            <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                            I Miei Studenti
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    
                    <Button 
                      variant="outline-light" 
                      size="sm" 
                      onClick={handleLogout}
                      className="btn-animated glass-btn"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="nav-link-animated mx-1">Accedi</Nav.Link>
                  <Nav.Link as={Link} to="/register" className="nav-link-animated mx-1">Registrati</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
