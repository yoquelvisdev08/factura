import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Slider,
  TextField,
  IconButton,
  Tooltip,
  Popover,
  Stepper,
  Step,
  StepLabel,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
  Paper,
  Stack,
  MenuItem,
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFViewer } from '@react-pdf/renderer';
import SignatureCanvas from 'react-signature-canvas';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import StyleIcon from '@mui/icons-material/Style';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FacturaProfesional from '../templates/FacturaProfesional';
import FacturaModerna from '../templates/FacturaModerna';
import FacturaClasica from '../templates/FacturaClasica';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/scale.css';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import PreviewIcon from '@mui/icons-material/Preview';
import SignaturePad from 'react-signature-canvas';
import { plantillaProfesional, plantillaModerna, plantillaClasica } from '../assets/plantillas';

const demoData = {
  empresaNombre: 'Mi Empresa, S.R.L.',
  empresaRNC: '123456789',
  empresaDireccion: 'Calle Principal #123',
  empresaTelefono: '(809) 555-1234',
  empresaEmail: 'info@miempresa.com',
  empresaLogo: null,
  empresaFirma: null,
  clienteNombre: 'Cliente Demo',
  clienteRNC: '987654321',
  clienteEmail: 'cliente@demo.com',
  clienteDireccion: 'Av. Cliente #456',
  clienteTelefono: '(809) 555-5678',
  numeroFactura: 'FAC-2024-001',
  fecha: new Date().toISOString().split('T')[0],
  vencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  moneda: 'USD',
  metodoPago: 'Transferencia',
  condicionesPago: 'Contado',
  items: [
    {
      descripcion: 'Producto Demo 1',
      cantidad: 2,
      precioUnitario: 100,
      impuesto: 18,
      descuento: 0,
      subtotal: 200,
    },
    {
      descripcion: 'Servicio Demo 1',
      cantidad: 1,
      precioUnitario: 150,
      impuesto: 18,
      descuento: 0,
      subtotal: 150,
    },
  ],
  descuentoGlobal: 0,
  notas: 'Esta es una factura de demostración',
  subtotal: 350,
  itbis: 63,
  total: 413,
};

const plantillas = [
  {
    id: 1,
    nombre: 'Profesional',
    descripcion: 'Diseño elegante y profesional con encabezado moderno',
    componente: FacturaProfesional,
    color: '#2962ff',
    preview: plantillaProfesional
  },
  {
    id: 2,
    nombre: 'Moderna',
    descripcion: 'Diseño minimalista con acentos de color',
    componente: FacturaModerna,
    color: '#1a237e',
    preview: plantillaModerna
  },
  {
    id: 3,
    nombre: 'Clásica',
    descripcion: 'Diseño tradicional y formal',
    componente: FacturaClasica,
    color: '#000000',
    preview: plantillaClasica
  }
];

const tooltips = {
  primaryColor: {
    title: 'Color Principal',
    description: 'Define el color dominante de tu factura. Se usa en encabezados y elementos importantes.',
    example: (color) => (
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Vista previa:
        </Typography>
        <Box sx={{ 
          width: 200, 
          height: 40, 
          bgcolor: color,
          borderRadius: 1,
          mb: 1
        }} />
        <Typography variant="caption">
          Se aplica a: encabezados, títulos y botones principales
        </Typography>
      </Box>
    )
  },
  secondaryColor: {
    title: 'Color Secundario',
    description: 'Color complementario usado para detalles y elementos secundarios.',
    example: (color) => (
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Vista previa:
        </Typography>
        <Box sx={{ 
          width: 200, 
          height: 40, 
          bgcolor: color,
          borderRadius: 1,
          mb: 1
        }} />
        <Typography variant="caption">
          Se aplica a: subtítulos, bordes y elementos decorativos
        </Typography>
      </Box>
    )
  },
  // ... más tooltips para otros colores ...
};

const ColorPicker = ({ color, onChange, label, tooltip }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = useCallback((newColor) => {
    onChange(newColor);
  }, [onChange]);

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2" sx={{ flex: 1 }}>{label}</Typography>
        <Tooltip title={tooltip} arrow placement="top">
          <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
        </Tooltip>
        <Box
          onClick={handleClick}
          sx={{
            width: 28,
            height: 28,
            borderRadius: '4px',
            border: '2px solid #ddd',
            backgroundColor: color,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        />
      </Stack>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 1 }}>
          <HexColorPicker 
            color={color} 
            onChange={handleColorChange}
          />
        </Box>
      </Popover>
    </Box>
  );
};

