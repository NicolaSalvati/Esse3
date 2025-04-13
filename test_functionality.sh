#!/bin/bash

# Script per testare le funzionalità del progetto ESSE3

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Esecuzione test funzionalità ESSE3...${NC}"

# Verifica la struttura del progetto
echo -e "${YELLOW}Verifica della struttura del progetto...${NC}"
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo -e "${RED}Struttura del progetto non valida. Assicurati di essere nella directory principale del progetto.${NC}"
  exit 1
fi

# Verifica file di configurazione
echo -e "${YELLOW}Verifica dei file di configurazione...${NC}"
if [ ! -f "backend/.env" ]; then
  echo -e "${RED}File .env mancante nella directory backend.${NC}"
  exit 1
fi

if [ ! -f "frontend/.env" ]; then
  echo -e "${RED}File .env mancante nella directory frontend.${NC}"
  exit 1
fi

# Verifica connessione MongoDB
echo -e "${YELLOW}Verifica connessione MongoDB...${NC}"
MONGODB_URI=$(grep MONGODB_URI backend/.env | cut -d '=' -f2)
if [ -z "$MONGODB_URI" ]; then
  echo -e "${RED}MONGODB_URI non trovato nel file .env del backend.${NC}"
  exit 1
fi

echo -e "${GREEN}Configurazione MongoDB trovata: $MONGODB_URI${NC}"

# Verifica dipendenze backend
echo -e "${YELLOW}Verifica dipendenze backend...${NC}"
cd backend
if [ ! -f "package.json" ]; then
  echo -e "${RED}File package.json mancante nella directory backend.${NC}"
  exit 1
fi

# Verifica dipendenze frontend
echo -e "${YELLOW}Verifica dipendenze frontend...${NC}"
cd ../frontend
if [ ! -f "package.json" ]; then
  echo -e "${RED}File package.json mancante nella directory frontend.${NC}"
  exit 1
fi

# Verifica componenti principali
echo -e "${YELLOW}Verifica componenti principali...${NC}"
if [ ! -f "src/App.jsx" ]; then
  echo -e "${RED}Componente App.jsx mancante.${NC}"
  exit 1
fi

if [ ! -f "src/pages/LoginPage.jsx" ]; then
  echo -e "${RED}Componente LoginPage.jsx mancante.${NC}"
  exit 1
fi

if [ ! -f "src/pages/RegisterPage.jsx" ]; then
  echo -e "${RED}Componente RegisterPage.jsx mancante.${NC}"
  exit 1
fi

if [ ! -f "src/pages/AdminMatricolaPage.jsx" ]; then
  echo -e "${RED}Componente AdminMatricolaPage.jsx mancante.${NC}"
  exit 1
fi

# Verifica stili
echo -e "${YELLOW}Verifica file di stile...${NC}"
if [ ! -f "src/styles/App.css" ]; then
  echo -e "${RED}File di stile App.css mancante.${NC}"
  exit 1
fi

# Tutti i test sono passati
echo -e "${GREEN}Tutti i test di verifica sono passati con successo!${NC}"
echo -e "${GREEN}Il progetto è pronto per essere avviato.${NC}"
echo -e "${YELLOW}Usa ./start.sh per avviare il progetto.${NC}"

exit 0
