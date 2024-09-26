import express from 'express';
import cors from 'cors'; // CORS 설정 1
import authRoutes from './routes/authRoutes.js';
import dailyRoutes from './routes/dailyRoutes.js';
import monthlyRoutes from './routes/monthlyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { authenticateToken } from './middlewares/authMiddleware.js';


const app = express();

// CORS 설정 2
app.use(cors({
  origin: 'http://localhost:3000', // 허용할 프론트엔드 도메인
  // methods: ['GET', 'POST', 'PUT', 'DELETE'], a// 허용할 HTTP 메서드
  // allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  credentials: true // 인증 정보(쿠키 등)를 요청에 포함할 수 있도록 설정
}));

app.use(express.json());

// 라우트 설정
app.use('/api/auth', authRoutes);  // 로그인 및 토큰 갱신 라우트
app.use(authenticateToken); // 모든 요청에 대해 미들웨어 적용 (전역 설정)
app.use('/api', dailyRoutes);
app.use('/api', monthlyRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

