import express from 'express';
import { getUserInfo, updatePassword } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', authenticateToken, getUserInfo); // 유저 정보 조회
router.put('/password', authenticateToken, updatePassword); // 비밀번호 변경

export default router;
