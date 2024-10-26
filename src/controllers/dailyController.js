import prisma from '../prisma/prismaClient.js';

// 일기 작성
export const createDiary = async (req, res) => {
  const { content, date, emotionAnalysis } = req.body;
  const userId = req.user.userId; // 토큰에서 추출된 userId 사용

  // 유효성 검사
  if (!content || !emotionAnalysis) {
    return res.status(400).json({ error: '일기 내용 및 감정 분석 결과를 입력해주세요.' });
  }

  // 감정 퍼센티지 범위 검사
  const emotionKeys = ['joy_pct', 'sadness_pct', 'anxiety_pct', 'anger_pct', 'neutrality_pct', 'fatigue_pct'];
  for (const key of emotionKeys) {
    if (emotionAnalysis[key] < 0 || emotionAnalysis[key] > 100) {
      return res.status(400).json({ error: `감정 퍼센티지 값은 0에서 100 사이여야 합니다. [${key}]` });
    }
  }

  try {
    // 입력된 날짜에서 시간을 제외하고 비교를 위해 시작 시간과 종료 시간 설정
    const diaryDate = new Date(date ? date : new Date());
    diaryDate.setHours(0, 0, 0, 0); // 시작 시간 설정
    const startOfDay = new Date(diaryDate);
    diaryDate.setHours(23, 59, 59, 999); // 종료 시간 설정
    const endOfDay = new Date(diaryDate);

    // 이미 해당 날짜에 일기가 있는지 확인
    const existingDiary = await prisma.diary.findFirst({
      where: {
        user_id: userId,
        date: {
          gte: startOfDay, // 해당 날짜의 시작 시간
          lt: endOfDay, // 해당 날짜의 끝 시간
        },
      },
    });

    if (existingDiary) {
      return res.status(409).json({ error: '해당 날짜에 이미 작성된 일기가 있습니다. 하루에 일기는 하나만 작성할 수 있습니다.' });
    }

    // 새로운 일기 생성
    const newDiary = await prisma.diary.create({
      data: {
        user_id: userId,
        content,
        date: new Date(date) || new Date(), // 일기 작성 날짜 (입력된 날짜 또는 현재 날짜)
      },
    });

    // 프론트엔드로부터 받은 감정 분석 결과 저장
    const newEmotionAnalysis = await prisma.emotionAnalysis.create({
      data: {
        diary_id: newDiary.diary_id,
        ...emotionAnalysis,
      },
    });

    // 감정 분석 결과에서 분석 ID와 일기 ID를 제거하고 6개의 감정 퍼센티지만 반환
    const filteredEmotionAnalysis = emotionKeys.reduce((obj, key) => {
      obj[key] = newEmotionAnalysis[key];
      return obj;
    }, {});

    // 일기와 감정 분석 결과 함께 반환
    res.status(201).json({
      ...newDiary,
      emotionAnalysis: filteredEmotionAnalysis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '일기를 작성하는 도중 오류가 발생했습니다.', message: error.message });
  }
};




// 일별 일기 조회
export const getDiaryByDate = async (req, res) => {
  const { date } = req.query; // 쿼리 파라미터에서 date를 가져옴
  const userId = req.user.userId;

  // 유효성 검사: date가 올바른 형식인지 확인
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    return res.status(400).json({ error: '올바른 날짜 형식이 아닙니다. 형식: YYYY-MM-DD' });
  }

  // // 유효성 검사: 미래 날짜인지 확인
  // if (new Date(date) > new Date()) {
  //   return res.status(400).json({ error: '미래의 날짜는 조회할 수 없습니다.' });
  // }

  try {
    const diary = await prisma.diary.findFirst({
      where: {
        user_id: userId,
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

    // 감정 분석 결과에서 analysis_id와 diary_id를 제거하고 6개의 감정 퍼센티지만 반환
    const emotionKeys = ['joy_pct', 'sadness_pct', 'anxiety_pct', 'anger_pct', 'neutrality_pct', 'fatigue_pct'];
    const filteredEmotionAnalysis = emotionKeys.reduce((obj, key) => {
      obj[key] = diary.emotionAnalysis[key];
      return obj;
    }, {});

    // 일기와 감정 분석 결과 함께 반환
    res.status(200).json({
      ...diary,
      emotionAnalysis: filteredEmotionAnalysis, // analysis_id와 diary_id 제외한 감정 퍼센티지들만 반환
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '일기 조회 중 오류가 발생했습니다.', message: error.message });
  }
};
