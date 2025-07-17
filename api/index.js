import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend serverless funcionando correctamente' 
  });
});

// Mock studies endpoint for testing
app.get('/api/studies', (req, res) => {
  res.json([
    {
      id: 'mock-1',
      responsable: 'Test User',
      supervisor: 'Test Supervisor',
      linea: 'Línea 1',
      modelo: 'Modelo Test',
      familia: 'Familia Test',
      piezasPorHora: 60,
      taktime: 60,
      tolerancia: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      records: []
    }
  ]);
});

// Catch all other routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
export default app; 