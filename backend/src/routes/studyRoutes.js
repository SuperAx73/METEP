import express from 'express';
import { studyController } from '../controllers/studyController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { studyValidationSchema, recordValidationSchema } from '../utils/validators.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// CRUD de estudios
router.post('/', validateRequest(studyValidationSchema), studyController.createStudy);
router.get('/', studyController.getStudies);
router.get('/:id', studyController.getStudy);
router.put('/:id', validateRequest(studyValidationSchema), studyController.updateStudy);
router.delete('/:id', studyController.deleteStudy);

// Gestión de registros
router.post('/:id/records', validateRequest(recordValidationSchema), studyController.addRecord);
router.delete('/:id/records', studyController.clearRecords);

// Exportación
router.get('/:id/export', studyController.exportToExcel);

export default router;