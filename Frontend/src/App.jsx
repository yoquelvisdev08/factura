import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import useAuthStore from './store/authStore';
import theme from './theme';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FacturaRapida from './pages/FacturaRapida';
import ContratoRapido from './pages/ContratoRapido';
import DocumentoLegal from './pages/DocumentoLegal';

function App() {
  const { initializeAuth, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Las rutas que deberían mostrar el header y footer normales
  const isStandardLayout = (pathname) => {
    return !['/dashboard'].includes(pathname);
  };

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={
                <StandardLayout>
                  {user ? <Navigate to="/dashboard" replace /> : <LoginForm />}
                </StandardLayout>
              } />
              <Route path="/register" element={
                <StandardLayout>
                  {user ? <Navigate to="/dashboard" replace /> : <RegisterForm />}
                </StandardLayout>
              } />
              <Route path="/forgot-password" element={
                <StandardLayout>
                  {user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordForm />}
                </StandardLayout>
              } />
              <Route path="/" element={
                <StandardLayout>
                  <Home />
                </StandardLayout>
              } />
              
              {/* Rutas protegidas */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/factura-rapida" element={
                <ProtectedRoute>
                  <StandardLayout>
                    <FacturaRapida />
                  </StandardLayout>
                </ProtectedRoute>
              } />
              <Route path="/contrato-rapido" element={
                <ProtectedRoute>
                  <StandardLayout>
                    <ContratoRapido />
                  </StandardLayout>
                </ProtectedRoute>
              } />
              <Route path="/documento-legal" element={
                <ProtectedRoute>
                  <StandardLayout>
                    <DocumentoLegal />
                  </StandardLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

// Layout estándar con espacio para navbar y footer
const StandardLayout = ({ children }) => (
  <Box
    component="main"
    sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      width: '100%',
    }}
  >
    <Toolbar /> {/* Espacio para el navbar fijo */}
    <Box sx={{ flex: 1, p: 3 }}>
      {children}
    </Box>
    <Footer />
  </Box>
);

export default App;
