import './Join.css';
import React, { useState } from 'react';
import client from '../api/client'; // axios 인스턴스

const Join = ({ navigate }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms || !agreePrivacy) {
      alert('약관 및 개인정보 동의는 필수입니다.');
      return;
    }
    if (pw !== pw2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 백엔드 /auth/register 스펙: { username, password, name }
      await client.post('/auth/register', {
        username: id,
        password: pw,
        name,
      });

      alert('회원가입 성공!');
      navigate('login');
    } catch (err) {
      // 백엔드 표준 에러 포맷: { success:false, code, message }
      const msg = err?.response?.data?.message || '서버 오류 또는 네트워크 오류';
      alert(msg);
    }
  };

  return (
    <div>
      <div className="join-corp-bg">
        <div className="join-corp-box">
          <h2>NUNBOM</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            {/* 서버 스펙에 맞게 아이디/비밀번호만 전송 */}
            <input
              type="text"
              placeholder="아이디 (영문+숫자+특수문자)"
              value={id}
              onChange={e => setId(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={pw2}
              onChange={e => setPw2(e.target.value)}
              required
            />

            <div className="terms">
              <label>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  required
                />
                약관 동의
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={e => setAgreePrivacy(e.target.checked)}
                  required
                />
                개인정보처리방침 동의
              </label>
            </div>

            <button className="main-btn" type="submit">회원가입</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;