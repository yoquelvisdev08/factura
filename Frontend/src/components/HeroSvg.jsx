import { motion } from 'framer-motion';

const HeroSvg = () => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Fondo con gradiente */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2196f3" />
          <stop offset="100%" stopColor="#512da8" />
        </linearGradient>
      </defs>

      {/* Dashboard Frame */}
      <motion.rect
        x="100"
        y="50"
        width="600"
        height="400"
        rx="20"
        fill="white"
        stroke="url(#gradient)"
        strokeWidth="2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Header Bar */}
      <motion.rect
        x="120"
        y="70"
        width="560"
        height="50"
        rx="10"
        fill="#f5f5f5"
        initial={{ width: 0 }}
        animate={{ width: 560 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      {/* Document Icons - Animated */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + i * 0.2 }}
        >
          <rect
            x={150 + i * 200}
            y="150"
            width="140"
            height="180"
            rx="10"
            fill={i === 0 ? '#bbdefb' : i === 1 ? '#e1bee7' : '#c8e6c9'}
          />
          <rect
            x={170 + i * 200}
            y="170"
            width="100"
            height="10"
            rx="5"
            fill="white"
          />
          <rect
            x={170 + i * 200}
            y="190"
            width="80"
            height="10"
            rx="5"
            fill="white"
          />
        </motion.g>
      ))}

      {/* Floating Elements */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={`circle-${i}`}
          cx={200 + i * 150}
          cy={400}
          r="15"
          fill="url(#gradient)"
          initial={{ y: 50, opacity: 0 }}
          animate={{ 
            y: [0, -20, 0],
            opacity: 1
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.2
            },
            opacity: { duration: 0.5, delay: 1 + i * 0.2 }
          }}
        />
      ))}

      {/* Animated Lines */}
      {[0, 1, 2].map((i) => (
        <motion.line
          key={`line-${i}`}
          x1={150 + i * 200}
          y1="360"
          x2={290 + i * 200}
          y2="360"
          stroke="url(#gradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1 + i * 0.2 }}
        />
      ))}
    </motion.svg>
  );
};

export default HeroSvg; 