import { studyController } from '../backend/src/controllers/studyController.js';
import { authenticateToken } from '../backend/src/middleware/auth.js';
import { validateRequest } from '../backend/src/middleware/validation.js';
import { studyValidationSchema } from '../backend/src/utils/validators.js';

export default async function handler(req, res) {
  await authenticateToken(req, res, async () => {
    const { id } = req.query;
    req.params = { id };
    if (req.method === 'GET') {
      await studyController.getStudy(req, res);
    } else if (req.method === 'PUT') {
      await validateRequest(studyValidationSchema)(req, res, async () => {
        await studyController.updateStudy(req, res);
      });
    } else if (req.method === 'DELETE') {
      await studyController.deleteStudy(req, res);
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  });
} 