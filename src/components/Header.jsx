import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaGlobe, FaBars, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // (추가) 아코디언 아이콘
import './Header.css';

const menuData = [
  { title: '회사소개', items: [{ name: '인사말', page: 'hi' }, { name: '홍보영상', page: 'promo' }] },
  { title: '서비스', items: [{ name: '제품 소개', page: 'intro' }, { name: '체험', page: 'trial' }] },
  { title: '문의사항', items: [{ name: 'FAQ', page: 'faq' }, { name: '1:1문의하기', page: 'questionform' }] }
];

const Header = ({ navigate , isLoggedIn}) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // (추가) 모바일 메뉴 상태
  const [openAccordion, setOpenAccordion] = useState(null);     // (추가) 모바일 아코디언 상태
  const headerRef = useRef(null); 

  const handleLinkClick = (e, page) => {
    e.preventDefault();
    navigate(page);
    setMobileMenuOpen(false); // (추가) 모바일에서 링크 클릭 시 메뉴 닫기
  };

    // 2. 로그인 상태에 따라 페이지를 이동시키는 함수를 만듭니다.
  const handleAuthRedirect = () => {
    if (isLoggedIn) {
      // 로그인 상태(true)이면 마이페이지로 이동합니다.
      navigate('mypage');
    } else {
      // 비로그인 상태(false)이면 로그인 페이지로 이동합니다.
      navigate('login');
    }
    setMobileMenuOpen(false); // 모바일 메뉴가 열려있었다면 닫습니다.
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowMegaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // (추가) 모바일 아코디언 토글 함수
  const toggleAccordion = (title) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  return (
    <div className="header-wrapper" ref={headerRef}>
      <header className="header-container">
        
        <div className="logo">
          <a href="#" onClick={(e) => handleLinkClick(e, 'home')}>NUNBOM</a>
        </div>
        
        <div 
          className="nav-area-wrapper" 
          onMouseEnter={() => setShowMegaMenu(true)}
          onMouseLeave={() => setShowMegaMenu(false)}
        >
          <nav className="nav">
            {menuData.map((menu) => (
              <div key={menu.title} className="nav-item">
                <span className="nav-title">{menu.title}</span>
                <div className={`dropdown-column ${showMegaMenu ? 'visible' : ''}`}>
                  {menu.items.map((item) => (
                    <a key={item.name} href="#" onClick={(e) => handleLinkClick(e, item.page)} className="dropdown-link">
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="header-icons">
          <div className="icon-button" onClick={handleAuthRedirect}><FaUserCircle /></div>
        </div>

        {/* (추가) 햄버거 버튼 */}
        <div className="hamburger-button" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

      </header>

      {/* PC용 메가메뉴 배경 */}
      <div className={`mega-menu-background ${showMegaMenu ? 'visible' : ''}`}></div>
      {/* (추가) 모바일 메뉴 */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className='mobile-login' onClick={handleAuthRedirect}>
          {isLoggedIn ? '마이페이지' : '로그인/회원가입'}
        </div>
        {menuData.map(menu => (
          <div key={menu.title} className="mobile-menu-group">
            <div className="mobile-menu-1depth" onClick={() => toggleAccordion(menu.title)}>
              <span>{menu.title}</span>
              {openAccordion === menu.title ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {/* 아코디언이 열렸을 때 2뎁스 메뉴를 보여줌 */}
            {openAccordion === menu.title && (
              <div className="mobile-menu-2depth-links">
                {menu.items.map(item => (
                  <a 
                    key={item.name} 
                    href="#"
                    onClick={(e) => handleLinkClick(e, item.page)} 
                    className="mobile-menu-link"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;