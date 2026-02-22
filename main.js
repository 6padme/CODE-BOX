class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
          font-size: 24px;
          font-weight: bold;
          color: white;
        }
        .number:nth-child(1) { background-color: #fbc400; }
        .number:nth-child(2) { background-color: #69c8f2; }
        .number:nth-child(3) { background-color: #ff7272; }
        .number:nth-child(4) { background-color: #aaa; }
        .number:nth-child(5) { background-color: #b0d840; }
        .number:nth-child(6) { background-color: #c7c7c7; }

        button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background-color: #4CAF50;
          color: white;
        }
      </style>
      <div class="lotto-container">
        <div class="numbers">
          ${this.generateNumbers().map(number => `<div class="number">${number}</div>`).join('')}
        </div>
        <button>Generate New Numbers</button>
      </div>
    `;

    this.shadowRoot.querySelector('button').addEventListener('click', () => this.render());
  }
}

customElements.define('lotto-generator', LottoGenerator);
