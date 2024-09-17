import express from 'express';
import { register, login, refreshAccessToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);  // 회원가입
router.post('/login', login);  // 로그인
router.post('/refresh-token', refreshAccessToken);  // Access Token 갱신

export default router;
