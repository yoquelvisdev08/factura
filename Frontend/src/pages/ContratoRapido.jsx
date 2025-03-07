import React, { useState, useEffect } from 'react';
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
  IconButton, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '../store/authStore';
import useDocumentStore from '../store/documentStore';
import ContractTemplate from '../components/templates/ContractTemplate';

// Constantes
const CONTRACT_TYPES = [
  { 
    value: 'service', 
    label: 'Contrato de Prestación de Servicios',
    defaultClauses: [
      { 
        title: 'OBJETO DEL CONTRATO', 
        content: 'El PROVEEDOR se compromete a prestar los servicios profesionales consistentes en [descripción detallada de los servicios], en adelante "los Servicios", de acuerdo con los términos y condiciones establecidos en el presente contrato.' 
      },
      { 
        title: 'DURACIÓN', 
        content: 'El presente contrato tendrá una duración de [duración] a partir de la fecha de firma. El contrato podrá ser renovado por períodos adicionales mediante acuerdo escrito entre las partes.' 
      },
      { 
        title: 'HONORARIOS Y FORMA DE PAGO', 
        content: 'El CLIENTE abonará al PROVEEDOR la cantidad de [importe] euros en concepto de honorarios por los Servicios. El pago se realizará de la siguiente manera: [detallar forma de pago y plazos].' 
      },
      { 
        title: 'OBLIGACIONES DEL PROVEEDOR', 
        content: 'El PROVEEDOR se compromete a: a) Prestar los Servicios con la máxima diligencia y profesionalidad; b) Cumplir con los plazos acordados; c) Mantener la confidencialidad sobre toda la información a la que tenga acceso.' 
      },
      { 
        title: 'OBLIGACIONES DEL CLIENTE', 
        content: 'El CLIENTE se compromete a: a) Proporcionar al PROVEEDOR toda la información y materiales necesarios para la correcta prestación de los Servicios; b) Realizar los pagos en los plazos acordados; c) Designar a una persona de contacto para la comunicación con el PROVEEDOR.' 
      },
    ]
  },
  { 
    value: 'nda', 
    label: 'Acuerdo de Confidencialidad (NDA)',
    defaultClauses: [
      { 
        title: 'DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL', 
        content: 'A efectos del presente acuerdo, "Información Confidencial" significa toda información técnica, financiera, comercial o de cualquier otra naturaleza relacionada con la actividad de la parte reveladora, que sea comunicada a la parte receptora, ya sea por escrito, verbalmente o por cualquier otro medio.' 
      },
      { 
        title: 'OBLIGACIONES DE LA PARTE RECEPTORA', 
        content: 'La parte receptora se compromete a: a) Mantener la Información Confidencial en estricta confidencialidad; b) No divulgar ni permitir la divulgación de la Información Confidencial a terceros sin el consentimiento previo y por escrito de la parte reveladora; c) Utilizar la Información Confidencial únicamente para los fines específicos para los cuales fue revelada.' 
      },
      { 
        title: 'EXCEPCIONES', 
        content: 'Las obligaciones de confidencialidad no se aplicarán a la información que: a) Sea de dominio público o pase a ser de dominio público por causas distintas al incumplimiento del presente acuerdo; b) Estuviera legítimamente en posesión de la parte receptora antes de su divulgación; c) Deba ser revelada por imperativo legal o por orden judicial.' 
      },
      { 
        title: 'DURACIÓN', 
        content: 'Las obligaciones de confidencialidad establecidas en el presente acuerdo permanecerán en vigor durante un período de [duración] años a partir de la fecha de firma del acuerdo.' 
      },
      { 
        title: 'RESPONSABILIDAD', 
        content: 'El incumplimiento de las obligaciones de confidencialidad dará derecho a la parte reveladora a reclamar una indemnización por los daños y perjuicios causados, sin perjuicio de las acciones legales que pudieran corresponder.' 
      },
    ]
  },
  { 
    value: 'rental', 
    label: 'Contrato de Alquiler',
    defaultClauses: [
      { 
        title: 'OBJETO DEL CONTRATO', 
        content: 'El ARRENDADOR arrienda al ARRENDATARIO el inmueble situado en [dirección completa], en adelante "el Inmueble", para ser destinado exclusivamente a [uso del inmueble].' 
      },
      { 
        title: 'DURACIÓN', 
        content: 'El presente contrato tendrá una duración de [duración] a partir de la fecha de firma. El contrato podrá ser prorrogado por períodos adicionales mediante acuerdo escrito entre las partes.' 
      },
      { 
        title: 'RENTA Y FORMA DE PAGO', 
        content: 'El ARRENDATARIO abonará al ARRENDADOR la cantidad de [importe] euros mensuales en concepto de renta. El pago se realizará dentro de los primeros cinco días de cada mes mediante transferencia bancaria a la cuenta designada por el ARRENDADOR.' 
      },
      { 
        title: 'FIANZA', 
        content: 'El ARRENDATARIO entrega en este acto la cantidad de [importe] euros en concepto de fianza, equivalente a [número] mensualidades de renta. La fianza será devuelta al ARRENDATARIO a la finalización del contrato, una vez comprobado el buen estado del Inmueble.' 
      },
      { 
        title: 'OBLIGACIONES DEL ARRENDATARIO', 
        content: 'El ARRENDATARIO se compromete a: a) Destinar el Inmueble al uso pactado; b) Mantener el Inmueble en buen estado de conservación; c) No realizar obras sin el consentimiento escrito del ARRENDADOR; d) Permitir el acceso al ARRENDADOR para inspecciones periódicas previo aviso.' 
      },
    ]
  }
];

