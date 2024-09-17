import prisma from '../prisma/prismaClient.js';

// 월별 감정 조회
export const getMonthlyEmotions = async (req, res) => {
    const { year, month } = req.params;
  
    try {
      // 주어진 연도와 월에 해당하는 모든 일기를 조회
      const diaries = await prisma.diary.findMany({
        where: {
          date: {
            gte: new Date(`${year}-${month}-01T00:00:00.000Z`),
            lt: new Date(`${year}-${month}-31T23:59:59.999Z`),
          },
        },
        include: {
          emotionAnalysis: true,
        },
      });
  
      const monthlyEmotions = diaries.map((diary) => {
        const emotions = diary.emotionAnalysis;
        
        // 가장 높은 퍼센티지의 감정을 찾기
        const emotionsMap = {
          joyful_pct: 'joyful',
          sad_pct: 'sad',
          anxious_pct: 'anxious',
          annoyed_pct: 'annoyed',
          neutral_pct: 'neutral',
          tired_pct: 'tired',
        };
  
        let topEmotion = 'neutral';
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
          percentage: topPercentage,
        };
      });
  
      res.status(200).json({ monthly_emotions: monthlyEmotions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '월별 감정 조회 중 오류가 발생했습니다.' });
    }
  };
  