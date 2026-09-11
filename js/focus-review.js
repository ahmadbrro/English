"use strict";

const FOCUS_STORE = "vocab_focus";
let focusKeys = new Set();
const originalResolveScopeWords = resolveScopeWords;
const trainingViews = ["flashcards", "quiz", "errors", "time-trial", "matching", "writing", "reading"];

function focusKey(item) {
  return item.isSub ? item.key : keyOf(item);
}

function loadFocusState() {
  focusKeys = new Set(loadJSON(FOCUS_STORE, []));
}

function saveFocusState() {
  saveJSON(FOCUS_STORE, [...focusKeys]);
}

function focusScopeWords() {
  return ALL_ITEMS
    .filter(item => focusKeys.has(item.key))
    .map(item => ({
      key: item.key,
      en: item.en,
      ar: item.ar,
      examples: item.examples || [],
      subs: [],
      section: item.parent && item.parent.section
    }));
}

function isFocusedItem(item) {
  return focusKeys.has(focusKey(item));
}

function findStudyItem(key) {
  return key.includes("\u00A6sub\u00A6")
    ? ALL_ITEMS.find(item => item.key === key)
    : findWordByKey(key);
}

function focusButtonHTML(item) {
  const focused = isFocusedItem(item);
  return `<button class="focus-btn ${focused ? "focused" : ""}" data-focus-key="${esc(focusKey(item))}" title="${focused ? "إزالة من التركيز" : "إضافة إلى التركيز"}">${focused ? "🎯" : "◎"}</button>`;
}

function savedButtonHTML(item) {
  const saved = state.savedKeys.has(focusKey(item));
  return `<button class="focus-save-btn ${saved ? "saved" : ""}" data-save-key="${esc(focusKey(item))}" title="${saved ? "إلغاء الحفظ" : "حفظ الكلمة"}">${saved ? "⭐" : "☆"}</button>`;
}

function decorateDictionaryCards() {
  document.querySelectorAll("#dict-grid .word-card").forEach(card => {
    const main = findStudyItem(card.dataset.key);
    if (!main || card.querySelector(".focus-btn")) return;
    const actions = card.querySelector(".word-card-head > div:last-child");
    if (actions) actions.insertAdjacentHTML("beforeend", focusButtonHTML(main));
    card.querySelectorAll(".sub-chip-wrap").forEach((wrap, index) => {
      const sub = (main.subs || [])[index];
      if (!sub || wrap.querySelector(".focus-sub-actions")) return;
      const item = ALL_ITEMS.find(candidate => candidate.key === `${main.key}\u00A6sub\u00A6${sub.en}\u00A6${sub.ar}`);
      if (!item) return;
      wrap.insertAdjacentHTML("beforeend", `<span class="focus-sub-actions">${savedButtonHTML(item)}${focusButtonHTML(item)}</span>`);
    });
  });
}

function focusCardHTML(item) {
  const saved = state.savedKeys.has(focusKey(item));
  const examples = item.examples || [];
  return `<article class="word-card focus-card ${saved ? "saved" : ""}" data-key="${esc(focusKey(item))}">
    <div class="word-card-head">
      <div class="word-main">
        <span class="word-en">${esc(item.en)}</span>
        <span class="word-ar">${esc(item.ar)}</span>
        <small class="word-section">${esc(item.parent && item.parent.sectionName || "")}</small>
      </div>
      <div class="focus-card-actions">
        <button class="sound-btn" title="استمع للنطق" onclick="speak('${esc(item.en).replace(/'/g, "\\'")}')">🔊</button>
        ${savedButtonHTML(item)}
        <button class="learned-btn" data-learned-key="${esc(focusKey(item))}" title="تمت مراجعتها">✓ تمت المراجعة</button>
      </div>
    </div>
    ${examples.length ? `<button class="examples-toggle focus-example-btn" data-focus-example-key="${esc(focusKey(item))}">📄 عرض الأمثلة <span>(${examples.length})</span></button>` : ""}
  </article>`;
}

function renderFocus() {
  const grid = document.getElementById("focus-grid");
  const empty = document.getElementById("focus-empty");
  if (!grid || !empty) return;
  const items = ALL_ITEMS.filter(item => focusKeys.has(item.key));
  empty.hidden = items.length > 0;
  grid.innerHTML = items.map(focusCardHTML).join("");
}

