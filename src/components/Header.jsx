import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { FaUserCircle, FaGlobe } from "react-icons/fa";

// 메뉴 데이터는 컴포넌트 바깥에 두어 불필요한 재생성을 방지합니다.
const menuData = [
  { title: '회사소개', items: [{ name: '인사말', page: 'hi' }, { name: '홍보영상', page: 'promo' }] },
  { title: '서비스', items: [{ name: '제품 소개', page: 'intro' }, { name: '체험', page: 'trial' }] },
  { title: '문의사항', items: [{ name: 'FAQ', page: 'faq' }, { name: '1:1문의하기', page: 'questionform' }] }
];

const Header = ({ navigate }) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const headerRef = useRef(null); 

  const handleLinkClick = (e, page) => {
    e.preventDefault();
    navigate(page);
  };
  
  // 메뉴 바깥 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowMegaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                {/* 'visible' 클래스를 동적으로 제어합니다. */}
                <div className={`dropdown-column ${showMegaMenu ? 'visible' : ''}`}>
                  {menu.items.map((item) => (
                    <a 
                      key={item.name} 
                      href="#" 
                      onClick={(e) => handleLinkClick(e, item.page)}
                      className="dropdown-link"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="header-icons">
          <div className="icon-button"><FaGlobe /></div>
          <div className="icon-button"><FaUserCircle /></div>
        </div>

      </header>

      {/* 배경도 항상 렌더링하고 'visible' 클래스로 제어해야 애니메이션이 작동합니다. */}
      <div className={`mega-menu-background ${showMegaMenu ? 'visible' : ''}`}></div>
    </div>
  );
};

export default Header;