import React from 'react';
import { Box, useTheme } from '@mui/material';

// Ilustraciones SVG para las características
export const DocumentsIllustration = ({ width = 200, height = 200 }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="40" y="30" width="120" height="140" rx="8" fill={theme.palette.background.paper} stroke={theme.palette.primary.main} strokeWidth="2" />
      <rect x="55" y="50" width="90" height="10" rx="2" fill={theme.palette.primary.light} opacity="0.7" />
      <rect x="55" y="70" width="70" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="55" y="85" width="90" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="55" y="100" width="50" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="55" y="120" width="90" height="30" rx="3" fill={theme.palette.background.default} stroke={theme.palette.primary.main} strokeWidth="1" />
      <rect x="60" y="135" width="40" height="5" rx="2" fill={theme.palette.primary.main} opacity="0.8" />
      <rect x="30" y="40" width="120" height="140" rx="8" fill={theme.palette.background.paper} stroke={theme.palette.secondary.main} strokeWidth="2" />
      <rect x="45" y="60" width="90" height="10" rx="2" fill={theme.palette.secondary.light} opacity="0.7" />
      <rect x="45" y="80" width="70" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="45" y="95" width="90" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="45" y="110" width="50" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="45" y="130" width="90" height="30" rx="3" fill={theme.palette.background.default} stroke={theme.palette.secondary.main} strokeWidth="1" />
      <rect x="50" y="145" width="40" height="5" rx="2" fill={theme.palette.secondary.main} opacity="0.8" />
      <rect x="20" y="50" width="120" height="140" rx="8" fill={theme.palette.background.paper} stroke={theme.palette.info.main} strokeWidth="2" />
      <rect x="35" y="70" width="90" height="10" rx="2" fill={theme.palette.info.light} opacity="0.7" />
      <rect x="35" y="90" width="70" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="35" y="105" width="90" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="35" y="120" width="50" height="6" rx="2" fill={theme.palette.text.secondary} opacity="0.5" />
      <rect x="35" y="140" width="90" height="30" rx="3" fill={theme.palette.background.default} stroke={theme.palette.info.main} strokeWidth="1" />
      <rect x="40" y="155" width="40" height="5" rx="2" fill={theme.palette.info.main} opacity="0.8" />
    </Box>
  );
};

export const AnalyticsIllustration = ({ width = 200, height = 200 }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="20" width="160" height="160" rx="8" fill={theme.palette.background.paper} stroke={theme.palette.divider} strokeWidth="2" />
      <rect x="35" y="40" width="130" height="15" rx="3" fill={theme.palette.primary.light} opacity="0.3" />
      <rect x="35" y="70" width="40" height="90" rx="3" fill={theme.palette.primary.main} />
      <rect x="85" y="100" width="40" height="60" rx="3" fill={theme.palette.secondary.main} />
      <rect x="135" y="80" width="40" height="80" rx="3" fill={theme.palette.info.main} />
      <line x1="35" y1="170" x2="165" y2="170" stroke={theme.palette.text.secondary} strokeWidth="2" />
      <line x1="35" y1="70" x2="35" y2="170" stroke={theme.palette.text.secondary} strokeWidth="2" />
      <circle cx="35" cy="70" r="3" fill={theme.palette.error.main} />
      <circle cx="85" cy="100" r="3" fill={theme.palette.error.main} />
      <circle cx="135" cy="80" r="3" fill={theme.palette.error.main} />
      <path d="M35 70L85 100L135 80" stroke={theme.palette.error.main} strokeWidth="2" strokeDasharray="4 4" />
    </Box>
  );
};

export const SignatureIllustration = ({ width = 200, height = 200 }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="40" width="160" height="120" rx="8" fill={theme.palette.background.paper} stroke={theme.palette.divider} strokeWidth="2" />
      <path d="M40 120C60 80 80 150 100 100C110 80 130 70 150 110" stroke={theme.palette.primary.main} strokeWidth="3" strokeLinecap="round" />
      <path d="M40 110C70 100 90 130 110 90C120 70 140 80 160 100" stroke={theme.palette.secondary.main} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 3" />
      <rect x="20" y="170" width="160" height="1" fill={theme.palette.divider} />
      <circle cx="55" cy="180" r="8" fill={theme.palette.primary.main} />
      <circle cx="85" cy="180" r="8" fill={theme.palette.secondary.main} />
      <circle cx="115" cy="180" r="8" fill={theme.palette.error.main} />
      <circle cx="145" cy="180" r="8" fill={theme.palette.info.main} />
    </Box>
  );
};

