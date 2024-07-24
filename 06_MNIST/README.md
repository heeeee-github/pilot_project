
# MNIST 0/1 분류기 생성



## 01. 환경설정


### 01.01.설치

* Python : [공식 웹사이트](https://www.python.org)
* VS code : [공식 웹사이트](https://code.visualstudio.com)

### 01.02. 프로젝트 폴더 및 파일 생성

터미널(`Mac/Linux`) 또는 명령 프롬프트(`Window`) 열기

    * 명령 프롬프트는 cmd창
    * powershell은 이용하지 않음.


프로젝트 폴더를 만들기
    ```
    mkdir pilot_project
    ```


프로젝트 폴더로 이동
    ```
    cd MNIST
    ```

### 01.03. 가상환경 생성 및 활성화

생성할 가상환경 이름을 `mnist_env`로 명명
 * (가상환경 생성) 프로젝트별로 독립된 Python환경을 생성

    ```
    python -m venv mnist_env
    ```

 * (가상환경 활성화) 생성한 가상환경을 실행
 * 
    ```
    # 맥/리눅스
    source mnist_env/bin/activate
    # 윈도우
    .\mnist_env\Scripts\activate.bat
    ```

활성화가 되면, 터미널 프롬프트 앞에 `(mnist_env)`가 표시

 * (가상환경 비활성화) 실행한 가상환경을 끔
 * 
    ```
    deactivate
    ```

### 01.04. 필요한 라이브러리 설치

가상환경이 활성화된 상태에서 필요한 라이브러리 설치

   ```
   #pip install (라이브러리 이름들)
   pip install pandas numpy scikit-learn joblib flask
   ```


## 02. 모델 훈련(train_model.py)



### 02.01. 프로젝트 파일 생성 및 분석코드 입력

프로젝트 폴더(`MNIST`)에 프로젝트 파일(`train_model.py`) 생성

분석 코드 입력

```python

import numpy as np
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import joblib

# MNIST 데이터 로드
print("MNIST 데이터 로드 중...")
mnist = fetch_openml('mnist_784', version=1, as_frame=False, parser='auto')
X, y = mnist.data / 255.0, mnist.target.astype(int)

# 0과 1만 선택 (이진 분류)
X_binary = X[(y == 0) | (y == 1)]
y_binary = y[(y == 0) | (y == 1)]

# 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X_binary, y_binary, test_size=0.2, random_state=42)

# 데이터 스케일링
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 로지스틱 회귀 모델 생성 및 훈련
print("모델 훈련 중...")
model = LogisticRegression(random_state=42, max_iter=1000)
model.fit(X_train, y_train)

# 모델 평가
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"모델 정확도: {accuracy:.4f}")

# 모델과 스케일러 저장
joblib.dump(model, 'sklearn_logistic_model.joblib')
joblib.dump(scaler, 'sklearn_scaler.joblib')
print("모델과 스케일러가 저장되었습니다.")

```


### 02.02. 모델 훈련(파일 실행)

모델 훈련을 위하여 터미널에서 파일 실행 명령어 입력
PC 또는 노트북 사양에 따라 소요되는 시간은 상이
완료시 프로젝트 폴더에 모델과 스케일러가 파일로 저장됨을 확인인

 * 모델 : 'sklearn_logistic_model.joblib'
 * 스케일러 : 'sklearn_scaler.joblib'

    ```
    python train_model.py
    ```


## 03. 웹 어플리케이션 생성(app.py)

### 03.01. 프로젝트 파일 생성 및 분석코드 입력

프로젝트 폴더(`MNIST`)에 프로젝트 파일(`train_model.py`) 생성

분석 코드 입력
```python

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
```


## 04. HTML 템플릿 생성(index.html)


### 04.01. 템플릿 폴더(`templates`) 생성 및 html파일(`index.html`) 생성

프로젝트 폴더(`MNIST`) 안에 템플릿 폴더(`templates`) 생성
    ```
    # 폴더 생성시 현재 위치(`MNIST`) 확인
    mkdir templates
    ```

템플릿 폴더(`templates`) 안에 html 파일(`index.html`) 생성


### 04.02. 템플릿코드 입력

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MNIST 0/1 Classifier</title>
  <style>
      canvas {
          border: 1px solid black;
      }
  </style>
</head>
<body>
  <h1>MNIST 0/1 Classifier</h1>
  <input type="number" id="index-input" min="0" placeholder="Enter index">
  <button onclick="predict()">Predict</button>
  <br><br>
  <canvas id="image-canvas" width="280" height="280"></canvas>
  <p>Predicted digit: <span id="predicted-digit"></span></p>
  <p>Confidence: <span id="confidence"></span></p>
  <p>Actual digit: <span id="actual-digit"></span></p>
  
  <script>
      function predict() {
          const index = document.getElementById('index-input').value;
          fetch('/predict', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ index: index }),
          })
          .then(response => response.json())
          .then(data => {
              document.getElementById('predicted-digit').textContent = data.predicted_digit;
              document.getElementById('confidence').textContent = (data.confidence * 100).toFixed(2) + '%';
              document.getElementById('actual-digit').textContent = data.actual_digit;
              drawImage(data.image_data);
          });
      }

      function drawImage(imageData) {
          const canvas = document.getElementById('image-canvas');
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const scale = canvas.width / 28;
          for (let y = 0; y < 28; y++) {
              for (let x = 0; x < 28; x++) {
                  const value = imageData[y][x] * 255;
                  ctx.fillStyle = `rgb(${value},${value},${value})`;
                  ctx.fillRect(x * scale, y * scale, scale, scale);
              }
          }
      }
  </script>
