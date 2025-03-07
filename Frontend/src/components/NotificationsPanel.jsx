import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider,
  Button,
  Tooltip,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Gavel as GavelIcon,
  DeleteOutline as DeleteIcon,
  Check as CheckIcon,
  DoNotDisturbOn as DoNotDisturbIcon,
  MarkEmailRead as MarkReadIcon,
  NotificationsActive as NotificationActiveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useDocumentStore from '../store/documentStore';

// Mock data para notificaciones
const mockNotifications = [
  {
    id: 1,
    title: 'Factura pendiente de revisión',
    message: 'La factura #2023-001 está pendiente de revisión y firma.',
    type: 'invoice',
    documentId: '001',
    read: false,
    date: new Date(Date.now() - 3600000), // 1 hora atrás
  },
  {
    id: 2,
    title: 'Contrato creado con éxito',
    message: 'El contrato de servicios ha sido creado exitosamente.',
    type: 'contract',
    documentId: '002',
    read: true,
    date: new Date(Date.now() - 86400000), // 1 día atrás
  },
  {
    id: 3,
    title: 'Documento legal expirado',
    message: 'El documento legal de autorización ha expirado. Por favor, renuévelo.',
    type: 'legal',
    documentId: '003',
    read: false,
    date: new Date(Date.now() - 172800000), // 2 días atrás
  },
  {
    id: 4,
    title: 'Factura pagada',
    message: 'La factura #2023-002 ha sido marcada como pagada.',
    type: 'invoice',
    documentId: '004',
    read: false,
    date: new Date(Date.now() - 259200000), // 3 días atrás
  },
];

const NotificationsPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { documents } = useDocumentStore();

  // Cargar notificaciones (simulando una carga desde API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000); // Simular tiempo de carga

    return () => clearTimeout(timer);
  }, []);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleReadNotification = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDeleteNotification = (id, event) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    // Marcar como leída
    handleReadNotification(notification.id);
    
    // Navegar según el tipo
    switch (notification.type) {
      case 'invoice':
        navigate(`/factura-rapida?id=${notification.documentId}`);
        break;
      case 'contract':
        navigate(`/contrato-rapido?id=${notification.documentId}`);
        break;
      case 'legal':
        navigate(`/documento-legal?id=${notification.documentId}`);
        break;
      default:
        navigate('/dashboard');
    }
    
    handleCloseMenu();
  };

  // Obtener el icono según el tipo de documento
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'invoice':
        return <ReceiptIcon />;
      case 'contract':
        return <GavelIcon />;
      case 'legal':
        return <DescriptionIcon />;
      default:
        return <NotificationActiveIcon />;
    }
  };

  // Formato de fecha relativo (ej: "hace 2 horas")
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDays = Math.round(diffHr / 24);

    if (diffSec < 60) {
      return `hace ${diffSec} segundos`;
    } else if (diffMin < 60) {
      return `hace ${diffMin} minutos`;
    } else if (diffHr < 24) {
      return `hace ${diffHr} horas`;
    } else if (diffDays === 1) {
      return `ayer`;
    } else {
      return `hace ${diffDays} días`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton
          color="inherit"
          onClick={handleOpenMenu}
          size="large"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: { 
            width: 360,
            maxHeight: 500,
            overflowY: 'auto',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Notificaciones
          </Typography>
        </Box>
        
        <Divider />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : notifications.length > 0 ? (
          <>
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItemButton 
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(25, 118, 210, 0.12)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: notification.type === 'invoice' 
                            ? 'primary.light' 
                            : notification.type === 'contract' 
                              ? 'secondary.light' 
                              : 'info.light',
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: notification.read ? 'normal' : 'bold',
                            color: notification.read ? 'text.primary' : 'primary.main',
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" noWrap>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getRelativeTime(notification.date)}
                          </Typography>
                        </>
                      }
                    />
                    <Box>
                      {!notification.read && (
                        <Tooltip title="Marcar como leído">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReadNotification(notification.id);
                            }}
                            sx={{ mr: 1 }}
                          >
                            <MarkReadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemButton>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between' 
            }}>
              <Button
                size="small"
                startIcon={<CheckIcon />}
                onClick={handleMarkAllAsRead}
                disabled={!notifications.some(n => !n.read)}
              >
                Marcar todo como leído
              </Button>
              <Button
                size="small"
                startIcon={<DoNotDisturbIcon />}
                onClick={handleClearAll}
              >
                Borrar todo
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No hay notificaciones
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationsPanel; 