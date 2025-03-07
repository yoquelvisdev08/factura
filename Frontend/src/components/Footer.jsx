import React from 'react';
import { Typography, Box, Container, Link, Divider, Stack } from '@mui/material';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              DocuFlow
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión documental sencilla e intuitiva
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Enlaces rápidos
            </Typography>
            <Link href="/" color="inherit" display="block" underline="hover">
              Inicio
            </Link>
            <Link href="/factura-rapida" color="inherit" display="block" underline="hover">
              Facturas
            </Link>
            <Link href="/contrato-rapido" color="inherit" display="block" underline="hover">
              Contratos
            </Link>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Soporte
            </Typography>
            <Link href="/help" color="inherit" display="block" underline="hover">
              Centro de ayuda
            </Link>
            <Link href="/contact" color="inherit" display="block" underline="hover">
              Contacto
            </Link>
          </Box>
        </Stack>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} DocuFlow. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 