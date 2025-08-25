import React, { useState, useEffect } from 'react';
import './Login.css'; // 정리된 CSS 파일을 import 합니다.

const Login = ({ navigate }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [saveId, setSaveId] = useState(false);
  const [error, setError] = useState('');

  const savedIdKey = 'savedUserId'; 

  useEffect(() => {
    const saved = localStorage.getItem(savedIdKey);
    if (saved) {
      setId(saved);
      setSaveId(true);
    }
  }, []);

  const loginUrl = 'http://localhost:3001/login';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!id || !pw) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }

    try {
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pw }),
      });
      const data = await res.json();

      if (data.result === 'success') {
        if (saveId) {
          localStorage.setItem(savedIdKey, id);
        } else {
          localStorage.removeItem(savedIdKey);
        }
        localStorage.setItem('userId', id); 
        navigate('home');
      } else {
        setError(data.msg || '로그인 실패! 아이디/비밀번호를 확인하세요.');
      }
    } catch (err) {
      setError('서버 오류! 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div>
      <div className="login-corp-bg">
        <div className="login-corp-box">
          
          <h1>NUNBOM</h1>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder='아이디'
              value={id}
              onChange={e => setId(e.target.value)}
              autoFocus
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />
            
            {/* 아이디 저장 체크박스 영역 */}
            <div className="save-id-section">
              <input
                type="checkbox"
                id="saveId"
                checked={saveId}
                onChange={() => setSaveId(!saveId)}
              />
              <label htmlFor="saveId">
                아이디 저장
              </label>
            </div>

            {error && <div className="login-error">{error}</div>}
            <button className="main-loginbtn" type="submit">로그인</button>
          </form>

          <div className="login-link-area">
            <span>비밀번호를 잊으셨나요?</span>
            <span className="divider">|</span>
            <span onClick={() => navigate('join')} className="join-link">회원가입</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;