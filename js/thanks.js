import { thanksList } from '../assets/config/thanksConfig.js';

const wrapEl = document.querySelector('.thanks-card-wrap');

thanksList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'thanks-card';
    card.innerHTML = `
    <div class="thanks-avatar">
      <img src="${item.avatar}" alt="${item.name}">
    </div>
    <div class="thanks-info">
      <div class="thanks-name">${item.name}</div>
      <div class="thanks-desc">${item.desc}</div>
    </div>
  `;

    if (item.link) {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            window.open(item.link, "_blank");
        })
    }

    wrapEl.appendChild(card);
});