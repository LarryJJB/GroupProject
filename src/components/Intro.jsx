import React from 'react';
import './Intro.css';
import Rabel from '../assets/Rabel.jpg'
import Rabel2 from '../assets/Rabel2.jpg'
// 아이콘 import (react-icons)
import {
  FiCamera,
  FiCpu,
  FiCheckCircle,
  FiFileText,
  FiTag,
  FiRefreshCw,
  FiDownload,
  FiExternalLink,
} from 'react-icons/fi';

const ICON_COLOR = '#007bff';
const DISABLED_ICON_COLOR = '#6c757d'; // 회색

const Intro = () => {
  return (
    <main className="intro-container">
      {/* 히어로 섹션 */}
      <section className="hero">
        <h1 className="hero-title">
          AI가 의약품 라벨 불량을 단 1초 만에 감지합니다
        </h1>
        <p className="hero-subtitle">
          사람의 눈으로 놓치기 쉬운 오류도, AI는 놓치지 않습니다.
        </p>
      </section>

      {/* 문제 제기 섹션 */}
      <section className="sub-section">
        <div className='section-header'>
        <h2>왜 라벨 검사가 중요한가?</h2>

        </div>
        <ul className="problem-list">
          <li>
            라벨 오류 환자 피해 연간 3,000건 이상
            <a
              href="https://www.ismp.org/resources/medication-errors"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: '6px', color: ICON_COLOR }}
            >
              <FiExternalLink size={14} />
            </a>
          </li>
          <li>
            리콜 1건당 수십억 원 소요
            <a
              href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: '6px', color: ICON_COLOR }}
            >
              <FiExternalLink size={14} />
            </a>
          </li>
          <li>
            육안 검사 결함 최대 15% 누락
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5051234/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: '6px', color: ICON_COLOR }}
            >
              <FiExternalLink size={14} />
            </a>
          </li>
        </ul>
        <p className="problem-summary">
          육안 검사는 미세 결함을 놓치기 쉽고, 대량 검수 시 피로도로 인해 정확도가 저하됩니다.
        </p>
      </section>

      {/* 솔루션 개요 섹션 */}
      <section className="sub-section">
        <div className='section-header'>

        <h2>우리의 접근 방법</h2>
        </div>
        <div className="flow">
          <div className="flow-step">
            <FiCamera size={90} color={DISABLED_ICON_COLOR} />
            <p>이미지 업로드</p>
          </div>
          <div className="flow-step">
            <FiCpu size={90} color={DISABLED_ICON_COLOR} />
            <p>OCR & YOLO 분석</p>
          </div>
          <div className="flow-step">
            {/* 세 번째 아이콘만 회색으로 표시 */}
            <FiCheckCircle size={90} color={DISABLED_ICON_COLOR} />
            <p>불량 판별 & 리포트 제공</p>
          </div>
        </div>
      </section>

      {/* 핵심 기능 섹션 */}
      <section className="sub-section dark-bg">
        <div className="section-header">
        <h2>핵심 기능</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <FiFileText size={90} color={ICON_COLOR} />
            <h3>다양한 형식 지원</h3>
            <p>PDF·이미지·실시간 카메라 피드 대응</p>
          </div>
          <div className="feature-card">
            <FiTag size={90} color={ICON_COLOR} />
            <h3>불량 유형 자동 분류</h3>
            <p>누락·흐림·오염 등 5가지 이상 분류</p>
          </div>
          <div className="feature-card">
            <FiRefreshCw size={90} color={ICON_COLOR} />
            <h3>배치 처리 기능</h3>
            <p>한 번에 최대 1000개 검사 지원</p>
          </div>
          <div className="feature-card">
            <FiDownload size={90} color={ICON_COLOR} />
            <h3>리포트 다운로드</h3>
            <p>PDF·CSV 리포트 자동 생성·다운로드</p>
          </div>
        </div>
      </section>

      {/* 결과 예시 섹션 */}
      <section className="sub-section">
        <div className='section-header'>

        <h2>결과 예시</h2>
        </div>
        <div className="sample-images">
          <img src={Rabel} alt="YOLO 박스가 그려진 라벨 사진" />
          <img src={Rabel2} alt="추출된 OCR 텍스트 예시" />
        </div>
      </section>
    </main>
  );
};

export default Intro;
