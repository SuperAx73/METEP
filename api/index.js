// Función serverless simple para Vercel
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  // Health check endpoint
  if (url === '/api/health' && method === 'GET') {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'Backend serverless funcionando correctamente'
    });
    return;
  }

  // Mock studies endpoint
  if (url === '/api/studies' && method === 'GET') {
    res.status(200).json([
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
    return;
  }

  // Create study endpoint
  if (url === '/api/studies' && method === 'POST') {
    const newStudy = {
      id: 'mock-' + Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      records: []
    };
    res.status(201).json(newStudy);
    return;
  }

  // 404 for other routes
  res.status(404).json({
    error: 'Ruta no encontrada',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
} 