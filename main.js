class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .lotto-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: sans-serif;
          background-color: var(--container-bg);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .numbers {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        /* Lotto ball colors */
        .number:nth-child(1) { background-color: #fbc400; }
        .number:nth-child(2) { background-color: #69c8f2; }
        .number:nth-child(3) { background-color: #ff7272; }
        .number:nth-child(4) { background-color: #aaa; }
        .number:nth-child(5) { background-color: #b0d840; }
        .number:nth-child(6) { background-color: #c7c7c7; }

        button {
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background-color: #4CAF50;
          color: white;
          transition: 0.2s;
        }
        button:hover {
          opacity: 0.9;
        }
      </style>
      <div class="lotto-container">
        <div class="numbers">
          ${this.generateNumbers().map(number => `<div class="number">${number}</div>`).join('')}
        </div>
        <button id="generate-btn">Generate New Numbers</button>
      </div>
    `;

    this.shadowRoot.getElementById('generate-btn').addEventListener('click', () => this.render());
  }
}

customElements.define('lotto-generator', LottoGenerator);

class RouletteGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.options = ['점심메뉴', '저녁메뉴', '커피내기', '간식내기', '심부름'];
    this.isSpinning = false;
    this.currentRotation = 0;
  }

  connectedCallback() {
    this.render();
    this.initCanvas();
  }

  initCanvas() {
    const canvas = this.shadowRoot.getElementById('roulette-canvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = this.shadowRoot.getElementById('spin-btn');
    const inputField = this.shadowRoot.getElementById('roulette-input');
    const updateBtn = this.shadowRoot.getElementById('update-options-btn');
    const resultDisplay = this.shadowRoot.getElementById('roulette-result');

    const draw = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      const sliceAngle = (2 * Math.PI) / this.options.length;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.options.forEach((option, i) => {
        const startAngle = i * sliceAngle + this.currentRotation;
        const endAngle = (i + 1) * sliceAngle + this.currentRotation;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fillStyle = `hsl(${(i * 360) / this.options.length}, 70%, 60%)`;
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(option, radius - 10, 5);
        ctx.restore();
      });

      // Draw pointer
      ctx.beginPath();
      ctx.moveTo(centerX + radius + 5, centerY);
      ctx.lineTo(centerX + radius - 15, centerY - 10);
      ctx.lineTo(centerX + radius - 15, centerY + 10);
      ctx.closePath();
      ctx.fillStyle = 'red';
      ctx.fill();
    };

    const spin = () => {
      if (this.isSpinning) return;
      this.isSpinning = true;
      resultDisplay.textContent = '두근두근...';

      const spinRounds = 10 + Math.random() * 10;
      const spinDuration = 3000 + Math.random() * 2000;
      const startTimestamp = performance.now();
      const initialRotation = this.currentRotation;

      const animate = (timestamp) => {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        this.currentRotation = initialRotation + easeOut * spinRounds * 2 * Math.PI;

        draw();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.isSpinning = false;
          const sliceAngle = (2 * Math.PI) / this.options.length;
          const normalizedRotation = (this.currentRotation % (2 * Math.PI));
          const winningIndex = Math.floor((2 * Math.PI - normalizedRotation) / sliceAngle) % this.options.length;
          resultDisplay.textContent = `결과: ${this.options[winningIndex]}`;
        }
      };

      requestAnimationFrame(animate);
    };

    spinBtn.addEventListener('click', spin);
    updateBtn.addEventListener('click', () => {
      const val = inputField.value.trim();
      if (val) {
        this.options = val.split(',').map(s => s.trim()).filter(s => s);
        this.currentRotation = 0;
        draw();
      }
    });

    draw();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: inherit;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        canvas {
          max-width: 100%;
          height: auto;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }
        .controls {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .input-group {
          display: flex;
          gap: 0.5rem;
        }
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: var(--bg-color);
          color: var(--text-color);
        }
        button {
          padding: 10px 20px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          transition: 0.2s;
        }
        #spin-btn {
          background-color: #FF5722;
          color: white;
          font-size: 1.2rem;
          padding: 15px;
        }
        #update-options-btn {
          background-color: #2196F3;
          color: white;
        }
        #roulette-result {
          font-size: 1.5rem;
          font-weight: bold;
          min-height: 2rem;
          color: #FF5722;
        }
        .hint {
          font-size: 0.8rem;
          color: #888;
        }
      </style>
      <div class="container">
        <canvas id="roulette-canvas" width="400" height="400"></canvas>
        <div id="roulette-result"></div>
        <button id="spin-btn">GO!</button>
        <div class="controls">
          <div class="input-group">
            <input type="text" id="roulette-input" placeholder="쉼표(,)로 구분하여 입력 (예: 치킨, 피자, 초밥)" value="${this.options.join(', ')}">
            <button id="update-options-btn">수정</button>
          </div>
          <span class="hint">* 항목을 수정한 후 '수정' 버튼을 눌러주세요.</span>
        </div>
      </div>
    `;
  }
}

customElements.define('roulette-generator', RouletteGenerator);

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    let theme = document.body.getAttribute('data-theme');
    if (theme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeToggle.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
});

// Roulette Toggle Logic
const showRouletteBtn = document.getElementById('show-roulette-btn');
const rouletteContainer = document.getElementById('roulette-container');

showRouletteBtn.addEventListener('click', () => {
    rouletteContainer.style.display = 'block';
});

// Teachable Machine Logic (File Upload Version)
const ANIMAL_MODEL_URL = "https://teachablemachine.withgoogle.com/models/bF5aNMxvE/";
let model, labelContainer, maxPredictions;

async function loadModel() {
    if (model) return;
    const modelURL = ANIMAL_MODEL_URL + "model.json";
    const metadataURL = ANIMAL_MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

const imageUpload = document.getElementById('image-upload');
const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const retryBtn = document.getElementById('retry-btn');
const animalLabelContainer = document.getElementById('animal-label-container');

uploadBtn.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.innerHTML = `<img src="${event.target.result}" id="uploaded-image">`;
        animalLabelContainer.innerHTML = "AI가 분석 중입니다...";
        
        // Load model and predict
        await loadModel();
        const uploadedImg = document.getElementById('uploaded-image');
        
        // Wait for image to load to ensure it has dimensions
        uploadedImg.onload = async () => {
            const prediction = await model.predict(uploadedImg);
            displayResults(prediction);
            retryBtn.style.display = 'inline-block';
            document.getElementById('upload-wrapper').style.display = 'none';
        };
    };
    reader.readAsDataURL(file);
});

function displayResults(prediction) {
    animalLabelContainer.innerHTML = "";
    // Sort by probability
    prediction.sort((a, b) => b.probability - a.probability);
    
    const topResult = prediction[0];
    const resultHeader = document.createElement('h3');
    resultHeader.textContent = `당신은 ${topResult.className}상입니다!`;
    animalLabelContainer.appendChild(resultHeader);

    for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement('div');
        const percentage = (prediction[i].probability * 100).toFixed(0);
        div.textContent = `${prediction[i].className}: ${percentage}%`;
        animalLabelContainer.appendChild(div);
    }
}

retryBtn.addEventListener('click', () => {
    document.getElementById('upload-wrapper').style.display = 'block';
    imagePreview.innerHTML = "<p>얼굴 사진을 업로드하거나 선택하세요</p>";
    animalLabelContainer.innerHTML = "";
    retryBtn.style.display = 'none';
    imageUpload.value = "";
});