export const NotificationsIllustration = ({ width = 200, height = 200 }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="50" y="30" width="100" height="140" rx="8" fill={theme.palette.background.paper} stroke={theme.palette.divider} strokeWidth="2" />
      <rect x="60" y="50" width="80" height="15" rx="3" fill={theme.palette.primary.main} opacity="0.8" />
      <rect x="60" y="75" width="80" height="10" rx="2" fill={theme.palette.text.secondary} opacity="0.3" />
      <rect x="60" y="95" width="80" height="10" rx="2" fill={theme.palette.text.secondary} opacity="0.3" />
      <rect x="60" y="115" width="80" height="10" rx="2" fill={theme.palette.text.secondary} opacity="0.3" />
      <rect x="60" y="135" width="80" height="10" rx="2" fill={theme.palette.text.secondary} opacity="0.3" />
      <circle cx="150" cy="50" r="20" fill={theme.palette.error.main} />
      <text x="150" y="55" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16">3</text>
      <circle cx="170" cy="100" r="15" fill={theme.palette.primary.main} />
      <path d="M170 93V107M163 100H177" stroke="white" strokeWidth="2" />
      <circle cx="30" cy="130" r="15" fill={theme.palette.secondary.main} />
      <path d="M30 123V137M23 130H37" stroke="white" strokeWidth="2" />
      <circle cx="170" cy="160" r="15" fill={theme.palette.info.main} />
      <path d="M170,153 l0,7 l-7,0 M170,153 l0,14 l7,0" stroke="white" strokeWidth="2" fill="none" />
    </Box>
  );
};

export const SecurityIllustration = ({ width = 200, height = 200 }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M100 30L40 60V110C40 150 65 175 100 190C135 175 160 150 160 110V60L100 30Z" fill={theme.palette.primary.light} opacity="0.2" stroke={theme.palette.primary.main} strokeWidth="2" />
      <rect x="70" y="90" width="60" height="40" rx="4" fill={theme.palette.background.paper} stroke={theme.palette.primary.main} strokeWidth="2" />
      <circle cx="100" cy="105" r="10" fill={theme.palette.primary.main} />
      <rect x="95" y="105" width="10" height="15" rx="2" fill={theme.palette.primary.main} />
      <path d="M85 80C85 74.4772 89.4772 70 95 70H105C110.523 70 115 74.4772 115 80V90H85V80Z" fill={theme.palette.background.paper} stroke={theme.palette.secondary.main} strokeWidth="2" />
      <path d="M100 85V75M95 80H105" stroke={theme.palette.secondary.main} strokeWidth="2" />
    </Box>
  );
};

export const DocuFlowLogo = ({ width = 200, height = 80 }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.palette.primary.main} />
          <stop offset="100%" stopColor={theme.palette.secondary.main} />
        </linearGradient>
      </defs>
      
      {/* Documento */}
      <rect x="30" y="15" width="40" height="50" rx="5" fill="white" stroke="url(#logoGradient)" strokeWidth="2.5" />
      <rect x="38" y="25" width="24" height="3" rx="1.5" fill={theme.palette.primary.main} opacity="0.7" />
      <rect x="38" y="33" width="24" height="3" rx="1.5" fill={theme.palette.primary.main} opacity="0.5" />
      <rect x="38" y="41" width="15" height="3" rx="1.5" fill={theme.palette.primary.main} opacity="0.3" />
      <rect x="38" y="49" width="24" height="3" rx="1.5" fill={theme.palette.primary.main} opacity="0.5" />
      
      {/* Flecha de flujo */}
      <path 
        d="M80 40 C90 40, 90 15, 105 15 L130 15" 
        stroke="url(#logoGradient)" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round"
      />
      <path 
        d="M125 10 L135 15 L125 20" 
        stroke="url(#logoGradient)" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Texto */}
      <text x="80" y="55" fontFamily="Arial" fontSize="26" fontWeight="bold" fill="url(#logoGradient)">DocuFlow</text>
      
      {/* Texto pequeño */}
      <text x="83" y="65" fontFamily="Arial" fontSize="10" fill={theme.palette.text.secondary}>Gestión documental inteligente</text>
    </Box>
  );
};

