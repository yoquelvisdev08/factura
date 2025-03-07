# DocuFlow (anteriormente FacturaApp)

DocuFlow es una aplicación web moderna para la gestión integral de documentos empresariales, incluyendo facturas, contratos y documentos legales. Diseñada para pequeñas y medianas empresas, ofrece una interfaz intuitiva y diferentes plantillas para crear y gestionar documentos profesionales.

![DocuFlow](https://via.placeholder.com/800x400?text=DocuFlow+Platform)

## Características Principales

### 📄 Gestión de Documentos
- **Sistema unificado de gestión documental** - Almacena y accede a todos tus documentos en un solo lugar
- **Dashboard interactivo con visualizaciones** - Obtén insights valiosos sobre tu documentación
- **Búsqueda y filtrado avanzado** - Encuentra rápidamente cualquier documento
- **Organización por categorías y etiquetas** - Mantén tus documentos ordenados con facilidad
- **Acceso desde cualquier dispositivo** - Diseño responsive para todas las pantallas

### 📊 Análisis y Estadísticas
- **Gráficos interactivos de distribución** - Visualiza los tipos de documentos y su estado
- **Análisis de tendencias** - Observa patrones en la creación de documentos a lo largo del tiempo
- **Indicadores de rendimiento** - Métricas importantes presentadas de forma clara
- **Dashboard personalizable** - Configura las visualizaciones más relevantes para tu negocio
- **Exportación de reportes** - Comparte y analiza los datos cuando lo necesites

### 🔔 Sistema de Notificaciones
- **Centro de notificaciones integrado** - Recibe alertas en tiempo real
- **Configuración de preferencias** - Personaliza qué notificaciones quieres recibir
- **Seguimiento de vencimientos** - Nunca olvides una fecha importante
- **Alertas de aprobaciones pendientes** - Mantente informado sobre documentos que requieren tu atención
- **Historial de actividad** - Revisa todas las notificaciones anteriores

### ✍️ Firma Digital
- **Herramienta de dibujo de firma** - Crea tu firma personal directamente en la plataforma
- **Múltiples opciones de color** - Personaliza el aspecto de tu firma
- **Almacenamiento seguro** - Guarda tu firma para uso futuro
- **Aplicación en documentos** - Agrega tu firma a cualquier documento con un solo clic
- **Descarga de firma** - Exporta tu firma digital para uso externo

### 🎨 Plantillas y Personalización
- **Tres diseños para facturas** - Profesional, Moderna y Clásica
- **Plantillas de contratos legales** - Adaptadas a diferentes necesidades empresariales
- **Personalización de colores y estilos** - Adapta los documentos a tu identidad corporativa
- **Editor visual intuitivo** - No se requieren conocimientos técnicos
- **Previsualización en tiempo real** - Ve los cambios mientras editas

### 🔐 Seguridad Avanzada
- **Autenticación con Supabase** - Gestión segura de usuarios
- **Control de roles y permisos** - Define quién puede ver y editar cada documento
- **Encriptación de documentos sensibles** - Protección adicional para información confidencial
- **Autenticación de dos factores** - Capa extra de seguridad para tu cuenta
- **Registros de auditoría** - Seguimiento de todas las actividades en el sistema

## Tecnologías Utilizadas

### Frontend
- ⚛️ React 18 + Vite - Para una experiencia de usuario rápida y fluida
- 🎨 Material-UI (MUI) - Componentes estilizados y responsivos
- 🗃️ Zustand - Gestión de estado simple y efectiva
- 🚀 React Router 6 - Navegación optimizada
- 📄 React-PDF - Generación y visualización de PDFs
- 📊 Recharts - Gráficos interactivos y visualizaciones de datos
- ✨ Framer Motion - Animaciones fluidas y profesionales
- 🔄 Supabase Client - Integración con el backend

### Backend
- 🟢 Node.js - Entorno de ejecución para JavaScript
- 🛠️ Express - Framework web rápido y minimalista
- 📊 Supabase - Base de datos, autenticación y almacenamiento
- 📄 PDFMake - Creación programática de PDFs
- 🔐 JWT - Autenticación segura mediante tokens
- 📱 QRCode - Generación de códigos QR para documentos

## Pantallas Principales

### 🏠 Home
- **Página de inicio atractiva** con ilustraciones SVG personalizadas
- **Sección de características** mostrando las funcionalidades principales
- **Muestra de plantillas** disponibles en la plataforma
- **Llamada a la acción** para registro y prueba gratuita

### 📊 Dashboard
- **Vista general** con estadísticas de documentos
- **Gráficos interactivos** mostrando distribución y tendencias
- **Documentos recientes** para acceso rápido
- **Acciones rápidas** para crear nuevos documentos
- **Herramientas de productividad** como firma digital

### 📄 Gestión de Documentos
- **Lista de documentos** con opciones de filtrado y búsqueda
- **Vista detallada** de cada documento
- **Opciones de edición** y personalización
- **Herramientas de colaboración** para compartir documentos
- **Exportación en múltiples formatos** (PDF, CSV, etc.)

### ✏️ Editor de Documentos
- **Interfaz intuitiva** de creación y edición
- **Personalización de plantillas** en tiempo real
- **Cálculos automáticos** para facturas y presupuestos
- **Integración con firma digital** para documentos legales
- **Guardado automático** para no perder cambios

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta en Supabase

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/docuflow.git
cd docuflow
```

2. Instalar dependencias del frontend:
```bash
cd Frontend
npm install
```

3. Instalar dependencias del backend:
```bash
cd backend
npm install
```

## Configuración

1. Crear un archivo .env en la carpeta Frontend:
```env
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
VITE_API_URL=http://localhost:5001
```

2. Crear un archivo .env en la carpeta backend:
```env
PORT=5001
SUPABASE_URL=tu-url-de-supabase
SUPABASE_SERVICE_KEY=tu-clave-de-servicio-de-supabase
JWT_SECRET=tu-secreto-jwt
```

## Estructura del Proyecto

```
docuflow/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Componentes de autenticación
│   │   │   ├── dashboard/       # Componentes del dashboard
│   │   │   ├── documents/       # Componentes de gestión de documentos
│   │   │   ├── illustrations/   # Ilustraciones SVG personalizadas
│   │   │   └── shared/          # Componentes compartidos
│   │   ├── hooks/              # Hooks personalizados
│   │   ├── layouts/            # Layouts de la aplicación
│   │   ├── pages/              # Páginas de la aplicación
│   │   ├── services/           # Servicios de API y Supabase
│   │   ├── store/              # Estado global con Zustand
│   │   ├── templates/          # Plantillas de documentos
│   │   └── utils/              # Utilidades y helpers
│   ├── public/                 # Archivos estáticos
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/        # Controladores de la API
│   │   ├── middleware/         # Middleware personalizado
│   │   ├── routes/             # Rutas de la API
│   │   ├── services/           # Servicios de negocio
│   │   ├── config/             # Configuraciones
│   │   └── index.js            # Entrada de la aplicación
│   └── package.json
└── README.md
```

## Scripts Disponibles

### Frontend
```bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Construye la aplicación para producción
npm run preview   # Vista previa de la versión de producción
npm run lint      # Ejecuta el linter
npm run test      # Ejecuta las pruebas
```

### Backend
```bash
npm run dev       # Inicia el servidor en modo desarrollo
npm run start     # Inicia el servidor en modo producción
npm run test      # Ejecuta las pruebas
```

## Mejoras Recientes

- ✅ Sistema de análisis interactivo con gráficos
- ✅ Implementación de notificaciones en tiempo real
- ✅ Herramienta integrada de firma digital
- ✅ Mejora de la interfaz de usuario con animaciones
- ✅ Vista de dashboard con pestañas organizadas
- ✅ Explorador de plantillas con miniaturas

## Próximas Funcionalidades

- [ ] Integración con servicios de firma digital de terceros
- [ ] Exportación masiva de documentos
- [ ] Creación de plantillas personalizadas por el usuario
- [ ] API pública para integraciones
- [ ] Panel de administración avanzado
- [ ] Aplicación móvil nativa

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

Link del proyecto: [https://github.com/tu-usuario/docuflow](https://github.com/tu-usuario/docuflow)
