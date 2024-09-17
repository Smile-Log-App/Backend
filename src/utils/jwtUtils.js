import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'secret_access_token';  // 강력한 비밀키 사용
const REFRESH_TOKEN_SECRET = 'secret_refresh_token';  // 강력한 비밀키 사용

// Access Token 생성
export const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.user_id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Refresh Token 생성
export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.user_id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Access Token 검증
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid Access Token');
  }
};

// Refresh Token 검증
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid Refresh Token');
  }
};
