import React from 'react';
import './Home.css'; // CSS 파일 import

const Home = ({ navigate }) => {
    const handleNavigateToTrial = () => {
    navigate('trial');
  };
  return (
    <main className="hero-section">
  <div className="hero-overlay"></div>
  <div className="hero-content">
    <h1>AI 기반 의약품 라벨 불량 판정 시스템</h1>
    <p>실시간 라벨 오류 감지로 품질관리 자동화</p>
        <button onClick={handleNavigateToTrial} className="trial-link">
          체험하기
        </button>
  </div>
    </main>
  );
};

export default Home;