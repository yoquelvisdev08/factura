import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
  InputAdornment,
  IconButton,
  Tooltip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFViewer } from '@react-pdf/renderer';
import FacturaProfesional from '../templates/FacturaProfesional';
import FacturaModerna from '../templates/FacturaModerna';
import FacturaClasica from '../templates/FacturaClasica';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import SignatureCanvas from 'react-signature-canvas';
import { QRCodeSVG } from 'qrcode.react';
import TemplateSelector from '../components/TemplateSelector';

const FacturaRapida = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Información del emisor
    empresaNombre: '',
    empresaRNC: '',
    empresaDireccion: '',
    empresaTelefono: '',
    empresaEmail: '',
    empresaLogo: null,
    empresaFirma: null,
    
    // Información del cliente
    clienteNombre: '',
    clienteRNC: '',
    clienteEmail: '',
    clienteDireccion: '',
    clienteTelefono: '',
    
    // Detalles de factura
    numeroFactura: generateInvoiceNumber(),
    fecha: new Date().toISOString().split('T')[0],
    vencimiento: '',
    moneda: 'USD',
    metodoPago: 'Transferencia',
    condicionesPago: 'Contado',
    
    // Items de la factura
    items: [
      {
        descripcion: '',
        cantidad: '1',
        precioUnitario: '',
        impuesto: '18',
        descuento: '0',
      }
    ],
    
    // Extras
    descuentoGlobal: '0',
    notas: '',
  });

  const [openPreview, setOpenPreview] = useState(false);
  const signaturePadRef = useRef();
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  function generateInvoiceNumber() {
    const prefix = 'FAC';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  const monedas = [
    { value: 'USD', label: 'Dólar estadounidense (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'DOP', label: 'Peso dominicano (DOP)' },
    { value: 'OTRO', label: 'Otra moneda' }
  ];

  const metodosPago = [
    { value: 'Transferencia', label: 'Transferencia bancaria' },
    { value: 'PayPal', label: 'PayPal' },
    { value: 'Tarjeta', label: 'Tarjeta de crédito/débito' },
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'OTRO', label: 'Otro método' }
  ];

  const condicionesPago = [
    { value: 'Contado', label: 'Contado' },
    { value: 'Credito30', label: 'Crédito 30 días' },
    { value: 'Credito60', label: 'Crédito 60 días' },
    { value: 'Credito90', label: 'Crédito 90 días' },
    { value: 'OTRO', label: 'Otras condiciones' }
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          empresaLogo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFirmaUpload = () => {
    if (signaturePadRef.current) {
      const firmaDataURL = signaturePadRef.current.toDataURL();
      setFormData(prev => ({
        ...prev,
        empresaFirma: firmaDataURL
      }));
    }
  };

  const limpiarFirma = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    
    if (index !== null) {
      // Actualizar item específico
      const newItems = formData.items.map((item, i) => {
        if (i === index) {
          return { ...item, [name]: value };
        }
        return item;
      });
      
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        descripcion: '',
        cantidad: '1',
        precioUnitario: '',
        impuesto: '18',
        descuento: '0',
      }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => {
      const cantidad = parseFloat(item.cantidad) || 0;
      const precio = parseFloat(item.precioUnitario) || 0;
      const descuento = parseFloat(item.descuento) || 0;
      const subtotalItem = cantidad * precio;
      return total + (subtotalItem - (subtotalItem * descuento / 100));
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const descuentoGlobal = parseFloat(formData.descuentoGlobal) || 0;
    const subtotalConDescuento = subtotal - (subtotal * descuentoGlobal / 100);
    
    const impuestos = formData.items.reduce((total, item) => {
      const cantidad = parseFloat(item.cantidad) || 0;
      const precio = parseFloat(item.precioUnitario) || 0;
      const impuesto = parseFloat(item.impuesto) || 0;
      const descuento = parseFloat(item.descuento) || 0;
      const subtotalItem = cantidad * precio;
      const subtotalConDescuento = subtotalItem - (subtotalItem * descuento / 100);
      return total + (subtotalConDescuento * impuesto / 100);
    }, 0);

    return subtotalConDescuento + impuestos;
  };

  const generateQRData = () => {
    const qrData = {
      emisor: formData.empresaNombre,
      rncEmisor: formData.empresaRNC,
      cliente: formData.clienteNombre,
      rncCliente: formData.clienteRNC,
      numeroFactura: formData.numeroFactura,
      fecha: formData.fecha,
      total: calculateTotal().toFixed(2),
      moneda: formData.moneda
    };
    return JSON.stringify(qrData);
  };

  const steps = [
    'Datos del Emisor',
    'Datos del Cliente',
    'Información de Factura',
    'Productos y Servicios',
    'Extras y Finalización'
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenPreview(true);
  };

  const handleGenerarPDF = async () => {
    try {
      const pdfData = {
        ...formData,
        subtotal: calculateSubtotal(),
        itbis: calculateTotal() - calculateSubtotal(),
        total: calculateTotal()
      };

      const response = await fetch('http://localhost:5001/api/invoice/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData)
      });

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      // Obtener el blob del PDF
      const blob = await response.blob();
      
      // Crear URL del blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear un elemento <a> temporal
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${formData.numeroFactura}.pdf`;
      
      // Añadir el link al documento y hacer clic
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Datos del Emisor
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={formData.empresaLogo}
                  alt="Logo empresa"
                  sx={{
                    width: 150,
                    height: 150,
                    border: '2px dashed #ccc',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {!formData.empresaLogo && <CloudUploadIcon sx={{ fontSize: 50 }} />}
                </Avatar>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                >
                  Subir Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nombre o Razón Social"
                name="empresaNombre"
                value={formData.empresaNombre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Identificación Fiscal (RNC)"
                name="empresaRNC"
                value={formData.empresaRNC}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Correo Electrónico"
                name="empresaEmail"
                type="email"
                value={formData.empresaEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Teléfono"
                name="empresaTelefono"
                type="tel"
                value={formData.empresaTelefono}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="empresaDireccion"
                multiline
                rows={3}
                value={formData.empresaDireccion}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Datos del Cliente
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nombre o Razón Social"
                name="clienteNombre"
                value={formData.clienteNombre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Identificación Fiscal (RNC)"
                name="clienteRNC"
                value={formData.clienteRNC}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Correo Electrónico"
                name="clienteEmail"
                type="email"
                value={formData.clienteEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="clienteTelefono"
                type="tel"
                value={formData.clienteTelefono}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="clienteDireccion"
                multiline
                rows={3}
                value={formData.clienteDireccion}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Información de la Factura
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Número de Factura"
                name="numeroFactura"
                value={formData.numeroFactura}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Fecha de Emisión"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Vencimiento"
                name="vencimiento"
                type="date"
                value={formData.vencimiento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleChange}
                  label="Moneda"
                >
                  {monedas.map((moneda) => (
                    <MenuItem key={moneda.value} value={moneda.value}>
                      {moneda.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  label="Método de Pago"
                >
                  {metodosPago.map((metodo) => (
                    <MenuItem key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Condiciones de Pago</InputLabel>
                <Select
                  name="condicionesPago"
                  value={formData.condicionesPago}
                  onChange={handleChange}
                  label="Condiciones de Pago"
                >
                  {condicionesPago.map((condicion) => (
                    <MenuItem key={condicion.value} value={condicion.value}>
                      {condicion.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Productos y Servicios
              </Typography>
            </Grid>
            
            {formData.items.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ ml: 0, mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label="Descripción"
                    name="descripcion"
                    value={item.descripcion}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    required
                    fullWidth
                    label="Cantidad"
                    name="cantidad"
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => handleChange(e, index)}
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    required
                    fullWidth
                    label="Precio"
                    name="precioUnitario"
                    type="number"
                    value={item.precioUnitario}
                    onChange={(e) => handleChange(e, index)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {formData.moneda === 'USD' ? '$' : formData.moneda === 'EUR' ? '€' : 'RD$'}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    required
                    fullWidth
                    label="ITBIS %"
                    name="impuesto"
                    type="number"
                    value={item.impuesto}
                    onChange={(e) => handleChange(e, index)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Descuento %"
                    name="descuento"
                    type="number"
                    value={item.descuento}
                    onChange={(e) => handleChange(e, index)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {index === formData.items.length - 1 && (
                      <Tooltip title="Agregar ítem">
                        <IconButton onClick={addItem} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {formData.items.length > 1 && (
                      <Tooltip title="Eliminar ítem">
                        <IconButton onClick={() => removeItem(index)} color="error">
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                  Resumen
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>Subtotal:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography>
                      {formData.moneda === 'USD' ? '$' : formData.moneda === 'EUR' ? '€' : 'RD$'}
                      {calculateSubtotal().toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Total ITBIS:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography>
                      {formData.moneda === 'USD' ? '$' : formData.moneda === 'EUR' ? '€' : 'RD$'}
                      {(calculateTotal() - calculateSubtotal()).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Total:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary">
                      {formData.moneda === 'USD' ? '$' : formData.moneda === 'EUR' ? '€' : 'RD$'}
                      {calculateTotal().toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Extras y Finalización
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Descuento Global %"
                name="descuentoGlobal"
                type="number"
                value={formData.descuentoGlobal}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas Adicionales"
                name="notas"
                multiline
                rows={4}
                value={formData.notas}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Firma Digital
              </Typography>
              <Paper
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                <SignatureCanvas
                  ref={signaturePadRef}
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-canvas'
                  }}
                />
              </Paper>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={limpiarFirma}>
                  Limpiar Firma
                </Button>
                <Button variant="contained" onClick={handleFirmaUpload}>
                  Guardar Firma
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Código QR
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <QRCodeSVG value={generateQRData()} size={200} />
              </Box>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const plantillas = [
    {
      id: 1,
      nombre: 'Profesional',
      descripcion: 'Diseño elegante y profesional con encabezado moderno',
      component: FacturaProfesional
    },
    {
      id: 2,
      nombre: 'Moderna',
      descripcion: 'Diseño minimalista con acentos de color',
      component: FacturaModerna
    },
    {
      id: 3,
      nombre: 'Clásica',
      descripcion: 'Diseño tradicional y formal',
      component: FacturaClasica
    }
  ];

  const handleTemplateSelect = (templateData) => {
    const { template, theme } = templateData;
    setSelectedTemplate(plantillas.findIndex(p => p.nombre.toLowerCase() === template) + 1);
    setFormData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...theme
      }
    }));
    setShowTemplateSelector(false);
  };

  if (showTemplateSelector) {
    return (
      <TemplateSelector
        open={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              Factura Rápida
            </Typography>
          </Box>

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 6,
              '& .MuiStepLabel-root': {
                '& .MuiStepLabel-label': {
                  fontSize: '1.1rem',
                  mt: 1
                }
              },
              '& .MuiStepIcon-root': {
                fontSize: '2rem',
                '&.Mui-active': {
                  color: 'primary.main',
                  transform: 'scale(1.2)',
                  transition: 'transform 0.3s ease'
                },
                '&.Mui-completed': {
                  color: 'success.main'
                }
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {label}
                  </motion.div>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                {renderStepContent(activeStep)}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    sx={{
                      px: 4,
                      '&:not(:disabled)': {
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(-5px)'
                        }
                      }
                    }}
                  >
                    Atrás
                  </Button>
                  <Box>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                          px: 6,
                          backgroundImage: 'linear-gradient(45deg, #2962ff, #ff3d00)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Generar Factura
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                          px: 4,
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateX(5px)'
                          }
                        }}
                      >
                        Siguiente
                      </Button>
                    )}
                  </Box>
                </Box>
              </form>
            </motion.div>
          </AnimatePresence>
        </Paper>

        <Dialog
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Vista Previa de Factura</DialogTitle>
          <DialogContent>
            <PDFViewer width="100%" height="600px">
              {React.createElement(plantillas[selectedTemplate - 1].component, {
                formData: {
                  ...formData,
                  subtotal: calculateSubtotal(),
                  itbis: calculateTotal() - calculateSubtotal(),
                  total: calculateTotal()
                }
              })}
            </PDFViewer>
          </DialogContent>
          <DialogActions sx={{ borderTop: 1, borderColor: 'divider', py: 2 }}>
            <Button 
              onClick={() => setOpenPreview(false)}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cerrar
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerarPDF}
              sx={{
                backgroundImage: 'linear-gradient(45deg, #2962ff, #ff3d00)',
                px: 4
              }}
            >
              Descargar PDF
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default FacturaRapida; 