import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminImmatricolazionePage.css';

const AdminImmatricolazionePage = () => {
  const navigate = useNavigate();
  const [immatricolazioneRequests, setImmatricolazioneRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentRequest, setCurrentRequest] = useState(null);
  const [matricola, setMatricola] = useState('012400');
  const [motivo, setMotivo] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchImmatricolazioneRequests();
  }, [filter]);

  const fetchImmatricolazioneRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/immatricolazione?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setImmatricolazioneRequests(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Errore durante il recupero delle richieste di immatricolazione');
      setLoading(false);
      console.error(err);
    }
  };

  const handleApproveClick = (request) => {
    setCurrentRequest(request);
    setMatricola('012400'); // Prefisso obbligatorio
    setShowApproveModal(true);
  };

  const handleRejectClick = (request) => {
    setCurrentRequest(request);
    setMotivo('');
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    try {
      if (matricola.length !== 10) {
        alert('La matricola deve essere di 10 caratteri');
        return;
      }
      
      if (!matricola.startsWith('012400')) {
        alert('La matricola deve iniziare con 012400');
        return;
      }
      
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/immatricolazione/${currentRequest._id}/approve`,
        { matricola },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      alert('Richiesta di immatricolazione approvata con successo!');
      setShowApproveModal(false);
      fetchImmatricolazioneRequests();
    } catch (err) {
      setError('Errore durante l\'approvazione della richiesta di immatricolazione');
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/immatricolazione/${currentRequest._id}/reject`,
        { motivo },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      alert('Richiesta di immatricolazione rifiutata con successo!');
      setShowRejectModal(false);
      fetchImmatricolazioneRequests();
    } catch (err) {
      setError('Errore durante il rifiuto della richiesta di immatricolazione');
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading) {
    return <div className="loading">Caricamento...</div>;
  }

  return (
    <div className="admin-immatricolazione-container">
      <h2 className="admin-immatricolazione-title">Richieste di Immatricolazione</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="admin-immatricolazione-filter">
        <label htmlFor="filter">Filtra per stato:</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="pending">In attesa</option>
          <option value="approved">Approvate</option>
          <option value="rejected">Rifiutate</option>
          <option value="">Tutte</option>
        </select>
      </div>
      
      {immatricolazioneRequests.length === 0 ? (
        <div className="admin-immatricolazione-empty">
          Nessuna richiesta di immatricolazione trovata.
        </div>
      ) : (
        <div className="admin-immatricolazione-list">
          <table className="admin-immatricolazione-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Email</th>
                <th>Tipo Immatricolazione</th>
                <th>Corso</th>
                <th>Stato</th>
                <th>Data Richiesta</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {immatricolazioneRequests.map(request => (
                <tr key={request._id}>
                  <td>{request.nome}</td>
                  <td>{request.cognome}</td>
                  <td>{request.email}</td>
                  <td>{request.tipoImmatricolazione}</td>
                  <td>{request.corsoId?.nome || 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${request.status}`}>
                      {request.status === 'pending' ? 'In attesa' : 
                       request.status === 'approved' ? 'Approvata' : 'Rifiutata'}
                    </span>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>
                    {request.status === 'pending' && (
                      <div className="admin-immatricolazione-actions">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApproveClick(request)}
                        >
                          Approva
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRejectClick(request)}
                        >
                          Rifiuta
                        </button>
                      </div>
                    )}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => navigate(`/admin/immatricolazione/${request._id}`)}
                    >
                      Dettagli
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal per approvazione */}
      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Approva Richiesta di Immatricolazione</h3>
            <p>
              Stai per approvare la richiesta di immatricolazione di{' '}
              <strong>{currentRequest.nome} {currentRequest.cognome}</strong>.
            </p>
            <div className="form-group">
              <label htmlFor="matricola">Matricola:</label>
              <input
                type="text"
                id="matricola"
                value={matricola}
                onChange={(e) => setMatricola(e.target.value)}
                maxLength={10}
                required
              />
              <small>La matricola deve iniziare con 012400 e avere 10 caratteri.</small>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-success"
                onClick={handleApprove}
              >
                Conferma
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowApproveModal(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal per rifiuto */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Rifiuta Richiesta di Immatricolazione</h3>
            <p>
              Stai per rifiutare la richiesta di immatricolazione di{' '}
              <strong>{currentRequest.nome} {currentRequest.cognome}</strong>.
            </p>
            <div className="form-group">
              <label htmlFor="motivo">Motivo del rifiuto:</label>
              <textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={4}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={handleReject}
              >
                Conferma
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowRejectModal(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImmatricolazionePage;
