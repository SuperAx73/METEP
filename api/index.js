import { createServer } from 'http';
import { parse } from 'url';
import { config } from '../backend/src/config/environment.js';
import { db, auth } from '../backend/src/config/firebase.js';
import Logger from '../backend/src/utils/logger.js';

// Import controllers and routes
import studyRoutes from '../backend/src/routes/studyRoutes.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from '../backend/src/middleware/rateLimiter.js';
import { sanitizeInput } from '../backend/src/middleware/validation.js';

const app = express();

// Trust proxy for Vercel (fixes rate limiter warning)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Rate limiting
app.use('/api/', apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Routes
app.use('/api/studies', studyRoutes);

// Error handling
app.use((err, req, res, next) => {
  Logger.error('Unhandled error:', err);
  
  // Don't expose internal errors in production
  const errorMessage = config.nodeEnv === 'production' 
    ? 'Error interno del servidor' 
    : err.message || 'Error interno del servidor';
    
  res.status(500).json({ 
    error: errorMessage,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
export default app; 