import { codeConfig } from '../assets/config/keyConfig.js';

const trigger = document.querySelector('.select-trigger');
const dropdown = document.getElementById('dropDownBox');
const textEl = document.querySelector('.select-text');
const cardWrap = document.getElementById('cardWrap');

function getServerShowText(serverCode) {
  if (serverCode === 'cn') return '国服';
  if (serverCode === 'en') return '国际服';
  if (serverCode === 'all') return '通用';
  return serverCode;
}

function getGameList() {
  const set = new Set();
  codeConfig.codeList.forEach(item => set.add(item.gameName));
  return Array.from(set);
}

function renderOptions() {
  dropdown.innerHTML = '';
  const allOpt = document.createElement('div');
  allOpt.className = 'select-option';
  allOpt.dataset.value = '';
  allOpt.innerText = '全部';
  dropdown.appendChild(allOpt);

  getGameList().forEach(name => {
    const opt = document.createElement('div');
    opt.className = 'select-option';
    opt.dataset.value = name;
    opt.innerText = name;
    dropdown.appendChild(opt);
  })
}

function isExpired(timeStr) {
  if (timeStr === null) return false;
  return new Date(timeStr) < new Date();
}

function formatExpireText(timeStr) {
  if (timeStr === null) return "永久有效";
  return `有效期至${timeStr.replace(/-/g, "/").slice(0, 10)}`;
}

function renderCards(filterGame = "") {
  cardWrap.innerHTML = "";
  let arr = codeConfig.codeList;
  if (filterGame) {
    arr = arr.filter(i => i.gameName === filterGame);
  }

  if (arr.length === 0) {
    cardWrap.innerHTML = `<div class="empty-tip">暂无该游戏兑换码</div>`;
    return;
  }

  arr.forEach(item => {
    const expired = isExpired(item.expireTime);
    const div = document.createElement('div');
    div.className = "key-item" + (expired ? " key-item-expired" : "");
    div.dataset.game = item.gameName;

    const rewardHtml = item.reward.replaceAll('\n', '<br>');
    const serverText = getServerShowText(item.server);

    div.innerHTML = `
      <div class="code-text">${item.code}</div>
      <div class="game-title-wrap">
        <div class="game-title">${item.gameName}</div>
        <div class="server-tag">${serverText}</div>
      </div>
      <div class="reward-area">${rewardHtml}</div>
      <div class="right-bottom">
        <div class="expire-text">${formatExpireText(item.expireTime)}</div>
        <button class="copy-btn">复制</button>
      </div>
    `;
    cardWrap.appendChild(div);
  })

  cardWrap.querySelectorAll('.copy-btn').forEach((btn, idx) => {
    btn.onclick = async () => {
      await navigator.clipboard.writeText(arr[idx].code);
      Swal.fire({
        title: "成功",
        text: `已复制 ${arr[idx].gameName} 的兑换码：${arr[idx].code}`,
        icon: "success",
        draggable: true
      });
    }
  })
}

function bindEvent() {
  trigger.addEventListener('click', e => {
    e.stopPropagation();
    trigger.classList.toggle('open');
    dropdown.classList.toggle('show');
  })

  dropdown.addEventListener('click', e => {
    if (e.target.classList.contains('select-option')) {
      const val = e.target.dataset.value;
      textEl.innerText = e.target.innerText;
      renderCards(val);
      trigger.classList.remove('open');
      dropdown.classList.remove('show');
    }
  })

  document.addEventListener('click', () => {
    trigger.classList.remove('open');
    dropdown.classList.remove('show');
  })
}

renderOptions();
renderCards();
bindEvent();