import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

// Express 앱 초기화
const app = express();
const port = 3001;

// CORS 설정
app.use(cors());

// body-parser 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * 일기 컨텐츠를 받아서 외부 API로 요청을 보내는 라우트 설정
 * POST 요청을 통해 일기 내용을 받아 네이버 감정 분석 API로 전송하여 결과를 반환합니다.
 */
app.post("/diary", async (req, res) => {
  // 요청 본문에서 일기 컨텐츠 추출
  const { content } = req.body;

  // 네이버 API 키 설정
  const client_id = "ki39rdkaso";
  const client_secret = "0sB35nX5rFrxVZiiB05lcCZKC2n1GDFEASx2pve9";
  const url = "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze";

  // 네이버 API 요청 헤더 설정
  const headers = {
    "X-NCP-APIGW-API-KEY-ID": client_id,
    "X-NCP-APIGW-API-KEY": client_secret,
    "Content-Type": "application/json",
  };

  try {
    console.log("Request received:", { content }); // 디버깅을 위한 로그 추가
    // 네이버 API로 일기 내용을 POST 요청
    const response = await axios.post(url, { content }, { headers });
    console.log("Naver API response:", response.data); // 디버깅을 위한 로그 추가
    // 네이버 API의 응답 데이터를 클라이언트로 전송
    res.json(response.data);
  } catch (error) {
    console.error("Naver API error:", error.response ? error.response.data : error.message); // 디버깅을 위한 로그 추가
    // 에러가 발생할 경우 상태 코드와 에러 메시지를 클라이언트로 전송
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
