import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
// import QA from './components/QA'; // QA 컴포넌트 사용 안함
import QuestionForm from './components/QuestionForm';
import Trial from './components/Trial'; // 체험 페이지 추가
import Intro from './components/Intro';
import Hi from './components/Hi'; // Hi 컴포넌트 추가
import Faq from './components/Faq'; // Faq 컴포넌트 추가
import Promo from './components/Promo'; // 프로모션 컴포넌트 추가
import './App.css';

function App() {
  // 'home', 'qa' 등 문자열로 현재 페이지를 관리하는 상태
  const [currentPage, setCurrentPage] = useState('home');

  // 페이지를 변경하는 함수. Header로 전달됩니다.
  const navigate = (page) => {
    setCurrentPage(page);
  };

  // 문의 제출 처리 함수
  const handleInquirySubmit = (inquiryData) => {
    // 여기서 문의 데이터를 처리 (localStorage, API 등)
    console.log('새 문의:', inquiryData);
    alert('문의가 성공적으로 접수되었습니다!');
    // 문의 제출 후 홈으로 이동
    setCurrentPage('home');
  };

  // 문의 폼 닫기 함수
  const handleInquiryClose = () => {
    setCurrentPage('home');
  };

  // currentPage 상태에 따라 보여줄 컴포넌트를 결정하는 함수
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      // case 'qa': QA 컴포넌트 사용 안함
      //   return <QA />;
      case 'questionform':
        return (
          <QuestionForm 
            onSubmit={handleInquirySubmit}
            onClose={handleInquiryClose}
          />
        );
      case 'experience': // 체험 페이지 추가
        return <Trial navigate={navigate} />;
      // 다른 페이지 케이스를 여기에 추가할 수 있습니다.
      case 'intro':
        return <Intro navigate={navigate} />;
      case 'hi': // Hi 컴포넌트 추가
        return <Hi navigate={navigate} />;
      case 'faq':
        return <Faq navigate={navigate} />; // Faq 컴포넌트 추가
      case 'promo':
        return <Promo navigate={navigate} />; // 프로모션 컴포넌트 추가
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      {/* navigate 함수를 Header에 props로 전달 */}
      <Header navigate={navigate} />
      {/* 현재 페이지에 맞는 컴포넌트를 렌더링 */}
      {renderPage()}
    </div>
  );
}

export default App;