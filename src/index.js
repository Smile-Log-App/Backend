import 'dotenv/config';
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
  origin: ['https://smile-log.vercel.app', 'http://localhost:3000'], // 프엔 배포
  // methods: ['GET', 'POST', 'PUT', 'DELETE'], a// 허용할 HTTP 메서드
  // allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  credentials: true // 인증 정보(쿠키 등)를 요청에 포함할 수 있도록 설정
}));

app.use(express.json());

// 라우트 설정
app.use('/api/auth', authRoutes);  // 로그인 및 토큰 갱신 라우트


// app.use(authenticateToken); // 모든 요청에 대해 미들웨어 적용 (전역 설정)

// 인증 미들웨어를 나머지 경로에 적용
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api/auth/register') || 
    req.path.startsWith('/api/auth/login')
  ) {
    return next(); // register와 login은 인증 미들웨어를 건너뜀
  }
  authenticateToken(req, res, next); // 다른 경로에 대해 인증 미들웨어 적용
});


app.use('/api', dailyRoutes);
app.use('/api', monthlyRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

