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

