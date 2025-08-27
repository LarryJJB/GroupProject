import React, { useState, useEffect } from 'react';
import './Login.css';
import client from '../api/client';

const Login = ({ navigate }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [saveId, setSaveId] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);
      const res = await client.post('/auth/login', {
        username: id,
        password: pw,
      });

      console.log('[LOGIN RES]', res.status, res.data);

      // ⚠️ 성공 조건을 엄격히: 토큰이 문자열인지 확인
      const token = res?.data?.token;
      const ok = res?.data?.success === true && typeof token === 'string' && token.length > 20;

      if (ok) {
        if (saveId) localStorage.setItem(savedIdKey, id);
        else localStorage.removeItem(savedIdKey);

        localStorage.setItem('token', token);
        localStorage.setItem('username', id);

        // 토큰이 실제 저장됐는지 double-check
        const stored = localStorage.getItem('token');
        if (!stored) {
          setError('토큰 저장에 실패했습니다. 브라우저 저장소 설정을 확인해주세요.');
          return;
        }

        navigate('home'); // 성공시에만 이동
      } else {
        setError(res?.data?.message || '로그인 실패! 아이디/비밀번호를 확인하세요.');
      }
    } catch (err) {
      console.log('[LOGIN ERR]', err?.response?.status, err?.response?.data);
      const msg = err?.response?.data?.message || '서버 오류! 잠시 후 다시 시도해 주세요.';
      setError(msg);
    } finally {
      setLoading(false);
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
            <button className="main-loginbtn" type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
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