import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Add as AddIcon
} from '@mui/icons-material';
import useDocumentStore from '../../store/documentStore';
import useAuthStore from '../../store/authStore';

const DocumentList = ({ type = null }) => {
  const { user } = useAuthStore();
  const {
    documents,
    isLoading,
    error,
    loadUserDocuments,
    deleteDocument,
    getDocumentFileUrl
  } = useDocumentStore();

  useEffect(() => {
    if (user) {
      loadUserDocuments(user.id, type);
    }
  }, [user, type]);

  const handleDelete = async (documentId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      await deleteDocument(documentId);
    }
  };

  const handleDownload = async (document) => {
    try {
      const url = await getDocumentFileUrl(document.file_path);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al descargar el documento:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          {type ? `${type.charAt(0).toUpperCase() + type.slice(1)}s` : 'Todos los Documentos'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* TODO: Implementar creación */}}
        >
          Nuevo Documento
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {documents.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              No hay documentos para mostrar
            </Typography>
          </Grid>
        ) : (
          documents.map((document) => (
            <Grid item xs={12} sm={6} md={4} key={document.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" noWrap>
                    {document.title || 'Sin título'}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Creado: {new Date(document.created_at).toLocaleDateString()}
                  </Typography>
                  
                  <Box mt={1} mb={2}>
                    <Chip
                      label={document.status}
                      color={document.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(document)}
                      title="Descargar"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {/* TODO: Implementar edición */}}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(document.id)}
                      title="Eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default DocumentList; 