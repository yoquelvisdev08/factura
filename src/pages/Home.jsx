import { Container, Typography, Grid, Paper, Box, Button, Stack, Divider, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SpeedIcon from '@mui/icons-material/Speed';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';
import PaletteIcon from '@mui/icons-material/Palette';
import StyleIcon from '@mui/icons-material/Style';
import SignatureIcon from '@mui/icons-material/Draw';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Facturación Rápida',
      description: 'Genera facturas profesionales en cuestión de minutos con nuestro formulario intuitivo y fácil de usar.'
    },
    {
      icon: <StyleIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Múltiples Plantillas',
      description: 'Elige entre diferentes diseños: Profesional, Moderno o Clásico. Cada uno con su estilo único y profesional.'
    },
    {
      icon: <PaletteIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Personalización Total',
      description: 'Personaliza colores, fuentes, tamaños y más. Adapta el diseño a tu marca e identidad corporativa.'
    },
    {
      icon: <SignatureIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Firma Digital',
      description: 'Añade tu firma digital directamente en la factura. Dibuja, sube o importa tu firma con facilidad.'
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Vista Previa en Tiempo Real',
      description: 'Visualiza los cambios al instante mientras personalizas tu factura. Sin sorpresas en el resultado final.'
    },
    {
      icon: <DownloadIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Exportación PDF Profesional',
      description: 'Descarga tus facturas en formato PDF de alta calidad, listas para compartir con tus clientes.'
    }
  ];

  const templates = [
    {
      title: 'Profesional',
      description: 'Diseño elegante y moderno con un toque profesional.',
      features: ['Encabezado destacado', 'Diseño limpio', 'Colores personalizables'],
      gradient: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
      colors: {
        primary: '#6366F1',
        secondary: '#EC4899'
      }
    },
    {
      title: 'Moderna',
      description: 'Estilo contemporáneo con acentos de color.',
      features: ['Diseño minimalista', 'Acentos de color', 'Tipografía moderna'],
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      colors: {
        primary: '#10B981',
        secondary: '#34D399'
      }
    },
    {
      title: 'Clásica',
      description: 'Diseño tradicional y formal.',
      features: ['Estilo sobrio', 'Formato tradicional', 'Aspecto formal'],
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      colors: {
        primary: '#F59E0B',
        secondary: '#FBBF24'
      }
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          py: { xs: 10, md: 15 },
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundImage: 'url("/grid-pattern.svg")',
            opacity: 0.4,
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h1">
                  Facturación Simple y Profesional
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 4, fontWeight: 500 }}
                >
                  Crea facturas profesionales en segundos con nuestro sistema intuitivo.
                  Personaliza cada detalle y obtén documentos de calidad al instante.
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/factura-rapida')}
                  >
                    Crear Factura Gratis
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/factura-rapida')}
                  >
                    Ver Plantillas
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  component="img"
                  src="/preview-mockup.svg"
                  alt="Preview de Facturas"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '600px',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    mx: 'auto',
                    display: 'block',
                    filter: 'drop-shadow(0 4px 6px rgba(99, 102, 241, 0.07))',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 2 }}
        >
          Características Principales
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}
        >
          Todo lo que necesitas para crear facturas profesionales en un solo lugar
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Templates Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
      }}>
        <Container>
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 2 }}
          >
            Plantillas Disponibles
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}
          >
            Elige el diseño que mejor se adapte a tu negocio
          </Typography>

          <Grid container spacing={4}>
            {templates.map((template, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: template.gradient,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        transition: 'transform 0.3s ease-in-out',
                        boxShadow: `0 12px 24px -8px ${template.colors.primary}20`,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                          background: template.gradient,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {template.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                      >
                        {template.description}
                      </Typography>
                      <Divider sx={{ my: 3 }} />
                      <Stack spacing={2}>
                        {template.features.map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: template.gradient,
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container>
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          <Typography variant="h2" gutterBottom>
            ¿Listo para empezar?
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            Únete a miles de usuarios que ya están creando facturas profesionales con nuestra plataforma
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/factura-rapida')}
          >
            Crear Mi Primera Factura
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 