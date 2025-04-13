const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Carica le variabili d'ambiente
dotenv.config();

// Opzioni di connessione MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Aumentato per evitare timeout
  autoIndex: true,
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  family: 4
};

// URI di connessione MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/esse3-portal';

// Funzione per connettere al database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB connesso: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Errore di connessione a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Gestione degli eventi di connessione
mongoose.connection.on('connected', () => {
  console.log('Mongoose connesso al database');
});

mongoose.connection.on('error', (err) => {
  console.error(`Errore di connessione Mongoose: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnesso dal database');
});

// Gestione della chiusura dell'applicazione
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Connessione al database chiusa per terminazione dell\'applicazione');
  process.exit(0);
});

module.exports = connectDB;
