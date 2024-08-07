
// 재료 수에 따른 냉장고 크기 조절 및 아이콘 생성
function updateFridgeIcon() {
    const ingredientCount = document.querySelectorAll('.ingredient-item').length;

    // 기존 아이콘 제거
    document.querySelectorAll('.ingredient-icon').forEach(icon => icon.remove());

    // 새 아이콘 생성
    for (let i = 0; i < ingredientCount; i++) {
        createIngredientIcon();
    }
}

// 재료 추가/제거 시 냉장고 업데이트
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            updateFridgeIcon();
        }
    });
});

const ingredientLists = document.querySelectorAll('.ingredient-list');
ingredientLists.forEach(list => {
    observer.observe(list, { childList: true });
});

// 초기 냉장고 크기 설정
updateFridgeIcon();

// 탭을 전환하는 함수
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// 초기 탭 설정
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ingredients').style.display = 'block';
    document.getElementsByClassName('tab-button')[0].className += ' active';
});

// 로컬 스토리지에 데이터를 저장하는 함수
function saveToLocalStorage(category, items) {
    localStorage.setItem(category, JSON.stringify(items));
}

// 로컬 스토리지에서 데이터를 불러오는 함수
function loadFromLocalStorage(category) {
    const data = localStorage.getItem(category);
    return data ? JSON.parse(data) : [];
}

// 입력된 값을 추가하는 함수
function addIngredient(category) {
    const inputId = `${category}-ingredient-input`;
    const listId = `${category}-ingredients`;
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (input.value.trim() === '') {
        alert('입력값이 비어 있습니다.');
        return;
    }

    // 입력값 중복 체크
    const currentIngredients = getIngredients(listId);
    if (currentIngredients.includes(input.value.trim())) {
        alert('이미 있는 재료입니다.');
        input.value = '';
        return;
    }

    const newIngredient = document.createElement('span');
    newIngredient.className = 'ingredient-item';

    const textNode = document.createTextNode(input.value);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.onclick = function() {
        list.removeChild(newIngredient);
        updateLocalStorage(category);
        if (category === 'main') {
            checkMainIngredient(input.value);
        }
    };

    newIngredient.appendChild(textNode);
    newIngredient.appendChild(deleteButton);
    list.appendChild(newIngredient);

    if (category === 'main') {
        checkMainIngredient(input.value);
    }

    input.value = '';
    updateLocalStorage(category);
}

// 로컬 스토리지를 업데이트하는 함수
function updateLocalStorage(category) {
    const listId = `${category}-ingredients`;
    const list = document.getElementById(listId);
    const items = [];
    list.querySelectorAll('.ingredient-item').forEach(item => {
        items.push(item.firstChild.textContent);
    });
    saveToLocalStorage(category, items);
}

// 저장된 데이터를 로드하여 표시하는 함수
function loadIngredients(category) {
    const listId = `${category}-ingredients`;
    const list = document.getElementById(listId);
    const items = loadFromLocalStorage(category);

    items.forEach(itemText => {
        const newIngredient = document.createElement('span');
        newIngredient.className = 'ingredient-item';

        const textNode = document.createTextNode(itemText);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.onclick = function() {
            list.removeChild(newIngredient);
            updateLocalStorage(category);
            if (category === 'main') {
                checkMainIngredient(itemText);
            }
        };

        newIngredient.appendChild(textNode);
        newIngredient.appendChild(deleteButton);
        list.appendChild(newIngredient);
    });
}

// 주재료 상태를 확인하는 함수
function checkMainIngredient(ingredient) {
    const categories = ['basic', 'vegi', 'fridge', 'freezer'];
    let found = false;
    let foundCategory = '';

    categories.forEach(category => {
        const items = loadFromLocalStorage(category);
        if (items.includes(ingredient)) {
            found = true;
            foundCategory = getCategoryName(category);
        }
    });

    const statusDiv = document.getElementById('main-ingredient-status');
    if (found) {
        statusDiv.innerHTML = `<p>${ingredient}은(는) ${foundCategory}에 있습니다. 구매하지 않아도 됩니다.</p>`;
    } else {
        statusDiv.innerHTML = `<p>${ingredient}은(는) 구매가 필요합니다.</p>`;
    }
}

// 특정 카테고리의 재료 목록을 가져오는 함수
function getIngredients(listId) {
    return Array.from(document.getElementById(listId).children)
        .map(child => child.firstChild.textContent.trim());
}

// 카테고리 이름을 가져오는 함수
function getCategoryName(category) {
    switch (category) {
        case 'basic': return '양념';
        case 'vegi': return '야채';
        case 'fridge': return '냉장고';
        case 'freezer': return '냉동실';
        case 'main': return '주재료';
        default: return '알 수 없음';
    }
}

// 페이지가 로드된 후 각 입력 필드에 이벤트 리스너를 설정하고 데이터를 로드합니다.
document.addEventListener('DOMContentLoaded', function() {
    ['basic', 'vegi', 'fridge', 'freezer', 'main'].forEach(category => {
        setupEnterKeyListener(`${category}-ingredient-input`, category);
        loadIngredients(category);
    });
});

// 각 입력 필드에 대한 이벤트 리스너를 설정하는 함수
function setupEnterKeyListener(inputId, category) {
    const input = document.getElementById(inputId);

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // 기본 엔터키 동작 방지 (예: 폼 제출)
            addIngredient(category);
        }
    });
}

