import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  Grid, 
  TextField, 
  MenuItem, 
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '../store/authStore';
import useDocumentStore from '../store/documentStore';
import LegalDocTemplate from '../components/templates/LegalDocTemplate';

// Constantes
const DOCUMENT_TYPES = [
  { 
    value: 'resignation', 
    label: 'Carta de Renuncia',
    defaultTemplate: {
      title: 'CARTA DE RENUNCIA',
      greeting: 'Estimado/a Sr./Sra.:',
      content: `Por medio de la presente, me dirijo a usted para comunicarle formalmente mi decisión de renunciar al puesto de [cargo] que vengo desempeñando en [nombre de la empresa] desde [fecha de inicio].

De acuerdo con lo establecido en mi contrato de trabajo, ofrezco un preaviso de [periodo de preaviso] a partir de la fecha de esta comunicación, siendo mi último día de trabajo el [fecha de finalización].

Quiero expresar mi sincero agradecimiento por la oportunidad que me han brindado de formar parte de esta organización, así como por el apoyo y la experiencia que he adquirido durante este tiempo.

Me comprometo a completar todos los proyectos pendientes y a facilitar la transición de mis responsabilidades a la persona que sea designada para sustituirme.`,
      farewell: 'Atentamente,'
    }
  },
  { 
    value: 'imagePermission', 
    label: 'Permiso de Uso de Imagen',
    defaultTemplate: {
      title: 'AUTORIZACIÓN PARA EL USO DE IMAGEN',
      greeting: 'A quien corresponda:',
      content: `Yo, [nombre completo], mayor de edad, con DNI/NIF [número de identificación], por medio del presente documento otorgo mi autorización a [nombre del beneficiario] para el uso de mi imagen en fotografías y/o videos.

La presente autorización se otorga para que mi imagen pueda ser utilizada, reproducida y publicada en cualquier medio, incluidos medios impresos, audiovisuales e internet, para los siguientes fines: [especificar fines].

Esta autorización tiene un carácter [gratuito/remunerado por importe de XXX euros] y una duración de [tiempo de vigencia/indefinida].

Me reservo expresamente el derecho a revocar esta autorización en cualquier momento, comunicándolo por escrito a la entidad beneficiaria.`,
      farewell: 'En fe de lo cual, firmo la presente autorización,'
    }
  },
  { 
    value: 'powerOfAttorney', 
    label: 'Poder Notarial Simple',
    defaultTemplate: {
      title: 'PODER NOTARIAL',
      greeting: '',
      content: `En [lugar], a [fecha actual].

COMPARECE:

D./Dña. [nombre completo del poderdante], mayor de edad, con DNI/NIF [número de identificación], y domicilio en [dirección completa], en su propio nombre y derecho, en adelante "EL/LA PODERDANTE".

EXPONE:

Que por el presente documento confiere PODER ESPECIAL, tan amplio y bastante como en Derecho sea necesario, a favor de D./Dña. [nombre completo del apoderado], mayor de edad, con DNI/NIF [número de identificación], y domicilio en [dirección completa], en adelante "EL/LA APODERADO/A".

Para que en nombre y representación de EL/LA PODERDANTE pueda realizar los siguientes actos:

1. [Describir con precisión las facultades que se confieren al apoderado]
2. [Continuar enumerando las facultades]

Este poder estará vigente hasta [fecha de término/revocación expresa].`,
      farewell: ''
    }
  }
];

const steps = ['Tipo de Documento', 'Información de las Partes', 'Contenido del Documento', 'Vista Previa'];

const validationSchemas = [
  // Esquema para el paso 1: Tipo de Documento
  Yup.object({
    documentType: Yup.string().required('El tipo de documento es obligatorio')
  }),
  
  // Esquema para el paso 2: Información de las Partes
  Yup.object({
    sender: Yup.string().required('El nombre del remitente es obligatorio'),
    senderPosition: Yup.string(),
    senderCompany: Yup.string(),
    senderContact: Yup.string(),
    recipient: Yup.string().required('El nombre del destinatario es obligatorio'),
    recipientPosition: Yup.string(),
    recipientCompany: Yup.string(),
    recipientAddress: Yup.string()
  }),
  
  // Esquema para el paso 3: Contenido del Documento
  Yup.object({
    title: Yup.string().required('El título del documento es obligatorio'),
    place: Yup.string().required('El lugar es obligatorio'),
    date: Yup.date().required('La fecha es obligatoria'),
    greeting: Yup.string(),
    content: Yup.string().required('El contenido es obligatorio'),
    farewell: Yup.string()
  }),
  
  // Esquema para el paso 4: Vista Previa (sin validación)
  Yup.object({})
];

