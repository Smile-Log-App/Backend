import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// 미들웨어 설정 (JSON 파싱)
app.use(express.json());

// 사용자의 일기 목록 조회
app.get('/users/:userId/diaries', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const diaries = await prisma.diary.findMany({
      where: {
        user_id: parseInt(userId)
      }
    });
    res.json(diaries);
  } catch (error) {
    res.status(500).json({ error: '문제가 발생했습니다.' });
  }
});

// 특정 사용자의 일기 추가
app.post('/users/:userId/diaries', async (req, res) => {
  const { userId } = req.params;
  const { content } = req.body;
  
  try {
    const newDiary = await prisma.diary.create({
      data: {
        user_id: parseInt(userId),
        content: content,
      }
    });
    res.json(newDiary);
  } catch (error) {
    res.status(500).json({ error: '일기를 추가하는 도중 문제가 발생했습니다.' });
  }
});

// 감정 분석 결과 조회
app.get('/diaries/:diaryId/emotion-analysis', async (req, res) => {
  const { diaryId } = req.params;

  try {
    const analysis = await prisma.emotionAnalysis.findUnique({
      where: {
        diary_id: parseInt(diaryId),
      }
    });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: '감정 분석 결과를 조회하는 도중 문제가 발생했습니다.' });
  }
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
