import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider,
  useTheme,
  Stack,
  Paper,
  Chip,
  Link,
  Fade,
  Slide,
  useMediaQuery
} from '@mui/material';
import { 
  DocumentScannerOutlined, 
  BarChartOutlined, 
  NotificationsOutlined, 
  DriveFileRenameOutlineOutlined,
  SecurityOutlined, 
  DescriptionOutlined, 
  ChevronRight
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { 
  DocumentsIllustration, 
  AnalyticsIllustration, 
  SignatureIllustration, 
  NotificationsIllustration, 
  SecurityIllustration,
  DocuFlowLogo,
  AppIllustration
} from '../components/illustrations/FeatureIllustration';

// Componente de característica con animación
const FeatureCard = ({ title, description, icon: Icon, illustration: Illustration, reverse = false, delay = 0 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 4, 
          background: theme.palette.background.paper,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          position: 'relative',
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Grid 
          container 
          spacing={4} 
          alignItems="center" 
          direction={isMobile ? 'column-reverse' : reverse ? 'row-reverse' : 'row'}
        >
          <Grid item xs={12} md={7}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: '50%', 
                    bgcolor: theme.palette.primary.light, 
                    color: theme.palette.primary.main,
                    display: 'flex',
                  }}
                >
                  <Icon fontSize="medium" />
                </Box>
                <Typography variant="h5" component="h3" fontWeight="bold">
                  {title}
                </Typography>
              </Stack>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                mb={3}
                sx={{ lineHeight: 1.8 }}
              >
                {description}
              </Typography>
              
              <Button 
                component={RouterLink} 
                to="/login" 
                variant="outlined" 
                color="primary" 
                endIcon={<ChevronRight />}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Explorar función
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                p: 2,
                borderRadius: 4,
              }}
            >
              <Illustration width={isMobile ? 200 : 300} height={isMobile ? 200 : 300} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

