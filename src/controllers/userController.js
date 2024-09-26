import prisma from '../prisma/prismaClient.js';

// 유저 정보 조회
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.userId; // 토큰에서 추출된 userId 사용
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { username: true, user_login_id: true }
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: '유저 정보를 조회하는 중 오류가 발생했습니다.', message: error.message });
  }
};
