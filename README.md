# ESSE3 Portal - Sistema di Segreteria Studenti

Questo documento descrive le modifiche apportate al progetto ESSE3 per risolvere i problemi di connessione al database e migliorare l'interfaccia utente.

## Problemi risolti

### 1. Problema di timeout nel login
Il problema principale segnalato era:
```
Errore durante il login: Operation `users.findOne()` buffering timed out after 10000ms
```

Questo errore è stato risolto modificando la configurazione di connessione a MongoDB:
- Aumentato il timeout di selezione del server da 5000ms a 30000ms
- Implementato un sistema di gestione degli errori più robusto
- Configurato correttamente la connessione a MongoDB Atlas

### 2. Interfaccia utente migliorata
L'interfaccia utente è stata completamente ridisegnata con:
- Stile moderno con sfumature di blu e bianco
- Animazioni ed effetti di transizione
- Layout responsive per tutti i dispositivi
- Effetti di hover e feedback visivo per le interazioni

### 3. Sistema di registrazione e matricole
È stato implementato un sistema completo per:
- Registrazione degli studenti
- Approvazione degli studenti da parte degli amministratori
- Assegnazione di matricole nel formato richiesto (0124XXXXXX)

## Struttura del progetto

Il progetto è organizzato in due parti principali:

### Backend (Node.js + Express + MongoDB)
- `/backend`: API RESTful per la gestione degli utenti e delle matricole
  - `/config`: Configurazione del database e dell'applicazione
  - `/controllers`: Logica di business
  - `/middleware`: Middleware per autenticazione e autorizzazione
  - `/models`: Modelli dei dati
  - `/routes`: Definizione delle rotte API

### Frontend (React + Bootstrap)
- `/frontend`: Interfaccia utente
  - `/src/components`: Componenti riutilizzabili
  - `/src/pages`: Pagine dell'applicazione
  - `/src/styles`: Fogli di stile CSS
  - `/src/utils`: Utility e contesto di autenticazione

## Istruzioni per l'installazione

### Prerequisiti
- Node.js (v14 o superiore)
- MongoDB (locale o Atlas)

### Configurazione
1. Clona il repository
2. Configura i file `.env` in entrambe le directory:

Per il backend (`.env` nella cartella `backend`):
```
NODE_ENV=development
PORT=3010
MONGODB_URI=mongodb+srv://esse3admin:esse3password@esse3cluster.mongodb.net/esse3-portal
JWT_SECRET=esse3-secure-jwt-secret-key-2025
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=esse3-secure-refresh-token-key-2025
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

Per il frontend (`.env` nella cartella `frontend`):
```
VITE_API_URL=http://localhost:3010/api/v1
```

### Avvio
Usa lo script di avvio incluso:
```
./start.sh
```

Oppure avvia manualmente:
1. Backend:
```
cd backend
npm install
npm start
```

2. Frontend:
```
cd frontend
npm install
npm run dev
```

## Utilizzo

### Accesso
- Studenti: Registrazione e attesa di approvazione
- Admin: Gestione degli studenti e assegnazione matricole
- SuperAdmin: Gestione completa del sistema

### Flusso di registrazione studenti
1. Lo studente si registra tramite la pagina di registrazione
2. L'amministratore approva lo studente e assegna una matricola
3. Lo studente può accedere con la matricola assegnata

## Tecnologie utilizzate

### Backend
- Node.js e Express
- MongoDB con Mongoose
- JWT per l'autenticazione
- bcrypt per la crittografia delle password

### Frontend
- React con Hooks
- React Router per la navigazione
- Bootstrap per il layout responsive
- Formik e Yup per la validazione dei form
- Axios per le richieste HTTP
- FontAwesome per le icone

## Test

Per verificare che tutto funzioni correttamente:
```
./test_functionality.sh
```

## Crediti
Progetto sviluppato per il corso di Ingegneria del Software.
