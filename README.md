# METEP - Análisis de Microparos en Procesos Industriales

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.5-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10.0-orange.svg)](https://firebase.google.com/)

## Estado del Proyecto

- **Desarrollo**: Completado
- **Testing**: Funcional
- **Deploy**: Activo en Vercel
- **Documentación**: Completa
- **Mantenimiento**: Activo

## Descripción del Proyecto

METEP es una aplicación web para medir la frecuencia de salida de piezas en líneas de producción industrial, detectando y categorizando microparos para análisis posterior. Permite realizar estudios de eficiencia y generar reportes en Excel.

## Arquitectura del Proyecto

### Estructura de Carpetas
```
METEP/
├── backend/                    # Servidor Node.js + Express
│   ├── src/
│   │   ├── controllers/        # Controladores de rutas
│   │   ├── middleware/         # Middleware personalizado
│   │   ├── models/            # Modelos de datos
│   │   ├── routes/            # Definición de rutas
│   │   ├── services/          # Lógica de negocio
│   │   ├── utils/             # Utilidades y helpers
│   │   └── config/            # Configuraciones
│   ├── package.json
│   └── .env.example
├── src/                        # Cliente React (Frontend)
│   ├── components/            # Componentes reutilizables
│   │   ├── Layout/           # Componentes de layout
│   │   ├── Study/            # Componentes de estudios
│   │   ├── Stopwatch/        # Componentes de cronómetro
│   │   └── UI/               # Componentes de interfaz
│   ├── pages/                # Páginas de la aplicación
│   ├── hooks/                # Hooks personalizados
│   ├── services/             # Servicios para APIs
│   ├── types/                # Tipos TypeScript
│   ├── context/              # Context API
│   └── config/               # Configuraciones del frontend
├── api/                       # API Routes (Vercel)
├── public/                    # Archivos estáticos
├── package.json               # Dependencias del frontend
├── vite.config.ts            # Configuración de Vite
└── README.md
```

### Arquitectura de Capas
- **Presentación**: React + TypeScript (Frontend)
- **API**: Express.js (Backend) + Vercel API Routes
- **Lógica de Negocio**: Services (Backend)
- **Persistencia**: Firebase Firestore
- **Autenticación**: Firebase Auth + JWT

## Funcionalidades Principales

### 1. Sistema de Autenticación
- Login/Registro con correo electrónico
- Validación de campos
- Manejo de errores
- Sesiones seguras con JWT

### 2. Gestión de Estudios
- Lista de estudios por usuario
- Crear nuevos estudios
- Editar estudios existentes
- Exportar estudios a Excel
- Eliminar registros

### 3. Captura de Tiempos
- Cronómetro con precisión de centésimas
- Botones: "Pieza Lista", "Pausar", "Reset"
- Registro automático de muestras
- Detección automática de microparos

### 4. Análisis de Datos
- Cálculo automático de desviaciones
- Categorización de microparos
- Generación de reportes Pareto
- Cálculo de eficiencia

## Tecnologías Utilizadas

### Frontend
- **React 18+** con TypeScript
- **React Router v7** para navegación
- **TailwindCSS** para estilos
- **Lucide React** para iconos
- **Axios** para peticiones HTTP
- **Vite** como build tool
- **React Hot Toast** para notificaciones

### Backend
- **Node.js 18+** runtime
- **Express.js** framework
- **JavaScript ES Modules**
- **JWT + Firebase Admin SDK** para autenticación
- **Helmet, CORS, Rate Limiting** para seguridad
- **Joi** para validación
- **Custom Logger** para logs
- **ExcelJS** para generación de reportes

### Base de Datos
- **Firebase Firestore** (NoSQL)
- **Firebase Auth** para autenticación
- **Firebase Admin SDK** para backend

### Deploy
- **Vercel** para frontend y API routes
- **Vercel Functions** para backend serverless

## Estructura de Pantallas

### Pantalla 1: Login/Registro
- Formulario de autenticación
- Validación en tiempo real
- Manejo de errores
- Diseño responsive

### Pantalla 2: Lista de Estudios
- Tarjetas de estudios del usuario
- Opciones para cada estudio:
  - Ver detalles
  - Exportar a Excel
  - Continuar editando
  - Agregar registros

### Pantalla 3: Estudio Individual
#### Pestaña 1: Captura de Tiempos
- Cronómetro (segundos y centésimas)
- Controles: Pieza Lista, Pausar, Reset
- Tabla de registros con columnas:
  - Número de muestra
  - Es microparo (Si/No)
  - Tiempo de ciclo
  - Desviación
  - Fecha y hora
  - Categoría de causa
  - Comentario

#### Pestaña 2: Datos del Estudio
- Responsable del estudio
- Supervisor
- Línea
- Modelo
- Familia
- Piezas por hora (rate)
- Taktime en segundos
- Tolerancia en segundos

## Exportación a Excel

### Hoja 1: Resumen del Estudio
- Datos completos del estudio
- Eficiencia calculada
- Cantidad de piezas medidas
- Cantidad de microparos detectados
- Tiempo total perdido

### Hoja 2: Todos los Registros
- Registro completo de todas las muestras
- Microparos y no microparos
- Todos los campos de datos

### Hoja 3: Solo Microparos
- Únicamente registros catalogados como microparos
- Datos detallados de cada microparo

### Hoja 4: Análisis Pareto
- Tabla para generar Pareto
- Campos: desviación, categoría de causa
- Gráfico de Pareto incluido

## Lógica de Negocio Crítica

### Detección de Microparos
```javascript
// Lógica para detectar microparos
const esMicroparo = (tiempoCiclo, taktime, tolerancia) => {
  return tiempoCiclo > (taktime + tolerancia);
};

// Cálculo de desviación
const calcularDesviacion = (tiempoCiclo, taktime) => {
  return tiempoCiclo - taktime;
};

// Cálculo de eficiencia
const calcularEficiencia = (taktime, piezasMedidas, tiempoTotal) => {
  return (taktime * piezasMedidas) / tiempoTotal;
};
```

### Reglas de Negocio
1. **Microparo**: Tiempo de ciclo > (taktime + tolerancia)
2. **Desviación**: tiempo_ciclo - taktime
3. **Eficiencia**: (taktime * piezas_medidas) / tiempo_total
4. **Cronómetro**: Precisión de centésimas de segundo
5. **Registros**: Automáticos al presionar "Pieza Lista"

## Restricciones Importantes

### NO HACER
- **NO usar Firebase Realtime Database** (usar solo Firestore)
- **NO hardcodear datos** (usar variables de entorno)
- **NO hacer llamadas API desde frontend** (solo desde backend)
- **NO mezclar lógica de negocio entre capas**
- **NO dejar logs de debug en producción**
- **NO repetir variables innecesariamente**

### SIEMPRE HACER
- Seguir arquitectura de capas
- Validar datos en backend
- Manejar errores consistentemente
- Mantener código modular y escalable
- Implementar diseño responsive (mobile-first)
- Usar TypeScript en frontend
- Seguir principios SOLID
- Separar responsabilidades

## Seguridad

### Medidas Implementadas
- Autenticación JWT
- Validación de entrada (Joi)
- Rate limiting
- CORS configurado
- Helmet para headers de seguridad
- Sanitización de inputs

### Variables de Entorno
```env
# Backend
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
JWT_SECRET=
PORT=3001

# Frontend
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_API_URL=http://localhost:3001/api
```

## Responsive Design

### Prioridades
1. **Mobile-first**: Diseño principal para móviles
2. **Cronómetro**: Legible en pantallas pequeñas
3. **Botones**: Tamaño adecuado para touch
4. **Tablas**: Scroll horizontal en móviles
5. **Navegación**: Optimizada para táctil

### Breakpoints TailwindCSS
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Testing

### Casos de Prueba Críticos
1. Detección correcta de microparos
2. Cálculo preciso de desviaciones
3. Funcionamiento del cronómetro
4. Exportación a Excel
5. Autenticación de usuarios
6. Responsive design

## Despliegue

### Requisitos
- Node.js 18+
- Firebase project configurado
- Variables de entorno establecidas

### Comandos de Desarrollo
```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install

# Ejecutar backend en modo desarrollo
npm run dev

# En otra terminal, ejecutar frontend
npm run dev
```

### Comandos de Calidad
```bash
# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
npm run format:check

# Type checking
npm run type-check

# Limpieza
npm run clean
```

### Puertos de Desarrollo
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Proxy**: Configurado en vite.config.ts

## Flujo de Desarrollo

### Modificaciones Permitidas
1. **Componentes**: Agregar/modificar componentes React
2. **Estilos**: Ajustar TailwindCSS
3. **Validaciones**: Mejorar validaciones Joi
4. **Reportes**: Modificar exportación Excel
5. **Performance**: Optimizar consultas

### Modificaciones Prohibidas
1. **Arquitectura**: Cambiar estructura de capas
2. **Tecnologías**: Sustituir stack tecnológico
3. **Base de datos**: Cambiar de Firestore
4. **Lógica de negocio**: Alterar cálculos críticos

## Checklist para Contribuidores

### Antes de Modificar
- [ ] Entender la arquitectura de capas
- [ ] Revisar reglas de negocio
- [ ] Verificar restricciones tecnológicas
- [ ] Comprobar diseño responsive

### Durante el Desarrollo
- [ ] Mantener separación frontend/backend
- [ ] Validar datos en backend
- [ ] Usar TypeScript correctamente
- [ ] Implementar manejo de errores
- [ ] Seguir convenciones de código

### Antes de Finalizar
- [ ] Probar en dispositivos móviles
- [ ] Verificar cálculos matemáticos
- [ ] Validar exportación Excel
- [ ] Revisar seguridad
- [ ] Eliminar logs de debug

## Contribución

Al editar este proyecto, mantén siempre:
- **Escalabilidad**: Código fácil de mantener
- **Modularidad**: Componentes reutilizables
- **Seguridad**: Validaciones robustas
- **Performance**: Optimización constante
- **Accesibilidad**: Usabilidad en móviles

---

**Nota**: Este README debe ser consultado antes de realizar cualquier modificación al proyecto para asegurar que se mantengan los estándares y restricciones establecidos.

## Configuración de Variables de Entorno

Para que la aplicación funcione correctamente, necesitas configurar las siguientes variables de entorno:

### Frontend (.env)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (.env)
```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Nota**: Si estás haciendo deploy sin configurar estas variables, la aplicación mostrará advertencias en la consola pero seguirá funcionando con valores por defecto.

## Deploy

La aplicación está configurada para funcionar con Vercel:

### Frontend + API Routes
- Deploy automático desde GitHub
- Configuración en `vercel.json`
- Variables de entorno en dashboard de Vercel

### Backend (Opcional)
- Puede ejecutarse como servidor independiente
- Configurado para puerto 3001
- Compatible con servicios como Railway, Render, etc.

## Nota sobre 'Modo de Falla'

En todas las tablas y reportes (Excel y la tabla de registros en la app) el título mostrado es 'Modo de Falla'. Sin embargo, para el manejo de datos y en el código, la variable utilizada sigue siendo 'categoriaCausa'. Este cambio es únicamente estético para mayor claridad en los reportes.

Para deploys que requieren configuración de variables de entorno, asegúrate de agregar todas las variables VITE_* y las variables del backend en la configuración del servicio de deploy.
