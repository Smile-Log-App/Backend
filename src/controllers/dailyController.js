import prisma from '../prisma/prismaClient.js';

// 랜덤한 감정 분석 결과를 생성하는 함수
const generateRandomEmotionAnalysis = () => {
    return {
      joyful_pct: Math.random().toFixed(2), // 0.00 ~ 1.00 사이의 값
      sad_pct: Math.random().toFixed(2),
      anxious_pct: Math.random().toFixed(2),
      annoyed_pct: Math.random().toFixed(2),
      neutral_pct: Math.random().toFixed(2),
      tired_pct: Math.random().toFixed(2),
    };
  };

// 일기 작성
export const createDiary = async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const newDiary = await prisma.diary.create({
      data: {
        user_id: parseInt(user_id),
        content: content,
      },
    });

    // 랜덤 감정 분석 결과 생성
    const randomEmotionAnalysis = generateRandomEmotionAnalysis();

    // 감정 분석 결과를 DB에 저장
    const newEmotionAnalysis = await prisma.emotionAnalysis.create({
      data: {
        diary_id: newDiary.diary_id,
        joyful_pct: randomEmotionAnalysis.joyful_pct,
        sad_pct: randomEmotionAnalysis.sad_pct,
        anxious_pct: randomEmotionAnalysis.anxious_pct,
        annoyed_pct: randomEmotionAnalysis.annoyed_pct,
        neutral_pct: randomEmotionAnalysis.neutral_pct,
        tired_pct: randomEmotionAnalysis.tired_pct,
      },
    });

    // 일기와 감정 분석 결과 함께 반환
    res.status(201).json({
        ...newDiary,
        emotionAnalysis: newEmotionAnalysis,
      });

  } catch (error) {
    res.status(500).json({ error: '일기를 작성하는 도중 오류가 발생했습니다.', message: error.message });
  }
};

// 특정 날짜의 일기와 감정 분석 조회
export const getDiaryByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const diary = await prisma.diary.findFirst({
        where: {
            date: {
              gte: new Date(`${date}T00:00:00.000Z`), // 날짜의 시작 시간
              lt: new Date(`${date}T23:59:59.999Z`), // 날짜의 끝 시간
            },
          },
      include: {
        emotionAnalysis: true,
      },
    });

    if (!diary) {
      return res.status(204).json({ message: '해당 날짜의 일기가 없습니다.' });
    }

    res.status(200).json(diary);
  } catch (error) {
    res.status(500).json({ error: '일기 조회 중 오류가 발생했습니다.', message: error.message });
  }
};
