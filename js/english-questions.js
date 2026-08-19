/* ============================================================
   تشكيل الأسئلة واستخدام أدوات الاستفهام
   ============================================================ */

function speakText(text) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 0.85;
  speechSynthesis.speak(msg);
}

/* ---------- Navigation ---------- */
document.querySelectorAll(".nav-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("sec-" + tab.dataset.section).classList.add("active");
  });
});

/* ---------- Question Words Data ---------- */
const questionWords = [
  { en: "Who", ar: "مَن", phonetic: "/huː/", use: "للسؤال عن الأشخاص", example: "Who is your teacher?" },
  { en: "What", ar: "ماذا / ما", phonetic: "/wɒt/", use: "للسؤال عن الأشياء أو الأفعال", example: "What is your name?" },
  { en: "Where", ar: "أين", phonetic: "/weər/", use: "للسؤال عن المكان", example: "Where do you live?" },
  { en: "When", ar: "متى", phonetic: "/wen/", use: "للسؤال عن الوقت", example: "When is the exam?" },
  { en: "Why", ar: "لماذا", phonetic: "/waɪ/", use: "للسؤال عن السبب", example: "Why are you late?" },
  { en: "How", ar: "كيف", phonetic: "/haʊ/", use: "للسؤال عن الطريقة أو الحال", example: "How are you?" },
  { en: "Which", ar: "أيّ", phonetic: "/wɪtʃ/", use: "للاختيار من مجموعة محددة", example: "Which color do you prefer?" },
  { en: "Whose", ar: "لِمَن / مِلك مَن", phonetic: "/huːz/", use: "للسؤال عن الملكية", example: "Whose bag is this?" },
  { en: "How many", ar: "كم (عددي)", phonetic: "/haʊ ˈmeni/", use: "للسؤال عن العدد (عدد قابل للعد)", example: "How many books do you have?" },
  { en: "How much", ar: "كم (كمية/ثمن)", phonetic: "/haʊ mʌtʃ/", use: "للسؤال عن الكمية أو الثمن", example: "How much does it cost?" },
];

/* ---------- Build Question Words Table ---------- */
(function() {
  const tbody = document.querySelector("#qw-table tbody");
  questionWords.forEach(qw => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="en-word">${qw.en}</span></td>
      <td><span class="en-word-sm">${qw.phonetic}</span></td>
      <td><span class="ar-word">${qw.ar}</span></td>
      <td><span class="ar-word">${qw.use}</span></td>
      <td><span class="example-sentence">${qw.example}</span></td>
      <td><button class="sound-btn" onclick="speakText('${qw.example}')">🔊</button></td>`;
    tbody.appendChild(tr);
  });
})();

/* ---------- Build Quick Grid ---------- */
(function() {
  const grid = document.getElementById("qw-quick-grid");
  questionWords.forEach(qw => {
    const div = document.createElement("div");
    div.className = "qw-quick-card";
    div.innerHTML = `<div class="qw-en">${qw.en}</div><div class="qw-ar">${qw.ar}</div><div class="qw-use">${qw.use}</div>`;
    div.addEventListener("click", () => speakText(`${qw.en}. ${qw.ar}. ${qw.example}`));
    grid.appendChild(div);
  });
})();

/* ---------- WH Examples ---------- */
const whExamples = [
  { wh: "Who", statement: "She is my sister.", question: "Who is your sister?", answer: "She is my sister." },
  { wh: "What", statement: "He wants coffee.", question: "What does he want?", answer: "He wants coffee." },
  { wh: "Where", statement: "They live in Cairo.", question: "Where do they live?", answer: "They live in Cairo." },
  { wh: "When", statement: "The meeting is on Monday.", question: "When is the meeting?", answer: "The meeting is on Monday." },
  { wh: "Why", statement: "She is happy because she won.", question: "Why is she happy?", answer: "Because she won." },
  { wh: "How", statement: "She drives carefully.", question: "How does she drive?", answer: "She drives carefully." },
  { wh: "Which", statement: "He chose the blue shirt.", question: "Which shirt did he choose?", answer: "He chose the blue shirt." },
  { wh: "Whose", statement: "This is John's book.", question: "Whose book is this?", answer: "This is John's book." },
  { wh: "How many", statement: "She has three sisters.", question: "How many sisters does she have?", answer: "She has three sisters." },
  { wh: "How much", statement: "The book costs ten dollars.", question: "How much does the book cost?", answer: "The book costs ten dollars." },
];

(function() {
  const tbody = document.querySelector("#wh-examples-table tbody");
  whExamples.forEach(ex => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="en-word">${ex.wh}</span></td>
      <td><span class="ar-word">${ex.statement}</span></td>
      <td><span class="example-sentence">${ex.question}</span></td>
      <td><span class="example-sentence">${ex.answer}</span></td>
      <td><button class="sound-btn" onclick="speakText('${ex.question}')">🔊</button></td>`;
    tbody.appendChild(tr);
  });
})();

