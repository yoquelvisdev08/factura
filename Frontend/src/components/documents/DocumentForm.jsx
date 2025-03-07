import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Upload as UploadIcon, Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import useDocumentStore from '../../store/documentStore';
import useAuthStore from '../../store/authStore';

const DOCUMENT_TYPES = [
  { value: 'invoice', label: 'Factura' },
  { value: 'contract', label: 'Contrato' },
  { value: 'legal', label: 'Documento Legal' }
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' }
];

const DocumentForm = ({ type = null, document = null, onSuccess = () => {} }) => {
  const { user } = useAuthStore();
  const { createDocument, updateDocument, uploadDocumentFile, isLoading, error } = useDocumentStore();
  
  const [formData, setFormData] = useState({
    title: document?.title || '',
    type: type || document?.type || 'invoice',
    description: document?.description || '',
    status: document?.status || 'draft',
    data: document?.data || {}
  });
  
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (type) {
      setFormData(prev => ({
        ...prev,
        type
      }));
    }
  }, [type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setFileError('El archivo no debe superar los 5MB');
        setFile(null);
      } else {
        setFileError('');
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let filePath = document?.file_path || null;
      
      if (file) {
        const path = `${user.id}/${formData.type}/${Date.now()}_${file.name}`;
        filePath = await uploadDocumentFile(file, path);
      }
      
      const documentData = {
        ...formData,
        user_id: user.id,
        file_path: filePath
      };
      
      if (document?.id) {
        await updateDocument(document.id, documentData);
      } else {
        await createDocument(documentData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar el documento:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'invoice':
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Detalles de la Factura
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cliente"
                  name="client"
                  value={formData.data.client || ''}
                  onChange={handleDataChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Factura"
                  name="invoiceNumber"
                  value={formData.data.invoiceNumber || ''}
                  onChange={handleDataChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Emisión"
                  name="issueDate"
                  type="date"
                  value={formData.data.issueDate || ''}
                  onChange={handleDataChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Vencimiento"
                  name="dueDate"
                  type="date"
                  value={formData.data.dueDate || ''}
                  onChange={handleDataChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Importe Total"
                  name="amount"
                  type="number"
                  value={formData.data.amount || ''}
                  onChange={handleDataChange}
                />
              </Grid>
            </Grid>
          </>
        );
      
      case 'contract':
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Detalles del Contrato
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parte A (Emisor)"
                  name="partyA"
                  value={formData.data.partyA || ''}
                  onChange={handleDataChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parte B (Receptor)"
                  name="partyB"
                  value={formData.data.partyB || ''}
                  onChange={handleDataChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Inicio"
                  name="startDate"
                  type="date"
                  value={formData.data.startDate || ''}
                  onChange={handleDataChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Finalización"
                  name="endDate"
                  type="date"
                  value={formData.data.endDate || ''}
                  onChange={handleDataChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción del Servicio/Contrato"
                  name="serviceDescription"
                  multiline
                  rows={3}
                  value={formData.data.serviceDescription || ''}
                  onChange={handleDataChange}
                />
              </Grid>
            </Grid>
          </>
        );
      
      case 'legal':
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Detalles del Documento Legal
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emisor"
                  name="sender"
                  value={formData.data.sender || ''}
                  onChange={handleDataChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Destinatario"
                  name="recipient"
                  value={formData.data.recipient || ''}
                  onChange={handleDataChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha del Documento"
                  name="documentDate"
                  type="date"
                  value={formData.data.documentDate || ''}
                  onChange={handleDataChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Documento Legal</InputLabel>
                  <Select
                    name="legalType"
                    value={formData.data.legalType || ''}
                    label="Tipo de Documento Legal"
                    onChange={handleDataChange}
                  >
                    <MenuItem value="resignation">Carta de Renuncia</MenuItem>
                    <MenuItem value="permission">Permiso de Uso de Imagen</MenuItem>
                    <MenuItem value="power">Poder</MenuItem>
                    <MenuItem value="other">Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contenido/Descripción"
                  name="content"
                  multiline
                  rows={3}
                  value={formData.data.content || ''}
                  onChange={handleDataChange}
                />
              </Grid>
            </Grid>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Título del Documento"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Documento</InputLabel>
            <Select
              name="type"
              value={formData.type}
              label="Tipo de Documento"
              onChange={handleInputChange}
              disabled={!!type}
            >
              {DOCUMENT_TYPES.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            name="description"
            multiline
            rows={2}
            value={formData.description}
            onChange={handleInputChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          {renderTypeSpecificFields()}
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Estado"
              onChange={handleInputChange}
            >
              {STATUS_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            fullWidth
            sx={{ height: '56px' }}
          >
            {file ? file.name : (document?.file_path ? 'Cambiar archivo' : 'Subir archivo')}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {fileError && (
            <Typography color="error" variant="caption">
              {fileError}
            </Typography>
          )}
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || submitting}
          startIcon={document ? <SaveIcon /> : <AddIcon />}
        >
          {isLoading || submitting ? <CircularProgress size={24} /> : (document ? 'Actualizar' : 'Crear')}
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentForm; 