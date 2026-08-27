"use strict";

const timeTrialState = { words: [], current: null, score: 0, time: 60, timer: null };
const matchingState = { pairs: [], matched: new Set(), score: 0, source: null, draft: null, selectedSource: null };

function gameWords(scope = "all", sectionId) {
  const source = scope === "section"
    ? resolveScopeWords(scope, document.getElementById(sectionId))
    : resolveScopeWords(scope, null);
  const seen = new Set();
  return expandStudyWords(source).filter(word => {
    const key = `${word.en.toLowerCase()}|${word.ar}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return word.en && word.ar;
  });
}

function renderTimeTrialWord() {
  const word = timeTrialState.current;
  document.getElementById("time-trial-word").textContent = word.en;
  document.getElementById("time-trial-options").innerHTML = shuffle([
    word.ar,
    ...shuffle(gameWords().filter(item => item.ar !== word.ar).map(item => item.ar)).slice(0, 3)
  ]).map(option => `<button class="quiz-option" type="button">${esc(option)}</button>`).join("");
  document.querySelectorAll("#time-trial-options .quiz-option").forEach(button => {
    button.addEventListener("click", () => answerTimeTrial(button, word));
  });
}

function finishTimeTrial() {
  clearInterval(timeTrialState.timer);
  document.getElementById("time-trial-area").hidden = true;
  document.getElementById("time-trial-result").hidden = false;
  const best = Number(localStorage.getItem("time_trial_best") || 0);
  const isBest = timeTrialState.score > best;
  if (isBest) localStorage.setItem("time_trial_best", String(timeTrialState.score));
  document.getElementById("time-trial-result-score").innerHTML = `<span class="big">${timeTrialState.score}</span> نقطة`;
  document.getElementById("time-trial-result-message").textContent = isBest ? "رقم قياسي جديد! أحسنت." : `رقمك القياسي: ${Math.max(best, timeTrialState.score)} نقطة`;
  document.getElementById("time-trial-best").textContent = Math.max(best, timeTrialState.score);
}

function showTimeTrialSettings() {
  clearInterval(timeTrialState.timer);
  document.getElementById("time-trial-area").hidden = true;
  document.getElementById("time-trial-result").hidden = true;
  document.getElementById("time-trial-setup").hidden = false;
}

function answerTimeTrial(button, word) {
  if (button.disabled) return;
  const correct = button.textContent === word.ar;
  document.querySelectorAll("#time-trial-options .quiz-option").forEach(option => { option.disabled = true; });
  if (correct) {
    timeTrialState.score++;
    document.getElementById("time-trial-feedback").textContent = "✅";
  } else {
    button.classList.add("wrong");
    document.getElementById("time-trial-feedback").textContent = `الإجابة: ${word.ar}`;
  }
  document.getElementById("time-trial-score").textContent = timeTrialState.score;
  setTimeout(() => {
    if (timeTrialState.time > 0) {
      timeTrialState.current = timeTrialState.words[Math.floor(Math.random() * timeTrialState.words.length)];
      document.getElementById("time-trial-feedback").textContent = "";
      renderTimeTrialWord();
    }
  }, 180);
}

function startTimeTrial() {
  timeTrialState.words = gameWords(
    document.getElementById("time-trial-scope").value,
    "time-trial-section"
  );
  if (!timeTrialState.words.length) { toast("لا توجد كلمات متاحة للعبة"); return; }
  timeTrialState.current = timeTrialState.words[Math.floor(Math.random() * timeTrialState.words.length)];
  timeTrialState.score = 0;
  timeTrialState.time = 60;
  clearInterval(timeTrialState.timer);
  document.getElementById("time-trial-best").textContent = localStorage.getItem("time_trial_best") || 0;
  document.getElementById("time-trial-setup").hidden = true;
  document.getElementById("time-trial-result").hidden = true;
  document.getElementById("time-trial-area").hidden = false;
  document.getElementById("time-trial-score").textContent = "0";
  document.getElementById("time-trial-time").textContent = "60";
  renderTimeTrialWord();
  timeTrialState.timer = setInterval(() => {
    timeTrialState.time--;
    document.getElementById("time-trial-time").textContent = timeTrialState.time;
    if (timeTrialState.time <= 0) finishTimeTrial();
  }, 1000);
}

function matchingPoint(element, board) {
  const elementRect = element.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();
  return { x: elementRect.left + elementRect.width / 2 - boardRect.left, y: elementRect.top + elementRect.height / 2 - boardRect.top };
}

function drawMatchingLine(source, target, draft, pointerEvent, isWrong = false) {
  const board = document.getElementById("matching-board");
  const line = draft || document.createElementNS("http://www.w3.org/2000/svg", "line");
  const start = matchingPoint(source, board);
  const end = target && target.nodeType === 1 && target.classList.contains("matching-item") ? matchingPoint(target, board) : { x: pointerEvent.clientX - board.getBoundingClientRect().left, y: pointerEvent.clientY - board.getBoundingClientRect().top };
  line.setAttribute("x1", start.x); line.setAttribute("y1", start.y); line.setAttribute("x2", end.x); line.setAttribute("y2", end.y);
  if (!draft) {
    line.classList.add("matching-line");
    line.dataset.wrong = isWrong ? "true" : "false";
    document.getElementById("matching-lines").appendChild(line);
  }
  return line;
}

function endMatchingDrag(event) {
  if (!matchingState.source) return;
  const pointedElement = document.elementFromPoint(event.clientX, event.clientY);
  const target = pointedElement?.closest(".matching-arabic .matching-item")
    || (event.target.closest ? event.target.closest(".matching-arabic .matching-item") : null);
  const source = matchingState.source;
  const draft = matchingState.draft;
  if (draft) draft.remove();
  source.classList.remove("dragging");
  matchingState.source = null;
  matchingState.draft = null;
  if (!target || matchingState.matched.has(source.dataset.pair)) return;
  if (target.dataset.pair === source.dataset.pair) {
    matchingState.matched.add(source.dataset.pair);
    source.classList.add("matched"); target.classList.add("matched");
    drawMatchingLine(source, target, null, event);
    matchingState.score++;
  } else {
    drawMatchingLine(source, target, null, event, true);
  }
}

function connectMatchingPair(source, target) {
  if (!source || !target || matchingState.matched.has(source.dataset.pair)) return;
  source.classList.remove("selected");
  if (target.dataset.pair === source.dataset.pair) {
    matchingState.matched.add(source.dataset.pair);
    source.classList.add("matched");
    target.classList.add("matched");
    drawMatchingLine(source, target, null, { clientX: 0, clientY: 0 });
    matchingState.score++;
  } else {
    drawMatchingLine(source, target, null, { clientX: 0, clientY: 0 }, true);
  }
  matchingState.selectedSource = null;
}

function selectMatchingSource(event) {
  const source = event.currentTarget;
  if (source.classList.contains("matched")) return;
  document.querySelectorAll("#matching-english .matching-item.selected").forEach(item => item.classList.remove("selected"));
  matchingState.selectedSource = source;
  source.classList.add("selected");
  document.getElementById("matching-feedback").textContent = "الآن اختر الترجمة الصحيحة";
}

function chooseMatchingTarget(event) {
  if (!matchingState.selectedSource || event.currentTarget.classList.contains("matched")) return;
  connectMatchingPair(matchingState.selectedSource, event.currentTarget);
  document.getElementById("matching-feedback").textContent = "";
}

function startMatchingDrag(event) {
  const source = event.currentTarget;
  if (source.classList.contains("matched")) return;
  event.preventDefault();
  if (source.setPointerCapture && event.pointerId != null) source.setPointerCapture(event.pointerId);
  matchingState.source = source;
  source.classList.add("dragging");
  matchingState.draft = document.createElementNS("http://www.w3.org/2000/svg", "line");
  matchingState.draft.classList.add("matching-draft-line");
  document.getElementById("matching-lines").appendChild(matchingState.draft);
  drawMatchingLine(source, { nodeType: 0 }, matchingState.draft, event);
}

function renderMatchingBoard() {
  const english = shuffle(matchingState.pairs);
  const arabic = shuffle(matchingState.pairs);
  document.getElementById("matching-english").innerHTML = english.map((pair, index) => `<button class="matching-item" type="button" data-pair="${pair.id}" dir="ltr">${esc(pair.en)}</button>`).join("");
  document.getElementById("matching-arabic").innerHTML = arabic.map(pair => `<button class="matching-item" type="button" data-pair="${pair.id}">${esc(pair.ar)}</button>`).join("");
  document.querySelectorAll("#matching-english .matching-item").forEach(button => {
    button.addEventListener("pointerdown", startMatchingDrag);
    button.addEventListener("click", selectMatchingSource);
  });
  document.querySelectorAll("#matching-arabic .matching-item").forEach(button => button.addEventListener("click", chooseMatchingTarget));
}

function finishMatching() {
  document.querySelectorAll("#matching-lines .matching-line[data-wrong=\"true\"]").forEach(line => {
    line.classList.add("matching-result-wrong");
  });
  document.getElementById("matching-area").classList.add("matching-finished");
  document.getElementById("matching-result").hidden = false;
  document.getElementById("matching-result-score").innerHTML = `<span class="big">${matchingState.score} / ${matchingState.pairs.length}</span>`;
  document.getElementById("matching-result-message").textContent = matchingState.matched.size === matchingState.pairs.length ? "أكملت جميع الأزواج بنجاح!" : "انتهت الجولة، حاول مرة أخرى لتحسين نتيجتك.";
}

function showMatchingSettings() {
  matchingState.source = null;
  matchingState.draft = null;
  matchingState.selectedSource = null;
  document.getElementById("matching-area").hidden = true;
  document.getElementById("matching-result").hidden = true;
  document.getElementById("matching-setup").hidden = false;
}

function startMatching() {
  const available = gameWords(
    document.getElementById("matching-scope").value,
    "matching-section"
  );
  matchingState.pairs = shuffle(available).slice(0, Math.min(6, available.length)).map((word, id) => ({ id, en: word.en, ar: word.ar }));
  matchingState.matched = new Set(); matchingState.score = 0; matchingState.selectedSource = null;
  document.getElementById("matching-setup").hidden = true;
  document.getElementById("matching-result").hidden = true;
  document.getElementById("matching-area").hidden = false;
  document.getElementById("matching-area").classList.remove("matching-finished");
  document.getElementById("matching-feedback").textContent = "";
  document.getElementById("matching-lines").innerHTML = "";
  document.getElementById("btn-matching-settings").style.display = "flex";
  renderMatchingBoard();
}

function initDictionaryGames() {
  populateSectionSelect("time-trial-section");
  populateSectionSelect("matching-section");
  [
    ["time-trial-scope", "time-trial-section"],
    ["matching-scope", "matching-section"]
  ].forEach(([scopeId, sectionId]) => {
    document.getElementById(scopeId).addEventListener("change", event => {
      toggleScopeSection(event.target.value, sectionId);
    });
  });
  document.getElementById("btn-time-trial-start").addEventListener("click", startTimeTrial);
  document.getElementById("btn-time-trial-settings").addEventListener("click", showTimeTrialSettings);
  document.getElementById("btn-time-trial-retry").addEventListener("click", showTimeTrialSettings);
  document.getElementById("btn-matching-start").addEventListener("click", startMatching);
  document.getElementById("btn-matching-settings").addEventListener("click", showMatchingSettings);
  document.getElementById("btn-matching-finish").addEventListener("click", finishMatching);
  document.getElementById("btn-matching-retry").addEventListener("click", showMatchingSettings);
  document.addEventListener("pointermove", event => {
    if (matchingState.source && matchingState.draft) drawMatchingLine(matchingState.source, { nodeType: 0 }, matchingState.draft, event);
  });
  document.addEventListener("pointerup", endMatchingDrag);
  document.addEventListener("pointercancel", endMatchingDrag);
}

document.addEventListener("DOMContentLoaded", initDictionaryGames);
