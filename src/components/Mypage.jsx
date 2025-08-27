// src/components/MyPage.jsx

import React, { useState } from 'react';
import './MyPage.css'; 
import { FiGrid, FiBarChart2, FiMessageSquare, FiSettings, FiLogOut, FiMenu , FiChevronDown , FiChevronUp } from 'react-icons/fi';

const MyPage = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [openInquiry, setOpenInquiry] = useState(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);

  const [settingsForm, setSettingsForm] = useState({
    companyName: 'ABC 제약',
    contactPerson: '홍길동',
    email: 'test@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // 대시보드용 가짜 데이터
  const mockDashboardData = {
    totalInspections: 1250,
    defective: 12,
    defectRate: '0.96%',
    recentActivities: [
      { id: 1, date: '2023-10-27 15:30', result: '정상', fileName: 'label_batch_01.zip' },
      { id: 2, date: '2023-10-27 14:00', result: '불량 감지', fileName: 'sample_images_231027.zip' },
      { id: 3, date: '2023-10-26 18:00', result: '정상', fileName: 'test_run_final.zip' },
    ]
  };

    const mockInquiryData = [
    { 
      id: 'inq-01', 
      type: '기술지원', 
      title: 'API 연동 관련 문의드립니다.', 
      date: '2023-10-25', 
      status: '답변완료',
      question: '안녕하세요. 귀사의 API를 저희 시스템에 연동하는 과정에서 인증 오류가 발생하여 문의드립니다. 관련 문서를 받을 수 있을까요?',
      answer: '안녕하세요, 홍길동 고객님. 문의주셔서 감사합니다. 요청하신 API 연동 가이드 문서를 첨부해드렸습니다. 확인 후에도 문제가 지속되면 언제든지 다시 문의해주세요.'
    },
    { 
      id: 'inq-02', 
      type: '기타', 
      title: '서비스 플랜 변경 문의', 
      date: '2023-10-22', 
      status: '처리중',
      question: '현재 Basic 플랜을 사용 중인데, Pro 플랜으로 업그레이드하고 싶습니다. 절차를 알려주세요.',
      answer: null // 아직 답변이 없는 경우
    },
  ];

    // --- (추가) 폼 입력값이 바뀔 때마다 state를 업데이트하는 함수 ---
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm(prev => ({ ...prev, [name]: value }));
  };

  const sidebarMenus = [
    { id: 'dashboard', text: '대시보드', icon: <FiGrid /> },
    { id: 'inquiry', text: '문의 내역', icon: <FiMessageSquare /> },
    { id: 'settings', text: '계정 설정', icon: <FiSettings /> },
  ];

    // 문의 항목 클릭 시 아코디언을 토글하는 함수
  const toggleInquiry = (inquiryId) => {
    setOpenInquiry(openInquiry === inquiryId ? null : inquiryId);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div>
            <h2 className="mypage-content-title">요약 대시보드</h2>
            <div className="mypage-summary-grid">
              <div className="mypage-summary-card">
                <div className="mypage-card-title">총 체험 분석 수</div>
                <div className="mypage-card-value">{mockDashboardData.totalInspections.toLocaleString()}건</div>
              </div>
              <div className="mypage-summary-card">
                <div className="mypage-card-title">불량 판정</div>
                <div className="mypage-card-value">{mockDashboardData.defective}건</div>
              </div>
              <div className="mypage-summary-card">
                <div className="mypage-card-title">불량률</div>
                <div className="mypage-card-value">{mockDashboardData.defectRate}</div>
              </div>
            </div>
            <h3 className="mypage-content-title secondary">최근 체험하기 내역</h3>
            <div className="mypage-table-container">
              <table className="mypage-table">
                <tbody>
                {mockDashboardData.recentActivities.map(act => (
                  <tr key={act.id}>
                    <td>{act.date}</td>
                    <td>{act.fileName}</td>
                    <td className={act.result === '불량 감지' ? 'status-defect' : 'status-normal'}>
                      {act.result}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'inquiry':
        return (
          <div>
            <h2 className="mypage-content-title">My문의내역</h2>
            <div className="inquiry-list-container">
              {mockInquiryData.map(inquiry => (
                <div key={inquiry.id} className="inquiry-item">
                  <div className="inquiry-header" onClick={() => toggleInquiry(inquiry.id)}>
                    <div className="inquiry-summary">
                      <span className={`status-badge ${inquiry.status === '답변완료' ? 'completed' : 'pending'}`}>
                        {inquiry.status}
                      </span>
                      <span className="inquiry-title">{inquiry.title}</span>
                    </div>
                    <div className="inquiry-meta">
                      <span className="inquiry-date">{inquiry.date}</span>
                      {openInquiry === inquiry.id ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                  {/* 아코디언이 열렸을 때 상세 내용을 보여줌 */}
                  {openInquiry === inquiry.id && (
                    <div className="inquiry-content">
                      <div className="content-section question">
                        <strong>Q. 질문 내용</strong>
                        <p>{inquiry.question}</p>
                      </div>
                      {inquiry.answer && (
                        <div className="content-section answer">
                          <strong>A. 답변 내용</strong>
                          <p>{inquiry.answer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2 className="mypage-content-title">계정 설정</h2>
            <div className="settings-form-container">
              {/* 회사 정보 섹션 */}
              <div className="form-section">
                <h3 className="form-section-title">회사 정보</h3>
                <div className="form-group">
                  <label htmlFor="companyName">회사명</label>
                  <input type="text" id="companyName" name="companyName" value={settingsForm.companyName} onChange={handleSettingsChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="contactPerson">담당자명</label>
                  <input type="text" id="contactPerson" name="contactPerson" value={settingsForm.contactPerson} onChange={handleSettingsChange} />
                </div>
              </div>

              {/* 로그인 정보 섹션 */}
              <div className="form-section">
                <h3 className="form-section-title">로그인 정보</h3>
                <div className="form-group">
                  <label htmlFor="email">이메일 주소 (ID)</label>
                  <input type="email" id="email" name="email" value={settingsForm.email} readOnly disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="currentPassword">현재 비밀번호</label>
                  <input type="password" id="currentPassword" name="currentPassword" value={settingsForm.currentPassword} onChange={handleSettingsChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">새 비밀번호</label>
                  <input type="password" id="newPassword" name="newPassword" value={settingsForm.newPassword} onChange={handleSettingsChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={settingsForm.confirmPassword} onChange={handleSettingsChange} />
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="settings-actions">
                <button className="save-button">변경사항 저장</button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>대시보드</div>;
    }
  };

return (
    // 2. isSidebarCollapsed 값에 따라 'sidebar-collapsed' 클래스를 동적으로 추가합니다.
    //    CSS는 이 클래스의 유무를 보고 사이드바를 숨기거나 보여주는 애니메이션을 실행합니다.
    <div className={`mypage-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      
      {/* 3. 토글 버튼을 사이드바 바깥에, 독립적으로 위치시킵니다. */}
      {/* 이렇게 해야 사이드바가 숨겨져도 버튼은 화면에 남아있을 수 있습니다. */}
      <div className="sidebar-toggle-button" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}>
        <FiMenu />
      </div>

      <aside className="mypage-sidebar">
        <div className="mypage-profile">
          <div className="profile-content">
            <div className="mypage-company-name">ABC 제약</div>
            <div className="mypage-user-name">홍길동 담당자님</div>
          </div>
        </div>
        <nav className="mypage-nav">
          {sidebarMenus.map(menu => (
            <div 
              key={menu.id}
              className={`mypage-menu-item ${activeMenu === menu.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(menu.id)}
            >
              {menu.icon}
              <span className="menu-text">{menu.text}</span>
            </div>
          ))}
        </nav>
        <div 
          className="mypage-menu-item mypage-logout-button"
          onClick={onLogout}
        >
          <FiLogOut />
          <span className="menu-text">로그아웃</span>
        </div>
      </aside>
      <main className="mypage-main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default MyPage;
