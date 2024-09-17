import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dailyRoutes from './routes/dailyRoutes.js';
import monthlyRoutes from './routes/monthlyRoutes.js';

const app = express();
app.use(express.json());

// 라우트 설정
app.use('/api/auth', authRoutes);  // 로그인 및 토큰 갱신 라우트
app.use('/api', dailyRoutes);
app.use('/api', monthlyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