</body>
</html>

```


## 05. 웹 애플리케이션 실행

### 05.01. Flask 앱 시작

터미널에 아래 명령어를 입력하여 Flask앱을 시작
    ```
    python app.py
    ```

### 05.02. 웹페이지 확인
생성된 웹페이지 경로를 터미널에서 확인 후 접속
 * 경로 : `http://127.0.0.1:5000`

숫자 입력란에 파일번호 0 ~ 60000 중 하나를 입력
"Predict" 버튼을 클릭하여 예측 결과를 확인



## 06. 추가 파일 생성

### 06.01. .gitignore 파일 생성

생성한 파일을 GitHub에 push하려고 하는데, 올리면 안되는 파일을 설정할 때
위의 내용 중에는 가상환경(`mnist_env`)을 올리지 않음

 * 생성 순서
   1. `.gitignore` 파일 생성
   2. GitHub에 올리지 않을 파일 목록 작성
      * 작성 내용 : [ignore.io](https://www.toptal.com/developers/gitignore)
   3. 파일 저장
      * (참고) 파일은 제일 첫번째에 위치해야 함  

### 06.02. requirements.txt 파일 생성
프로젝트에서 사용되는 모든 패키지와 버전을 나열하는 파일

* 방법 1
   pip freeze 명령어 사용
  
    ```
    pip freeze > requirements.txt
    ```

* 방법 2
   1. `requirements.txt` 파일 생성
   2. pip list를 사용하여 명령어를 확인
       ```
       pip list
       ```
   3. 명령어 확인 후 해당 리스트를 복사하여 파일에 붙여넣기 

* 방법 3
   pip list로 목록을 확인하고, pip freeze 명령어 사용
    ```
    pip list --format=freeze > requirements.txt
    ```
    

생성한 requirements를 활용하여 필요한 모든 패키지 설치하기 위해서는 아래의 명령어 입력

   ```
   pip install -r requirements.txt
   ```
    

## 07. 정리

이 프로젝트를 통해 머신러닝 모델 훈련, 데이터 전처리, 웹 애플리케이션 개발의 기본 학습

- `train_model.py`는 MNIST 데이터셋에서 0과 1을 분류하는 로지스틱 회귀 모델을 훈련
- `app.py`는 Flask를 사용하여 웹 서버를 생성하고, 훈련된 모델을 사용하여 예측을 수행
- `index.html`은 사용자 인터페이스를 제공하며, JavaScript를 사용하여 서버와 통신

