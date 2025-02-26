# FacturaApp

FacturaApp es una aplicación web moderna para la generación de facturas profesionales, diseñada para pequeñas y medianas empresas. Ofrece una interfaz intuitiva y diferentes plantillas para crear facturas personalizadas.

## Características

- 🎨 Tres plantillas de diseño: Profesional, Moderna y Clásica
- 🎨palette Personalización completa de colores y estilos
- 📱 Diseño responsive para todas las pantallas
- 💾 Generación de PDF de alta calidad
- 🖊️ Soporte para firma digital
- 🏢 Gestión de información de empresa y clientes
- 💰 Cálculo automático de impuestos y totales

## Tecnologías Utilizadas

- Frontend:
  - React + Vite
  - Material-UI (MUI)
  - React-PDF
  - Framer Motion

- Backend:
  - Node.js
  - Express
  - PDFMake
  - QRCode

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone https://github.com/tu-usuario/factura-app.git
cd factura-app
\`\`\`

2. Instalar dependencias del frontend:
\`\`\`bash
npm install
\`\`\`

3. Instalar dependencias del backend:
\`\`\`bash
cd backend
npm install
\`\`\`

## Configuración

1. Crear un archivo .env en la raíz del proyecto:
\`\`\`env
VITE_API_URL=http://localhost:5001
\`\`\`

2. Crear un archivo .env en la carpeta backend:
\`\`\`env
PORT=5001
\`\`\`

## Uso

1. Iniciar el servidor de desarrollo frontend:
\`\`\`bash
npm run dev
\`\`\`

2. Iniciar el servidor backend:
\`\`\`bash
cd backend
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:5173`

## Pruebas

Para ejecutar las pruebas de integración:
\`\`\`bash
npm run test
\`\`\`

Para ejecutar las pruebas end-to-end con Cypress:
\`\`\`bash
npm run test:e2e
\`\`\`

## Estructura del Proyecto

\`\`\`
factura-app/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas de la aplicación
│   ├── templates/     # Plantillas de facturas
│   ├── theme.js       # Configuración del tema
│   └── App.jsx        # Componente principal
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
├── public/           # Archivos estáticos
└── package.json
\`\`\`

## Contribución

1. Fork el proyecto
2. Crea una rama para tu función (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter)

Link del proyecto: [https://github.com/tu-usuario/factura-app](https://github.com/tu-usuario/factura-app)
