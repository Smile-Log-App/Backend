
# 일기 작성 및 감정 분석 애플리케이션 

이 프로젝트는 Node.js를 사용하여 개발된 일기 작성 및 감정 분석 애플리케이션의 백엔드 레포지토리입니다. 프론트엔드로부터 일기 내용을 수신하고, Naver Sentiment API를 사용하여 감정 분석을 수행한 후 결과를 반환합니다.

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [사용 기술](#사용-기술)
3. [설치 방법](#설치-방법)
4. [폴더 구조](#폴더-구조)
5. [주요 라우트](#주요-라우트)

## 프로젝트 개요

이 프로젝트는 사용자가 작성한 일기 내용을 분석하여 감정 결과를 반환하는 백엔드 서버입니다. Express.js를 사용하여 서버를 설정하고, Naver Sentiment API를 사용하여 감정 분석을 수행합니다.

## 사용 기술

- Node.js
- Express.js
- Axios
- Body-Parser
- CORS

## 설치 방법

1. **레포지토리 클론**
   ```sh
   git clone <repository-url>
   cd backend
2. **의존성 설치 및 서버 실행**
   ```sh
   npm install
   node server.js
  
## 폴더 구조
```sh
backend/
├── server.js
└── package.json
```
## 주요 라우트
- /diary: 프론트엔드로부터 일기 내용을 받아 Naver Sentiment API로 감정 분석 요청을 보냅니다. 분석 결과를 프론트엔드로 반환합니다.
