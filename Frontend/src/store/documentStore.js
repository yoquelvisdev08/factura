import { create } from 'zustand';
import { documentService } from '../services/documentService';

const useDocumentStore = create((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,

  // Cargar documentos del usuario
  loadUserDocuments: async (userId, type = null) => {
    set({ isLoading: true, error: null });
    try {
      const documents = await documentService.getUserDocuments(userId, type);
      set({ documents, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Crear nuevo documento
  createDocument: async (documentData) => {
    set({ isLoading: true, error: null });
    try {
      const newDocument = await documentService.createDocument(documentData);
      set(state => ({
        documents: [newDocument, ...state.documents],
        currentDocument: newDocument,
        isLoading: false
      }));
      return newDocument;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Actualizar documento
  updateDocument: async (documentId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDocument = await documentService.updateDocument(documentId, updates);
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === documentId ? updatedDocument : doc
        ),
        currentDocument: state.currentDocument?.id === documentId ? updatedDocument : state.currentDocument,
        isLoading: false
      }));
      return updatedDocument;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Eliminar documento
  deleteDocument: async (documentId) => {
    set({ isLoading: true, error: null });
    try {
      // Obtener el documento antes de eliminarlo para recuperar la ruta del archivo
      const documentToDelete = get().documents.find(doc => doc.id === documentId);
      
      await documentService.deleteDocument(documentId);
      
      // Si el documento tenía un archivo, eliminarlo del almacenamiento
      if (documentToDelete?.file_path) {
        await documentService.deleteDocumentFile(documentToDelete.file_path);
      }
      
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== documentId),
        currentDocument: state.currentDocument?.id === documentId ? null : state.currentDocument,
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Descargar documento
  generateDocumentPdf: async (documentId) => {
    set({ isLoading: true, error: null });
    try {
      const pdfUrl = await documentService.generatePdf(documentId);
      set({ isLoading: false });
      return pdfUrl;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Subir archivo
  uploadDocumentFile: async (file, path) => {
    set({ isLoading: true, error: null });
    try {
      const filePath = await documentService.uploadDocumentFile(file, path);
      set({ isLoading: false });
      return filePath;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Obtener URL del archivo
  getDocumentFileUrl: async (path) => {
    if (!path) return null;
    try {
      return await documentService.getDocumentFileUrl(path);
    } catch (error) {
      console.error('Error getting document file URL:', error);
      return null;
    }
  },

  // Obtener un documento por ID
  getDocumentById: async (documentId) => {
    set({ isLoading: true, error: null });
    try {
      const document = await documentService.getDocumentById(documentId);
      set({ currentDocument: document, isLoading: false });
      return document;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),
  
  // Limpiar estado actual
  clearState: () => set({ documents: [], currentDocument: null, isLoading: false, error: null }),
}));

export default useDocumentStore; 