function renderSavedWithSubWords() {
  const grid = document.getElementById("saved-grid");
  const empty = document.getElementById("saved-empty");
  if (!grid || !empty) return;
  const items = ALL_ITEMS.filter(item => state.savedKeys.has(item.key));
  empty.hidden = items.length > 0;
  grid.innerHTML = items.map(item => item.isSub ? focusCardHTML(item) : wordCardHTML(findWordByKey(item.key))).join("");
}

function addTrainingBackButtons() {
  trainingViews.forEach(view => {
    const container = document.getElementById(`view-${view}`);
    if (!container || container.querySelector(".training-back-btn")) return;
    const button = document.createElement("button");
    button.className = "btn ghost training-back-btn";
    button.type = "button";
    button.textContent = "← العودة إلى الأدوات";
    button.title = "العودة إلى صفحة التدريبات والأدوات";
    button.addEventListener("click", () => switchView("training"));
    container.prepend(button);
  });
}

function updateFocusButton(key) {
  document.querySelectorAll(`[data-focus-key="${CSS.escape(key)}"]`).forEach(button => {
    const focused = focusKeys.has(key);
    button.classList.toggle("focused", focused);
    button.textContent = focused ? "🎯" : "◎";
    button.title = focused ? "إزالة من التركيز" : "إضافة إلى التركيز";
  });
}

function updateSavedButton(key) {
  document.querySelectorAll(`[data-save-key="${CSS.escape(key)}"]`).forEach(button => {
    const saved = state.savedKeys.has(key);
    button.classList.toggle("saved", saved);
    button.textContent = saved ? "⭐" : "☆";
    button.title = saved ? "إلغاء الحفظ" : "حفظ الكلمة";
  });
}

function handleFocusClick(event) {
  const focusButton = event.target.closest("[data-focus-key]");
  if (focusButton) {
    event.stopPropagation();
    const key = focusButton.dataset.focusKey;
    if (focusKeys.has(key)) focusKeys.delete(key); else focusKeys.add(key);
    saveFocusState();
    updateFocusButton(key);
    if (document.getElementById("view-focus").classList.contains("active")) renderFocus();
    toast(focusKeys.has(key) ? "أضيفت إلى التركيز 🎯" : "أزيلت من التركيز");
    return;
  }

  const saveButton = event.target.closest("[data-save-key]");
  if (saveButton) {
    event.stopPropagation();
    const key = saveButton.dataset.saveKey;
    if (state.savedKeys.has(key)) state.savedKeys.delete(key); else state.savedKeys.add(key);
    persistSaved();
    updateSavedButton(key);
    toast(state.savedKeys.has(key) ? "تم حفظ الكلمة ⭐" : "تمت إزالة الحفظ");
    return;
  }

  const learnedButton = event.target.closest("[data-learned-key]");
  if (learnedButton) {
    event.stopPropagation();
    focusKeys.delete(learnedButton.dataset.learnedKey);
    saveFocusState();
    renderFocus();
    toast("أحسنت، أزيلت الكلمة من قائمة التركيز");
    return;
  }

  const exampleButton = event.target.closest("[data-focus-example-key]");
  if (exampleButton) {
    const item = findStudyItem(exampleButton.dataset.focusExampleKey);
    if (item) openExamplesModal(item);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadFocusState();
  const resolveWithFocus = (scope, sectionSelect) => scope === "focus"
    ? focusScopeWords()
    : originalResolveScopeWords(scope, sectionSelect);
  resolveScopeWords = resolveWithFocus;
  renderSaved = renderSavedWithSubWords;
  addTrainingBackButtons();
  decorateDictionaryCards();
  const grid = document.getElementById("dict-grid");
  if (grid) new MutationObserver(decorateDictionaryCards).observe(grid, { childList: true });
  document.addEventListener("click", handleFocusClick);
  document.querySelectorAll(".training-card").forEach(card => {
    card.addEventListener("click", () => {
      switchView(card.dataset.view);
      document.querySelector('[data-view="training"]').classList.add("active");
    });
  });
  document.querySelector('[data-view="focus"]').addEventListener("click", renderFocus);
  document.getElementById("btn-clear-focus").addEventListener("click", () => {
    if (!focusKeys.size) { toast("لا توجد كلمات قيد التركيز"); return; }
    if (confirm("هل تريد مسح قائمة التركيز؟")) {
      focusKeys.clear();
      saveFocusState();
      renderFocus();
      toast("تم مسح قائمة التركيز");
    }
  });
});
