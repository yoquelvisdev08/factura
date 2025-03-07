import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  IconButton,
  Button,
  useTheme,
  Divider,
  Avatar,
  Chip,
  Tooltip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Gavel as GavelIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  SignalCellularAlt as TrendingIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useDocumentStore from '../../store/documentStore';
import useAuthStore from '../../store/authStore';
import AnalyticsWidget from './AnalyticsWidget';
import SignatureCanvas from '../SignatureCanvas';

// Componente de tarjeta de estadísticas
const StatCard = ({ icon: Icon, title, value, color, subtitle = null }) => {
  const theme = useTheme();
  
  return (
    <Card elevation={0} sx={{ 
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: theme.shadows[3],
        transform: 'translateY(-3px)'
      }
    }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 28, color: color }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Componente de tarjeta de documento reciente
const RecentDocumentCard = ({ document, onView, onDownload }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'invoice': return <ReceiptIcon fontSize="small" />;
      case 'contract': return <GavelIcon fontSize="small" />;
      case 'legal': return <DescriptionIcon fontSize="small" />;
      default: return <DescriptionIcon fontSize="small" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'draft': return 'Borrador';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <Paper elevation={0} sx={{ 
      p: 2, 
      mb: 2, 
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.01)',
      }
    }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{
                bgcolor: document.type === 'invoice' 
                  ? 'primary.light' 
                  : document.type === 'contract' 
                    ? 'secondary.light' 
                    : 'info.light',
                width: 40,
                height: 40
              }}
            >
              {getTypeIcon(document.type)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {document.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(document.created_at)}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Chip 
            label={getStatusText(document.status)} 
            color={getStatusColor(document.status)} 
            size="small" 
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
          <Tooltip title="Ver documento">
            <IconButton 
              size="small" 
              onClick={() => onView(document)}
              sx={{ mr: 1 }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {document.file_path && (
            <Tooltip title="Descargar">
              <IconButton 
                size="small" 
                onClick={() => onDownload(document)}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

// Componente principal del Dashboard Overview
const DashboardOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { documents } = useDocumentStore();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Estadísticas
  const totalDocuments = documents.length;
  const invoiceCount = documents.filter(doc => doc.type === 'invoice').length;
  const contractCount = documents.filter(doc => doc.type === 'contract').length;
  const legalCount = documents.filter(doc => doc.type === 'legal').length;
  
  // Cálculo del porcentaje de completitud
  const completedCount = documents.filter(doc => doc.status === 'completed').length;
  const completionRate = totalDocuments ? Math.round((completedCount / totalDocuments) * 100) : 0;
  
  // Documentos recientes (los 5 más recientes)
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewDocument = (document) => {
    // Navegar al detalle del documento o abrir modal
    console.log('Ver documento:', document);
  };

  const handleDownloadDocument = (document) => {
    // Descargar documento
    console.log('Descargar documento:', document);
  };

  const handleCreateDocument = (type) => {
    switch (type) {
      case 'invoice':
        navigate('/factura-rapida');
        break;
      case 'contract':
        navigate('/contrato-rapido');
        break;
      case 'legal':
        navigate('/documento-legal');
        break;
      default:
        break;
    }
  };

  const handleSignatureSave = (signatureDataURL) => {
    console.log('Firma guardada:', signatureDataURL);
    // Aquí se podría guardar en el perfil del usuario
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
          Bienvenido, {user?.full_name || 'Usuario'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tus documentos de manera eficiente y profesional
        </Typography>
      </Box>

      {/* Pestañas para cambiar entre vistas */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Resumen" />
          <Tab label="Analíticas" />
          <Tab label="Herramientas" />
        </Tabs>
      </Box>

      {/* Vista de Resumen */}
      {activeTab === 0 && (
        <>
          {/* Estadísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={DescriptionIcon}
                title="Total Documentos"
                value={totalDocuments}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={ReceiptIcon}
                title="Facturas"
                value={invoiceCount}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={GavelIcon}
                title="Contratos"
                value={contractCount}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={TrendingIcon}
                title="Completados"
                value={`${completionRate}%`}
                color={theme.palette.success.main}
                subtitle={`${completedCount} de ${totalDocuments} documentos`}
              />
            </Grid>
          </Grid>

          {/* Documentos recientes y acciones rápidas */}
          <Grid container spacing={3}>
            {/* Documentos recientes */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                height: '100%'
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Documentos Recientes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {recentDocuments.length > 0 ? (
                  recentDocuments.map((doc) => (
                    <RecentDocumentCard
                      key={doc.id}
                      document={doc}
                      onView={handleViewDocument}
                      onDownload={handleDownloadDocument}
                    />
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      No hay documentos recientes
                    </Typography>
                  </Box>
                )}
                
                {totalDocuments > 5 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/dashboard')}
                    >
                      Ver todos los documentos
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {/* Acciones rápidas */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                height: '100%'
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Acciones Rápidas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ReceiptIcon />}
                    onClick={() => handleCreateDocument('invoice')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}10`
                      }
                    }}
                  >
                    Crear Nueva Factura
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GavelIcon />}
                    onClick={() => handleCreateDocument('contract')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.main,
                      '&:hover': {
                        backgroundColor: `${theme.palette.secondary.main}10`
                      }
                    }}
                  >
                    Crear Nuevo Contrato
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DescriptionIcon />}
                    onClick={() => handleCreateDocument('legal')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: theme.palette.info.main,
                      color: theme.palette.info.main,
                      '&:hover': {
                        backgroundColor: `${theme.palette.info.main}10`
                      }
                    }}
                  >
                    Crear Documento Legal
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Vista de Analíticas */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AnalyticsWidget />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%'
            }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Estadísticas de Rendimiento
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Documentos creados este mes
                  </Typography>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {documents.filter(doc => {
                      const docDate = new Date(doc.created_at);
                      const now = new Date();
                      return docDate.getMonth() === now.getMonth() && 
                             docDate.getFullYear() === now.getFullYear();
                    }).length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tiempo promedio de creación
                  </Typography>
                  <Typography variant="h4" color="secondary.main" fontWeight="bold">
                    5min
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Documentos terminados
                  </Typography>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {completedCount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tasa de finalización
                  </Typography>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    {completionRate}%
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Vista de Herramientas */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%'
            }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Firma Digital
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Crea tu firma digital para utilizarla en todos tus documentos.
              </Typography>
              
              <SignatureCanvas onSave={handleSignatureSave} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%'
            }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Plantillas Disponibles
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Explora plantillas profesionales para tus documentos.
              </Typography>
              
              <Grid container spacing={2}>
                {[
                  { title: "Factura Moderna", type: "invoice", color: theme.palette.primary.main },
                  { title: "Factura Profesional", type: "invoice", color: theme.palette.primary.light },
                  { title: "Contrato de Servicios", type: "contract", color: theme.palette.secondary.main },
                  { title: "NDA", type: "contract", color: theme.palette.secondary.light },
                  { title: "Carta de Renuncia", type: "legal", color: theme.palette.info.main },
                  { title: "Permiso de Imagen", type: "legal", color: theme.palette.info.light },
                ].map((template, index) => (
                  <Grid item xs={6} key={index}>
                    <Card 
                      elevation={0} 
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: 1,
                          borderColor: template.color,
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: template.color,
                            }}
                          >
                            {template.type === 'invoice' ? <ReceiptIcon fontSize="small" /> : 
                             template.type === 'contract' ? <GavelIcon fontSize="small" /> : 
                             <DescriptionIcon fontSize="small" />}
                          </Avatar>
                          <Typography variant="subtitle2">
                            {template.title}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/templates')}
                endIcon={<ArrowForwardIcon />}
              >
                Ver todas las plantillas
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DashboardOverview; 