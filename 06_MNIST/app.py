from flask import Flask, render_template, request, jsonify
import numpy as np
import joblib
from sklearn.datasets import fetch_openml

app = Flask(__name__)

# 모델과 스케일러 로드
model = joblib.load('sklearn_logistic_model.joblib')
scaler = joblib.load('sklearn_scaler.joblib')

# MNIST 테스트 데이터 로드
print("MNIST 데이터 로드 중...")
mnist = fetch_openml('mnist_784', version=1, as_frame=False, parser='auto')
X, y = mnist.data / 255.0, mnist.target.astype(int)

# 0과 1만 선택
X_binary = X[(y == 0) | (y == 1)]
y_binary = y[(y == 0) | (y == 1)]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    index = int(request.json['index'])

    if index < 0 or index >= len(X_binary):
        return jsonify({'error': 'Invalid index'}), 400

    # 선택된 이미지에 대한 예측 수행
    image = X_binary[index:index+1]
    image_scaled = scaler.transform(image)
    prediction = model.predict(image_scaled)
    probability = model.predict_proba(image_scaled)[0]

    predicted_digit = int(prediction[0])
    confidence = float(probability[predicted_digit])

    # 실제 레이블
    actual_digit = int(y_binary[index])

    # 이미지 데이터를 리스트로 변환 (JSON 직렬화를 위해)
    image_data = image.reshape(28, 28).tolist()

    return jsonify({
        'predicted_digit': predicted_digit,
        'confidence': confidence,
        'actual_digit': actual_digit,
        'image_data': image_data
    })

if __name__ == '__main__':
    app.run(debug=True)