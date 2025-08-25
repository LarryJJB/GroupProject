import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import QuestionForm from './components/QuestionForm';
import Trial from './components/Trial';
import Intro from './components/Intro';
import Hi from './components/Hi';
import Faq from './components/Faq';
import Promo from './components/Promo';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleInquirySubmit = (inquiryData) => {
    console.log('새 문의:', inquiryData);
    alert('문의가 성공적으로 접수되었습니다!');
    setCurrentPage('home');
  };

  const handleInquiryClose = () => {
    setCurrentPage('home');
  };

  return (
    <div className="App">
      <Header navigate={navigate} />

      <main>
        {/* renderPage 함수 대신, 여기에 직접 페이지를 보여주는 로직을 넣습니다. */}
        {(() => {
          switch (currentPage) {
            case 'home':
              return <Home navigate={navigate} />;
            case 'questionform':
              return (
                <QuestionForm 
                  onSubmit={handleInquirySubmit}
                  onClose={handleInquiryClose}
                />
              );
            case 'trial':
              return <Trial navigate={navigate} />;
            case 'intro':
              return <Intro navigate={navigate} />;
            case 'hi':
              return <Hi navigate={navigate} />;
            case 'faq':
              return <Faq navigate={navigate} />;
            case 'promo':
              return <Promo navigate={navigate} />;
            default:
              return <Home navigate={navigate} />;
          }
        })()}
      </main>
    </div>
  );
}

export default App;