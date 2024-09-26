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

import bcrypt from 'bcrypt';

// 비밀번호 변경
export const updatePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.userId;

  try {
    // 현재 비밀번호 확인
    const user = await prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const validPassword = await bcrypt.compare(current_password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 새 비밀번호 해시화
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(new_password, salt);

    // 비밀번호 업데이트
    await prisma.user.update({
      where: { user_id: userId },
      data: { password: hashedNewPassword }
    });

    res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '비밀번호 변경 중 오류가 발생했습니다.', message: error.message });
  }
};

