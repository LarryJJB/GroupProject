import os
import io
import base64
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from ultralytics import YOLO
import easyocr
# --- 👇 새로 추가된 라이브러리 ---
import google.generativeai as genai
from dotenv import load_dotenv

# --------------------------------------------------------------
# 1. 설정 및 모델 로딩
# --------------------------------------------------------------
load_dotenv() # .env 파일에서 환경 변수 로드

app = Flask(__name__)
CORS(app)

# YOLO 모델 로드
try:
    model = YOLO('my_model.pt')
except Exception as e:
    print(f"YOLO 모델 로딩 실패: {e}")
    model = None

# EasyOCR 리더 로드
try:
    ocr_reader = easyocr.Reader(['ko', 'en'])
except Exception as e:
    print(f"OCR 리더 로딩 실패: {e}")
    ocr_reader = None

# --- 👇 Gemini API 설정 ---
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-pro-latest')
except Exception as e:
    print(f"Gemini 모델 설정 실패: {e}")
    gemini_model = None

# --------------------------------------------------------------
# 2. 헬퍼 함수
# --------------------------------------------------------------
def pil_to_base64(pil_img):
    buffered = io.BytesIO()
    pil_img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode()

# --- 👇 이미지를 받아 분석하는 Gemini 함수 (수정됨) ---
def get_gemini_summary_from_image(image, prompt):
    if not gemini_model or not image:
        return "이미지를 분석할 수 없습니다."
    
    try:
        response = gemini_model.generate_content([prompt, image])
        # --- 👇 [수정] 결과 텍스트에서 ** 제거 ---
        clean_text = response.text.strip().replace('**', '')
        return clean_text
    except Exception as e:
        print(f"Gemini API 호출 오류: {e}")
        return "이미지를 분석하는 중 오류가 발생했습니다."

# --------------------------------------------------------------
# 3. API 엔드포인트 정의
# --------------------------------------------------------------
@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "이미지 파일이 없습니다."}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "파일이 선택되지 않았습니다."}), 400

    if file and model and ocr_reader and gemini_model:
        try:
            pil_img = Image.open(file.stream).convert("RGB")
            
            # --- 👇 1단계: YOLO 및 OCR 처리 (기존 코드 복원) ---
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
                    
                    # 전처리 파이프라인
                    denoised_img = cv2.fastNlMeansDenoisingColored(cropped_np, None, 10, 10, 7, 21)
                    h, w, _ = denoised_img.shape
                    upscaled_img = cv2.resize(denoised_img, (w * 2, h * 2), interpolation=cv2.INTER_CUBIC)
                    sharpen_kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
                    sharpened_img = cv2.filter2D(upscaled_img, -1, sharpen_kernel)
                    gray_img = cv2.cvtColor(sharpened_img, cv2.COLOR_BGR2GRAY)
                    _, binary_img = cv2.threshold(gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                    
                    ocr_results = ocr_reader.readtext(binary_img)
                    ocr_text = " ".join([res[1] for res in ocr_results]) if ocr_results else "N/A"
                    processed_pil_img = Image.fromarray(binary_img)

                    detections.append({
                        'image': pil_to_base64(processed_pil_img),
                        'id': obj_id,
                        'text': ocr_text,
                        'label': label,
                        'confidence': confidence,
                        'coords': str(coords.tolist())
                    })

            # --- 👇 2단계: Gemini 이미지 분석 처리 ---
            image_analysis_prompt = """
            당신은 의약품 라벨 이미지를 분석하는 뛰어난 약사입니다.
            제공된 의약품 라벨 이미지를 보고, 아래 지침에 따라 환자가 이해하기 쉽게 설명해주세요.

            ## 분석 및 설명 지침 ##
            1. 제품명 식별: 이미지에서 가장 눈에 띄는 제품명을 정확히 찾아주세요.
            2. 주요 효능 및 효과: 제품명과 이미지 속 정보를 바탕으로 이 약이 어떤 증상에 사용되는지 설명해주세요.
            3. 핵심 주의사항: 이미지에서 '주의사항' 또는 이와 유사한 섹션을 찾아 가장 중요하다고 생각되는 내용을 강조해서 설명해주세요. 특히 하루 권장 복용량을 반드시 포함해주세요. 
            4. 사용기한 확인: 이미지에서 '사용기한' 또는 'EXP'와 같은 정보를 찾아 약을 사용하기 전 날짜를 확인해야 한다고 안내해주세요.
            5. 종합 요약: 위의 내용을 종합하여 한국어로 3~4 문장 이내의 간결한 요약문으로 작성해주세요.

            설명:
            """
            summary = get_gemini_summary_from_image(pil_img, image_analysis_prompt)
            
            # --- 👇 3단계: 두 가지 결과 모두 반환 ---
            return jsonify({
                "resultImage": main_image_b64, # YOLO 바운딩 박스가 포함된 이미지
                "detections": detections,      # OCR 결과가 담긴 표 데이터
                "summary": summary             # Gemini가 이미지를 직접 분석한 요약
            })

        except Exception as e:
            print(f"분석 중 오류 발생: {e}")
            return jsonify({"error": f"서버 내부 오류: {e}"}), 500

    return jsonify({"error": "서버 모델이 준비되지 않았습니다."}), 503

# --------------------------------------------------------------
# 4. 서버 실행
# --------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)