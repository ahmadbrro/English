"use strict";

const MY_VOCABULARY_STORE = "my_vocabulary";
let myVocabulary = [];

function loadMyVocabulary() {
  const saved = loadJSON(MY_VOCABULARY_STORE, []);
  myVocabulary = Array.isArray(saved) ? saved.filter(word => word && word.en && word.ar) : [];
}

function saveMyVocabulary() {
  saveJSON(MY_VOCABULARY_STORE, myVocabulary);
}

function myWordKey(word) {
  return keyOf(word);
}

function renderMyVocabulary() {
  const grid = document.getElementById("my-vocabulary-grid");
  const empty = document.getElementById("my-vocabulary-empty");
  empty.hidden = myVocabulary.length > 0;
  grid.innerHTML = myVocabulary.map((word, index) => `
    <article class="word-card my-word-card" data-index="${index}">
      <div class="word-card-head">
        <div class="word-main">
          <span class="word-en">${esc(word.en)}</span>
          <span class="word-ar">${esc(word.ar)}</span>
          <small class="word-section">كلمة أضفتها بنفسي</small>
        </div>
        <div class="my-word-actions">
          <button class="sound-btn my-word-speak" type="button" title="استمع للنطق">🔊</button>
          <button class="bookmark-btn saved my-word-delete" type="button" title="حذف الكلمة">🗑</button>
        </div>
      </div>
    </article>`).join("");

  grid.querySelectorAll(".my-word-card").forEach(card => {
    const word = myVocabulary[Number(card.dataset.index)];
    card.querySelector(".my-word-speak").addEventListener("click", () => speak(word.en));
    card.querySelector(".my-word-delete").addEventListener("click", () => removeMyWord(word));
  });
}

function addMyWord(event) {
  event.preventDefault();
  const enInput = document.getElementById("my-word-en");
  const arInput = document.getElementById("my-word-ar");
  const en = enInput.value.trim();
  const ar = arInput.value.trim();
  if (!en || !ar) return;

  const word = { en, ar, key: keyOf({ en, ar }), examples: [], subs: [], section: -1, sectionName: "قائمة كلماتي" };
  const duplicate = myVocabulary.some(item => myWordKey(item) === word.key);
  if (duplicate) {
    toast("هذه الكلمة موجودة في قائمتك");
    return;
  }
  myVocabulary.unshift(word);
  saveMyVocabulary();
  state.savedKeys.add(word.key);
  persistSaved();
  document.getElementById("my-word-form").reset();
  renderMyVocabulary();
  toast("تمت إضافة الكلمة وحفظها ⭐");
}

function removeMyWord(word) {
  myVocabulary = myVocabulary.filter(item => myWordKey(item) !== myWordKey(word));
  saveMyVocabulary();
  state.savedKeys.delete(word.key);
  persistSaved();
  renderMyVocabulary();
  toast("تم حذف الكلمة من قائمتك");
}

function includeMyWordsInSavedScopes() {
  const originalResolveScopeWords = resolveScopeWords;
  resolveScopeWords = (scope, sectionSelect) => {
    const words = originalResolveScopeWords(scope, sectionSelect);
    if (scope === "saved") return words.concat(myVocabulary.filter(word => state.savedKeys.has(word.key)));
    return words;
  };
}

function initMyVocabulary() {
  loadMyVocabulary();
  includeMyWordsInSavedScopes();
  document.getElementById("my-word-form").addEventListener("submit", addMyWord);
  document.querySelector('.tab[data-view="my-vocabulary"]').addEventListener("click", renderMyVocabulary);
  renderMyVocabulary();
}

document.addEventListener("DOMContentLoaded", initMyVocabulary);
