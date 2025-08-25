import './LoginCorp.css';
import React from 'react';

const JoinMain = ({ navigate }) => { // navigate prop을 받도록 수정
  return (
    <div>
      {/* <Header /> 는 App.jsx에서 렌더링되므로 제거 */}
      <div className="login-corp-bg">
        <div className="login-corp-box">
          <h2>회원가입</h2>
          <div>
            {/* Link를 navigate 함수를 사용하는 button으로 변경 */}
            <button onClick={() => navigate('joinbusiness')} className="main-btn-01">
              기업
            </button>
            <button onClick={() => navigate('joingovernment')} className="main-btn-01">
              관공업
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMain;
