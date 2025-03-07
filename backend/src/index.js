const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupDatabase } = require('./config/setupDatabase');
const authRoutes = require('./routes/auth.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const documentRoutes = require('./routes/document.routes');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configurar base de datos (esto es asíncrono, pero continuamos con la inicialización del servidor)
setupDatabase()
  .then(() => console.log('Base de datos configurada'))
  .catch(err => console.error('Error configurando la base de datos:', err));

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/documents', documentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 