export const AppIllustration = ({ width = 500, height = 300 }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox="0 0 500 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="appGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.palette.primary.main} />
          <stop offset="100%" stopColor={theme.palette.secondary.main} />
        </linearGradient>
      </defs>
      
      {/* Fondo */}
      <rect x="50" y="30" width="400" height="240" rx="10" fill={theme.palette.background.paper} stroke={theme.palette.divider} strokeWidth="2" />
      
      {/* Barra de navegación */}
      <rect x="50" y="30" width="400" height="40" rx="10" fill="url(#appGradient)" />
      <circle cx="430" cy="50" r="15" fill="white" opacity="0.9" />
      <text x="430" y="55" textAnchor="middle" fontSize="16" fontWeight="bold" fill={theme.palette.primary.main}>YA</text>
      
      {/* Sidebar */}
      <rect x="50" y="70" width="100" height="200" fill={theme.palette.background.default} />
      <rect x="70" y="90" width="60" height="8" rx="4" fill={theme.palette.primary.light} />
      <rect x="70" y="110" width="60" height="8" rx="4" fill={theme.palette.text.secondary} opacity="0.3" />
      <rect x="70" y="130" width="60" height="8" rx="4" fill={theme.palette.text.secondary} opacity="0.3" />
      <rect x="70" y="150" width="60" height="8" rx="4" fill={theme.palette.text.secondary} opacity="0.3" />
      <rect x="70" y="170" width="60" height="8" rx="4" fill={theme.palette.text.secondary} opacity="0.3" />
      
      {/* Contenido Principal - Vista de Dashboard */}
      <rect x="160" y="90" width="80" height="50" rx="5" fill={theme.palette.primary.light} opacity="0.2" stroke={theme.palette.primary.main} />
      <rect x="250" y="90" width="80" height="50" rx="5" fill={theme.palette.secondary.light} opacity="0.2" stroke={theme.palette.secondary.main} />
      <rect x="340" y="90" width="80" height="50" rx="5" fill={theme.palette.info.light} opacity="0.2" stroke={theme.palette.info.main} />
      
      {/* Gráfico */}
      <rect x="160" y="150" width="120" height="80" rx="5" fill={theme.palette.background.default} stroke={theme.palette.divider} />
      <circle cx="190" cy="170" r="15" fill={theme.palette.primary.main} opacity="0.7" />
      <circle cx="230" cy="170" r="10" fill={theme.palette.secondary.main} opacity="0.7" />
      <circle cx="260" cy="170" r="5" fill={theme.palette.info.main} opacity="0.7" />
      <text x="220" y="200" textAnchor="middle" fontSize="12" fill={theme.palette.text.primary}>Estadísticas</text>
      
      {/* Documentos Recientes */}
      <rect x="290" y="150" width="130" height="80" rx="5" fill={theme.palette.background.default} stroke={theme.palette.divider} />
      <rect x="300" y="165" width="110" height="10" rx="2" fill={theme.palette.text.secondary} opacity="0.3" />
      <rect x="300" y="185" width="110" height="10" rx="2" fill={theme.palette.text.secondary} opacity="0.3" />
      <rect x="300" y="205" width="110" height="10" rx="2" fill={theme.palette.text.secondary} opacity="0.3" />
      <text x="355" y="230" textAnchor="middle" fontSize="12" fill={theme.palette.text.primary}>Documentos Recientes</text>
      
      {/* Logo */}
      <text x="100" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">DocuFlow</text>
    </Box>
  );
};

export default {
  DocumentsIllustration,
  AnalyticsIllustration,
  SignatureIllustration,
  NotificationsIllustration,
  SecurityIllustration,
  DocuFlowLogo,
  AppIllustration
}; 