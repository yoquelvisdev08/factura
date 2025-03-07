const documentService = require('../services/document.service');

// Obtener todos los documentos del usuario
exports.getAllDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const documents = await documentService.getAllDocuments(userId);
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
};

// Obtener un documento por ID
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const document = await documentService.getDocumentById(id, userId);
    
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    res.status(200).json(document);
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ error: 'Error al obtener documento' });
  }
};

// Crear un nuevo documento
exports.createDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const documentData = {
      ...req.body,
      user_id: userId
    };
    
    const newDocument = await documentService.createDocument(documentData);
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ error: 'Error al crear documento' });
  }
};

// Actualizar un documento existente
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const documentData = req.body;
    
    const updatedDocument = await documentService.updateDocument(id, userId, documentData);
    
    if (!updatedDocument) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ error: 'Error al actualizar documento' });
  }
};

// Eliminar un documento
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await documentService.deleteDocument(id, userId);
    
    if (!result) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    res.status(200).json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
};

// Obtener documentos por tipo
exports.getDocumentsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user.id;
    
    if (!['invoice', 'contract', 'legal'].includes(type)) {
      return res.status(400).json({ error: 'Tipo de documento no válido' });
    }
    
    const documents = await documentService.getDocumentsByType(userId, type);
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error al obtener documentos por tipo:', error);
    res.status(500).json({ error: 'Error al obtener documentos por tipo' });
  }
};

// Generar PDF de un documento
exports.generatePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const document = await documentService.getDocumentById(id, userId);
    
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    const pdfBuffer = await documentService.generatePdf(document);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${document.type}_${id}.pdf"`);
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
}; 