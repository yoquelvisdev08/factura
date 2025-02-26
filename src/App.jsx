import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FacturaRapida from './pages/FacturaRapida';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Navbar />
          <Box
            component="main"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.default',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/factura-rapida" element={<FacturaRapida />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
