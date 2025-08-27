// src/pages/Faq.jsx
import React, { useState } from 'react';
import './Faq.css';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqList = [
  { id: 1, question: '회원 가입은 어떻게 하나요?', answer: '홈페이지 상단의 로그인버튼을 눌러주세요.' },
  { id: 2, question: '서비스를 도입하고 싶어요.', answer: '고객센터로 연략해주시면 빠르게 도와드리겠습니다.' },
  { id: 3, question: '이용 요금은 얼마인가요?', answer: '각 기관별로 상이하기에 1:1문의 부탁드립니다.' },
  { id: 4, question: '000에도 도입가능한가요?', answer: '네 가능합니다. 저희 서비스는 000이외에도 00, 00, 00등 다양한 분야에도 적용가능합니다.' },
  { id: 5, question: '고객센터 연락처는 어떻게 되나요?', answer: '000-000-0000으로 연락주시면 빠르게 해결해드리겠습니다.' },
];

// 👇 1. App으로부터 navigate 신호를 선물(props)로 받습니다.
const Faq = ({ navigate }) => {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  // 👇 2. 버튼을 클릭하면, 선물 받은 navigate 신호를 사용해 페이지를 이동시킵니다.
  const handleNavigateToInquiry = () => {
    navigate('questionform');
  };

  return (
    <div className="faq-container">
      <div className="faq-hero">
        <h1 className='hero-title'>자주 묻는 질문</h1>
        <p className='hero-subtitle'>궁금한 점이 있으신가요? 먼저 자주 묻는 질문을 확인해보세요.</p>
      </div>
      
      <div className="faq-list">
        {faqList.map((item) => (
          <div className="faq-item" key={item.id} onClick={() => toggleFaq(item.id)}>
            <div className="faq-question">
              <span>{item.question}</span>
              {openId === item.id ? <FiMinus /> : <FiPlus />}
            </div>
            {openId === item.id && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 👇 3. Link 태그를 button으로 바꾸고 onClick 이벤트를 연결합니다. */}
      <div className="faq-footer">
        <p>원하는 답변을 찾지 못하셨나요?</p>
        <button onClick={handleNavigateToInquiry} className="inquiry-link">
          1:1 문의하기
        </button>
      </div>
    </div>
  );
};

export default Faq;