// Sección de plantillas
const TemplateSection = () => {
  const theme = useTheme();
  
  const templates = [
    { 
      id: 1, 
      title: 'Facturas Profesionales', 
      description: 'Plantillas elegantes con personalización completa y cálculos automáticos.',
      color: theme.palette.primary.main 
    },
    { 
      id: 2, 
      title: 'Contratos Legales', 
      description: 'Formatos estandarizados con espacios para firma digital y términos personalizables.',
      color: theme.palette.secondary.main 
    },
    { 
      id: 3, 
      title: 'Documentos Corporativos', 
      description: 'Diseños modernos para documentos internos y externos de la empresa.',
      color: theme.palette.info.main 
    },
  ];

  return (
    <Box sx={{ py: 5 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        fontWeight="bold" 
        textAlign="center" 
        mb={1}
      >
        Plantillas Personalizables
      </Typography>
      <Typography 
        variant="subtitle1" 
        color="text.secondary" 
        textAlign="center" 
        mb={5}
      >
        Elige entre nuestra variedad de plantillas profesionales
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        {templates.map((template, index) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: 180, 
                    background: `linear-gradient(45deg, ${template.color} 30%, ${theme.palette.background.paper} 90%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <DescriptionOutlined sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)' }} />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 16, 
                      left: 16,
                      zIndex: 2
                    }}
                  >
                    <Chip 
                      label="Popular" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'white', 
                        color: template.color,
                        fontWeight: 'bold',
                        display: template.id === 1 ? 'flex' : 'none'
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {template.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {template.description}
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary" 
                    component={RouterLink}
                    to="/login"
                    endIcon={<ChevronRight />}
                    sx={{ textTransform: 'none' }}
                  >
                    Ver plantilla
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Hero Section con animación de la aplicación
const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ mb: 4 }}>
                <DocuFlowLogo width={isMobile ? 180 : 250} height={isMobile ? 72 : 100} />
              </Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.2rem', md: '3rem' },
                  lineHeight: 1.2,
                  mb: 3
                }}
              >
                Gestión de documentos{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '8px',
                      bottom: '8px',
                      left: 0,
                      backgroundColor: theme.palette.primary.light,
                      opacity: 0.3,
                      zIndex: -1
                    }
                  }}
                >
                  inteligente
                </Box>{' '}
                para tu empresa
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                paragraph
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  mb: 4,
                  maxWidth: '90%',
                  lineHeight: 1.8
                }}
              >
                Simplifica la creación y gestión de documentos con DocuFlow. Facturas, contratos y documentos legales 
                en un solo lugar, con herramientas avanzadas de análisis, firma digital y notificaciones.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
              >
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    borderRadius: 2, 
                    py: 1.5, 
                    fontWeight: 'bold',
                    textTransform: 'none',
                    minWidth: 140
                  }}
                >
                  Comenzar gratis
                </Button>
                <Button
                  component={RouterLink}
                  to="/docs"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ 
                    borderRadius: 2, 
                    py: 1.5,
                    textTransform: 'none',
                    minWidth: 140
                  }}
                >
                  Ver demo
                </Button>
              </Stack>
              <Box sx={{ mt: 5 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Usado por empresas líderes en todo el mundo
                </Typography>
                <Stack 
                  direction="row" 
                  spacing={4} 
                  sx={{ 
                    mt: 2,
                    opacity: 0.7
                  }}
                >
                  {/* Logos simulados */}
                  {['ACME', 'GlobalTech', 'Innovate', 'TechCorp'].map((company, index) => (
                    <Typography 
                      key={index} 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: theme.palette.text.secondary
                      }}
                    >
                      {company}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ 
                display: 'flex', 
                justifyContent: 'center',
                perspective: '1000px'
              }}
            >
              <motion.div
                animate={{ 
                  rotateY: [0, 5, 0, -5, 0],
                  y: [0, -10, 0, -5, 0]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  repeatType: 'loop'
                }}
              >
                <Box 
                  sx={{ 
                    position: 'relative',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
                  }}
                >
                  <AppIllustration width={isMobile ? 320 : 550} height={isMobile ? 192 : 330} />
                </Box>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const Home = () => {
  const theme = useTheme();
  
  const features = [
    {
      title: 'Gestión unificada de documentos',
      description: 'Centraliza facturas, contratos y documentos legales en una interfaz intuitiva. Organiza por categorías, añade etiquetas personalizadas y accede a tus documentos desde cualquier dispositivo.',
      icon: DocumentScannerOutlined,
      illustration: DocumentsIllustration,
      delay: 0.1
    },
    {
      title: 'Análisis y estadísticas en tiempo real',
      description: 'Visualiza el rendimiento de tu documentación con gráficos interactivos. Obtén insights sobre tipos de documentos, estados y tendencias a lo largo del tiempo para tomar mejores decisiones.',
      icon: BarChartOutlined,
      illustration: AnalyticsIllustration,
      reverse: true,
      delay: 0.2
    },
    {
      title: 'Sistema de notificaciones integrado',
      description: 'Mantente al día con alertas personalizables para vencimientos, aprobaciones y actualizaciones de documentos. Recibe notificaciones importantes directamente en la plataforma o por correo electrónico.',
      icon: NotificationsOutlined,
      illustration: NotificationsIllustration,
      delay: 0.3
    },
    {
      title: 'Firma digital avanzada',
      description: 'Firma documentos electrónicamente con nuestra herramienta integrada. Dibuja tu firma, guárdala para uso futuro y aplícala a contratos y acuerdos de forma segura y legal.',
      icon: DriveFileRenameOutlineOutlined,
      illustration: SignatureIllustration,
      reverse: true,
      delay: 0.4
    },
    {
      title: 'Seguridad de nivel empresarial',
      description: 'Protege tus documentos con encriptación de grado militar, autenticación de dos factores y permisos de acceso personalizables. Cumple con regulaciones de privacidad y mantén tus datos seguros.',
      icon: SecurityOutlined,
      illustration: SecurityIllustration,
      delay: 0.5
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            component="span" 
            sx={{ 
              color: theme.palette.primary.main, 
              fontWeight: 'bold',
              letterSpacing: 1.5,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              display: 'block',
              mb: 1
            }}
          >
            Características principales
          </Typography>
          <Typography variant="h3" component="h2" fontWeight="bold" mb={2}>
            Todo lo que necesitas en un solo lugar
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            DocuFlow ofrece herramientas avanzadas para gestionar todos tus documentos empresariales
          </Typography>
        </Box>
        
        <Box>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Box>
      </Container>
      
      {/* Templates Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.background.default,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <TemplateSection />
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 10, 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight="bold" 
              gutterBottom
              sx={{ 
                mb: 3, 
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              ¿Listo para optimizar tu gestión documental?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 5, 
                fontWeight: 'normal',
                opacity: 0.9,
                maxWidth: 700,
                mx: 'auto'
              }}
            >
              Únete a miles de empresas que ya mejoraron su productividad con DocuFlow.
              Comienza gratis hoy mismo.
            </Typography>
            <Button 
              component={RouterLink}
              to="/register"
              variant="contained" 
              color="secondary"
              size="large"
              sx={{ 
                py: 1.5, 
                px: 4, 
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                background: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  background: 'white',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                }
              }}
            >
              Comenzar ahora
            </Button>
          </motion.div>
        </Container>
        
        {/* Formas decorativas */}
        <Box 
          sx={{ 
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            top: '-150px',
            left: '-100px',
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            bottom: '-100px',
            right: '-50px',
            zIndex: 0
          }} 
        />
      </Box>
    </Box>
  );
};

export default Home; 