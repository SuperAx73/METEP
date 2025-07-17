# 🔧 SIGUIENTE PASO: CONFIGURAR BACKEND FIREBASE

## ✅ YA CONFIGURADO
- **Frontend**: El archivo `.env` ya está configurado con las credenciales de Firebase
- **Backend**: El archivo `backend/.env` ya existe pero necesita las credenciales del Service Account

## 🔥 OBTENER CREDENCIALES DEL SERVICE ACCOUNT

### 1. Ve a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `microparos-70a6b`
3. Ve a "Project Settings" (ícono de engranaje)
4. Haz clic en la pestaña "Service accounts"

### 2. Generar Nueva Clave Privada
1. Haz clic en "Generate new private key"
2. Haz clic en "Generate key"
3. Se descargará un archivo JSON

### 3. Extraer Información del JSON
Abre el archivo JSON descargado y busca estos campos:
- `project_id`
- `private_key`
- `client_email`

### 4. Actualizar backend/.env
Abre el archivo `backend/.env` y reemplaza estos valores:

```env
# Backend Configuration
PORT=3001
NODE_ENV=development
JWT_SECRET=metep-jwt-secret-key-2024

# Firebase Configuration
FIREBASE_PROJECT_ID=microparos-70a6b
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@microparos-70a6b.iam.gserviceaccount.com

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 5. Formato de la Private Key
La `private_key` debe estar en este formato:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggS...\n-----END PRIVATE KEY-----\n"
```

**Importante**: Mantén los caracteres `\n` para los saltos de línea y usa comillas dobles.

## 🚀 PROBAR LA APLICACIÓN

### 1. Instalar Dependencias
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Iniciar Servidores
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### 3. Verificar Funcionamiento
1. Ve a `http://localhost:5173`
2. Intenta registrar un nuevo usuario
3. Intenta iniciar sesión
4. Verifica que no haya errores en la consola

## 🔍 VERIFICAR CONFIGURACIÓN
- **Frontend**: No deberías ver errores de Firebase en la consola
- **Backend**: El servidor debería iniciar sin errores
- **Autenticación**: Deberías poder registrarte e iniciar sesión

## 🆘 SOLUCIÓN DE PROBLEMAS
- **Error "Invalid private key"**: Verifica el formato de la private key
- **Error "Client email not found"**: Verifica el client_email del Service Account
- **Error "Project not found"**: Verifica el FIREBASE_PROJECT_ID

¡Una vez completado, tu sistema de autenticación debería funcionar perfectamente! 