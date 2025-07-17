# PROMPT PARA BOLT.NEW - PROYECTO METEP

Crea una aplicación web para análisis de microparos en procesos industriales con las siguientes especificaciones:

## DESCRIPCIÓN DEL PROYECTO
Desarrollar una herramienta web que permita medir la frecuencia con la que sale cada pieza en una línea de producción, detectando y categorizando microparos para análisis posterior.

## TECNOLOGÍAS REQUERIDAS

### Frontend (React.js)
- Framework: React 18+ con TypeScript
- Routing: React Router v6
- Styling: TailwindCSS
- Icons: Lucide React
- HTTP Client: Axios
- Build Tool: Vite

### Backend (Node.js + Express)
- Runtime: Node.js 18+
- Framework: Express.js
- Language: JavaScript ES Modules
- Authentication: JWT + Firebase Admin SDK
- Security: Helmet, CORS, Rate Limiting
- Validation: Joi
- Logging: Custom Logger Utility

### Base de Datos y Autenticación
- Database: Firebase Firestore (NoSQL)
- Authentication: Firebase Auth
- Admin SDK: Firebase Admin (backend)

## ESTRUCTURA DEL PROYECTO
```
backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── config/
├── package.json
└── .env.example

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── context/
├── package.json
└── vite.config.ts
```

## FUNCIONALIDADES ESPECÍFICAS

### 1. PANTALLA DE LOGIN/REGISTRO
- Autenticación con correo electrónico
- Validación de campos
- Manejo de errores
- Diseño responsive

### 2. PANTALLA DE ESTUDIOS
- Lista de estudios del usuario
- Opciones para cada estudio:
  - Ver detalles
  - Exportar a Excel
  - Continuar editando
  - Agregar nuevos registros

### 3. PANTALLA DE ESTUDIO INDIVIDUAL
Debe tener 2 pestañas:

#### Pestaña 1: Captura de Tiempos
- Cronómetro con segundos y centésimas
- 3 botones: "Pieza Lista", "Pausar", "Reset"
- Tabla de registros con columnas:
  - Número de muestra
  - Es microparo (Si/No)
  - Tiempo de ciclo
  - Desviación
  - Fecha
  - Hora
  - Categoría de causa
  - Comentario

#### Pestaña 2: Datos del Estudio
Campos de configuración:
- Responsable del estudio
- Supervisor
- Línea
- Modelo
- Familia
- Piezas por hora (rate)
- Taktime en segundos
- Tolerancia en segundos

### 4. FUNCIONALIDADES ADICIONALES
- Botón para exportar a Excel
- Botón para limpiar registros
- Cálculo automático de desviaciones
- Detección automática de microparos

## EXPORTACIÓN A EXCEL (4 HOJAS)

### Hoja 1: Resumen del Estudio
- Todos los datos del estudio
- Eficiencia calculada
- Cantidad de piezas medidas
- Cantidad de microparos detectados
- Tiempo total perdido en microparos

### Hoja 2: Todos los Registros
- Todos los registros (microparos y no microparos)
- Todos los campos de datos

### Hoja 3: Solo Microparos
- Únicamente registros catalogados como microparos
- Todos sus datos asociados

### Hoja 4: Análisis Pareto
- Tabla con datos para generar Pareto
- Campos: desviación, categoría de causa (sin comentario)
- Gráfico de Pareto incluido

## REQUISITOS TÉCNICOS

### Arquitectura
- Arquitectura de capas bien definida
- Separación clara entre frontend y backend
- Código modular y escalable
- Implementación de patrones de diseño

### Seguridad
- Validación de datos en backend
- Autenticación JWT
- Protección contra CORS
- Rate limiting
- Sanitización de inputs

### Buenas Prácticas
- Código TypeScript en frontend
- Manejo de errores consistente
- Logging apropiado
- Variables de entorno
- No hardcodear datos
- Reutilización de componentes
- Separación de responsabilidades

### Responsive Design
- Diseño mobile-first
- Adaptación a diferentes tamaños de pantalla
- Navegación optimizada para móvil
- Botones y controles accesibles en táctil

## LÓGICA DE NEGOCIO

### Detección de Microparos
- Comparar tiempo de ciclo vs taktime + tolerancia
- Si tiempo > (taktime + tolerancia) = microparo
- Categorizar automáticamente

### Cálculos Automáticos
- Desviación = tiempo_ciclo - taktime
- Eficiencia = (taktime * piezas_medidas) / tiempo_total
- Detección automática de microparos

## CONFIGURACIÓN INICIAL
- Variables de entorno para Firebase
- Configuración de CORS
- Middleware de autenticación
- Esquemas de validación Joi
- Configuración de logging

## NOTAS IMPORTANTES
- Las llamadas API solo desde backend
- Código 100% escalable
- Seguir principios SOLID
- Implementar manejo de estados (Context API)
- Validación tanto en frontend como backend
- Manejo de errores robusto
- Implementar lazy loading cuando sea necesario

Genera la estructura base completa con todos los archivos necesarios para comenzar el desarrollo. 