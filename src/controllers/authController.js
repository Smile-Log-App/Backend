import prisma from '../prisma/prismaClient.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwtUtils.js';

// 회원가입
export const register = async (req, res) => {
  const { username, user_login_id, password } = req.body;

  try {
    // username 형식 확인 (영문자, 숫자, 하이픈, 언더스코어만 허용, 3~20자)
    const idRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!idRegex.test(username)) {
      return res.status(400).json({ error: '사용자 이름 형식이 올바르지 않습니다. 영문자, 숫자, 하이픈, 언더스코어만 허용되며, 3~20자 이어야 합니다.' });
    }

    // 아이디 형식 확인 (영문자, 숫자, 하이픈, 언더스코어만 허용, 3~20자)
    if (!idRegex.test(user_login_id)) {
      return res.status(400).json({ error: '아이디 형식이 올바르지 않습니다. 영문자, 숫자, 하이픈, 언더스코어만 허용되며, 3~20자 이어야 합니다.' });
    }

    // 비밀번호 강도 검사
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: '비밀번호는 최소 8자이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.' });
    }

    // 아이디 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { user_login_id: user_login_id },
    });

    if (existingUser) {
      return res.status(409).json({ error: '이미 존재하는 아이디입니다.' });
    }

    // 비밀번호 해시
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        username: username,
        user_login_id: user_login_id,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: '사용자가 성공적으로 생성되었습니다.', userId: newUser.user_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '회원가입 처리 중 오류가 발생했습니다.', message: error.message });
  }
};


// 로그인
export const login = async (req, res) => {
  const { user_login_id, password } = req.body;

  if (!user_login_id || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_login_id: user_login_id },
    });

    if (!user) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
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
    res.status(500).json({ error: '로그인 처리 중 오류가 발생했습니다.', message: error.message });
  }
};


// Refresh Token을 사용해 새로운 Access Token 발급
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  // 유효성 검사: Refresh Token이 존재하는지 확인
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh Token이 제공되지 않았습니다.' });
  }

  try {
    // Refresh Token 형식 검증
    const validToken = verifyRefreshToken(refreshToken);
    if (!validToken) {
      return res.status(403).json({ error: '유효하지 않은 Refresh Token입니다.' });
    }

    // DB에서 Refresh Token 확인
    const user = await prisma.user.findFirst({
      where: { refresh_token: refreshToken },
    });

    if (!user) {
      return res.status(403).json({ error: 'Refresh Token이 유효하지 않습니다.' });
    }

    // 새로운 Access Token 발급
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '토큰 갱신 중 오류가 발생했습니다.', message: error.message });
  }
};
