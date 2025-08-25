// src/api/client.js
import axios from 'axios';

// axios 인스턴스 생성
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // .env에서 API 주소 가져오기
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 → 토큰 자동 추가
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // 로그인 성공 시 저장된 토큰
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 → 에러 처리 표준화
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error("API Error:", err.response.data);
    } else {
      console.error("Network Error:", err);
    }
    return Promise.reject(err);
  }
);

export default client;