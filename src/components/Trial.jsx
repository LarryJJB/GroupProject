import React, { useState } from "react";
import "./Trial.css"; 

export default function Trial({ navigate }) {
  // --- 상태 관리 ---
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState("");
  const [detections, setDetections] = useState([]);

  // --- 이벤트 핸들러 ---

  // 이미지 업로드 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // 이전 결과 초기화
      setResultImage("");
      setDetections([]);
    }
  };

  // AI 분석 요청 처리
  const handleAnalysis = async () => {
    if (!imageFile) {
      alert("먼저 이미지를 업로드해주세요.");
      return;
    }

    setIsLoading(true);
    setResultImage("");
    setDetections([]);

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

    } catch (error) {
      console.error("분석 중 오류:", error);
      alert(`분석 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 렌더링 ---
  return (
    <div className="trial-page">
      <h1 className="page-title">YOLO + OCR 이미지 분석</h1>

      <div className="main-content">
        {/* 좌측 패널: 입력 */}
        <div className="panel">
          <div>
            <h2>1. 분석할 이미지 업로드</h2>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <label htmlFor="imageUpload" className="btn btn-secondary">
              이미지 선택
            </label>
          </div>

          <div>
            <h2>2. AI 분석 시작</h2>
            <button
              onClick={handleAnalysis}
              disabled={!imageFile || isLoading}
              className="btn btn-primary"
            >
              {isLoading ? "분석 중..." : "분석 시작하기"}
            </button>
          </div>
        </div>

        {/* 우측 패널: 출력 */}
        <div className="panel output-panel">
          {isLoading ? (
            <p className="loading-text">AI가 이미지를 분석하고 있습니다...</p>
          ) : resultImage ? (
            <div>
              <h2>분석 결과 이미지</h2>
              <img 
                src={`data:image/jpeg;base64,${resultImage}`} 
                alt="분석된 이미지" 
                className="image-preview analyzed-image"
              />
              
              <h2 className="details-header">탐지된 객체 상세 정보</h2>
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
          ) : imagePreview ? (
            <img src={imagePreview} alt="업로드된 이미지" className="image-preview" />
          ) : (
            <p className="output-placeholder">이미지를 업로드하고 분석을 시작하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}