/* ---------- WH Transform Examples ---------- */
(function() {
  const box = document.getElementById("wh-transform-examples");
  const transforms = [
    { sent: "You live in Cairo.", q: "Where do you live?", ar: "أين تعيش؟" },
    { sent: "She is a teacher.", q: "What does she do?", ar: "ماذا تعمل؟" },
    { sent: "He arrived yesterday.", q: "When did he arrive?", ar: "متى وصل؟" },
    { sent: "They are studying English.", q: "What are they studying?", ar: "ماذا يدرسون؟" },
    { sent: "He is late because of traffic.", q: "Why is he late?", ar: "لماذا هو متأخر؟" },
  ];
  transforms.forEach(t => {
    box.innerHTML += `
      <div class="transform-box">
        <div class="label">الجملة الأصلية:</div>
        <div class="en">${t.sent}</div>
      </div>
      <div class="transform-arrow">⬇️</div>
      <div class="transform-box">
        <div class="label">السؤال:</div>
        <div class="en">${t.q}</div>
        <div class="ar">${t.ar}</div>
      </div>
      <div style="height:12px;"></div>`;
  });
})();

/* ---------- WH Which Word ---------- */
(function() {
  const box = document.getElementById("wh-which-word");
  const exercises = [
    { q: "_____ is your father's name?", opts: ["Who", "What", "Where", "When"], correct: "What" },
    { q: "_____ do you go to school?", opts: ["What", "How", "Where", "Why"], correct: "Where" },
    { q: "_____ are you smiling?", opts: ["Who", "Where", "Why", "When"], correct: "Why" },
    { q: "_____ did you arrive late?", opts: ["What", "When", "How", "Where"], correct: "When" },
    { q: "_____ is the fastest way to learn English?", opts: ["Who", "What", "How", "Which"], correct: "How" },
  ];
  let idx = 0;
  function render() {
    if (idx >= exercises.length) {
      box.innerHTML = `<div style="text-align:center;color:var(--green);font-weight:800;font-size:18px;">🎉 أحسنت! أجبت على جميع الأسئلة</div>`;
      return;
    }
    const ex = exercises[idx];
    box.innerHTML = `<div style="font-size:17px;font-weight:700;margin-bottom:14px;text-align:center;direction:ltr;">${ex.q}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">${ex.opts.map(o =>
        `<button class="quiz-opt" data-val="${o}">${o}</button>`
      ).join("")}</div><div id="wh-which-fb" class="quiz-feedback"></div>`;
    box.querySelectorAll(".quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        box.querySelectorAll(".quiz-opt").forEach(b => b.disabled = true);
        const fb = document.getElementById("wh-which-fb");
        if (btn.dataset.val === ex.correct) {
          btn.classList.add("correct");
          fb.textContent = "✅ صحيح!";
          fb.className = "quiz-feedback good";
        } else {
          btn.classList.add("wrong");
          box.querySelector(`[data-val="${ex.correct}"]`).classList.add("correct");
          fb.textContent = `❌ الإجابة الصحيحة: ${ex.correct}`;
          fb.className = "quiz-feedback bad";
        }
        idx++;
        setTimeout(render, 1500);
      });
    });
  }
  render();
})();

/* ---------- Yes/No Auxiliaries ---------- */
const ynAux = [
  { aux: "Do", time: "المضارع البسيط", q: "Do you like coffee?", yes: "Yes, I do.", no: "No, I don't." },
  { aux: "Does", time: "المضارع (he/she/it)", q: "Does she speak English?", yes: "Yes, she does.", no: "No, she doesn't." },
  { aux: "Did", time: "الماضي البسيط", q: "Did you go to school?", yes: "Yes, I did.", no: "No, I didn't." },
  { aux: "Is", time: "المضارع (كائن)", q: "Is he a doctor?", yes: "Yes, he is.", no: "No, he isn't." },
  { aux: "Are", time: "المضارع (كائنون)", q: "Are they ready?", yes: "Yes, they are.", no: "No, they aren't." },
  { aux: "Was", time: "الماضي (كائن)", q: "Was it raining?", yes: "Yes, it was.", no: "No, it wasn't." },
  { aux: "Were", time: "الماضي (كائنون)", q: "Were you at home?", yes: "Yes, I was.", no: "No, I wasn't." },
  { aux: "Have", time: "الماضي التام", q: "Have you eaten?", yes: "Yes, I have.", no: "No, I haven't." },
  { aux: "Has", time: "الماضي التام (he/she/it)", q: "Has she finished?", yes: "Yes, she has.", no: "No, she hasn't." },
  { aux: "Can", time: "الإمكانية", q: "Can you swim?", yes: "Yes, I can.", no: "No, I can't." },
];

