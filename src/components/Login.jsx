import React, { useState, useEffect } from 'react';
import './Login.css';
import client from '../api/client'; // baseURL 설정된 axios 인스턴스

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!id || !pw) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }

    // Login.jsx (핵심 부분만)
    try {
      const res = await client.post('/auth/login', { username: id, password: pw });

      const token = res?.data?.token;
      const ok = res?.data?.success === true && typeof token === 'string' && token.length > 20;

      if (ok) {
        if (saveId) localStorage.setItem(savedIdKey, id);
        else localStorage.removeItem(savedIdKey);

        localStorage.setItem('token', token);
        // 토큰 payload에서 유저정보 추출 (id, username, role 등)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload?.username) localStorage.setItem('username', payload.username);
          if (payload?.role) localStorage.setItem('role', payload.role);
          if (payload?.id) localStorage.setItem('userId', payload.id);
        } catch {}

        alert('로그인 성공!');           // ← 확실한 피드백
        navigate('home', { state: { justLoggedIn: true } });  // ← 상태도 같이 넘김
      } else {
        setError(res?.data?.message || '로그인 실패! 아이디/비밀번호를 확인하세요.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || '서버 오류! 잠시 후 다시 시도해 주세요.';
      setError(msg);
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
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoFocus
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />

            <div className="save-id-section">
              <input
                type="checkbox"
                id="saveId"
                checked={saveId}
                onChange={() => setSaveId(!saveId)}
              />
              <label htmlFor="saveId">아이디 저장</label>
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