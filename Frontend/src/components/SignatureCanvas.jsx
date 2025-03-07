import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Draw as DrawIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';

const SignatureCanvas = ({ onSave, initialValue = null }) => {
  const sigCanvas = useRef({});
  const [open, setOpen] = useState(false);
  const [signature, setSignature] = useState(initialValue);
  const [darkPen, setDarkPen] = useState(true);
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Por favor, dibuje su firma antes de guardar');
      return;
    }

    const signatureDataURL = sigCanvas.current.toDataURL('image/png');
    setSignature(signatureDataURL);
    if (onSave) {
      onSave(signatureDataURL);
    }
    handleClose();
  };

  const downloadSignature = () => {
    if (!signature) return;

    const link = document.createElement('a');
    link.href = signature;
    link.download = 'firma_docuflow.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePenColor = (event) => {
    setDarkPen(event.target.checked);
    if (sigCanvas.current) {
      sigCanvas.current.penColor = event.target.checked ? '#000000' : '#1976d2';
    }
  };

  return (
    <>
      <Box>
        {signature ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mt: 1, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Firma digital</Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Descargar firma">
                  <IconButton size="small" onClick={downloadSignature}>
                    <FileDownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cambiar firma">
                  <IconButton size="small" onClick={handleOpen}>
                    <DrawIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            <Box 
              sx={{ 
                height: 120, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f8f8f8',
                borderRadius: 1,
              }}
            >
              <img 
                src={signature} 
                alt="Firma digital" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  display: 'block',
                  margin: '0 auto',
                }} 
              />
            </Box>
          </Paper>
        ) : (
          <Button 
            variant="outlined" 
            startIcon={<DrawIcon />} 
            onClick={handleOpen}
            fullWidth
            sx={{ mt: 1 }}
          >
            Añadir Firma Digital
          </Button>
        )}
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Firma Digital
          <IconButton
            aria-label="cerrar"
            onClick={handleClose}
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
          <Typography variant="body2" color="text.secondary" paragraph>
            Dibuje su firma en el recuadro a continuación. Esta firma se usará para firmar digitalmente sus documentos.
          </Typography>

          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor: '#f8f8f8',
              mt: 2,
              position: 'relative',
            }}
          >
            <SignaturePad
              ref={sigCanvas}
              canvasProps={{
                width: 500,
                height: 200,
                className: 'signature-canvas',
                style: { width: '100%', height: '200px' }
              }}
              penColor={darkPen ? '#000000' : '#1976d2'}
            />
          </Box>

          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <FormControlLabel
              control={
                <Switch 
                  checked={darkPen} 
                  onChange={handlePenColor} 
                  color="primary"
                />
              }
              label="Tinta oscura"
            />
            <Button
              startIcon={<DeleteIcon />}
              onClick={clearSignature}
              variant="outlined"
              color="error"
            >
              Limpiar
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={saveSignature} 
            variant="contained" 
            startIcon={<CheckIcon />}
            disabled={sigCanvas.current && sigCanvas.current.isEmpty && sigCanvas.current.isEmpty()}
          >
            Guardar firma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignatureCanvas; 