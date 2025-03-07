import React, { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import DocumentList from '../components/documents/DocumentList';
import DocumentForm from '../components/documents/DocumentForm';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editDocument, setEditDocument] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenForm = (document = null) => {
    setEditDocument(document);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditDocument(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    // La lista se actualizará automáticamente gracias al estado global
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="document types"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Todos" value="all" />
          <Tab label="Facturas" value="invoice" />
          <Tab label="Contratos" value="contract" />
          <Tab label="Documentos Legales" value="legal" />
        </Tabs>
      </Box>

      <DocumentList
        type={activeTab === 'all' ? null : activeTab}
        onEdit={handleOpenForm}
      />

      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editDocument ? 'Editar Documento' : 'Nuevo Documento'}
          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DocumentForm
              document={editDocument}
              onSuccess={handleFormSuccess}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Documents; 