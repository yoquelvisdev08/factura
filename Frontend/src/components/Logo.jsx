import { motion } from 'framer-motion';

const Logo = ({ width = 40, height = 40, color = 'currentColor' }) => {
  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Fondo circular con gradiente */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2196f3" />
          <stop offset="100%" stopColor="#512da8" />
        </linearGradient>
      </defs>

      {/* Círculo base */}
      <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />

      {/* Documento estilizado */}
      <motion.path
        d="M35 25H65C67.7614 25 70 27.2386 70 30V70C70 72.7614 67.7614 75 65 75H35C32.2386 75 30 72.7614 30 70V30C30 27.2386 32.2386 25 35 25Z"
        fill="white"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Líneas de documento */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <rect x="38" y="40" width="24" height="2" rx="1" fill="url(#logoGradient)" />
        <rect x="38" y="48" width="18" height="2" rx="1" fill="url(#logoGradient)" />
        <rect x="38" y="56" width="20" height="2" rx="1" fill="url(#logoGradient)" />
      </motion.g>

      {/* Flecha de flujo */}
      <motion.path
        d="M55 32C55 32 65 45 65 50C65 55 55 68 55 68"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.svg>
  );
};

export default Logo; 