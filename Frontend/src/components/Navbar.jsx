import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  Stack,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Logo from './Logo';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GavelIcon from '@mui/icons-material/Gavel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsPanel from './NotificationsPanel';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleCloseUserMenu();
    navigate('/');
  };

  // Menú para usuarios autenticados
  const renderAuthLinks = (isMobile) => (
    <>
      <Button 
        component={Link} 
        to="/dashboard" 
        color="inherit" 
        sx={{ 
          mx: 1,
          display: isMobile ? 'none' : 'block'
        }}
      >
        Dashboard
      </Button>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/factura-rapida" onClick={handleMenuClose}>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Factura Rápida</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/contrato-rapido" onClick={handleMenuClose}>
          <ListItemIcon>
            <GavelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Contrato Rápido</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/documento-legal" onClick={handleMenuClose}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Documento Legal</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cerrar Sesión</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={1}
      sx={{ 
        backgroundColor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Toolbar>
        {/* Logo y Nombre */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontWeight: 700,
            color: 'primary.main',
            textDecoration: 'none',
          }}
        >
          DocuFlow
        </Typography>

        {/* Menú móvil */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {/* Menú móvil para usuarios no autenticados */}
            {!user ? (
              <>
                <MenuItem 
                  component={Link} 
                  to="/login" 
                  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Iniciar Sesión</Typography>
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/register" 
                  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Registrarse</Typography>
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem 
                  component={Link} 
                  to="/dashboard" 
                  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/factura-rapida" 
                  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Factura Rápida</Typography>
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/contrato-rapido" 
                  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Contrato Rápido</Typography>
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/documento-legal" 
                  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Documento Legal</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Cerrar Sesión</Typography>
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
        
        {/* Logo para móvil */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontWeight: 700,
            color: 'primary.main',
            textDecoration: 'none',
          }}
        >
          DocuFlow
        </Typography>

        {/* Links de navegación para desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {user ? (
            <Button
              component={Link}
              to="/dashboard"
              sx={{ my: 2, color: 'text.primary', display: 'block' }}
            >
              Dashboard
            </Button>
          ) : null}
        </Box>

        {/* Botones de autenticación o usuario */}
        <Box sx={{ flexGrow: 0 }}>
          {user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsPanel />
                
                <Tooltip title="Opciones">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                    <Avatar 
                      alt={user.full_name} 
                      src={user.avatar_url}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white'
                      }}
                    >
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem 
                  component={Link} 
                  to="/dashboard" 
                  onClick={handleCloseUserMenu}
                >
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/profile" 
                  onClick={handleCloseUserMenu}
                >
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Mi Perfil</ListItemText>
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/settings" 
                  onClick={handleCloseUserMenu}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Configuración</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cerrar Sesión</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="primary"
              >
                Iniciar Sesión
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="primary"
              >
                Registrarse
              </Button>
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 