const steps = ['Tipo de Contrato', 'Información de las Partes', 'Detalles del Contrato', 'Vista Previa'];

const validationSchemas = [
  // Esquema para el paso 1: Tipo de Contrato
  Yup.object({
    contractType: Yup.string().required('El tipo de contrato es obligatorio')
  }),
  
  // Esquema para el paso 2: Información de las Partes
  Yup.object({
    partyA: Yup.string().required('El nombre del proveedor es obligatorio'),
    partyAId: Yup.string().required('El NIF/CIF del proveedor es obligatorio'),
    partyAAddress: Yup.string().required('La dirección del proveedor es obligatoria'),
    partyB: Yup.string().required('El nombre del cliente es obligatorio'),
    partyBId: Yup.string().required('El NIF/CIF del cliente es obligatorio'),
    partyBAddress: Yup.string().required('La dirección del cliente es obligatoria')
  }),
  
  // Esquema para el paso 3: Detalles del Contrato
  Yup.object({
    title: Yup.string().required('El título del contrato es obligatorio'),
    exposition: Yup.string().required('La exposición es obligatoria'),
    clauses: Yup.array().of(
      Yup.object({
        title: Yup.string().required('El título de la cláusula es obligatorio'),
        content: Yup.string().required('El contenido de la cláusula es obligatorio')
      })
    ).min(1, 'Debe incluir al menos una cláusula'),
    place: Yup.string().required('El lugar de firma es obligatorio'),
    contractDate: Yup.date().required('La fecha de firma es obligatoria')
  }),
  
  // Esquema para el paso 4: Vista Previa (sin validación)
  Yup.object({})
];

