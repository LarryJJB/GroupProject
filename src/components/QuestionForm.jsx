import React, { useState } from 'react';
import './QuestionForm.css';

const QuestionForm = ({onSubmit }) => {
  const [formData, setFormData] = useState({
    inquiryType: '환불',
    title: '',
    content: '',
    contact: '',
    file: null
  });

  const inquiryTypes = ['환불', '기술지원', '기타'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  // 필수값 체크
  if (!formData.title.trim() || !formData.content.trim() || !formData.contact.trim()) {
    alert('제목, 내용, 이메일은 필수 입력사항입니다.');
    return;
  }

    // 새 문의 데이터 생성
    const newInquiry = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString('ko-KR'),
      status: '접수',
      views: 0,
      answer: null
    };

    onSubmit(newInquiry);
    
    // 폼 초기화
    setFormData({
      inquiryType: '환불',
      title: '',
      content: '',
      contact: '',
      file: null
    });
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>1:1 문의하기</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="inquiry-form">
          {/* 문의 유형 */}
          <div className="form-group full-width">
            <label>문의유형 *</label>
            <div className="inquiry-types">
              {inquiryTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`type-button ${formData.inquiryType === type ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, inquiryType: type }))}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="form-group">
            <label htmlFor="title">제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="문의 제목을 입력해주세요"
              maxLength={100}
            />
          </div>

          {/* 내용 */}
          <div className="form-group full-width">
            <label htmlFor="content">내용 *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="문의 내용을 자세히 입력해주세요"
              rows={8}
              maxLength={1000}
            />
            <div className="char-count">{formData.content.length}/1000</div>
          </div>

          {/* 파일 첨부 */}
          <div className="form-group full-width">
            <label htmlFor="file">파일첨부</label>
            <div className="file-upload">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
              />
              <div className="file-info">
                {formData.file ? (
                  <span>📎 {formData.file.name}</span>
                ) : (
                  <span className="file-placeholder">파일을 선택해주세요 (최대 10MB)</span>
                )}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="form-buttons full-width">
            <button type="submit" className="submit-button">
              문의하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;