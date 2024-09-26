import express from 'express';
import { getUserInfo } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', authenticateToken, getUserInfo); // 유저 정보 조회

export default router;
