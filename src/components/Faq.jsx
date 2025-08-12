// src/pages/Faq.jsx

import React, { useState } from 'react';
// ⚠️ Link는 더 이상 필요 없으므로 import에서 제거해도 됩니다.
import './Faq.css';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqList = [
  { id: 1, question: '서비스 가입은 어떻게 하나요?', answer: '홈페이지 회원가입 버튼을 눌러주세요.' },
  { id: 2, question: '비밀번호를 잊어버렸어요.', answer: '비밀번호 찾기 메뉴에서 재설정 가능합니다.' },
  { id: 3, question: '이용 요금은 얼마인가요?', answer: '요금 안내 페이지에서 확인하실 수 있습니다.' },
  { id: 4, question: '서비스 해지는 어떻게 하나요?', answer: '마이페이지 > 서비스 해지에서 신청할 수 있습니다.' },
  { id: 5, question: '고객센터 연락처는 어떻게 되나요?', answer: '문의사항 페이지에서 확인 가능합니다.' },
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
      <div className="faq-header">
        <h2>자주 묻는 질문</h2>
        <p>궁금한 점이 있으신가요? 먼저 자주 묻는 질문을 확인해보세요.</p>
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