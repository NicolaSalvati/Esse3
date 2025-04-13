import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faSignOutAlt, faUser, faUserGraduate, faCog, faList, faCaretDown, faIdCard, faUserCog, faInfo, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';
import AuthDropdowns from './AuthDropdowns';
import '../styles/EnhancedAnimations.css';
import '../styles/CustomStyles.css';
import '../styles/DropdownStyles.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Effetto per rilevare lo scroll e aggiornare la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <Navbar 
        expand="lg" 
        className={`navbar-modern ${isScrolled ? 'scrolled' : ''}`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-modern">
            <FontAwesomeIcon icon={faGraduationCap} className="logo-icon-modern" />
            <span className="brand-text">UniparthenopeHub</span>
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            className="navbar-toggler-modern"
          >
            <div className="navbar-toggler-icon-modern">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Navbar.Toggle>
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto nav-menu-modern">
              <Nav.Link as={Link} to="/" className="nav-link-modern">Home</Nav.Link>
              
              {isAuthenticated() ? (
                <>
                  <div className="d-flex align-items-center ms-2">
                    <Nav.Link as={Link} to="/profile" className="nav-link-modern">
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
                  {/* Componenti dropdown per login e registrazione */}
                  <AuthDropdowns />
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
