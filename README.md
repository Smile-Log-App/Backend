
# 스마일 로그 - AI 기반 감정 관리 및 시각화 일기 서비스

**스마일 로그**는 AI를 활용하여 사용자의 일기를 분석하고 감정을 시각화하는 서비스입니다. 주요 기능으로 감정 분석, 감정 나무 시각화, 그리고 감정 탐구를 위한 AI 챗봇이 제공됩니다.

---

## 목차

1. [프로젝트 설명](#프로젝트-설명)
2. [주요 기능](#주요-기능)
3. [설치 방법](#설치-방법)
4. [사용법](#사용법)
5. [테스트 방법](#테스트-방법)
6. [사용된 오픈 소스 설명](#사용된-오픈-소스-설명)
7. [소스 코드 설명](#소스-코드-설명)
8. [프로젝트 구조](#프로젝트-구조)
9. [라이선스](#라이선스)

---

## 프로젝트 설명

스마일 로그는 감정 인식에 어려움을 겪는 사용자들이 자신의 감정을 이해하고, 원인을 파악할 수 있도록 돕는 서비스입니다.  

---

## 주요 기능

- **일기 작성**: 사용자가 작성한 일기를 분석해 감정 비율을 제공합니다.
- **감정 시각화**: 나무 형태로 상위 3개의 감정을 색상으로 나타냅니다.
- **캘린더 통계**: 일별 감정을 이모지로 시각화하고 월별 감정 통계를 제공합니다.
- **AI 챗봇**: 사용자의 감정을 심층 탐구할 수 있도록 도와주는 대화형 기능입니다.

---

## 설치 방법

### 사전 요구 사항

- Node.js v16.x 이상
- MySQL 데이터베이스
- Prisma CLI 설치
- OpenAI API 키

### 설치 단계

1. **레포지토리 복제**
   ```bash
   git clone https://github.com/Smile-Log-App/SmileLog-Backend.git
   cd SmileLog-Backend
   ```

2. **필요한 패키지 설치**
   ```bash
   npm install
   ```

3. **환경 설정**
   프로젝트 루트 디렉토리에 `.env` 파일을 만들고 다음 설정을 추가합니다:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/Smile-Log-App?schema=public"
   PORT=3001
   ```

4. **데이터베이스 설정**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **서버 실행**
   ```bash
   node src/index.js
   ```

---

## 사용법

### 1. **회원가입**  
   - **URL**: `/api/auth/register`  
   - **메서드**: POST  
   - **요청 본문**:  
     ```json
     {
       "username": "사용자이름",
       "user_login_id": "아이디",
       "password": "비밀번호"
     }
     ```
   - **응답**:  
     ```json
     {
       "message": "사용자가 성공적으로 생성되었습니다.",
       "userId": 1
     }
     ```

### 2. **로그인**  
   - **URL**: `/api/auth/login`  
   - **메서드**: POST  
   - **요청 본문**:  
     ```json
     {
       "user_login_id": "아이디",
       "password": "비밀번호"
     }
     ```  
   - **응답**:  
     ```json
     {
       "accessToken": "ACCESS_TOKEN",
       "refreshToken": "REFRESH_TOKEN"
     }
     ```  
   - **설명**: 반환된 `accessToken`과 `refreshToken`을 사용해 인증된 요청을 보낼 수 있습니다.

### 3. **일기 작성**  
   - **URL**: `/api/daily`  
   - **메서드**: POST  
   - **헤더**:  
     - `Authorization`: Bearer ACCESS_TOKEN  
   - **요청 본문**:  
     ```json
     {
       "content": "오늘 하루의 일기 내용입니다.",
       "emotionAnalysis": {
         "joy_pct": 40,
         "sadness_pct": 20,
         "anxiety_pct": 10,
         "anger_pct": 10,
         "neutrality_pct": 20,
         "fatigue_pct": 0
       }
     }
     ```  
   - **응답**:  
     ```json
     {
       "diary_id": 1,
       "content": "오늘 하루의 일기 내용입니다.",
       "emotionAnalysis": {
         "joy_pct": 40,
         "sadness_pct": 20,
         "anxiety_pct": 10,
         "anger_pct": 10,
         "neutrality_pct": 20,
         "fatigue_pct": 0
       }
     }
     ```

### 4. **일기 조회**  
   - **URL**: `/api/daily?date=YYYY-MM-DD`  
   - **메서드**: GET  
   - **헤더**:  
     - `Authorization`: Bearer ACCESS_TOKEN  
   - **응답**:  
     ```json
     {
       "content": "오늘 하루의 일기 내용입니다.",
       "emotionAnalysis": {
         "joy_pct": 40,
         "sadness_pct": 20,
         "anxiety_pct": 10,
         "anger_pct": 10,
         "neutrality_pct": 20,
         "fatigue_pct": 0
       }
     }
     ```

### 5. **월별 감정 조회**  
   - **URL**: `/api/monthly?year=YYYY&month=MM`  
   - **메서드**: GET  
   - **헤더**:  
     - `Authorization`: Bearer ACCESS_TOKEN  
   - **응답**:  
     ```json
     {
       "monthly_emotions": [
         { "date": "2024-06-01", "top_emotion": "joy" },
         { "date": "2024-06-02", "top_emotion": "neutrality" }
       ]
     }
     ```

---

## 테스트 방법

### Postman을 사용한 API 테스트

1. **Postman 설치**  
   [Postman 다운로드](https://www.postman.com/) 후 설치합니다.  

2. **요청 보내기 & 결과 확인**
   위의 [사용법](#사용법) 대로 요청을 보낸 후 예시와 같이 응답이 오는지 확인합니다.

---

## 사용된 오픈 소스 설명

### **1. OpenAI API**  
- **용도**:  
  - 감정 분석: 사용자가 작성한 일기를 분석해 감정을 퍼센트로 반환  
  - AI 챗봇: 감정 탐구를 위한 대화형 질문 제공  

- **특징**:  
  OpenAI의 뛰어난 자연어 처리 기술을 활용해 사용자 감정을 정밀하게 분석하고 대화 흐름을 유지합니다.  

- **공식 문서**: [OpenAI API](https://platform.openai.com/docs)  

---

## 소스 코드 설명

1. **인증 시스템**  
   - **파일**: `authController.js`  
   - **기능**: 회원가입, 로그인, Access Token 및 Refresh Token 발급  

2. **일기 관리 시스템**  
   - **파일**: `dailyController.js`  
   - **기능**: 일기 저장 및 감정 분석 결과 저장, 일기 조회  

3. **월별 감정 분석**  
   - **파일**: `monthlyController.js`  
   - **기능**: 월별 감정 통계 조회 및 최상위 감정 반환  

4. **JWT 인증**  
   - **파일**: `jwtUtils.js`  
   - **기능**: Access Token 및 Refresh Token 생성 및 검증  

5. **데이터베이스 연동**  
   - **파일**: `prismaClient.js`  
   - **기능**: Prisma ORM을 통해 MySQL 데이터베이스와 상호작용  

---

## 프로젝트 구조

```
SmileLog-Backend/
│── prisma/
│   └── schema.prisma
│── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dailyController.js
│   │   ├── monthlyController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dailyRoutes.js
│   │   ├── monthlyRoutes.js
│   │   └── userRoutes.js
│   ├── prisma/
│   │   └── prismaClient.js
│   ├── utils/
│   │   ├── jwtUtils.js
│   │   └── index.js
│── package.json
└── README.md
```

