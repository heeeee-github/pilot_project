# pip install pandas numpy joblib flask matplotlib tensorflow

# app.py
from flask import Flask, render_template, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.datasets import fashion_mnist

app = Flask(__name__)

# 모델 로드
model = load_model('fashion_mnist_model.h5')

# Passion MNIST 테스트 데이터 로드
_, (X_test, y_test) = fashion_mnist.load_data()
X_test = X_test.reshape(X_test.shape[0], 28, 28, 1).astype('float32') / 255

# 레이블 이름 정의
LABEL_NAMES = [
    "T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
    "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    index = int(request.json['index'])
    
    if index < 0 or index >= len(X_test):
        return jsonify({'error': 'Invalid index'}), 400
    
    image = X_test[index:index+1]
    prediction = model.predict(image)
    predicted_label = np.argmax(prediction)
    predicted_label_name = LABEL_NAMES[predicted_label]
    confidence = float(prediction[0][predicted_label])
    
    actual_label = int(y_test[index])
    actual_label_name = LABEL_NAMES[actual_label]
    image_data = image.reshape(28, 28).tolist()
    
    return jsonify({
        'predicted_label': predicted_label_name,
        'confidence': confidence,
        'actual_label': actual_label_name,
        'image_data': image_data
    })

if __name__ == '__main__':
    app.run(debug=True)