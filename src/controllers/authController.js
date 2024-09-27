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
