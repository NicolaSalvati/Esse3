import React from 'react';
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faSignOutAlt, faUser, faUserGraduate, faCog, faList } from '@fortawesome/free-solid-svg-icons';
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
      <Navbar bg="primary" variant="dark" expand="lg" className="navbar-animated py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faGraduationCap} size="lg" className="me-2 logo-icon" />
            <span className="fw-bold">ESSE3 Portal</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="nav-link-animated mx-1">Home</Nav.Link>
              
              {isAuthenticated() ? (
                <>
                  {user.role === 'student' && (
                    <Nav.Link as={Link} to="/student" className="nav-link-animated mx-1">Dashboard</Nav.Link>
                  )}
                  
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <>
                      <Nav.Link as={Link} to="/admin" className="nav-link-animated mx-1">
                        <FontAwesomeIcon icon={faCog} className="me-1" />
                        Dashboard
                      </Nav.Link>
                      <Nav.Link as={Link} to="/admin/matricole" className="nav-link-animated mx-1">
                        <FontAwesomeIcon icon={faUserGraduate} className="me-1" />
                        Gestione Matricole
                      </Nav.Link>
                      <Nav.Link as={Link} to="/admin/students" className="nav-link-animated mx-1">
                        <FontAwesomeIcon icon={faUserGraduate} className="me-1" />
                        Elenco Studenti
                      </Nav.Link>
                      <Nav.Link as={Link} to="/admin/immatricolazione" className="nav-link-animated mx-1">
                        <FontAwesomeIcon icon={faList} className="me-1" />
                        Richieste Immatricolazione
                      </Nav.Link>
                      <Nav.Link as={Link} to="/admin/facolta" className="nav-link-animated mx-1">
                        <FontAwesomeIcon icon={faGraduationCap} className="me-1" />
                        Gestione Facoltà
                      </Nav.Link>
                    </>
                  )}
                  
                  {user.role === 'superadmin' && (
                    <Nav.Link as={Link} to="/superadmin" className="nav-link-animated mx-1">Super Admin</Nav.Link>
                  )}
                  
                  <div className="d-flex align-items-center ms-2">
                    <Nav.Link as={Link} to="/profile" className="text-white me-3 nav-link-animated">
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      {user.name}
                    </Nav.Link>
                    <Button 
                      variant="outline-light" 
                      size="sm" 
                      onClick={handleLogout}
                      className="btn-animated"
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
