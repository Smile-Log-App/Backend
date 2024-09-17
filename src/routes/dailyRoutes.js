import express from 'express';
import { createDiary, getDiaryByDate } from '../controllers/dailyController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/daily', createDiary);
router.get('/daily/:date', getDiaryByDate);

export default router;
