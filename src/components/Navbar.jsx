import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(45deg, #6366F1, #EC4899)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer' 
            }}
            onClick={() => navigate('/')}
          >
            <ReceiptLongIcon sx={{ fontSize: 32, mr: 1, color: 'white' }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'white',
              }}
            >
              FacturaApp
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={() => navigate('/factura-rapida')}
                sx={{
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  px: 3,
                }}
              >
                Factura Rápida
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 