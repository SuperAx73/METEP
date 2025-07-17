import express from 'express';
import studyRoutes from './studyRoutes.js';

const router = express.Router();

router.use('/studies', studyRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;