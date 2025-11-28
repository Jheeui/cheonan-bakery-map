const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// 환경 변수 로드
dotenv.config();

// DB 연결
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트
const bakeryRoutes = require('./routes/bakeryRoutes');
app.use('/api/bakeries', bakeryRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '천안 빵집 지도 API 서버' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});