# Contributing to METEP

Gracias por tu interés en contribuir a METEP. Este documento proporciona las pautas para contribuir al proyecto.

## Como Contribuir

### 1. Configuración del Entorno

1. **Fork** el repositorio
2. **Clone** tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/METEP.git
   cd METEP
   ```
3. **Instala dependencias**:
   ```bash
   # Frontend
   npm install

   # Backend
   cd backend
   npm install
   ```
4. **Configura variables de entorno** (ver README.md)

### 2. Flujo de Trabajo

1. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```
2. **Desarrolla** tu feature
3. **Prueba** tu código
4. **Commit** tus cambios:
   ```bash
   git commit -m "feat: agregar nueva funcionalidad"
   ```
5. **Push** a tu fork:
   ```bash
   git push origin feature/nombre-de-tu-feature
   ```
6. **Crea un Pull Request**

### 3. Convenciones de Código

#### TypeScript/JavaScript
- Usa **TypeScript** en el frontend
- Usa **ESLint** y **Prettier**
- Sigue las **convenciones de React**
- Usa **interfaces** para tipos

#### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: pruebas
chore: tareas de mantenimiento
```

#### Nomenclatura
- **Componentes**: PascalCase (`StudyCard.tsx`)
- **Archivos**: kebab-case o PascalCase
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE

### 4. Estándares de Calidad

#### Frontend
- Componentes funcionales con hooks
- TypeScript estricto
- Responsive design (mobile-first)
- Accesibilidad básica
- Manejo de errores

#### Backend
- Validación de entrada (Joi)
- Manejo de errores consistente
- Logging apropiado
- Seguridad (CORS, Helmet, Rate limiting)

### 5. Testing

#### Frontend
- Prueba en diferentes dispositivos
- Verifica responsive design
- Prueba funcionalidades críticas

#### Backend
- Prueba endpoints con Postman/Thunder Client
- Verifica validaciones
- Prueba manejo de errores

### 6. Documentación

- Actualiza README.md si es necesario
- Documenta nuevas funcionalidades
- Incluye ejemplos de uso

### 7. Pull Request

#### Checklist antes de enviar:
- [ ] Código sigue convenciones
- [ ] Funcionalidad probada
- [ ] Documentación actualizada
- [ ] No hay logs de debug
- [ ] Responsive design verificado
- [ ] Manejo de errores implementado

#### Template de Pull Request:
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Mejora de documentación
- [ ] Refactorización

## Cambios realizados
- Lista de cambios específicos

## Pruebas realizadas
- [ ] Frontend probado
- [ ] Backend probado
- [ ] Responsive design verificado

## Screenshots (si aplica)
```

### 8. Reporte de Bugs

Usa el template de issue para reportar bugs:

```markdown
## Descripción del Bug
Descripción clara del problema

## Pasos para reproducir
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

## Comportamiento esperado
Descripción de lo que debería pasar

## Información adicional
- Dispositivo: [ej. iPhone 12]
- Navegador: [ej. Chrome 91]
- Versión: [ej. 1.0.0]
```

## Contacto

Si tienes preguntas sobre cómo contribuir, puedes:
- Abrir un issue
- Contactar al equipo de desarrollo

Gracias por contribuir a METEP.
