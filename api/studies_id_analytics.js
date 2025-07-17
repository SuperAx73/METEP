import { studyController } from '../backend/src/controllers/studyController.js';
import { authenticateToken } from '../backend/src/middleware/auth.js';

export default async function handler(req, res) {
  await authenticateToken(req, res, async () => {
    const { id } = req.query;
    req.params = { id };
    if (req.method === 'GET') {
      await studyController.getAnalytics(req, res);
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  });
} 