const defaultTheme = {
  primaryColor: '#2962ff',
  secondaryColor: '#1a237e',
  accentColor: '#ff3d00',
  headerColor: '#1a237e',
  textColor: '#000000',
  subtextColor: '#666666',
  borderColor: '#e0e0e0',
  backgroundColor: '#ffffff',
  tableHeaderColor: '#f5f5f5',
  highlightColor: '#2196f3',
  fontFamily: 'Poppins',
  headerFontFamily: 'Poppins',
  headerFontSize: 24,
  bodyFontSize: 10,
  fontWeight: 'normal',
};

const CustomizationPanel = ({ 
  theme, 
  onThemeChange, 
  signature, 
  onSignatureChange, 
  onSignatureClear, 
  signaturePadRef, 
  handleSignatureUpload, 
  fileInputRef,
  selectedTemplate,
  onShowFullPreview,
  formData
}) => {
  // Crear un key que cambie cuando el tema o la firma cambien
  const previewKey = useMemo(() => JSON.stringify({ theme, signature }), [theme, signature]);

  const previewData = useMemo(() => ({
    ...demoData,
    ...formData,
    theme,
    empresaFirma: signature
  }), [formData, theme, signature]);

  const renderPreview = () => {
    if (!selectedTemplate) return null;

    const Template = plantillas.find(p => p.nombre.toLowerCase() === selectedTemplate)?.componente;

    if (!Template) return null;

    return (
      <Box sx={{ height: '100%', minHeight: '800px' }}>
        <PDFViewer 
          key={previewKey}
          width="100%" 
          height="100%" 
          showToolbar={false}
          style={{ border: 'none' }}
        >
          <Template formData={previewData} />
        </PDFViewer>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Personalización de la Plantilla
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Colores
            </Typography>
            <Box>
              <ColorPicker
                color={theme.primaryColor}
                onChange={(color) => onThemeChange({ ...theme, primaryColor: color })}
                label="Color Principal"
                tooltip="Este color se usa para encabezados y elementos destacados"
              />
              <ColorPicker
                color={theme.secondaryColor}
                onChange={(color) => onThemeChange({ ...theme, secondaryColor: color })}
                label="Color Secundario"
                tooltip="Se usa para acentos y elementos secundarios"
              />
              <ColorPicker
                color={theme.headerColor}
                onChange={(color) => onThemeChange({ ...theme, headerColor: color })}
                label="Color de Encabezados"
                tooltip="Color para los títulos y encabezados de sección"
              />
              <ColorPicker
                color={theme.textColor}
                onChange={(color) => onThemeChange({ ...theme, textColor: color })}
                label="Color de Texto Principal"
                tooltip="Color principal para el texto del documento"
              />
              <ColorPicker
                color={theme.subtextColor}
                onChange={(color) => onThemeChange({ ...theme, subtextColor: color })}
                label="Color de Texto Secundario"
                tooltip="Color para textos menos importantes y detalles"
              />
              <ColorPicker
                color={theme.borderColor}
                onChange={(color) => onThemeChange({ ...theme, borderColor: color })}
                label="Color de Bordes"
                tooltip="Color para los bordes y líneas divisorias"
              />
              <ColorPicker
                color={theme.backgroundColor}
                onChange={(color) => onThemeChange({ ...theme, backgroundColor: color })}
                label="Color de Fondo"
                tooltip="Color de fondo del documento"
              />
              <ColorPicker
                color={theme.tableHeaderColor}
                onChange={(color) => onThemeChange({ ...theme, tableHeaderColor: color })}
                label="Color de Encabezado de Tabla"
                tooltip="Color para el encabezado de la tabla de items"
              />
              <ColorPicker
                color={theme.highlightColor}
                onChange={(color) => onThemeChange({ ...theme, highlightColor: color })}
                label="Color de Resaltado"
                tooltip="Color para resaltar información importante como totales"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tipografía
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Fuente Principal</Typography>
                <Tooltip title="Fuente para el contenido general del documento" arrow>
                  <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Tooltip>
              </Stack>
              <TextField
                select
                fullWidth
                value={theme.fontFamily || 'Poppins'}
                onChange={(e) => onThemeChange({ ...theme, fontFamily: e.target.value })}
                size="small"
                sx={{ mb: 2 }}
              >
                {[
                  { value: 'Poppins', label: 'Poppins' },
                  { value: 'Roboto', label: 'Roboto' },
                  { value: 'Open Sans', label: 'Open Sans' },
                  { value: 'Lato', label: 'Lato' },
                  { value: 'Montserrat', label: 'Montserrat' },
                  { value: 'Arial', label: 'Arial' },
                  { value: 'Helvetica', label: 'Helvetica' }
                ].map((font) => (
                  <MenuItem key={font.value} value={font.value}>
                    <Typography sx={{ fontFamily: font.value }}>{font.label}</Typography>
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Fuente de Encabezados</Typography>
                <Tooltip title="Fuente para títulos y encabezados" arrow>
                  <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Tooltip>
              </Stack>
              <TextField
                select
                fullWidth
                value={theme.headerFontFamily || theme.fontFamily || 'Poppins'}
                onChange={(e) => onThemeChange({ ...theme, headerFontFamily: e.target.value })}
                size="small"
                sx={{ mb: 3 }}
              >
                {[
                  { value: 'Poppins', label: 'Poppins' },
                  { value: 'Roboto', label: 'Roboto' },
                  { value: 'Open Sans', label: 'Open Sans' },
                  { value: 'Lato', label: 'Lato' },
                  { value: 'Montserrat', label: 'Montserrat' },
                  { value: 'Arial', label: 'Arial' },
                  { value: 'Helvetica', label: 'Helvetica' }
                ].map((font) => (
                  <MenuItem key={font.value} value={font.value}>
                    <Typography sx={{ fontFamily: font.value }}>{font.label}</Typography>
                  </MenuItem>
                ))}
              </TextField>
            
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Tamaño de Encabezados</Typography>
                <Tooltip title="Tamaño de texto para títulos y encabezados" arrow>
                  <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Tooltip>
              </Stack>
              <Slider
                value={theme.headerFontSize}
                onChange={(e, newValue) => onThemeChange({ ...theme, headerFontSize: newValue })}
                min={18}
                max={36}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Tamaño de Texto General</Typography>
                <Tooltip title="Tamaño de texto para el contenido general" arrow>
                  <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Tooltip>
              </Stack>
              <Slider
                value={theme.bodyFontSize}
                onChange={(e, newValue) => onThemeChange({ ...theme, bodyFontSize: newValue })}
                min={8}
                max={14}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Peso de Fuente</Typography>
                <Tooltip title="Grosor del texto general" arrow>
                  <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Tooltip>
              </Stack>
              <TextField
                select
                fullWidth
                value={theme.fontWeight || 'normal'}
                onChange={(e) => onThemeChange({ ...theme, fontWeight: e.target.value })}
                size="small"
              >
                {[
                  { value: 'light', label: 'Light' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'bold', label: 'Bold' }
                ].map((weight) => (
                  <MenuItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Firma Digital
            </Typography>
            <Box sx={{ border: '1px solid #ddd', mb: 2 }}>
              <SignaturePad
                ref={signaturePadRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas'
                }}
                onEnd={onSignatureChange}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => fileInputRef.current.click()}
              >
                Subir Firma
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onSignatureClear}
              >
                Limpiar
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleSignatureUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" gutterBottom>
              Vista Previa
            </Typography>
            <Box sx={{ 
              flex: 1,
              minHeight: '800px',
              overflow: 'auto',
              '& iframe': {
                height: '100% !important'
              }
            }}>
              {renderPreview()}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const TemplateSelector = ({ formData, onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState({
    primaryColor: '#2962ff',
    secondaryColor: '#1a237e',
    accentColor: '#ff3d00',
    headerColor: '#1a237e',
    textColor: '#000000',
    subtextColor: '#666666',
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    tableHeaderColor: '#f5f5f5',
    highlightColor: '#2196f3',
    fontFamily: 'Poppins',
    headerFontFamily: 'Poppins',
    headerFontSize: 24,
    bodyFontSize: 10,
    fontWeight: 'normal',
  });
  const [signature, setSignature] = useState(null);
  const signaturePadRef = useRef();
  const fileInputRef = useRef();
  const [showFullPreview, setShowFullPreview] = useState(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSignature = () => {
    if (signaturePadRef.current) {
      const dataUrl = signaturePadRef.current.toDataURL();
      setSignature(dataUrl);
    }
  };

  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignature(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignature(null);
    }
  };

  const handleConfirm = () => {
    const selectedTemplateData = plantillas.find(p => p.nombre.toLowerCase() === selectedTemplate);
    if (selectedTemplateData) {
      onSelect({
        template: selectedTemplate,
        theme: {
          ...theme,
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          accentColor: theme.accentColor || theme.primaryColor,
          headerColor: theme.headerColor || theme.primaryColor,
          textColor: theme.textColor,
          subtextColor: theme.subtextColor,
          borderColor: theme.borderColor,
          backgroundColor: theme.backgroundColor,
          tableHeaderColor: theme.tableHeaderColor,
          highlightColor: theme.highlightColor
        },
        signature
      });
    }
  };

  const handleTemplateSelect = (plantillaId) => {
    const plantilla = plantillas.find(p => p.id === plantillaId);
    if (plantilla) {
      setSelectedTemplate(plantilla.nombre.toLowerCase());
      let initialColors = {};
      
      switch (plantilla.nombre.toLowerCase()) {
        case 'profesional':
          initialColors = {
            primaryColor: '#6366F1',
            secondaryColor: '#EC4899'
          };
          break;
        case 'moderna':
          initialColors = {
            primaryColor: '#10B981',
            secondaryColor: '#34D399'
          };
          break;
        case 'clasica':
          initialColors = {
            primaryColor: '#F59E0B',
            secondaryColor: '#FBBF24'
          };
          break;
        default:
          initialColors = {
            primaryColor: '#6366F1',
            secondaryColor: '#EC4899'
          };
      }
      
      setTheme({
        ...theme,
        ...initialColors
      });
      setStep(1);
    }
  };

  const renderTemplateSelection = () => {
    const previewData = {
      ...demoData,
      theme: defaultTheme,
      empresaFirma: null
    };

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selecciona una Plantilla
        </Typography>
        <Grid container spacing={3}>
          {plantillas.map((plantilla) => (
            <Grid item xs={12} sm={4} key={plantilla.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedTemplate === plantilla.nombre.toLowerCase() ? '2px solid #2196f3' : '2px solid transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                  onClick={() => handleTemplateSelect(plantilla.id)}
                  elevation={selectedTemplate === plantilla.nombre.toLowerCase() ? 8 : 1}
                >
                  <Box
                    sx={{
                      height: 400,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      mb: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <PDFViewer 
                      width="100%" 
                      height="100%" 
                      showToolbar={false}
                      style={{ border: 'none' }}
                    >
                      <plantilla.componente formData={previewData} />
                    </PDFViewer>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                  >
                    {plantilla.nombre}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {plantilla.descripcion}
                  </Typography>
                  <Button
                    fullWidth
                    variant={selectedTemplate === plantilla.nombre.toLowerCase() ? "contained" : "outlined"}
                    onClick={() => handleTemplateSelect(plantilla.id)}
                    sx={{
                      mt: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    {selectedTemplate === plantilla.nombre.toLowerCase() ? "Seleccionada" : "Seleccionar"}
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {step === 0 && renderTemplateSelection()}
      {step === 1 && (
        <CustomizationPanel
          theme={theme}
          onThemeChange={handleThemeChange}
          signature={signature}
          onSignatureChange={handleSignature}
          onSignatureClear={clearSignature}
          signaturePadRef={signaturePadRef}
          handleSignatureUpload={handleSignatureUpload}
          fileInputRef={fileInputRef}
          selectedTemplate={selectedTemplate}
          onShowFullPreview={() => setShowFullPreview(true)}
          formData={formData}
        />
      )}
      
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {step > 0 && (
            <Button onClick={() => setStep(0)}>
              Atrás
            </Button>
          )}
          {step === 1 && (
            <Button
              variant="contained"
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default TemplateSelector; 