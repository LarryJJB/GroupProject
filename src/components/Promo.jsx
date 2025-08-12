import React from 'react';
import './Promo.css';
import { FiCpu, FiBarChart2, FiCalendar } from 'react-icons/fi';

const Promo = () => {
  return (
    <div className="promo-container">
      <section className="promo-video-placeholder">
        <div className="video-overlay"></div>
        <div className="video-content">
          <h2>AI 기반 실시간 라벨 검수 시스템</h2>
          <p>우리의 기술이 어떻게 제조 공정을 혁신하는지 확인해보세요.</p>
          <div className="play-button">▶</div>
          <span>(홍보 영상이 여기에 표시됩니다)</span>
        </div>
      </section>

      <section className="sub-section">
        <div className="section-header">
          <h2>핵심 기술</h2>
        </div>
        <div className="tech-table">
          <div className="tech-row header">
            <div>기술</div>
            <div>적용 대상</div>
            <div>판별 항목</div>
          </div>
          <div className="tech-row">
            <div>YOLO</div>
            <div>라벨 표기</div>
            <div>약품명, 유효기간 등의 위치 탐지</div>
          </div>
          <div className="tech-row">
            <div>OCR</div>
            <div>의약품명, 유효기간 등</div>
            <div>문자 데이터 추출</div>
          </div>
          <div className="tech-row">
            <div>OCV</div>
            <div>추출된 문자</div>
            <div>인쇄 오류, 왜곡, 누락 여부 검증</div>
          </div>
        </div>
      </section>

      <section className="sub-section dark-bg">
        <div className="section-header">
          <h2>기대 효과</h2>
        </div>
        <div className="effects-grid">
          <div className="effect-card">
            <h3>인력 효율화</h3>
            <p className="effect-highlight">연간 75% 비용 절감</p>
            <p>검사 공정 자동화로 인건비를 절감하고, 16개월 내 투자비 회수가 가능합니다. (5년 후 ROI 275% 실현)</p>
          </div>
          <div className="effect-card">
            <h3>데이터 자산화</h3>
            <p className="effect-highlight">검사 속도 40% 향상</p>
            <p>불량 패턴 데이터를 축적하고 지속적으로 학습시켜 품질 관리 시스템을 고도화하고, 라벨링 노력을 15% 절감합니다.</p>
          </div>
          <div className="effect-card">
            <h3>신뢰성 향상</h3>
            <p className="effect-highlight">최대 99.9% 정확도</p>
            <p>오류 허용률을 10배 이상 감소시켜 품질 안정성을 보증하고, 기업의 브랜드 가치를 극대화합니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Promo;
