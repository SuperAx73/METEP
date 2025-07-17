# 🚀 CONFIGURACIÓN VERCEL - FUNCIONES SERVERLESS

## ✅ LO QUE HE CONFIGURADO:

1. **Funciones Serverless**: El backend ahora funciona como funciones serverless
2. **Vercel.json**: Configuración para deploy automático
3. **API Endpoint**: Configurado en `/api/index.js`
4. **Dependencies**: Agregadas al package.json principal

## 🔧 CONFIGURAR VARIABLES DE ENTORNO EN VERCEL:

### 1. Ve a tu proyecto en Vercel Dashboard
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto METEP
3. Ve a "Settings" > "Environment Variables"

### 2. Agregar Variables del Frontend
```
VITE_FIREBASE_API_KEY=AIzaSyDVNI60P1CurCz2Z7uxTrv0gtGFrRjKj5E
VITE_FIREBASE_AUTH_DOMAIN=microparos-70a6b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=microparos-70a6b
VITE_FIREBASE_STORAGE_BUCKET=microparos-70a6b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=836038704396
VITE_FIREBASE_APP_ID=1:836038704396:web:36b9d0d7516877ee9a9d29
VITE_API_BASE_URL=/api
```

### 3. Agregar Variables del Backend (SERVERLESS)
```
NODE_ENV=production
JWT_SECRET=metep-jwt-secret-key-2024
FIREBASE_PROJECT_ID=microparos-70a6b
FIREBASE_PRIVATE_KEY=TU_PRIVATE_KEY_DEL_SERVICE_ACCOUNT
FIREBASE_CLIENT_EMAIL=TU_CLIENT_EMAIL_DEL_SERVICE_ACCOUNT
FRONTEND_URL=https://tu-dominio.vercel.app
```

### 4. Obtener Service Account (SI NO LO HAS HECHO)
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto `microparos-70a6b`
3. Ve a "Project Settings" > "Service accounts"
4. Haz clic en "Generate new private key"
5. Descarga el archivo JSON
6. Extrae:
   - `project_id` → FIREBASE_PROJECT_ID
   - `private_key` → FIREBASE_PRIVATE_KEY
   - `client_email` → FIREBASE_CLIENT_EMAIL

### 5. Formato de Private Key en Vercel
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggS...
-----END PRIVATE KEY-----
```

**Importante**: En Vercel, la private key debe estar en UNA SOLA LÍNEA sin `\n`

## 📁 ARCHIVOS AGREGADOS:

- ✅ `api/index.js` - Función serverless del backend
- ✅ `vercel.json` - Configuración de deploy
- ✅ `env-production.txt` - Template de variables para producción
- ✅ `package.json` - Actualizado con dependencias del backend

## 🚀 DEPLOY AUTOMÁTICO

Una vez que configures las variables de entorno en Vercel:

1. **El deploy se hace automáticamente** con cada push
2. **Frontend**: Se servira desde Vercel
3. **Backend**: Funciona como funciones serverless en `/api/*`
4. **Base de datos**: Firebase Firestore
5. **Autenticación**: Firebase Auth

## 🔍 PROBAR EL DEPLOY

1. Ve a tu URL de Vercel
2. Intenta registrar un nuevo usuario
3. Intenta iniciar sesión
4. Verifica que funcione correctamente

## 📝 NOTA IMPORTANTE

- **NO necesitas encender/apagar el backend** - funciona automáticamente
- **Escalado automático** - se ajusta según el tráfico
- **Cero configuración de servidor** - todo está automatizado
- **Logs automáticos** - disponibles en Vercel Dashboard

¡El backend ahora funciona como funciones serverless y se despliega automáticamente! 