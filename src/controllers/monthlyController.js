import prisma from '../prisma/prismaClient.js';

// 월별 감정 조회
export const getMonthlyEmotions = async (req, res) => {
  const { year, month } = req.params;
  try {
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${month}-01`);
    endDate.setMonth(endDate.getMonth() + 1);

    const diaries = await prisma.diary.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        emotionAnalysis: true,
      },
    });

    const monthlyEmotions = diaries.map(diary => {
      const emotions = diary.emotionAnalysis;
      const topEmotion = Object.entries(emotions).reduce((prev, curr) => {
        return curr[1] > prev[1] ? curr : prev;
      });

      return {
        date: diary.date,
        top_emotion: topEmotion[0].replace('_pct', ''),
        percentage: topEmotion[1],
      };
    });

    res.status(200).json({ monthly_emotions: monthlyEmotions });
  } catch (error) {
    res.status(500).json({ error: '감정 조회 중 오류가 발생했습니다.', message: error.message });
  }
};
