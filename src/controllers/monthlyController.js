import prisma from '../prisma/prismaClient.js';

// 월별 감정 조회
export const getMonthlyEmotions = async (req, res) => {
  const { year, month } = req.query; // 쿼리 파라미터에서 year, month를 가져옴
  const userId = req.user.userId;

  // 유효성 검사
  if (!year || !month || isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: '연도와 월을 올바르게 입력해주세요.' });
  }

  // 미래 날짜인지 확인
  const queryDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
  const currentDate = new Date();
  if (queryDate > currentDate) {
    return res.status(400).json({ error: '미래의 날짜는 조회할 수 없습니다.' });
  }

  try {
    // 주어진 연도와 월에 해당하는 모든 일기를 조회
    const diaries = await prisma.diary.findMany({
      where: {
        user_id: userId,
        date: {
          gte: new Date(`${year}-${month}-01T00:00:00.000Z`),
          lt: new Date(`${year}-${month}-31T23:59:59.999Z`),
        },
      },
      include: {
        emotionAnalysis: true,
      },
    });

    // 일기가 없으면 빈 배열 반환
    if (diaries.length === 0) {
      return res.status(200).json({ monthly_emotions: [] });
    }

    const monthlyEmotions = diaries.map((diary) => {
      const emotions = diary.emotionAnalysis;

      // 가장 높은 퍼센티지의 감정을 찾기
      const emotionsMap = {
        joy_pct: 'joy',
        sadness_pct: 'sadness',
        anxiety_pct: 'anxiety',
        anger_pct: 'anger',
        neutrality_pct: 'neutrality',
        fatigue_pct: 'fatigue',
      };

      let topEmotion = 'neutrality';
      let topPercentage = 0;

      for (let [key, value] of Object.entries(emotionsMap)) {
        if (emotions[key] > topPercentage) {
          topPercentage = emotions[key];
          topEmotion = value;
        }
      }

      return {
        date: diary.date.toISOString().split('T')[0], // 날짜만 반환
        top_emotion: topEmotion,
      };
    });

    res.status(200).json({ monthly_emotions: monthlyEmotions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '월별 감정 조회 중 오류가 발생했습니다.', message: error.message });
  }
};

