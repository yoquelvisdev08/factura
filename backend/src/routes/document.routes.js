const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const documentController = require('../controllers/document.controller');

// Rutas para todos los documentos
router.get('/', authMiddleware, documentController.getAllDocuments);

// Rutas específicas por tipo de documento
router.get('/type/:type', authMiddleware, documentController.getDocumentsByType);
router.post('/generate-pdf/:id', authMiddleware, documentController.generatePdf);

// Rutas para documentos individuales
router.get('/:id', authMiddleware, documentController.getDocumentById);
router.post('/', authMiddleware, documentController.createDocument);
router.put('/:id', authMiddleware, documentController.updateDocument);
router.delete('/:id', authMiddleware, documentController.deleteDocument);

module.exports = router; 