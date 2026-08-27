"use strict";

const readingState = { words: [], text: "" };

function getReadingPool() {
  const scope = document.getElementById("rd-scope").value;
  return expandStudyWords(resolveScopeWords(scope, document.getElementById("rd-section")));
}

function renderReadingPicker() {
  const picker = document.getElementById("rd-picker");
  const list = document.getElementById("rd-word-list");
  const scope = document.getElementById("rd-scope").value;
  picker.hidden = scope !== "section";
  if (scope !== "section") {
    list.innerHTML = "";
    return;
  }

  list.innerHTML = getReadingPool().map((word, index) => `
    <label class="reading-word-option">
      <input type="checkbox" value="${index}" checked>
      <span dir="ltr">${esc(word.en)}</span>
      <small>${esc(word.ar)}</small>
    </label>`).join("");
  document.getElementById("rd-select-all").textContent = "إلغاء تحديد الكل";
}

function updateReadingControls() {
  const scope = document.getElementById("rd-scope").value;
  toggleScopeSection(scope, "rd-section");
  renderReadingPicker();
}

function getSelectedReadingWords() {
  const scope = document.getElementById("rd-scope").value;
  const pool = getReadingPool();
  if (scope !== "section") return pool;
  const selected = new Set([...document.querySelectorAll("#rd-word-list input:checked")]
    .map(input => Number(input.value)));
  return pool.filter((word, index) => selected.has(index));
}

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function randomReadingItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildConnectedReadingText(words, length, repeatMode) {
  const openings = [
    "Every day, I set aside time to learn something new.",
    "This morning, I began a quiet learning journey with a clear goal.",
    "Learning becomes easier when each day has a simple purpose."
  ];
  const middles = [
    "I wrote the idea in my notebook and looked for a connection.",
    "I read slowly, listened to the sounds, and imagined one story.",
    "Instead of separate lists, I placed everything in one idea."
  ];
  const bridges = [
    "As the morning continued, the activity became more natural.",
    "That change helped me stay focused on the story.",
    "After a short break, the connected idea was easier to remember."
  ];
  const endings = [
    "By the end, I felt calmer and decided to continue tomorrow.",
    "When I finished, I remembered the whole idea instead of isolated words.",
    "The practice showed me that progress grows from connected thoughts."
  ];
  const wordScenes = [
    word => `At the beginning, I used the word "${word.en}" to describe the first part of my plan.`,
    word => `A little later, the word "${word.en}" helped me explain what happened next.`,
    word => `While the story moved forward, I connected the word "${word.en}" with a clear image.`,
    word => `This time, I placed the word "${word.en}" in the middle of the idea, where it felt natural.`,
    word => `Before moving on, I repeated the word "${word.en}" and linked it to the previous thought.`
  ];
  const wordsInText = repeatMode === "repeat"
    ? words.flatMap(word => Array.from({ length: 1 + Math.floor(Math.random() * 7) }, () => word))
    : words;
  const paragraphs = [randomReadingItem(openings)];
  wordsInText.forEach((word, index) => {
    let scene = wordScenes[index % wordScenes.length](word);
    paragraphs.push(repeatMode === "repeat" && index % 2 === 1
      ? scene.replace(`the word "${word.en}"`, `the same word "${word.en}" again`)
      : scene);
    if (index % 2 === 0) paragraphs.push(randomReadingItem(index % 4 ? middles : bridges));
  });
  paragraphs.push(randomReadingItem(endings));
  let text = paragraphs.join(" ");
  let requiredText = text;
  if (wordCount(requiredText) > length) {
    const compactParts = [randomReadingItem(openings)];
    wordsInText.forEach((word, index) => {
      compactParts.push(`${index ? "Then" : "Next"}, I remembered "${word.en}" and continued.`);
    });
    compactParts.push(randomReadingItem(endings));
    text = compactParts.join(" ");
    requiredText = text;
  }
  const fillerWords = "The story moves forward, and each connected thought makes the lesson clearer and easier to remember.".split(/\s+/);
  while (wordCount(text) < length) {
    const remaining = length - wordCount(text);
    const addition = fillerWords.slice(0, Math.min(remaining, fillerWords.length)).join(" ");
    if (!addition) break;
    text += ` ${addition}`;
  }
  if (wordCount(requiredText) <= length && wordCount(text) > length) {
    text = text.split(/\s+/).slice(0, length).join(" ");
  }
  return text;
}

function highlightReadingWords(text, words) {
  let html = esc(text);
  const terms = words.map(word => esc(word.en)).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!terms.length) return html;
  const pattern = new RegExp("(" + terms.map(escRe).join("|") + ")", "gi");
  return html.replace(pattern, "<mark class=\"reading-target\">$1</mark>");
}

function startReadingPractice() {
  const selected = getSelectedReadingWords();
  if (!selected.length) {
    toast("حدد كلمة واحدة على الأقل");
    return;
  }

  const length = Number(document.getElementById("rd-length").value) || 100;
  const repeatMode = document.getElementById("rd-repeat").value;
  const text = buildConnectedReadingText(selected, length, repeatMode);
  readingState.words = selected;
  readingState.text = text;
  document.getElementById("rd-count").textContent = `${wordCount(text)} كلمة، وتتضمن ${selected.length} كلمة مستهدفة`;
  document.getElementById("rd-text").innerHTML = highlightReadingWords(text, selected);
  document.getElementById("rd-translation").innerHTML = selected.map((word, index) =>
    `<div class="reading-translation-item"><span class="reading-number">${index + 1}</span><span dir="ltr">${esc(word.en)}</span><span>${esc(word.ar)}</span><button class="sound-btn" type="button" data-text="${esc(word.en)}" title="استمع للنطق">🔊</button></div>`
  ).join("");

  document.getElementById("reading-setup").hidden = true;
  document.getElementById("reading-result").hidden = false;
  document.querySelectorAll("#rd-translation .sound-btn").forEach(button => {
    button.addEventListener("click", () => speak(button.dataset.text));
  });
}

function speakReadingText() {
  if (readingState.text) speak(readingState.text.replace(/ · /g, ", "));
}

function showReadingSettings() {
  document.getElementById("reading-result").hidden = true;
  document.getElementById("reading-setup").hidden = false;
}

function initReading() {
  const tab = document.querySelector('.tab[data-view="reading"]');
  tab.addEventListener("click", () => {
    populateSectionSelect("rd-section");
    updateReadingControls();
  });
  document.getElementById("rd-scope").addEventListener("change", updateReadingControls);
  document.getElementById("rd-section").addEventListener("change", () => {
    renderReadingPicker();
  });
  document.getElementById("rd-select-all").addEventListener("click", () => {
    const inputs = [...document.querySelectorAll("#rd-word-list input")];
    const shouldSelect = inputs.some(input => !input.checked);
    inputs.forEach(input => { input.checked = shouldSelect; });
    document.getElementById("rd-select-all").textContent = shouldSelect ? "إلغاء تحديد الكل" : "تحديد الكل";
  });
  document.getElementById("btn-rd-start").addEventListener("click", startReadingPractice);
  document.getElementById("btn-rd-speak").addEventListener("click", speakReadingText);
  document.getElementById("btn-rd-settings").addEventListener("click", showReadingSettings);
  populateSectionSelect("rd-section");
  updateReadingControls();
}

document.addEventListener("DOMContentLoaded", initReading);
