import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/environment.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput } from './middleware/validation.js';
import routes from './routes/index.js';
import Logger from './utils/logger.js';

const app = express();
app.set('trust proxy', 1); // Confía en el proxy de Vercel para X-Forwarded-For

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

// Routes
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  Logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = config.port || 3001;
app.listen(PORT, () => {
  Logger.info(`Servidor escuchando en el puerto ${PORT}`);
});

// For serverless deployment (Vercel)
export default app;