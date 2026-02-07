import { buildSentencesFromText } from "./sentences.js";

let sentences = [];
let total = 0;

/* ===== 青空本文を読み込んで sentences を生成 ===== */
async function loadSentences() {
  const res = await fetch("./data/ginga.txt");
  const text = await res.text();
  sentences = buildSentencesFromText(text);
}

/* ===== 文章追加 ===== */
function appendSentences(count) {
  if (sentences.length === 0) return;

  const container = document.getElementById("container");
  const frag = document.createDocumentFragment();

  // 行頭の「閉じカッコ系」を除去したい（or それで空になったら弾く）
  const leadingClosers = /^[」』】）》]+/;

  for (let i = 0; i < count; i++) {
    let tries = 0;
    let s = "";

    // 変な行頭（」など）を避けるため、最大20回まで引き直す
    while (tries < 20) {
      const idx = Math.floor(Math.random() * sentences.length);
      s = (sentences[idx] ?? "").trim();

      // 行頭の閉じカッコを削ってみる
      const cleaned = s.replace(leadingClosers, "").trim();

      // 削った結果が十分な長さなら採用
      if (cleaned.length >= 10) {
        s = cleaned;
        break;
      }

      tries++;
    }

    // どうしてもダメなら今回はスキップ（無限ループ防止）
    if (!s || s.replace(leadingClosers, "").trim().length < 10) {
      continue;
    }

    const p = document.createElement("p");
    p.textContent = s;
    p.classList.add("fade-in");
    frag.appendChild(p);
    total++;
  }

  container.appendChild(frag);
  document.getElementById("counter").textContent = `${total} lines`;
}

/* ===== 無限スクロール ===== */
let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollPosition = window.innerHeight + window.pageYOffset;
      const threshold = document.body.offsetHeight - 500;

      if (scrollPosition > threshold) {
        appendSentences(18);
      }
      ticking = false;
    });
  },
  { passive: true },
);

/* ===== モーダルを閉じる処理 ===== */
const modal = document.getElementById("intro-modal");
const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", () => {
  modal.classList.add("intro-hide");

  // アニメ後に完全削除
  setTimeout(() => {
    modal.remove();
  }, 600);
});

/* ===== 流れ星 ===== */
const star = document.getElementById("shooting-star");

let idleTimer;
const IDLE_TIME = 5000;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(triggerShootingStar, IDLE_TIME);
}

function triggerShootingStar() {
  star.classList.add("active");
  setTimeout(() => star.classList.remove("active"), 1600);
}

["keydown", "mousedown", "scroll", "touchstart"].forEach((event) => {
  window.addEventListener(event, resetIdleTimer, { passive: true });
});

/* ===== 起動処理 ===== */
(async () => {
  await loadSentences(); // ← ここで青空本文ロード
  appendSentences(24); // ← 初期表示
  resetIdleTimer();
})();
