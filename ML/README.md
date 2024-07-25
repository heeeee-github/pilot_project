
# Fashion MNIST 생성



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
    cd FASHION_MNIST
    ```

### 01.03. 가상환경 생성 및 활성화

생성할 가상환경 이름을 `fashion_mnist_env`로 명명
 * (가상환경 생성) 프로젝트별로 독립된 Python환경을 생성

    ```
    python -m venv fashion_mnist_env
    ```

 * (가상환경 활성화) 생성한 가상환경을 실행
 * 
    ```
    # 맥/리눅스
    source mnist_env/bin/activate
    # 윈도우
    .\fashion_mnist_env\Scripts\activate.bat
    ```

활성화가 되면, 터미널 프롬프트 앞에 `(fashion_mnist_env)`가 표시

 * (가상환경 비활성화) 실행한 가상환경을 끔
 * 
    ```
    deactivate
    ```

### 01.04. 필요한 라이브러리 설치

가상환경이 활성화된 상태에서 필요한 라이브러리 설치

   ```
   #pip install (라이브러리 이름들)
   pip install pandas numpy joblib flask matplotlib tensorflow
   ```


## 02. 모델 훈련(train_model.py)



### 02.01. 프로젝트 파일 생성 및 분석코드 입력

프로젝트 폴더(`FASHION_MNIST`)에 프로젝트 파일(`train_model.py`) 생성

분석 코드 입력

```python

# train_model.py

import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt

# Fashion MNIST 데이터셋 로드 및 전처리
fashion_mnist = keras.datasets.fashion_mnist
(train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data()

train_images = train_images.reshape((train_images.shape[0], 28, 28, 1)).astype('float32') / 255
test_images = test_images.reshape((test_images.shape[0], 28, 28, 1)).astype('float32') / 255

# Sequential 모델 생성
model = keras.Sequential([
    keras.layers.InputLayer(input_shape=(28, 28, 1)),
    keras.layers.Conv2D(32, (3, 3), activation='relu'),
    keras.layers.MaxPooling2D((2, 2)),
    keras.layers.Conv2D(64, (3, 3), activation='relu'),
    keras.layers.MaxPooling2D((2, 2)),
    keras.layers.Conv2D(64, (3, 3), activation='relu'),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

# 모델 컴파일
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# 모델 훈련
history = model.fit(train_images, train_labels, epochs=5, validation_split=0.1)

# 모델 평가
test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2)
print(f'\\nTest accuracy: {test_acc}')

# 모델 저장
model.save('fashion_mnist_model.h5')
print("모델이 'fashion_mnist_model.h5'로 저장되었습니다.")

# 저장된 모델 로드
model = keras.models.load_model('fashion_mnist_model.h5')
model.summary()

```


### 02.02. 모델 훈련(파일 실행)

모델 훈련을 위하여 터미널에서 파일 실행 명령어 입력
PC 또는 노트북 사양에 따라 소요되는 시간은 상이
완료시 프로젝트 폴더에 모델이 저장됨을 확인인

 * 모델 : 'fashion_mnist_model.h5'

    ```
    python train_model.py
    ```


## 03. 웹 어플리케이션 생성(app.py)

### 03.01. 프로젝트 파일 생성 및 분석코드 입력

프로젝트 폴더(`FASHION_MNIST`)에 프로젝트 파일(`app.py`) 생성

분석 코드 입력

```python


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

```


## 04. HTML 템플릿 생성(index.html)


### 04.01. 템플릿 폴더(`templates`) 생성 및 html파일(`index.html`) 생성

프로젝트 폴더(`FASHION_MNIST`) 안에 템플릿 폴더(`templates`) 생성
    ```
    # 폴더 생성시 현재 위치(`FASHION_MNIST`) 확인
    mkdir templates
    ```

템플릿 폴더(`templates`) 안에 html 파일(`index.html`) 생성


### 04.02. 템플릿코드 입력

```html

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
위의 내용 중에는 가상환경(`fashion_mnist_env`)을 올리지 않음

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

- `train_model.py`는 Fashion_MMINST 데이터셋에서 0과 1을 분류하는 로지스틱 회귀 모델을 훈련
- `app.py`는 Flask를 사용하여 웹 서버를 생성하고, 훈련된 모델을 사용하여 예측을 수행
- `index.html`은 사용자 인터페이스를 제공하며, JavaScript를 사용하여 서버와 통신

