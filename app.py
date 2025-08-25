# 아래에서 작성할 Flask 서버 코드
import os
import io
import base64
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS  # CORS 처리를 위한 라이브러리
from PIL import Image
from ultralytics import YOLO
import easyocr

# --------------------------------------------------------------
# 1. 설정 및 모델 로딩
# --------------------------------------------------------------
app = Flask(__name__) 
# 리액트 앱(다른 주소)에서 오는 요청을 허용하기 위해 CORS 설정
CORS(app)

# YOLO 모델 로드 (모델 경로를 확인하세요)
try:
    model = YOLO('my_model.pt')
except Exception as e:
    print(f"모델 로딩 실패: {e}")
    model = None

# EasyOCR 리더 로드 (한국어, 영어)
try:
    ocr_reader = easyocr.Reader(['ko', 'en'])
except Exception as e:
    print(f"OCR 리더 로딩 실패: {e}")
    ocr_reader = None

# --------------------------------------------------------------
# 2. 헬퍼 함수
# --------------------------------------------------------------
def pil_to_base64(pil_img):
    """PIL 이미지를 Base64 문자열로 인코딩하는 함수"""
    buffered = io.BytesIO()
    pil_img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode()

# --------------------------------------------------------------
# 3. API 엔드포인트 정의
# --------------------------------------------------------------
# 리액트에서 호출할 주소: /analyze
@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "이미지 파일이 없습니다."}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "파일이 선택되지 않았습니다."}), 400

    if file and model and ocr_reader:
        try:
            pil_img = Image.open(file.stream).convert("RGB")
            results = model.track(pil_img, persist=True, conf=0.1)
            result_plot_img = Image.fromarray(results[0].plot()[..., ::-1])
            main_image_b64 = pil_to_base64(result_plot_img)
            detections = []

            if len(results[0].boxes) > 0:
                for box in results[0].boxes:
                    coords = box.xyxy[0].cpu().numpy().astype(int)
                    obj_id = int(box.id[0].cpu()) if box.id is not None else 0
                    label = model.names[int(box.cls[0].cpu())]
                    confidence = float(box.conf[0].cpu().item())

                    cropped_img = pil_img.crop(coords)
                    cropped_np = np.array(cropped_img)

                    # --- 5단계 전처리 파이프라인 ---
                    # 1. 노이즈 제거
                    denoised_img = cv2.fastNlMeansDenoisingColored(cropped_np, None, 10, 10, 7, 21)

                    # 2. 이미지 확대
                    h, w, _ = denoised_img.shape
                    upscaled_img = cv2.resize(denoised_img, (w * 2, h * 2), interpolation=cv2.INTER_CUBIC)

                    # 3. 선명화
                    sharpen_kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
                    sharpened_img = cv2.filter2D(upscaled_img, -1, sharpen_kernel)

                    # 4. 흑백 변환
                    gray_img = cv2.cvtColor(sharpened_img, cv2.COLOR_BGR2GRAY)

                    # 5. Otsu를 이용한 이진화
                    ret, binary_img = cv2.threshold(gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

                    # 최종 처리된 이미지로 OCR 수행
                    ocr_results = ocr_reader.readtext(binary_img)
                    ocr_text = " ".join([res[1] for res in ocr_results]) if ocr_results else "N/A"

                    # 웹 표에 표시할 이미지도 최종 처리된 이미지로 변환
                    processed_pil_img = Image.fromarray(binary_img)

                    detections.append({
                        'image': pil_to_base64(processed_pil_img),
                        'id': obj_id,
                        'text': ocr_text,
                        'label': label,
                        'confidence': confidence,
                        'coords': str(coords.tolist())
                    })
            
            return jsonify({
                "resultImage": main_image_b64,
                "detections": detections
            })

        except Exception as e:
            print(f"분석 중 오류 발생: {e}")
            return jsonify({"error": f"서버 내부 오류: {e}"}), 500

    return jsonify({"error": "서버 모델이 준비되지 않았습니다."}), 503

# --------------------------------------------------------------
# 4. 서버 실행
# --------------------------------------------------------------
if __name__ == '__main__':
    # 외부에서 접속 가능하도록 0.0.0.0으로 호스트 설정
    app.run(host='0.0.0.0', port=5000, debug=True)