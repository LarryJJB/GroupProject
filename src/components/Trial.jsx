import React, { useState } from "react";
import "./Trial.css";
import { FiAlertTriangle } from 'react-icons/fi';
import { FaVolumeUp } from 'react-icons/fa';

export default function Trial({ navigate }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState("");
  const [detections, setDetections] = useState([]);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [summary, setSummary] = useState("");


  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResultImage("");
      setDetections([]);
      setSummary("");
      setIsResultVisible(false);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleAnalysis = async () => {
    if (!imageFile) {
      alert("먼저 이미지를 업로드해주세요.");
      return;
    }

    setIsLoading(true);
    setResultImage("");
    setDetections([]);
    setSummary(""); 
    setIsResultVisible(false);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "서버 응답 오류");
      }

      const data = await response.json();
      setResultImage(data.resultImage);
      setDetections(data.detections || []);
      setSummary(data.summary || ""); 
      setIsResultVisible(true);

    } catch (error) {
      console.error("분석 중 오류:", error);
      alert(`분석 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR'; 
      utterance.rate = 1;  
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    } else {
      alert("음성 변환을 지원하지 않는 브라우저이거나, 읽을 텍스트가 없습니다.");
    }
  };

  return (
    <div className="trial-page">
      <div className="trial-hero">
        <h1 className="hero-title">라벨의 불량을 판정해 드립니다</h1>
        <p className="hero-subtitle">원하는 사진을 넣어보세요.</p>
      </div>
      <div className="main-content">
        {!isResultVisible ? (
          <>
            <h2>1. 분석할 이미지 업로드</h2>
            {/* ... 기존 업로드 UI ... */}
            <div className="form-group full-width">
              <div className="file-upload">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label htmlFor="file" className="file-label"> 
                  <div className="file-info">
                    {imageFile ? (
                      <span>📎 {imageFile.name}</span>
                    ) : (
                      <span className="file-placeholder">이미지를 선택해주세요</span>
                    )}
                  </div>
                </label>
                {imagePreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img src={imagePreview} alt="미리보기" className="image-preview"/>
                  </div>
                )}
              </div>
            </div>
            <h2>2. AI 분석 시작</h2>
            <button
              onClick={handleAnalysis}
              disabled={!imageFile || isLoading}
              className="btn btn-primary"
            >
              {isLoading ? "분석 중..." : "분석 시작하기"}
            </button>
          </>
        ) : (
          <div>
            <h2>분석 결과</h2>
            {isLoading ? (
              <p className="loading-text">AI가 이미지를 분석하고 있습니다...</p>
            ) : resultImage ? (
              <div className="trial-result-content">
                <h3>분석 결과 이미지</h3>
                <img
                  src={`data:image/jpeg;base64,${resultImage}`}
                  alt="분석된 이미지"
                  className="image-preview analyzed-image"
                />

                {summary && (
                  <div className="summary-container">
                    <h3 className="details-header">AI 요약 설명</h3>
                    <p className="summary-text">{summary}</p>
                    <button onClick={() => speakText(summary)} className="btn-speak">
                      <FaVolumeUp style={{ marginRight: '8px' }} /> 음성으로 듣기
                    </button>
                  </div>
                )}
                
                <h3 className="details-header">탐지된 객체 상세 정보</h3>
                {detections.length > 0 ? (
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th>이미지</th>
                        <th>ID</th>
                        <th>추출된 텍스트</th>
                        <th>라벨</th>
                        <th>신뢰도</th>
                        <th>좌표</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detections.map((det) => (
                        <tr key={det.id}>
                          <td>
                            <img
                              src={`data:image/jpeg;base64,${det.image}`}
                              alt={`det-${det.id}`}
                              className="cropped-image"
                              style={{ maxHeight: '40px' }}
                            />
                          </td>
                          <td>{det.id}</td>
                          <td>
                            <div className="scrollable-cell-text">{det.text}</div>
                          </td>
                          <td>{det.label}</td>
                          <td>{(det.confidence * 100).toFixed(2)}%</td>
                          <td>{det.coords}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>이미지에서 객체를 탐지하지 못했습니다.</p>
                )}
              </div>
            ) : (
              <p>분석 결과를 기다리는 중입니다.</p>
            )}
            <button onClick={() => setIsResultVisible(false)} className="btn btn-primary" style={{ marginTop: '4rem' }}>
              새로운 이미지 분석하기
            </button>
          </div>
        )}
      </div>
      <div className="warning-section">
        <h3><FiAlertTriangle
          size={20}
          style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          주의사항</h3>
        <ul>
          <li>선명하고 글자가 잘 보이는 이미지를 업로드해주세요.</li>
          <li>분석 결과는 참고용이며, 100% 정확하지 않을 수 있습니다.</li>
          <li>개인정보가 포함된 이미지는 업로드하지 마세요.</li>
        </ul>
      </div>
      
    </div>
  );
}