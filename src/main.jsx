import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 전역 스타일 적용
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <App />
  </React.StrictMode>
);