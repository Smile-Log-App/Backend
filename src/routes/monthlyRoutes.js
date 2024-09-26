import express from 'express';
import { getMonthlyEmotions } from '../controllers/monthlyController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/monthly', getMonthlyEmotions);

export default router;
