import { verifyAccessToken } from '../utils/jwtUtils.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token> 형식

  if (!token) {
    return res.status(401).json({ error: '토큰이 제공되지 않았습니다.' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // 사용자 정보를 요청 객체에 저장
    next();
  } catch (error) {
    res.status(403).json({ error: '토큰이 유효하지 않습니다.' });
  }
};
