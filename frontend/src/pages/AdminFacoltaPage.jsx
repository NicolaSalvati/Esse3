import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminFacoltaPage.css';

const AdminFacoltaPage = () => {
  const navigate = useNavigate();
  const [facolta, setFacolta] = useState([]);
  const [corsi, setCorsi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showAddFacoltaModal, setShowAddFacoltaModal] = useState(false);
  const [showEditFacoltaModal, setShowEditFacoltaModal] = useState(false);
  const [showAddCorsoModal, setShowAddCorsoModal] = useState(false);
  
  const [currentFacolta, setCurrentFacolta] = useState(null);
  const [newFacolta, setNewFacolta] = useState({
    nome: '',
    descrizione: ''
  });
  
  const [newCorso, setNewCorso] = useState({
    nome: '',
    codice: '',
    durata: 3,
    dipartimento: '',
    descrizione: ''
  });

  useEffect(() => {
    fetchFacolta();
    fetchCorsi();
  }, []);

  const fetchFacolta = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/facolta`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setFacolta(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Errore durante il recupero delle facoltà');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchCorsi = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/corsi`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCorsi(response.data.data);
    } catch (err) {
      console.error('Errore durante il recupero dei corsi:', err);
    }
  };

  const handleAddFacolta = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/facolta`,
        newFacolta,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setFacolta([...facolta, response.data.data]);
      setShowAddFacoltaModal(false);
      setNewFacolta({
        nome: '',
        descrizione: ''
      });
      
      alert('Facoltà aggiunta con successo!');
    } catch (err) {
      setError('Errore durante l\'aggiunta della facoltà');
      console.error(err);
    }
  };

  const handleUpdateFacolta = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/facolta/${currentFacolta._id}`,
        currentFacolta,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const updatedFacolta = facolta.map(f => 
        f._id === currentFacolta._id ? response.data.data : f
      );
      
      setFacolta(updatedFacolta);
      setShowEditFacoltaModal(false);
      
      alert('Facoltà aggiornata con successo!');
    } catch (err) {
      setError('Errore durante l\'aggiornamento della facoltà');
      console.error(err);
    }
  };

  const handleDeleteFacolta = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa facoltà?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/facolta/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const updatedFacolta = facolta.filter(f => f._id !== id);
      setFacolta(updatedFacolta);
      
      alert('Facoltà eliminata con successo!');
    } catch (err) {
      setError('Errore durante l\'eliminazione della facoltà');
      console.error(err);
    }
  };

  const handleAddCorsoToFacolta = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Prima creiamo il corso
      const corsoResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/corsi`,
        newCorso,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const corsoId = corsoResponse.data.data._id;
      
      // Poi lo aggiungiamo alla facoltà
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/facolta/${currentFacolta._id}/addcorso`,
        { corsoId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Aggiorniamo lo stato
      fetchFacolta();
      fetchCorsi();
      
      setShowAddCorsoModal(false);
      setNewCorso({
        nome: '',
        codice: '',
        durata: 3,
        dipartimento: '',
        descrizione: ''
      });
      
      alert('Corso aggiunto con successo!');
    } catch (err) {
      setError('Errore durante l\'aggiunta del corso');
      console.error(err);
    }
  };

  const handleRemoveCorsoFromFacolta = async (facoltaId, corsoId) => {
    if (!confirm('Sei sicuro di voler rimuovere questo corso dalla facoltà?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/facolta/${facoltaId}/removecorso`,
        { corsoId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Aggiorniamo lo stato
      fetchFacolta();
      
      alert('Corso rimosso con successo!');
    } catch (err) {
      setError('Errore durante la rimozione del corso');
      console.error(err);
    }
  };

  const handleEditFacoltaClick = (facolta) => {
    setCurrentFacolta(facolta);
    setShowEditFacoltaModal(true);
  };

  const handleAddCorsoClick = (facolta) => {
    setCurrentFacolta(facolta);
    setShowAddCorsoModal(true);
  };

  const handleInputChange = (e, stateSetter, stateObj) => {
    const { name, value } = e.target;
    stateSetter({
      ...stateObj,
      [name]: value
    });
  };

  if (loading) {
    return <div className="loading">Caricamento...</div>;
  }

  return (
    <div className="admin-facolta-container">
      <h2 className="admin-facolta-title">Gestione Facoltà</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="admin-facolta-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddFacoltaModal(true)}
        >
          Aggiungi Facoltà
        </button>
      </div>
      
      {facolta.length === 0 ? (
        <div className="admin-facolta-empty">
          Nessuna facoltà trovata.
        </div>
      ) : (
        <div className="admin-facolta-list">
          {facolta.map(f => (
            <div key={f._id} className="facolta-card">
              <div className="facolta-header">
                <h3>{f.nome}</h3>
                <div className="facolta-actions">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleEditFacoltaClick(f)}
                  >
                    Modifica
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteFacolta(f._id)}
                  >
                    Elimina
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleAddCorsoClick(f)}
                  >
                    Aggiungi Corso
                  </button>
                </div>
              </div>
              
              {f.descrizione && (
                <p className="facolta-description">{f.descrizione}</p>
              )}
              
              <div className="facolta-corsi">
                <h4>Corsi di Laurea</h4>
                {f.corsi && f.corsi.length > 0 ? (
                  <ul className="corsi-list">
                    {f.corsi.map(corso => (
                      <li key={corso._id} className="corso-item">
                        <div className="corso-info">
                          <span className="corso-nome">{corso.nome}</span>
                          <span className="corso-codice">({corso.codice})</span>
                          <span className="corso-durata">
                            {corso.durata} {corso.durata === 1 ? 'anno' : 'anni'}
                          </span>
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveCorsoFromFacolta(f._id, corso._id)}
                        >
                          Rimuovi
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nessun corso associato a questa facoltà.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal per aggiungere facoltà */}
      {showAddFacoltaModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Aggiungi Facoltà</h3>
            <div className="form-group">
              <label htmlFor="nome">Nome Facoltà:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={newFacolta.nome}
                onChange={(e) => handleInputChange(e, setNewFacolta, newFacolta)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descrizione">Descrizione:</label>
              <textarea
                id="descrizione"
                name="descrizione"
                value={newFacolta.descrizione}
                onChange={(e) => handleInputChange(e, setNewFacolta, newFacolta)}
                rows={4}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleAddFacolta}
              >
                Aggiungi
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddFacoltaModal(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal per modificare facoltà */}
      {showEditFacoltaModal && currentFacolta && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Modifica Facoltà</h3>
            <div className="form-group">
              <label htmlFor="edit-nome">Nome Facoltà:</label>
              <input
                type="text"
                id="edit-nome"
                name="nome"
                value={currentFacolta.nome}
                onChange={(e) => handleInputChange(e, setCurrentFacolta, currentFacolta)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-descrizione">Descrizione:</label>
              <textarea
                id="edit-descrizione"
                name="descrizione"
                value={currentFacolta.descrizione}
                onChange={(e) => handleInputChange(e, setCurrentFacolta, currentFacolta)}
                rows={4}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleUpdateFacolta}
              >
                Aggiorna
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditFacoltaModal(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal per aggiungere corso */}
      {showAddCorsoModal && currentFacolta && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Aggiungi Corso a {currentFacolta.nome}</h3>
            <div className="form-group">
              <label htmlFor="corso-nome">Nome Corso:</label>
              <input
                type="text"
                id="corso-nome"
                name="nome"
                value={newCorso.nome}
                onChange={(e) => handleInputChange(e, setNewCorso, newCorso)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="corso-codice">Codice Corso:</label>
              <input
                type="text"
                id="corso-codice"
                name="codice"
                value={newCorso.codice}
                onChange={(e) => handleInputChange(e, setNewCorso, newCorso)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="corso-durata">Durata (anni):</label>
              <select
                id="corso-durata"
                name="durata"
                value={newCorso.durata}
                onChange={(e) => handleInputChange(e, setNewCorso, newCorso)}
                required
              >
                <option value={3}>3 (Triennale)</option>
                <option value={2}>2 (Magistrale)</option>
                <option value={5}>5 (Magistrale a Ciclo Unico)</option>
                <option value={6}>6 (Magistrale a Ciclo Unico)</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="corso-dipartimento">Dipartimento:</label>
              <input
                type="text"
                id="corso-dipartimento"
                name="dipartimento"
                value={newCorso.dipartimento}
                onChange={(e) => handleInputChange(e, setNewCorso, newCorso)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="corso-descrizione">Descrizione:</label>
              <textarea
                id="corso-descrizione"
                name="descrizione"
                value={newCorso.descrizione}
                onChange={(e) => handleInputChange(e, setNewCorso, newCorso)}
                rows={4}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleAddCorsoToFacolta}
              >
                Aggiungi
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddCorsoModal(false)}
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

export default AdminFacoltaPage;
