# MTEP - Análisis de Microparos en Procesos Industriales

## 🎯 DESCRIPCIÓN DEL PROYECTO

MTEP es una herramienta web diseñada para medir la frecuencia con la que sale cada pieza en líneas de producción industrial, detectando y categorizando microparos para análisis posterior. La aplicación permite realizar estudios detallados de eficiencia y generar reportes completos en formato Excel.

## 🏗️ ARQUITECTURA DEL PROYECTO

### Estructura de Carpetas
```
MTEP/
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
├── frontend/                   # Cliente React
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── services/         # Servicios para APIs
│   │   ├── utils/            # Utilidades del frontend
│   │   ├── types/            # Tipos TypeScript
│   │   └── context/          # Context API
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

### Arquitectura de Capas
- **Presentación**: React + TypeScript (Frontend)
- **API**: Express.js (Backend)
- **Lógica de Negocio**: Services (Backend)
- **Persistencia**: Firebase Firestore
- **Autenticación**: Firebase Auth + JWT

## 📱 FUNCIONALIDADES PRINCIPALES

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

## 🛠️ TECNOLOGÍAS UTILIZADAS

### Frontend
- **React 18+** con TypeScript
- **React Router v6** para navegación
- **TailwindCSS** para estilos
- **Lucide React** para iconos
- **Axios** para peticiones HTTP
- **Vite** como build tool

### Backend
- **Node.js 18+** runtime
- **Express.js** framework
- **JavaScript ES Modules**
- **JWT + Firebase Admin SDK** para autenticación
- **Helmet, CORS, Rate Limiting** para seguridad
- **Joi** para validación
- **Custom Logger** para logs

### Base de Datos
- **Firebase Firestore** (NoSQL)
- **Firebase Auth** para autenticación
- **Firebase Admin SDK** para backend

## 📊 ESTRUCTURA DE PANTALLAS

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

## 📈 EXPORTACIÓN A EXCEL

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

## 🔧 LÓGICA DE NEGOCIO CRÍTICA

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

## 🚫 RESTRICCIONES IMPORTANTES

### ⚠️ NO HACER
- **NO usar Firebase Realtime Database** (usar solo Firestore)
- **NO hardcodear datos** (usar variables de entorno)
- **NO hacer llamadas API desde frontend** (solo desde backend)
- **NO mezclar lógica de negocio entre capas**
- **NO dejar logs de debug en producción**
- **NO repetir variables innecesariamente**

### ✅ SIEMPRE HACER
- Seguir arquitectura de capas
- Validar datos en backend
- Manejar errores consistentemente
- Mantener código modular y escalable
- Implementar diseño responsive (mobile-first)
- Usar TypeScript en frontend
- Seguir principios SOLID
- Separar responsabilidades

## 🔒 SEGURIDAD

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
PORT=3000

# Frontend
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_API_URL=
```

## 📱 RESPONSIVE DESIGN

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

## 🧪 TESTING

### Casos de Prueba Críticos
1. Detección correcta de microparos
2. Cálculo preciso de desviaciones
3. Funcionamiento del cronómetro
4. Exportación a Excel
5. Autenticación de usuarios
6. Responsive design

## 🚀 DESPLIEGUE

### Requisitos
- Node.js 18+
- Firebase project configurado
- Variables de entorno establecidas

### Comandos
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 🔄 FLUJO DE DESARROLLO

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

## 📋 CHECKLIST PARA CONTRIBUIDORES

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

## 🤝 CONTRIBUCIÓN

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

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

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

**Nota**: Si estás haciendo deploy sin configurar estas variables, la aplicación mostrará advertencias en la consola pero seguirá funcionando con valores por defecto.

## Deploy

La aplicación está configurada para funcionar con servicios de deploy como Vercel, Netlify, etc. 

Para deploys que requieren configuración de variables de entorno, asegúrate de agregar todas las variables VITE_* en la configuración del servicio de deploy. 

## 📝 NOTA SOBRE 'MODO DE FALLA'

En todas las tablas y reportes (Excel y la tabla de registros en la app) el título mostrado es 'Modo de Falla'. Sin embargo, para el manejo de datos y en el código, la variable utilizada sigue siendo 'categoriaCausa'. Este cambio es únicamente estético para mayor claridad en los reportes. 