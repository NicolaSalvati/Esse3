import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ImmatricolazionePage.css';

const ImmatricolazionePage = () => {
  const navigate = useNavigate();
  const [tipoImmatricolazione, setTipoImmatricolazione] = useState('');

  const handleTipoImmatricolazioneChange = (tipo) => {
    setTipoImmatricolazione(tipo);
  };

  const handleContinue = () => {
    if (tipoImmatricolazione) {
      navigate(`/immatricolazione/form?tipo=${tipoImmatricolazione}`);
    }
  };

  return (
    <div className="immatricolazione-container">
      <div className="immatricolazione-card">
        <h2 className="immatricolazione-title">Scelta tipo domanda di Immatricolazione</h2>
        
        <div className="immatricolazione-info">
          <p>In questa pagina è presentata la scelta del tipo di domanda di Immatricolazione:</p>
          
          <ul className="immatricolazione-types">
            <li>
              <strong>Immatricolazione Standard:</strong> per studenti che NON hanno carriere universitarie pregresse 
              (cioè studenti che hanno conseguito il diploma di maturità ed accedono per la prima volta al sistema universitario, 
              coloro che hanno conseguito una laurea triennale ed intendono immatricolarsi ad un corso di studio magistrale, 
              oppure coloro che si iscrivono ad un corso di studio post laurea "Master o Dottorati").
            </li>
            <li>
              <strong>Abbreviazione Carriera:</strong> per studenti già in possesso di un titolo di studio universitario 
              di pari livello ed intendono immatricolarsi chiedendo anche il riconoscimento delle attività didattiche 
              già sostenute in una precedente carriera.
            </li>
          </ul>
          
          <p className="immatricolazione-note">
            <strong>N.B.:</strong> Al termine della relativa procedura, per rendere effettiva la domanda, 
            effettuare il rispettivo pagamento presente nella sezione "Segreteria" --&gt; "Pagamenti"
          </p>
        </div>
        
        <div className="immatricolazione-options">
          <h3>Seleziona il tipo di immatricolazione:</h3>
          
          <div className="immatricolazione-radio-group">
            <div 
              className={`immatricolazione-option ${tipoImmatricolazione === 'Immatricolazione standard' ? 'selected' : ''}`}
              onClick={() => handleTipoImmatricolazioneChange('Immatricolazione standard')}
            >
              <input 
                type="radio" 
                id="standard" 
                name="tipoImmatricolazione" 
                value="Immatricolazione standard"
                checked={tipoImmatricolazione === 'Immatricolazione standard'}
                onChange={() => {}}
              />
              <label htmlFor="standard">Immatricolazione standard</label>
            </div>
            
            <div 
              className={`immatricolazione-option ${tipoImmatricolazione === 'Abbreviazione Carriera' ? 'selected' : ''}`}
              onClick={() => handleTipoImmatricolazioneChange('Abbreviazione Carriera')}
            >
              <input 
                type="radio" 
                id="abbreviazione" 
                name="tipoImmatricolazione" 
                value="Abbreviazione Carriera"
                checked={tipoImmatricolazione === 'Abbreviazione Carriera'}
                onChange={() => {}}
              />
              <label htmlFor="abbreviazione">Abbreviazione Carriera</label>
            </div>
          </div>
        </div>
        
        <div className="immatricolazione-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleContinue}
            disabled={!tipoImmatricolazione}
          >
            Continua
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImmatricolazionePage;
