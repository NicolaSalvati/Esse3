#!/bin/bash

# Script per avviare il progetto ESSE3

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Avvio del progetto ESSE3...${NC}"

# Verifica se MongoDB è in esecuzione
echo -e "${YELLOW}Verifica connessione MongoDB...${NC}"
mongo --eval "db.stats()" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo -e "${RED}MongoDB non sembra essere in esecuzione.${NC}"
  echo -e "${YELLOW}Assicurati che MongoDB sia installato e in esecuzione prima di continuare.${NC}"
  echo -e "${YELLOW}In alternativa, modifica il file .env nel backend per utilizzare MongoDB Atlas.${NC}"
  read -p "Vuoi continuare comunque? (s/n): " choice
  if [ "$choice" != "s" ]; then
    echo -e "${RED}Avvio annullato.${NC}"
    exit 1
  fi
fi

# Avvio del backend
echo -e "${YELLOW}Avvio del backend...${NC}"
cd backend
echo -e "${YELLOW}Installazione delle dipendenze del backend...${NC}"
npm install

echo -e "${YELLOW}Avvio del server backend...${NC}"
npm start &
BACKEND_PID=$!
echo -e "${GREEN}Backend avviato con PID: $BACKEND_PID${NC}"

# Attendi che il backend sia pronto
echo -e "${YELLOW}Attendi l'avvio del backend...${NC}"
sleep 5

# Avvio del frontend
echo -e "${YELLOW}Avvio del frontend...${NC}"
cd ../frontend
echo -e "${YELLOW}Installazione delle dipendenze del frontend...${NC}"
npm install

echo -e "${YELLOW}Avvio del server di sviluppo frontend...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend avviato con PID: $FRONTEND_PID${NC}"

echo -e "${GREEN}Progetto ESSE3 avviato con successo!${NC}"
echo -e "${GREEN}Backend: http://localhost:3010${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}Premi Ctrl+C per terminare entrambi i server${NC}"

# Gestione della terminazione
trap "kill $BACKEND_PID $FRONTEND_PID; echo -e '${YELLOW}Server terminati.${NC}'; exit" INT TERM

# Mantieni lo script in esecuzione
wait
