import './Join.css';
import { useState } from "react";
// import Header from './Header'; // App.jsx에서 렌더링되므로 제거
// import { useNavigate } from "react-router-dom"; // 라우터 의존성 제거
import axios from 'axios';
import React from 'react';

// props로 navigate 함수를 받도록 수정
const Join = ({ navigate }) => { 
  // 각각 입력값 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [corpTel, setCorpTel] = useState('');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // const navigate = useNavigate(); // 라우터 hook 제거

  // 제출 이벤트 핸들러
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
    // POST 요청
    try {
      const res = await axios.post('http://localhost:3001/userg/join', {
        name, phone, email, corpTel, id, pw
      });
      if (res.data.result === 1) {
        alert('회원가입 성공!');
        // props로 받은 navigate 함수를 사용하여 'login' 페이지로 이동
        navigate('login'); 
      } else {
        alert('회원가입 실패!');
      }
    } catch (err) {
      alert('서버 오류 또는 DB 오류!');
    }
  };

  return (
    <div>
      {/* <Header /> 는 App.jsx에서 렌더링되므로 제거 */}
      <div className="join-corp-bg">
        <div className="join-corp-box">
          <br /><br /><br /><br />
          <h2>NUNBOM</h2>
          <br /><br />
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} required />
            <input type="tel" placeholder="연락처(휴대폰)" value={phone} onChange={e => setPhone(e.target.value)} required />
            <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="text" placeholder="[선택] 전화번호" value={corpTel} onChange={e => setCorpTel(e.target.value)} />
            <input type="text" placeholder="아이디 (영문+숫자+특수문자)" value={id} onChange={e => setId(e.target.value)} required />
            <input type="password" placeholder="비밀번호" value={pw} onChange={e => setPw(e.target.value)} required />
            <input type="password" placeholder="비밀번호 확인" value={pw2} onChange={e => setPw2(e.target.value)} required />
            <div className="terms">
              <label>
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} required />
                약관 동의
              </label>
              <label>
                <input type="checkbox" checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)} required />
                개인정보처리방침 동의
              </label>
            </div>
            <br />
            <button className="main-btn" type="submit">회원가입</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;