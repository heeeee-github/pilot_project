document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('#generateBtn');
    const saveBtn = document.querySelector('#saveBtn');
    const resetBtn = document.querySelector('#resetBtn');
    const gridContainer = document.querySelector('#gridContainer');
    const widthInput = document.querySelector('#widthInput');
    const heightInput = document.querySelector('#heightInput');
    const grayscaleInput = document.querySelector('#grayscaleInput');
    const blurInput = document.querySelector('#blurInput');

    generateBtn.addEventListener('click', () => {
        const width = widthInput.value || 200;
        const height = heightInput.value || 200;
        const grayscale = grayscaleInput.checked ? 'grayscale' : '';
        const blur = blurInput.value ? `blur=${blurInput.value}` : '';

        // 고유한 ID를 추가하여 매번 다른 이미지가 생성되도록 함
        const uniqueId = Math.floor(Math.random() * 1000);
        let imageUrl = `https://picsum.photos/seed/${uniqueId}/${width}/${height}`;
        if (grayscale || blur) {
            imageUrl += `?${grayscale ? 'grayscale' : ''}${grayscale && blur ? '&' : ''}${blur}`;
        }

        // 새로운 이미지 요소 생성
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = '랜덤 이미지';
        img.classList.add('random-image'); // 스타일을 위한 클래스 추가
        imgContainer.appendChild(img);

        // 이미지 클릭 이벤트 추가 (선택/해제 기능)
        img.addEventListener('click', () => {
            imgContainer.classList.toggle('selected');
        });

        // gridContainer에 이미지 추가
        gridContainer.appendChild(imgContainer);
    });

    saveBtn.addEventListener('click', () => {
        const selectedImages = document.querySelectorAll('.img-container.selected img');
        if (selectedImages.length === 0) {
            alert('저장할 이미지를 선택하세요.');
            return;
        }

        selectedImages.forEach(img => {
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'random_image.jpg';
            link.click();
        });
    });

    resetBtn.addEventListener('click', () => {
        gridContainer.innerHTML = '';
    });
});
