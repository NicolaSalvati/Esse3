import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();

  // Mostra spinner durante il caricamento
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Verifica se l'utente è autenticato
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Se sono specificati ruoli consentiti, verifica se l'utente ha uno di questi ruoli
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // Reindirizza in base al ruolo dell'utente
    if (user.role === 'student') {
      return <Navigate to="/student" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'superadmin') {
      return <Navigate to="/superadmin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Se l'utente è autenticato e ha il ruolo corretto, mostra il contenuto
  return children;
};

export default ProtectedRoute;