const DocumentoLegal = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createDocument } = useDocumentStore();
  
  // Inicializar formik con valores por defecto
  const formik = useFormik({
    initialValues: {
      documentType: '',
      title: '',
      place: '',
      date: new Date().toISOString().split('T')[0],
      sender: user?.full_name || '',
      senderPosition: '',
      senderCompany: '',
      senderContact: '',
      recipient: '',
      recipientPosition: '',
      recipientCompany: '',
      recipientAddress: '',
      greeting: '',
      content: '',
      farewell: ''
    },
    validationSchema: validationSchemas[activeStep],
    onSubmit: (values) => {
      if (activeStep === steps.length - 1) {
        handleSave(values);
      } else {
        handleNext();
      }
    }
  });
  
  // Cargar datos por defecto cuando se selecciona un tipo de documento
  React.useEffect(() => {
    if (formik.values.documentType) {
      const selectedType = DOCUMENT_TYPES.find(type => type.value === formik.values.documentType);
      if (selectedType && selectedType.defaultTemplate) {
        formik.setFieldValue('title', selectedType.defaultTemplate.title);
        formik.setFieldValue('greeting', selectedType.defaultTemplate.greeting);
        formik.setFieldValue('content', selectedType.defaultTemplate.content);
        formik.setFieldValue('farewell', selectedType.defaultTemplate.farewell);
      }
    }
  }, [formik.values.documentType]);
  
  const handleNext = () => {
    const currentValidationSchema = validationSchemas[activeStep];
    
    try {
      currentValidationSchema.validateSync(formik.values, { abortEarly: false });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (errors) {
      formik.validateForm();
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSave = async (values) => {
    setLoading(true);
    try {
      await createDocument({
        type: 'legal',
        status: 'completed',
        data: values,
      });
      
      // Mostrar mensaje de éxito y redirigir al dashboard
      alert('Documento guardado con éxito');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al guardar el documento:', error);
      alert('Error al guardar el documento. Inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const getCurrentStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Seleccione el tipo de documento
            </Typography>
            <FormControl fullWidth error={formik.touched.documentType && Boolean(formik.errors.documentType)}>
              <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
              <Select
                labelId="document-type-label"
                id="documentType"
                name="documentType"
                value={formik.values.documentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Tipo de Documento"
              >
                {DOCUMENT_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.documentType && formik.errors.documentType && (
                <FormHelperText>{formik.errors.documentType}</FormHelperText>
              )}
            </FormControl>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Seleccione el tipo de documento legal que desea generar. Cada tipo incluye un contenido predefinido que podrá personalizar en los siguientes pasos.
              </Typography>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de las partes
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Información del Remitente
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="sender"
                  name="sender"
                  label="Nombre Completo"
                  value={formik.values.sender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sender && Boolean(formik.errors.sender)}
                  helperText={formik.touched.sender && formik.errors.sender}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="senderPosition"
                  name="senderPosition"
                  label="Cargo/Posición"
                  value={formik.values.senderPosition}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.senderPosition && Boolean(formik.errors.senderPosition)}
                  helperText={formik.touched.senderPosition && formik.errors.senderPosition}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="senderCompany"
                  name="senderCompany"
                  label="Empresa/Organización"
                  value={formik.values.senderCompany}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.senderCompany && Boolean(formik.errors.senderCompany)}
                  helperText={formik.touched.senderCompany && formik.errors.senderCompany}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="senderContact"
                  name="senderContact"
                  label="Teléfono/Email"
                  value={formik.values.senderContact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.senderContact && Boolean(formik.errors.senderContact)}
                  helperText={formik.touched.senderContact && formik.errors.senderContact}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                  Información del Destinatario
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="recipient"
                  name="recipient"
                  label="Nombre/Razón Social"
                  value={formik.values.recipient}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.recipient && Boolean(formik.errors.recipient)}
                  helperText={formik.touched.recipient && formik.errors.recipient}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="recipientPosition"
                  name="recipientPosition"
                  label="Cargo/Posición"
                  value={formik.values.recipientPosition}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.recipientPosition && Boolean(formik.errors.recipientPosition)}
                  helperText={formik.touched.recipientPosition && formik.errors.recipientPosition}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="recipientCompany"
                  name="recipientCompany"
                  label="Empresa/Organización"
                  value={formik.values.recipientCompany}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.recipientCompany && Boolean(formik.errors.recipientCompany)}
                  helperText={formik.touched.recipientCompany && formik.errors.recipientCompany}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="recipientAddress"
                  name="recipientAddress"
                  label="Dirección"
                  value={formik.values.recipientAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.recipientAddress && Boolean(formik.errors.recipientAddress)}
                  helperText={formik.touched.recipientAddress && formik.errors.recipientAddress}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contenido del documento
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Título del documento"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="place"
                  name="place"
                  label="Lugar"
                  value={formik.values.place}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.place && Boolean(formik.errors.place)}
                  helperText={formik.touched.place && formik.errors.place}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  label="Fecha"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="greeting"
                  name="greeting"
                  label="Saludo inicial"
                  value={formik.values.greeting}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.greeting && Boolean(formik.errors.greeting)}
                  helperText={formik.touched.greeting && formik.errors.greeting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="content"
                  name="content"
                  label="Contenido del documento"
                  multiline
                  rows={10}
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.content && Boolean(formik.errors.content)}
                  helperText={formik.touched.content && formik.errors.content}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="farewell"
                  name="farewell"
                  label="Despedida"
                  value={formik.values.farewell}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.farewell && Boolean(formik.errors.farewell)}
                  helperText={formik.touched.farewell && formik.errors.farewell}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vista previa del documento
            </Typography>
            
            <Box sx={{ mt: 2, height: 600, border: '1px solid #ccc' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <LegalDocTemplate templateData={formik.values} />
              </PDFViewer>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mx: 1 }}
                component={PDFDownloadLink}
                document={<LegalDocTemplate templateData={formik.values} />}
                fileName={`${formik.values.title.replace(/\s+/g, '_').toLowerCase()}.pdf`}
              >
                Descargar PDF
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ mx: 1 }}
                onClick={() => handleSave(formik.values)}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar y Finalizar'}
              </Button>
            </Box>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Generador de Documentos Legales
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <form onSubmit={formik.handleSubmit}>
          {getCurrentStepContent()}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Atrás
              </Button>
            )}
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DocumentoLegal; 