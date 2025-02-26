import { Box, Container, Typography, IconButton, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(45deg, #2962ff, #ff3d00)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 2, md: 0 },
            }}
          >
            <ReceiptLongIcon
              sx={{
                fontSize: 40,
                mr: 1,
                color: 'primary.main',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2962ff, #ff3d00)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FacturaApp
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            {[
              { icon: GitHubIcon, label: 'GitHub', url: 'https://github.com' },
              { icon: LinkedInIcon, label: 'LinkedIn', url: 'https://linkedin.com' },
              { icon: EmailIcon, label: 'Email', url: 'mailto:contacto@facturaapp.com' },
            ].map((social) => (
              <motion.div
                key={social.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <social.icon />
                </IconButton>
              </motion.div>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: { xs: 2, md: 0 } }}
          >
            © {currentYear} FacturaApp. Todos los derechos reservados.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['Términos', 'Privacidad', 'Soporte'].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
              >
                <Typography
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {item}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 