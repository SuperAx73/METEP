import { studyController } from '../backend/src/controllers/studyController.js';
import { authenticateToken } from '../backend/src/middleware/auth.js';
import { validateRequest } from '../backend/src/middleware/validation.js';
import { studyValidationSchema } from '../backend/src/utils/validators.js';

export default async function handler(req, res) {
  await authenticateToken(req, res, async () => {
    if (req.method === 'GET') {
      await studyController.getStudies(req, res);
    } else if (req.method === 'POST') {
      await validateRequest(studyValidationSchema)(req, res, async () => {
        await studyController.createStudy(req, res);
      });
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  });
} 