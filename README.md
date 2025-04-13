# ESSE3 - Sistema di Segreteria Studenti

<div align="center">
  <img src="https://img.shields.io/badge/node.js-v14+-green.svg" alt="Node.js Version">
  <img src="https://img.shields.io/badge/react-latest-blue.svg" alt="React Version">
  <img src="https://img.shields.io/badge/mongodb-atlas-success.svg" alt="MongoDB">
  <img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="License">
</div>



## 🆕 Novità Versione 7.0

### Homepage - Migliorie grafiche e funzionali
- Implementazione di un carosello di immagini con scorrimento automatico
- Overlay blu trasparente sulle immagini del carosello
- Rimozione dei pulsanti di navigazione laterali
- Pulsanti principali resi trasparenti al 70%
- Miglioramento del titolo dell’università:
  - Aumento dimensioni
  - Animazioni ed effetti visivi
  - Migliore leggibilità grazie ad ombreggiatura

### Nuova pagina: Informazioni sull’Università
Creata una pagina dedicata con 3 sezioni principali:

#### → Storia
- Video YouTube integrato
- Timeline interattiva per evidenziare gli eventi più importanti

#### → Sedi
- Scorrimento orizzontale per visualizzare le sedi universitarie
- Immagini dedicate per ogni sede
- Mappa interattiva con marker per la posizione di ogni sede

#### → Corsi
- Organizzazione dei corsi per sede universitaria
- Scorrimento orizzontale dei corsi per una migliore esperienza utente
- Rimozione dei link ridondanti per una navigazione più pulita

---

## Considerazioni finali
> Questa versione è incentrata sulla User Experience e sulla valorizzazione visiva dei contenuti, migliorando estetica, navigazione e interazione dell’utente.


## 📋 Panoramica

UniparthenopeHub è un sistema completo di gestione della segreteria studenti che offre funzionalità di registrazione, autenticazione e gestione delle matricole. Il sistema è progettato con un'architettura moderna che separa frontend e backend, garantendo scalabilità e manutenibilità.

### 🔍 Caratteristiche Principali

- **Sistema di autenticazione avanzato** con JWT e refresh token
- **Gestione completa degli utenti** con ruoli differenziati (Studenti, Admin, SuperAdmin)
- **Processo di registrazione studenti** con approvazione amministrativa
- **Assegnazione automatica delle matricole** nel formato standardizzato (0124XXXXXX)
- **Interfaccia utente moderna e reattiva** ottimizzata per tutti i dispositivi
- **API RESTful** per l'integrazione con altri sistemi

## 🚀 Tecnologie Utilizzate

### Backend
- **Node.js** e **Express** per il server API
- **MongoDB** con **Mongoose** per la persistenza dei dati
- **JWT** per l'autenticazione sicura
- **bcrypt** per la crittografia delle password

### Frontend
- **React** con Hooks per l'interfaccia utente
- **React Router** per la navigazione
- **Bootstrap** per il layout responsive
- **Formik** e **Yup** per la validazione dei form
- **Axios** per le richieste HTTP
- **FontAwesome** per le icone

## 🏗️ Architettura del Progetto

```
esse3/
├── backend/               # Server API Node.js
│   ├── config/            # Configurazione del database e dell'app
│   ├── controllers/       # Logica di business
│   ├── middleware/        # Middleware per auth e autorizzazione
│   ├── models/            # Modelli dei dati Mongoose
│   ├── routes/            # Definizione delle rotte API
│   └── server.js          # Entry point del server
│
├── frontend/              # Applicazione React
│   ├── src/
│   │   ├── components/    # Componenti riutilizzabili
│   │   ├── pages/         # Pagine dell'applicazione
│   │   ├── styles/        # Fogli di stile CSS
│   │   ├── utils/         # Utility e contesto di autenticazione
│   │   ├── App.jsx        # Componente principale
│   │   └── main.jsx       # Entry point React
│   └── index.html         # Template HTML
│
├── start.sh               # Script di avvio dell'applicazione
└── test_functionality.sh  # Script per testare le funzionalità
```

## 🔧 Installazione e Configurazione

### Prerequisiti
- Node.js (v14 o superiore)
- MongoDB (locale o Atlas)
- npm o yarn

### Passaggi per l'Installazione

1. **Clona il repository**
   ```bash
   git clone https://github.com/NicolaSalvati/Esse3.git
   cd Esse3
   ```

2. **Configura le variabili d'ambiente**

   Per il backend (crea `.env` nella cartella `backend`):
   ```
   NODE_ENV=development
   PORT=3010
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/esse3-portal
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRE=30d
   JWT_REFRESH_SECRET=your-refresh-token-key
   JWT_REFRESH_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

   Per il frontend (crea `.env` nella cartella `frontend`):
   ```
   VITE_API_URL=http://localhost:3010/api/v1
   ```

3. **Avvia l'applicazione**

   Utilizzando lo script di avvio:
   ```bash
   ./start.sh
   ```

   Oppure manualmente:
   ```bash
   # Avvia il backend
   cd backend
   npm install
   npm start
   
   # In un altro terminale, avvia il frontend
   cd frontend
   npm install
   npm run dev
   ```

## 🖥️ Utilizzo

### Accesso al Sistema

- **Studenti**: Registrazione tramite form e attesa di approvazione
- **Admin**: Gestione degli studenti e assegnazione matricole
- **SuperAdmin**: Gestione completa del sistema e degli amministratori

### Flusso di Registrazione Studenti

1. Lo studente compila il form di registrazione
2. L'amministratore riceve la richiesta e la approva
3. Il sistema assegna automaticamente una matricola nel formato corretto
4. Lo studente riceve notifica e può accedere con le proprie credenziali

## 🧪 Test

Per verificare il corretto funzionamento dell'applicazione:

```bash
./test_functionality.sh
```

Questo script esegue una serie di test automatizzati per verificare:
- Connessione al database
- Registrazione e autenticazione
- Assegnazione delle matricole
- Funzionalità di amministrazione

## 🛠️ Problemi Risolti

### Connessione al Database
- Risolto il problema di timeout durante il login
- Aumentato il timeout di selezione del server da 5000ms a 30000ms
- Implementato un sistema di gestione degli errori più robusto

### Interfaccia Utente
- Completamente ridisegnata con un tema moderno
- Migliorata la reattività su tutti i dispositivi
- Aggiunti effetti di transizione e feedback visivo

## 📝 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 👥 Contributi

Le contribuzioni sono benvenute! Per favore, sentiti libero di inviare una pull request o aprire un issue per miglioramenti o correzioni.

## 📞 Contatti

Progetto sviluppato per il corso di Ingegneria del Software.

---

<div align="center">
  <sub>Fatto con ❤️ da Nicola Salvati</sub>
</div>
