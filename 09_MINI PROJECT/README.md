# 06_Plz_Take_care_of_My_Refrigerator

## 프로젝트 개요
- **(목표)** 주재료와 보유 중인 재료를 활용할 수 있는 음식을 추천하고 조리할 수 있는 레시피를 알려주는 서비스 개발 및 배포
    - 생성AI API를 활용한 레시피 제공 서비스 개발

- **(기간)** 2024.07.29.(월) ~ 2024.08.02.(금)

- **(역할)** 기획/디자인/개발/배포(1인 프로젝트)



## WBS(Work Breakdown Structure)
### 프로젝트 전체
![WBS](image-2.png)
[Link URL](https://github.com/users/heeeee-github/projects/6)

### 테스트 목록
![Test List](image-1.png)



## Wire Frame
![Wire Frame](image.png)

[Link URL](https://www.figma.com/design/Cdv0GO8PKspUcRK69ptrdf/%EB%83%89%EC%9E%A5%EA%B3%A0%EB%A5%BC-%EB%B6%80%ED%83%81%ED%95%B4?node-id=0-1&t=60SudV9UQd35Kd7l-1)



## 사용 기술
### HTML
- 메인 화면
- 사용자가 보유하고 있는 재료 입력란과 확인 필드
    - 카테고리 : 부재료 / 야채 및 과일 / 냉장 / 냉동 
- 요리하려고 하는 주재료의 입력란과 확인 필드
- 레시피 제공을 위한 필드

### CSS
- 레이아웃 : 와이어프레임기반 웹페이지 디자인
- 반응형 디자인 : 화면 크기에 맞는 호환성을 위함
- Loding Indicator : 생성AI 연결 및 답변이 동작 중인지 확인하기 위함

### Java Script
#### 애니메이션
- 냉장고 문 열림/닫힘 효과를 위한 애니메이션
- 냉장고 안 재료 수에 따른 배경 아이콘 생성

#### 화면 전환
- 탭(재료 보유/레시피) 전환 함수

#### 사용자 데이터 입/출력
- 사용자 입력 데이터 로컬 스토리지에 저장/불러오기/업데이트
- 사용자 입력값 중복 체크
- 주재료 상태 확인 및 상태별 결과(구매 필요 여부) 회신

#### 생성AI
- 로컬 스토리지에 저장된 데이터 로드 및 생성AI 호출
- 생성AI 응답 시간 동안 "답변 중"으로 메세지(로딩 표시 요소/아이콘) 표시
- 생성AI 응답 가져오기



## 배포 서비스
[🥩 냉장고를 부탁해 🐟](https://heeeee-github.github.io/06_Plz_Take_care_of_My_Refrigerator/)



## 시연 영상
- (시연 1) 재료 입력
![01_재료입력](https://github.com/user-attachments/assets/b8c4b919-c2b1-4267-830e-5b9f764e5d04)
  

- (시연 2) 재료중복 확인
![02_재료중복 확인](https://github.com/user-attachments/assets/62c51542-76f2-46db-8e80-fb84081d09a8)


- (시연 3) 주재료 구매 필요 여부
![03_주재료 확인](https://github.com/user-attachments/assets/58156e1c-e9b8-4df2-962b-c612a97891c0)


- (시연 4) 답변 중 애니메이션
![04_답변 중 애니메이션](https://github.com/user-attachments/assets/ff8062f3-3aed-4735-a084-7170f3091bc6)


- (시연 5) 레시피 생성 결과
![05_레시피 생성 결과](https://github.com/user-attachments/assets/62856224-13f1-4402-9f3c-1a776b27e2a5)


- (시연6) 입력데이터 유지 여부 확인
![06_데이터_유지](https://github.com/user-attachments/assets/ed9e407f-ffd7-4be3-bd77-40e742fcbaa2)



## 개선사항
- 사용자별 회원가입/로그인 및 데이터 수집(DB연동)
- 레시피DB를 활용하여 유사한 레시피가 있는 경우 해당 레시피를 함께 공유하여 GPT hallucination 해결
- Mall 등과 연동하여 상품 구매 내역 목올을 활용하여 "보유 재료 DB" 자동 업데이트
- 앱배포(IOS/Android)
