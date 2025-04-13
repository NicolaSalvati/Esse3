const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const User = require('./models/User');

// Carica le variabili d'ambiente
dotenv.config();

// Connessione al database
connectDB();

// Inizializza l'app Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Logging in modalità sviluppo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Definizione delle rotte
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/immatricolazione', require('./routes/immatricolazione'));
app.use('/api/v1/facolta', require('./routes/facolta'));

// Endpoint per creare un admin (solo in ambiente di sviluppo)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/v1/init', async (req, res) => {
    try {
      const adminExists = await User.findOne({ role: 'admin' });
      
      if (!adminExists) {
        // Genera il salt e cripta la password manualmente
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        await User.create({
          name: 'Admin Esse3',
          email: 'admin@esse3.it',
          password: hashedPassword,
          role: 'admin',
          isApproved: true,
          matricola: 'ADMIN0001'
        });
        return res.status(200).json({ success: true, message: 'Admin creato con successo' });
      }
      
      return res.status(200).json({ success: true, message: 'Admin già esistente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Errore durante la creazione dell\'admin', error: error.message });
    }
  });
}

// Middleware per la gestione degli errori
app.use(errorHandler);

// Porta del server
const PORT = process.env.PORT || 3010;

// Avvio del server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Gestione degli errori non gestiti
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Chiudi il server e termina il processo
  server.close(() => process.exit(1));
});

module.exports = server;
