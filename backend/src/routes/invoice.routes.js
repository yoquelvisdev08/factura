const express = require('express');
const router = express.Router();
const { generateInvoicePDF } = require('../controllers/invoice.controller');

router.post('/generate-pdf', generateInvoicePDF);

module.exports = router; 