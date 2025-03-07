import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Gavel as GavelIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DocumentList from '../components/documents/DocumentList';
import DocumentForm from '../components/documents/DocumentForm';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import useAuthStore from '../store/authStore';
import useDocumentStore from '../store/documentStore';

const DRAWER_WIDTH = 280;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { documents, loadUserDocuments } = useDocumentStore();

  // Cargar documentos al iniciar
  useEffect(() => {
    if (user) {
      loadUserDocuments(user.id);
    }
  }, [user, loadUserDocuments]);

  const pendingDocuments = documents.filter(doc => doc.status === 'pending').length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleViewChange = (view, docType = null) => {
    setSelectedView(view);
    setSelectedDocType(docType);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleNewDocumentClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleNewDocumentMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleNewDocument = (type) => {
    setSelectedDocType(type);
    setIsFormOpen(true);
    handleNewDocumentMenuClose();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    // Recargar los documentos después de cerrar el formulario
    if (user) {
      loadUserDocuments(user.id, selectedDocType);
    }
  };

  // Agrupar los documentos por tipo
  const invoiceCount = documents.filter(doc => doc.type === 'invoice').length;
  const contractCount = documents.filter(doc => doc.type === 'contract').length;
  const legalDocCount = documents.filter(doc => doc.type === 'legal').length;

  const menuItems = [
    {
      section: 'Principal',
      items: [
        {
          text: 'Vista General',
          icon: <DashboardIcon />,
          view: 'overview',
        },
      ],
    },
    {
      section: 'Documentos',
      items: [
        {
          text: 'Todos los Documentos',
          icon: <DescriptionIcon />,
          view: 'documents',
          count: documents.length,
        },
        {
          text: 'Facturas',
          icon: <ReceiptIcon />,
          view: 'documents',
          docType: 'invoice',
          count: invoiceCount,
        },
        {
          text: 'Contratos',
          icon: <GavelIcon />,
          view: 'documents',
          docType: 'contract',
          count: contractCount,
        },
        {
          text: 'Documentos Legales',
          icon: <AssignmentIcon />,
          view: 'documents',
          docType: 'legal',
          count: legalDocCount,
        },
      ],
    },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          DocuFlow
        </Typography>
      </Toolbar>
      <Divider />
      {menuItems.map((section) => (
        <React.Fragment key={section.section}>
          <List>
            <ListItem>
              <Typography variant="subtitle2" color="textSecondary">
                {section.section.toUpperCase()}
              </Typography>
            </ListItem>
            {section.items.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedView === item.view && selectedDocType === item.docType}
                  onClick={() => handleViewChange(item.view, item.docType)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.count > 0 && (
                    <Badge badgeContent={item.count} color={item.docType === undefined && pendingDocuments > 0 ? 'error' : 'primary'} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </React.Fragment>
      ))}
      <List>
        <ListItem>
          <Typography variant="subtitle2" color="textSecondary">
            ACCIONES RÁPIDAS
          </Typography>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleNewDocumentClick}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Nuevo Documento" />
          </ListItemButton>
        </ListItem>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleNewDocumentMenuClose}
        >
          <MenuItem onClick={() => handleNewDocument('invoice')}>
            <ListItemIcon>
              <ReceiptIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Nueva Factura</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleNewDocument('contract')}>
            <ListItemIcon>
              <GavelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Nuevo Contrato</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleNewDocument('legal')}>
            <ListItemIcon>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Nuevo Documento Legal</ListItemText>
          </MenuItem>
        </Menu>
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (selectedView) {
      case 'documents':
        return <DocumentList type={selectedDocType} />;
      case 'overview':
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar - barra superior */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedDocType ? `${selectedDocType.charAt(0).toUpperCase() + selectedDocType.slice(1)}s` : 'Vista General'}
          </Typography>
          <Tooltip title="Notificaciones">
            <IconButton color="inherit">
              <Badge badgeContent={pendingDocuments} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Configuración">
            <IconButton color="inherit" onClick={() => navigate('/settings')}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Drawer - barra lateral */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundColor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Toolbar /> {/* Espacio para el AppBar */}
        <Box
          sx={{
            p: 3,
            flexGrow: 1,
            overflow: 'auto', // Permite scroll en el contenido principal
          }}
        >
          <Container maxWidth="xl">
            {renderContent()}
          </Container>
        </Box>
      </Box>

      {/* Modal de formulario */}
      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedDocType ? `Nuevo ${selectedDocType.charAt(0).toUpperCase() + selectedDocType.slice(1)}` : 'Nuevo Documento'}
          <IconButton
            aria-label="cerrar"
            onClick={handleFormClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DocumentForm
              type={selectedDocType}
              onSuccess={handleFormClose}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 