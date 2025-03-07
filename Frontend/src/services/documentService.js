import { supabase } from './supabase';
import axios from 'axios';

const DOCUMENTS_TABLE = 'documents';
const STORAGE_BUCKET = 'documents';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const documentService = {
  // Create a new document
  async createDocument(documentData) {
    try {
      // Si estamos en modo API, usar el backend
      if (API_URL) {
        const response = await axios.post(`${API_URL}/documents`, documentData, {
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if available
            ...(supabase.auth.getSession() && {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            })
          }
        });
        return response.data;
      }
      
      // Fallback a Supabase directo si no hay API
      const { data, error } = await supabase
        .from(DOCUMENTS_TABLE)
        .insert([{
          ...documentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Get all documents for a user
  async getUserDocuments(userId, type = null) {
    try {
      // Si estamos en modo API, usar el backend
      if (API_URL) {
        let url = `${API_URL}/documents`;
        if (type) {
          url = `${API_URL}/documents/type/${type}`;
        }
        
        const response = await axios.get(url, {
          headers: {
            ...(supabase.auth.getSession() && {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            })
          }
        });
        return response.data;
      }
      
      // Fallback a Supabase directo
      let query = supabase
        .from(DOCUMENTS_TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user documents:', error);
      throw error;
    }
  },

  // Get a single document by ID
  async getDocumentById(documentId) {
    try {
      // Si estamos en modo API, usar el backend
      if (API_URL) {
        const response = await axios.get(`${API_URL}/documents/${documentId}`, {
          headers: {
            ...(supabase.auth.getSession() && {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            })
          }
        });
        return response.data;
      }
      
      // Fallback a Supabase directo
      const { data, error } = await supabase
        .from(DOCUMENTS_TABLE)
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  // Update an existing document
  async updateDocument(documentId, updates) {
    try {
      // Si estamos en modo API, usar el backend
      if (API_URL) {
        const response = await axios.put(`${API_URL}/documents/${documentId}`, updates, {
          headers: {
            'Content-Type': 'application/json',
            ...(supabase.auth.getSession() && {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            })
          }
        });
        return response.data;
      }
      
      // Fallback a Supabase directo
      const { data, error } = await supabase
        .from(DOCUMENTS_TABLE)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete a document
  async deleteDocument(documentId) {
    try {
      // Si estamos en modo API, usar el backend
      if (API_URL) {
        await axios.delete(`${API_URL}/documents/${documentId}`, {
          headers: {
            ...(supabase.auth.getSession() && {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            })
          }
        });
        return true;
      }
      
      // Fallback a Supabase directo
      const { error } = await supabase
        .from(DOCUMENTS_TABLE)
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Upload a file to storage
  async uploadDocumentFile(file, path) {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get a file URL
  async getDocumentFileUrl(path) {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(path, 3600);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  // Delete a file from storage
  async deleteDocumentFile(path) {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },
  
  // Generate PDF for a document
  async generatePdf(documentId) {
    try {
      if (!API_URL) {
        throw new Error('API_URL not defined, cannot generate PDF');
      }
      
      const response = await axios.post(`${API_URL}/documents/generate-pdf/${documentId}`, {}, {
        headers: {
          ...(supabase.auth.getSession() && {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          })
        },
        responseType: 'blob'
      });
      
      // Create download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return url;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}; 