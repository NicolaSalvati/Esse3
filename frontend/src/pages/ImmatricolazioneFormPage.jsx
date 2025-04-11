import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/ImmatricolazioneFormPage.css';

const ImmatricolazioneFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tipoImmatricolazione = searchParams.get('tipo') || 'Immatricolazione standard';
  
  const [facolta, setFacolta] = useState([]);
  const [corsi, setCorsi] = useState([]);
  const [selectedFacolta, setSelectedFacolta] = useState('');
  const [selectedTipoCorso, setSelectedTipoCorso] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    codiceFiscale: '',
    dataNascita: '',
    luogoNascita: '',
    indirizzo: '',
    telefono: '',
    tipoImmatricolazione: tipoImmatricolazione,
    tipoCorso: '',
    corsoId: '',
    diplomaScuola: '',
    votoScuola: '',
    // Solo per Abbreviazione Carriera
    universitaPrecedente: '',
    corsoPrecedente: '',
    esamiSostenuti: []
  });
  
  const [esame, setEsame] = useState({
    nome: '',
    voto: '',
    cfu: ''
  });
  
  useEffect(() => {
    const fetchFacolta = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/facolta`);
        setFacolta(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Errore durante il recupero delle facoltà');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchFacolta();
  }, []);
  
  const handleFacoltaChange = (e) => {
    const facoltaId = e.target.value;
    setSelectedFacolta(facoltaId);
    
    if (facoltaId) {
      const selectedFacoltaObj = facolta.find(f => f._id === facoltaId);
      if (selectedFacoltaObj) {
        setCorsi(selectedFacoltaObj.corsi);
      }
    } else {
      setCorsi([]);
    }
    
    setFormData({
      ...formData,
      corsoId: ''
    });
  };
  
  const handleTipoCorsoChange = (e) => {
    const tipoCorso = e.target.value;
    setSelectedTipoCorso(tipoCorso);
    setFormData({
      ...formData,
      tipoCorso
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleEsameChange = (e) => {
    const { name, value } = e.target;
    setEsame({
      ...esame,
      [name]: value
    });
  };
  
  const handleAddEsame = () => {
    if (esame.nome && esame.voto && esame.cfu) {
      setFormData({
        ...formData,
        esamiSostenuti: [...formData.esamiSostenuti, esame]
      });
      
      setEsame({
        nome: '',
        voto: '',
        cfu: ''
      });
    }
  };
  
  const handleRemoveEsame = (index) => {
    const updatedEsami = [...formData.esamiSostenuti];
    updatedEsami.splice(index, 1);
    
    setFormData({
      ...formData,
      esamiSostenuti: updatedEsami
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/immatricolazione`,
        formData
      );
      
      alert('Richiesta di immatricolazione inviata con successo!');
      navigate('/');
    } catch (err) {
      setError('Errore durante l\'invio della richiesta di immatricolazione');
      console.error(err);
    }
  };
  
  if (loading) {
    return <div className="loading">Caricamento...</div>;
  }
  
  return (
    <div className="immatricolazione-form-container">
      <div className="immatricolazione-form-card">
        <h2 className="immatricolazione-form-title">
          Domanda di {tipoImmatricolazione}
        </h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit} className="immatricolazione-form">
          <div className="form-section">
            <h3>Dati Personali</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cognome">Cognome *</label>
                <input
                  type="text"
                  id="cognome"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="codiceFiscale">Codice Fiscale *</label>
                <input
                  type="text"
                  id="codiceFiscale"
                  name="codiceFiscale"
                  value={formData.codiceFiscale}
                  onChange={handleInputChange}
                  required
                  maxLength={16}
                  minLength={16}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dataNascita">Data di Nascita *</label>
                <input
                  type="date"
                  id="dataNascita"
                  name="dataNascita"
                  value={formData.dataNascita}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="luogoNascita">Luogo di Nascita *</label>
                <input
                  type="text"
                  id="luogoNascita"
                  name="luogoNascita"
                  value={formData.luogoNascita}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="indirizzo">Indirizzo *</label>
                <input
                  type="text"
                  id="indirizzo"
                  name="indirizzo"
                  value={formData.indirizzo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telefono">Telefono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Dati Scolastici</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="diplomaScuola">Diploma di Scuola Superiore *</label>
                <input
                  type="text"
                  id="diplomaScuola"
                  name="diplomaScuola"
                  value={formData.diplomaScuola}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="votoScuola">Voto Diploma *</label>
                <input
                  type="number"
                  id="votoScuola"
                  name="votoScuola"
                  value={formData.votoScuola}
                  onChange={handleInputChange}
                  required
                  min={60}
                  max={100}
                />
              </div>
            </div>
          </div>
          
          {tipoImmatricolazione === 'Abbreviazione Carriera' && (
            <div className="form-section">
              <h3>Carriera Precedente</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="universitaPrecedente">Università Precedente *</label>
                  <input
                    type="text"
                    id="universitaPrecedente"
                    name="universitaPrecedente"
                    value={formData.universitaPrecedente}
                    onChange={handleInputChange}
                    required={tipoImmatricolazione === 'Abbreviazione Carriera'}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="corsoPrecedente">Corso Precedente *</label>
                  <input
                    type="text"
                    id="corsoPrecedente"
                    name="corsoPrecedente"
                    value={formData.corsoPrecedente}
                    onChange={handleInputChange}
                    required={tipoImmatricolazione === 'Abbreviazione Carriera'}
                  />
                </div>
              </div>
              
              <div className="esami-section">
                <h4>Esami Sostenuti</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="esameNome">Nome Esame</label>
                    <input
                      type="text"
                      id="esameNome"
                      name="nome"
                      value={esame.nome}
                      onChange={handleEsameChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="esameVoto">Voto</label>
                    <input
                      type="number"
                      id="esameVoto"
                      name="voto"
                      value={esame.voto}
                      onChange={handleEsameChange}
                      min={18}
                      max={30}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="esameCfu">CFU</label>
                    <input
                      type="number"
                      id="esameCfu"
                      name="cfu"
                      value={esame.cfu}
                      onChange={handleEsameChange}
                      min={1}
                    />
                  </div>
                  
                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleAddEsame}
                    >
                      Aggiungi Esame
                    </button>
                  </div>
                </div>
                
                {formData.esamiSostenuti.length > 0 && (
                  <div className="esami-list">
                    <h5>Esami Aggiunti:</h5>
                    <ul>
                      {formData.esamiSostenuti.map((e, index) => (
                        <li key={index}>
                          {e.nome} - Voto: {e.voto} - CFU: {e.cfu}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveEsame(index)}
                          >
                            Rimuovi
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="form-section">
            <h3>Corso di Laurea</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipoCorso">Tipo di Corso *</label>
                <select
                  id="tipoCorso"
                  name="tipoCorso"
                  value={formData.tipoCorso}
                  onChange={handleTipoCorsoChange}
                  required
                >
                  <option value="">Seleziona tipo di corso</option>
                  <option value="triennale">Laurea Triennale</option>
                  <option value="magistrale">Laurea Magistrale</option>
                  <option value="magistrale a ciclo unico">Laurea Magistrale a Ciclo Unico</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="facolta">Facoltà *</label>
                <select
                  id="facolta"
                  name="facolta"
                  value={selectedFacolta}
                  onChange={handleFacoltaChange}
                  required
                >
                  <option value="">Seleziona facoltà</option>
                  {facolta.map(f => (
                    <option key={f._id} value={f._id}>{f.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="corsoId">Corso di Laurea *</label>
                <select
                  id="corsoId"
                  name="corsoId"
                  value={formData.corsoId}
                  onChange={handleInputChange}
                  required
                  disabled={!selectedFacolta || !selectedTipoCorso}
                >
                  <option value="">Seleziona corso di laurea</option>
                  {corsi.filter(corso => corso.durata === (
                    selectedTipoCorso === 'triennale' ? 3 : 
                    selectedTipoCorso === 'magistrale' ? 2 : 
                    selectedTipoCorso === 'magistrale a ciclo unico' ? 5 : 0
                  )).map(corso => (
                    <option key={corso._id} value={corso._id}>
                      {corso.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Invia Domanda di Immatricolazione
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/immatricolazione')}
            >
              Indietro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImmatricolazioneFormPage;
