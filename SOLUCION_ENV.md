# 🔧 SOLUCIÓN COMPLETA PARA ARCHIVOS .env

## 🚨 PROBLEMA DETECTADO:
- **Frontend `.env`**: VACÍO
- **Backend `backend/.env`**: CORRUPTO/MALFORMADO

## ✅ SOLUCIÓN PASO A PASO:

### **1. CREAR/ARREGLAR FRONTEND .env**
```bash
# Copia este contenido al archivo .env en la raíz del proyecto
```

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDVNI60P1CurCz2Z7uxTrv0gtGFrRjKj5E
VITE_FIREBASE_AUTH_DOMAIN=microparos-70a6b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=microparos-70a6b
VITE_FIREBASE_STORAGE_BUCKET=microparos-70a6b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=836038704396
VITE_FIREBASE_APP_ID=1:836038704396:web:36b9d0d7516877ee9a9d29

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
```

### **2. CREAR/ARREGLAR BACKEND backend/.env**
```bash
# Copia este contenido al archivo backend/.env
```

```env
# Backend Configuration
PORT=3001
NODE_ENV=development
JWT_SECRET=metep-jwt-secret-key-2024
JWT_EXPIRES_IN=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=microparos-70a6b
FIREBASE_PRIVATE_KEY=TU_PRIVATE_KEY_AQUÍ
FIREBASE_CLIENT_EMAIL=TU_CLIENT_EMAIL_AQUÍ

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### **3. OBTENER CREDENCIALES FALTANTES**

**Para backend/.env necesitas**:
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto `microparos-70a6b`
3. Ve a "Project Settings" > "Service accounts"
4. Haz clic en "Generate new private key"
5. Descarga el archivo JSON
6. Extrae:
   - `private_key` → FIREBASE_PRIVATE_KEY
   - `client_email` → FIREBASE_CLIENT_EMAIL

### **4. VERIFICAR CONFIGURACIÓN**

Después de crear los archivos, verifica:
- **Frontend**: No errores de Firebase en consola
- **Backend**: Servidor inicia sin errores
- **Autenticación**: Login/registro funcionan

## 🎯 ARCHIVOS FINALES ESPERADOS:

```
METEP/
├── .env                     ← Frontend config
└── backend/
    └── .env                 ← Backend config
```

## 🚀 SIGUIENTE PASO:
1. Crea los archivos manualmente
2. Copia el contenido exacto
3. Obtén las credenciales faltantes
4. Prueba la aplicación

¡Con esto la autenticación debería funcionar perfectamente! 