const ContratoRapido = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createDocument } = useDocumentStore();
  
  // Inicializar formik con valores por defecto
  const formik = useFormik({
    initialValues: {
      contractType: '',
      title: '',
      partyA: user?.full_name || '',
      partyAId: '',
      partyAAddress: '',
      partyB: '',
      partyBId: '',
      partyBAddress: '',
      exposition: 'Que ambas partes están interesadas en formalizar el presente contrato con arreglo a las siguientes cláusulas:',
      clauses: [],
      place: '',
      contractDate: new Date().toISOString().split('T')[0]
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
  
  // Cargar cláusulas por defecto cuando se selecciona un tipo de contrato
  useEffect(() => {
    if (formik.values.contractType) {
      const selectedType = CONTRACT_TYPES.find(type => type.value === formik.values.contractType);
      if (selectedType) {
        formik.setFieldValue('clauses', [...selectedType.defaultClauses]);
        
        // Establecer título según el tipo de contrato
        switch (formik.values.contractType) {
          case 'service':
            formik.setFieldValue('title', 'CONTRATO DE PRESTACIÓN DE SERVICIOS');
            break;
          case 'nda':
            formik.setFieldValue('title', 'ACUERDO DE CONFIDENCIALIDAD');
            break;
          case 'rental':
            formik.setFieldValue('title', 'CONTRATO DE ALQUILER');
            break;
          default:
            formik.setFieldValue('title', 'CONTRATO');
        }
      }
    }
  }, [formik.values.contractType]);
  
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
  
  const handleAddClause = () => {
    const newClauses = [...formik.values.clauses, { title: '', content: '' }];
    formik.setFieldValue('clauses', newClauses);
  };
  
  const handleRemoveClause = (index) => {
    const newClauses = formik.values.clauses.filter((_, i) => i !== index);
    formik.setFieldValue('clauses', newClauses);
  };
  
  const handleSave = async (values) => {
    setLoading(true);
    try {
      await createDocument({
        type: 'contract',
        status: 'completed',
        data: values,
      });
      
      // Mostrar mensaje de éxito y redirigir al dashboard
      alert('Contrato guardado con éxito');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al guardar el contrato:', error);
      alert('Error al guardar el contrato. Inténtelo de nuevo.');
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
              Seleccione el tipo de contrato
            </Typography>
            <FormControl fullWidth error={formik.touched.contractType && Boolean(formik.errors.contractType)}>
              <InputLabel id="contract-type-label">Tipo de Contrato</InputLabel>
              <Select
                labelId="contract-type-label"
                id="contractType"
                name="contractType"
                value={formik.values.contractType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Tipo de Contrato"
              >
                {CONTRACT_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.contractType && formik.errors.contractType && (
                <FormHelperText>{formik.errors.contractType}</FormHelperText>
              )}
            </FormControl>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Seleccione el tipo de contrato que desea generar. Cada tipo incluye cláusulas predefinidas que podrá personalizar en los siguientes pasos.
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
                  Información del Proveedor/Emisor
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="partyA"
                  name="partyA"
                  label="Nombre/Razón Social"
                  value={formik.values.partyA}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.partyA && Boolean(formik.errors.partyA)}
                  helperText={formik.touched.partyA && formik.errors.partyA}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="partyAId"
                  name="partyAId"
                  label="NIF/CIF"
                  value={formik.values.partyAId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.partyAId && Boolean(formik.errors.partyAId)}
                  helperText={formik.touched.partyAId && formik.errors.partyAId}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="partyAAddress"
                  name="partyAAddress"
                  label="Dirección completa"
                  value={formik.values.partyAAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.partyAAddress && Boolean(formik.errors.partyAAddress)}
                  helperText={formik.touched.partyAAddress && formik.errors.partyAAddress}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Información del Cliente/Receptor
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="partyB"
                  name="partyB"
                  label="Nombre/Razón Social"
                  value={formik.values.partyB}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.partyB && Boolean(formik.errors.partyB)}
                  helperText={formik.touched.partyB && formik.errors.partyB}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="partyBId"
                  name="partyBId"
                  label="NIF/CIF"
                  value={formik.values.partyBId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.partyBId && Boolean(formik.errors.partyBId)}
                  helperText={formik.touched.partyBId && formik.errors.partyBId}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="partyBAddress"
                  name="partyBAddress"
                  label="Dirección completa"
                  value={formik.values.partyBAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.partyBAddress && Boolean(formik.errors.partyBAddress)}
                  helperText={formik.touched.partyBAddress && formik.errors.partyBAddress}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detalles del contrato
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Título del contrato"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="exposition"
                  name="exposition"
                  label="Exposición"
                  multiline
                  rows={4}
                  value={formik.values.exposition}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.exposition && Boolean(formik.errors.exposition)}
                  helperText={formik.touched.exposition && formik.errors.exposition}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                  Cláusulas
                </Typography>
                {formik.values.clauses.map((clause, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
                    <IconButton
                      aria-label="eliminar cláusula"
                      onClick={() => handleRemoveClause(index)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id={`clauses[${index}].title`}
                          name={`clauses[${index}].title`}
                          label={`Título de la Cláusula ${index + 1}`}
                          value={clause.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.clauses?.[index]?.title &&
                            Boolean(formik.errors.clauses?.[index]?.title)
                          }
                          helperText={
                            formik.touched.clauses?.[index]?.title &&
                            formik.errors.clauses?.[index]?.title
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id={`clauses[${index}].content`}
                          name={`clauses[${index}].content`}
                          label="Contenido"
                          multiline
                          rows={4}
                          value={clause.content}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.clauses?.[index]?.content &&
                            Boolean(formik.errors.clauses?.[index]?.content)
                          }
                          helperText={
                            formik.touched.clauses?.[index]?.content &&
                            formik.errors.clauses?.[index]?.content
                          }
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Button
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddClause}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Añadir Cláusula
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Firma
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="place"
                  name="place"
                  label="Lugar de firma"
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
                  id="contractDate"
                  name="contractDate"
                  label="Fecha de firma"
                  type="date"
                  value={formik.values.contractDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.contractDate && Boolean(formik.errors.contractDate)}
                  helperText={formik.touched.contractDate && formik.errors.contractDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vista previa del contrato
            </Typography>
            
            <Box sx={{ mt: 2, height: 600, border: '1px solid #ccc' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <ContractTemplate templateData={formik.values} />
              </PDFViewer>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mx: 1 }}
                component={PDFDownloadLink}
                document={<ContractTemplate templateData={formik.values} />}
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
          Generador de Contratos
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

export default ContratoRapido; 