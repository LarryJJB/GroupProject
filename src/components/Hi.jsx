import React from 'react';
import './Hi.css'; // 스타일 통일을 위해 Intro.css도 import

const Hi = () => {
  return (
    <div className="hi-container">
      {/* Hero 메시지 */}
      <section className="sub-section dark-bg">
        <h1 className="hi-hero__title">
          환자의 안전을 지키는 <span className="hi-hero__highlight">작은 혁신</span>
        </h1>
        <p className="hi-hero__subtitle">의약품 라벨 불량 판정의 새로운 기준을 만듭니다.</p>
      </section>

      {/* 인삿말 */}
      <section className="sub-section">
        <div className='section-header'>
        <h2>인사말</h2>
        </div>
        <p className="greeting__text">
          보이지 않는 위험까지 잡아내는 AI의 눈, 눈봄은 모든 생명이 안심할 수 있는 환경을 만듭니다.
          <br />
          당신의 안전, 그 시작은 눈봄과 함께입니다.
        </p>
      </section>

      {/* 핵심 가치 */}
      <section className="sub-section">
        {/* 👇 여기에 className 추가! */}
        <div className='section-header'>
        <h2>핵심 가치</h2>
        </div>
        <div className="values__grid">
          <div className="values__card">
            <h3 className="values__card-title">정확성</h3>
            <p className="values__card-text">한글자의 오차도 허용하지 않는 분석</p>
          </div>
          <div className="values__card">
            <h3 className="values__card-title">신뢰성</h3>
            <p className="values__card-text">제약·의료업계가 믿고 맡길 수 있는 품질</p>
          </div>
          <div className="values__card">
            <h3 className="values__card-title">혁신</h3>
            <p className="values__card-text">AI 기반의 검사 프로세스 혁신</p>
          </div>
        </div>
      </section>

      {/* 비전 & 미션 */}
      <section className="sub-section">
        <div className='section-header'>
        <h2>현재와 미래</h2>
        </div>
        <div className='vision-mission'>
        <div className="vision-mission__box">
          <h3 className="vision-mission__title">Vision</h3>
          <p className="vision-mission__text">의약품 품질 검사에서 전 세계가 신뢰하는 표준</p>
        </div>
        <div className="vision-mission__box">
          <h3 className="vision-mission__title">Mission</h3>
          <p className="vision-mission__text">AI 기술로 오류 없는 검사 환경을 구축</p>
        </div>
        </div>
      </section>
    </div>
  );
};

export default Hi;
