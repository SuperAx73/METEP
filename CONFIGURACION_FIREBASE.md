# 🔧 CONFIGURACIÓN DE FIREBASE - SOLUCIÓN AL PROBLEMA DE AUTENTICACIÓN

## 🔥 PROBLEMA IDENTIFICADO
El sistema de autenticación no funciona porque faltan las variables de entorno de Firebase.

## 📋 SOLUCIÓN PASO A PASO

### 1. CREAR PROYECTO EN FIREBASE
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa el nombre del proyecto (ej: "metep-app")
4. Deshabilita Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

### 2. CONFIGURAR AUTENTICACIÓN
1. En el menú lateral, selecciona "Authentication"
2. Haz clic en "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Activa "Email/Password"
5. Haz clic en "Guardar"

### 3. CONFIGURAR FIRESTORE
1. En el menú lateral, selecciona "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba"
4. Selecciona una ubicación cercana
5. Haz clic en "Listo"

### 4. OBTENER CREDENCIALES DEL FRONTEND
1. Ve a "Project Settings" (ícono de engranaje)
2. Baja hasta "Your apps"
3. Haz clic en "Web app" (ícono </>)
4. Ingresa un nombre para la app
5. Haz clic en "Registrar app"
6. Copia las credenciales que aparecen

### 5. OBTENER CREDENCIALES DEL BACKEND
1. Ve a "Project Settings" > "Service accounts"
2. Haz clic en "Generate new private key"
3. Descarga el archivo JSON
4. Abre el archivo y extrae los valores necesarios

### 6. CREAR ARCHIVO .env FRONTEND
1. Crea un archivo llamado `.env` en la raíz del proyecto
2. Copia el contenido del archivo `env-frontend.txt`
3. Reemplaza los valores con tus credenciales:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
VITE_API_BASE_URL=http://localhost:3001/api
```

### 7. CREAR ARCHIVO .env BACKEND
1. Crea un archivo llamado `.env` en la carpeta `backend`
2. Copia el contenido del archivo `backend/env-backend.txt`
3. Reemplaza los valores con tus credenciales:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=tu-secreto-jwt-super-seguro
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key-aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:5173
```

### 8. INICIAR LA APLICACIÓN
1. Instala dependencias del backend:
```bash
cd backend
npm install
```

2. Instala dependencias del frontend:
```bash
cd ..
npm install
```

3. Inicia el backend:
```bash
cd backend
npm run dev
```

4. En otra terminal, inicia el frontend:
```bash
npm run dev
```

## ⚠️ NOTAS IMPORTANTES

1. **Private Key**: La clave privada debe incluir los caracteres `\n` para los saltos de línea
2. **Comillas**: Usa comillas dobles alrededor de la private key
3. **No subir .env**: Los archivos .env ya están en `.gitignore`
4. **Firestore Rules**: Cambiar las reglas de Firestore para producción

## 🎯 REGLAS DE FIRESTORE PARA DESARROLLO
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔍 VERIFICAR CONFIGURACIÓN
1. Abre la consola del navegador
2. No deberías ver errores de Firebase
3. Deberías poder registrar un nuevo usuario
4. Deberías poder iniciar sesión

## 🆘 SOLUCIÓN DE PROBLEMAS
- **Error "Invalid API key"**: Verifica que el API key sea correcto
- **Error "Firebase not configured"**: Verifica que todas las variables estén configuradas
- **Error "Token invalid"**: Verifica la configuración del backend
- **Error CORS**: Verifica que FRONTEND_URL coincida con tu URL local

¡Una vez configurado, el sistema de autenticación debería funcionar correctamente! 