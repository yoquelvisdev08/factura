const express = require('express');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoice.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/invoice', invoiceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 