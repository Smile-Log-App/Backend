import prisma from '../prisma/prismaClient.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';

// 로그인
export const login = async (req, res) => {
  const { user_login_id, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { user_login_id: user_login_id },
    });

    if (!user) {
      return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: '비밀번호가 잘못되었습니다.' });
    }

    // Access Token 및 Refresh Token 생성
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Refresh Token을 DB에 저장 (선택적으로 사용자에 따라 관리 가능)
    await prisma.user.update({
      where: { user_login_id: user_login_id },
      data: { refresh_token: refreshToken },
    });

    // 토큰 반환
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '로그인 처리 중 오류가 발생했습니다.' });
  }
};

// Refresh Token을 사용해 새로운 Access Token 발급
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh Token이 없습니다.' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { refresh_token: refreshToken },
    });

    if (!user) {
      return res.status(403).json({ error: 'Refresh Token이 유효하지 않습니다.' });
    }

    // Refresh Token 검증
    const validToken = verifyRefreshToken(refreshToken);

    // 새로운 Access Token 발급
    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '토큰 갱신 중 오류가 발생했습니다.' });
  }
};