(function() {
  const tbody = document.querySelector("#yn-aux-table tbody");
  ynAux.forEach(y => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="en-word">${y.aux}</span></td>
      <td><span class="ar-word">${y.time}</span></td>
      <td><span class="example-sentence">${y.q}</span></td>
      <td><span class="example-sentence" style="color:var(--green);">${y.yes}</span></td>
      <td><span class="example-sentence" style="color:var(--rose);">${y.no}</span></td>
      <td><button class="sound-btn" onclick="speakText('${y.q}')">🔊</button></td>`;
    tbody.appendChild(tr);
  });
})();

/* ---------- Yes/No Transform ---------- */
(function() {
  const box = document.getElementById("yn-transform");
  const transforms = [
    { sent: "She likes chocolate.", aux: "Does", q: "Does she like chocolate?", ar: "هل تحب الشوكولاتة؟" },
    { sent: "They are students.", aux: "Are", q: "Are they students?", ar: "هل هم طلاب؟" },
    { sent: "He went to the market.", aux: "Did", q: "Did he go to the market?", ar: "هل ذهب إلى السوق؟" },
    { sent: "You can speak French.", aux: "Can", q: "Can you speak French?", ar: "هل تستطيع التحدث بالفرنسية؟" },
    { sent: "She has a new car.", aux: "Does", q: "Does she have a new car?", ar: "هل لديها سيارة جديدة؟" },
  ];
  transforms.forEach(t => {
    box.innerHTML += `
      <div class="transform-box">
        <div class="label">الجملة الأصلية:</div>
        <div class="en">${t.sent}</div>
      </div>
      <div style="text-align:center;font-size:13px;color:var(--text-muted);margin:4px 0;">⬇️ أضف <strong style="color:var(--amber);">${t.aux}</strong> في البداية</div>
      <div class="transform-box">
        <div class="label">السؤال:</div>
        <div class="en">${t.q}</div>
        <div class="ar">${t.ar}</div>
      </div>
      <div style="height:12px;"></div>`;
  });
})();

/* ---------- Yes/No Examples ---------- */
(function() {
  const box = document.getElementById("yn-examples");
  const examples = [
    { q: "Do you like English?", en: "Do you like English?", ar: "هل تحب الإنجليزية؟" },
    { q: "Is she your friend?", en: "Is she your friend?", ar: "هل هي صديقتك؟" },
    { q: "Did they travel last year?", en: "Did they travel last year?", ar: "هل سافروا العام الماضي؟" },
    { q: "Can you help me?", en: "Can you help me?", ar: "هل يمكنك مساعدتي؟" },
    { q: "Has he finished his homework?", en: "Has he finished his homework?", ar: "هل أنهى واجبه؟" },
  ];
  examples.forEach(ex => {
    box.innerHTML += `
      <div class="transform-box" style="display:flex;align-items:center;gap:12px;">
        <div style="flex:1;">
          <div class="en">${ex.en}</div>
          <div class="ar">${ex.ar}</div>
        </div>
        <button class="sound-btn" onclick="speakText('${ex.en}')">🔊</button>
      </div>`;
  });
})();

/* ---------- Quiz ---------- */
const quizQuestions = [
  { q: "_____ is your name?", opts: ["Who", "What", "Where", "How"], correct: "What" },
  { q: "_____ do you live?", opts: ["What", "Where", "When", "Why"], correct: "Where" },
  { q: "_____ are you late?", opts: ["Who", "What", "Why", "How"], correct: "Why" },
  { q: "_____ did the movie start?", opts: ["Where", "Why", "When", "How"], correct: "When" },
  { q: "_____ is the weather today?", opts: ["What", "Where", "When", "How"], correct: "How" },
  { q: "_____ is that man? He is my uncle.", opts: ["What", "Who", "Where", "Which"], correct: "Who" },
  { q: "_____ book do you want?", opts: ["Who", "What", "Where", "Which"], correct: "Which" },
  { q: "_____ shoes are these? They are mine.", opts: ["What", "Where", "Whose", "How"], correct: "Whose" },
  { q: "_____ students are in the class?", opts: ["How much", "How many", "What", "Where"], correct: "How many" },
  { q: "_____ does this cost?", opts: ["How many", "What", "How much", "Where"], correct: "How much" },
  { q: "Do you like coffee? — Yes, _____.", opts: ["I do", "I am", "I can", "I did"], correct: "I do" },
  { q: "Does she speak English? — No, _____.", opts: ["she doesn't", "she isn't", "she don't", "she does"], correct: "she doesn't" },
  { q: "Did you go to school? — Yes, _____.", opts: ["I do", "I am", "I did", "I was"], correct: "I did" },
  { q: "Can you swim? — No, _____.", opts: ["I can't", "I don't", "I'm not", "I didn't"], correct: "I can't" },
  { q: "_____ she a teacher?", opts: ["Do", "Does", "Is", "Did"], correct: "Is" },
  { q: "_____ they playing football?", opts: ["Do", "Does", "Is", "Are"], correct: "Are" },
  { q: "_____ he went to the park yesterday?", opts: ["Do", "Does", "Did", "Is"], correct: "Did" },
  { q: "_____ you have a pen?", opts: ["Are", "Is", "Do", "Does"], correct: "Do" },
  { q: "_____ she have a brother?", opts: ["Do", "Does", "Is", "Are"], correct: "Does" },
  { q: "_____ he finished his work? — Yes, he has.", opts: ["Do", "Does", "Did", "Has"], correct: "Has" },
];

let quizState = { index: 0, score: 0, answered: false };
let shuffledQuiz = [];

function startQuiz() {
  shuffledQuiz = shuffleArray([...quizQuestions]);
  quizState = { index: 0, score: 0, answered: false };
  document.getElementById("quiz-result").style.display = "none";
  document.getElementById("btn-restart").style.display = "none";
  renderQuiz();
}

function renderQuiz() {
  const q = shuffledQuiz[quizState.index];
  const total = shuffledQuiz.length;
  document.getElementById("quiz-fill").style.width = ((quizState.index) / total * 100) + "%";
  document.getElementById("quiz-progress-text").textContent = `السؤال ${quizState.index + 1} من ${total}`;
  document.getElementById("quiz-question").textContent = q.q;
  const optsEl = document.getElementById("quiz-options");
  optsEl.innerHTML = q.opts.map(o => `<button class="quiz-opt" data-val="${o}">${o}</button>`).join("");
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-feedback").className = "quiz-feedback";
  document.getElementById("btn-next").style.display = "none";
  quizState.answered = false;

  optsEl.querySelectorAll(".quiz-opt").forEach(btn => {
    btn.addEventListener("click", () => answerQuiz(btn));
  });
}

function answerQuiz(btn) {
  if (quizState.answered) return;
  quizState.answered = true;
  const q = shuffledQuiz[quizState.index];
  const fb = document.getElementById("quiz-feedback");
  document.querySelectorAll(".quiz-opt").forEach(b => b.disabled = true);

  if (btn.dataset.val === q.correct) {
    quizState.score++;
    btn.classList.add("correct");
    fb.textContent = "✅ إجابة صحيحة!";
    fb.className = "quiz-feedback good";
  } else {
    btn.classList.add("wrong");
    document.querySelector(`[data-val="${q.correct}"]`).classList.add("correct");
    fb.textContent = `❌ الإجابة الصحيحة: ${q.correct}`;
    fb.className = "quiz-feedback bad";
  }

  const last = quizState.index === shuffledQuiz.length - 1;
  const nextBtn = document.getElementById("btn-next");
  nextBtn.textContent = last ? "عرض النتيجة" : "السؤال التالي ←";
  nextBtn.style.display = "inline-flex";
  nextBtn.onclick = () => {
    if (last) {
      showResult();
    } else {
      quizState.index++;
      renderQuiz();
    }
  };
}

function showResult() {
  document.getElementById("quiz-options").innerHTML = "";
  document.getElementById("quiz-question").textContent = "";
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("btn-next").style.display = "none";
  document.getElementById("quiz-fill").style.width = "100%";
  document.getElementById("quiz-progress-text").textContent = "انتهى!";

  const total = shuffledQuiz.length;
  const pct = Math.round((quizState.score / total) * 100);
  const msg = pct >= 90 ? "ممتاز! 🏆" : pct >= 70 ? "جيد جدًا! 👏" : pct >= 50 ? "جيد، واصل التدريب 💪" : "تحتاج إلى مزيد من المراجعة 📚";
  document.getElementById("quiz-result").innerHTML = `
    <span class="big">${quizState.score} / ${total}</span>
    <div style="font-size:20px;font-weight:800;margin-top:8px;">${pct}%</div>
    <div class="msg">${msg}</div>`;
  document.getElementById("quiz-result").style.display = "block";
  document.getElementById("btn-restart").style.display = "inline-flex";
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

document.getElementById("btn-restart").addEventListener("click", startQuiz);
startQuiz();