// OpenAI API URL
let openAIUrl = `https://open-api.jejucodingcamp.workers.dev/`;

// 레시피를 생성하는 함수
function generateRecipe() {
    const ingredients = {
        basic: getIngredients('basic-ingredients'),
        vegi: getIngredients('vegi-ingredients'),
        fridge: getIngredients('fridge-ingredients'),
        freezer: getIngredients('freezer-ingredients'),
        main: getIngredients('main-ingredients')
    };


    // "답변 중" 메시지 표시
    const recipeResult = document.getElementById('recipe-result');
    recipeResult.classList.add('loading');
    recipeResult.innerHTML = '';

    // OpenAI API로 레시피 데이터를 전송
    sendRecipeToOpenAI(ingredients);
}

// OpenAI API로 레시피 데이터를 전송하는 함수
const sendRecipeToOpenAI = async (ingredients) => {
    const recipeData = [
        {
            role: "system",
            content: "전 세계의 요리를 맛보고 맛있게 구현할 수 있는 요리전문가이다. 요청하는 메인 메뉴에 맞추어 레시피를 3가지 추천한다. 실험적인 레시피는 알려주지 않고, 검증된 레시피만 알려준다. 주재료 등 재료명을 정확하게 작성하지 않으면 알려주지 않는다.",
        },
        {
            role: "user",
            content: `주재료: ${ingredients.main.join(', ')}, 야채: ${ingredients.vegi.join(', ')}, 기본 재료: ${ingredients.basic.join(', ')}, 냉장고 재료: ${ingredients.fridge.join(', ')}, 냉동실 재료: ${ingredients.freezer.join(', ')}. 없는 재료를 추가하여 요리를 해야하는 경우 "구매가 필요한 재료"를 명시해줘. 답변은  
<h3>추천 레시피 [번호] : [음식 레시피 명]</h3>
<h4>재료</h4>
<p>보유 중인 재료 : </p>
<p>구매가 필요한 재료 : </p>
<p>추가하면 풍미가 더해지는 재료 : </p>
<p>양념 재료 : </p>
<h4>제조</h4>
<p>양념 제조: </p>
<p>조리 순서 : </p>
로 알려줘.
각 추천 레시피 끝에 구분선을 추가해줘.` ,
        },
    ];

    try {
        const response = await fetch(openAIUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeData),
            redirect: "follow",
        });
        const result = await response.json();
        displayOpenAIResponse(result.choices[0].message.content);
    } catch (err) {
        console.log(err);
    }
}

// 로딩 표시 요소와 아이콘을 가져오기
const loadingIndicator = document.getElementById('loading-indicator');
const loadingIcon = document.getElementById('loading-icon');

// OpenAI API의 응답을 화면에 표시하는 함수
function displayOpenAIResponse(responseContent) {
    const recipeResult = document.getElementById('recipe-result');
    recipeResult.classList.remove('loading'); 
    let htmlContent = '';
    // // 레시피 결과를 업데이트
    recipeResult.innerHTML = `${responseContent}`;
}



// 냉장고 문 열기/닫기 기능
const fridgeDoor = document.querySelector('.fridge-door');
let isFridgeOpen = false;

fridgeDoor.addEventListener('click', () => {
    isFridgeOpen = !isFridgeOpen;
    fridgeDoor.style.transform = isFridgeOpen ? 'translateX(-95%)' : 'translateX(0)';
});

// 재료 아이콘 생성 및 애니메이션
const ingredientIcons = [
    '🥕', '🍎', '🥩', '🍗', '🥛', '🧀', '🥚', '🥬', // 기존 아이콘
    '🍅', '🍊', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', // 과일
    '🌽', '🥦', '🍆', '🍠', '🥔', '🥒', '🍄', '🌶️', // 채소
    '🧄', '🧅', '🥥', '🍑', '🍋', '🍏', '🥭', '🍉', // 과일 및 기타
    '🍞', '🥖', '🥯', '🥨', '🧇', '🥞', '🧈', '🍳', // 빵 및 아침 식사
    '🍔', '🌭', '🌮', '🌯', '🍕', '🍟', '🥪', '🥗', // 패스트 푸드 및 샐러드
    '🍜', '🍲', '🍣', '🍤', '🍱', '🍛', '🍙', '🍚', // 아시아 요리
    '🍢', '🍡', '🥟', '🥠', '🍥', '🍧', '🍨', '🍦', // 디저트 및 기타
    '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', // 디저트 및 과자
    '🍮', '🍯', '🍼', '🥤', '🍵', '☕', '🍶', '🍾',  // 음료
    '❄️', '🧊', '🥶', // 냉동실
    '🧂', '🌶️', '🥫', '🧄', '🧅', // 양념류
];

const fridgeContainer = document.querySelector('body');

function createIngredientIcon() {
    const icon = document.createElement('div');
    icon.className = 'ingredient-icon';
    icon.textContent = ingredientIcons[Math.floor(Math.random() * ingredientIcons.length)];
    icon.style.left = `${Math.random() * 100}%`;
    icon.style.top = `${Math.random() * 100}%`;
    fridgeContainer.appendChild(icon);

    setTimeout(() => {
        icon.style.opacity = `${2 + Math.random() * 5}`;
        icon.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
    }, 100);

    return icon;
}
