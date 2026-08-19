let quizQuestions = [];
let currentQ = 0;
let score = 0;

function speak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.section).classList.add('active');
    });
  });

  document.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.text));
  });
});

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  quizQuestions = shuffleArray([
    {
      q: "_____ is a very interesting book.",
      opts: ["This", "These", "That", "Those"],
      answer: 0,
      explain: "نستخدم This مع المفرد القريب: This book (هذا الكتاب)."
    },
    {
      q: "_____ shoes are too small for me.",
      opts: ["This", "That", "These", "Those"],
      answer: 2,
      explain: "نستخدم These مع الجمع القريب: These shoes (هذه الأحذية)."
    },
    {
      q: "Who is _____ man over there?",
      opts: ["this", "these", "that", "those"],
      answer: 2,
      explain: "نستخدم that مع المفرد البعيد: that man over there (ذلك الرجل هناك)."
    },
    {
      q: "_____ are the books I told you about.",
      opts: ["This", "That", "These", "Those"],
      answer: 2,
      explain: "نستخدم These مع الجمع القريب: These books (هذه الكتب)."
    },
    {
      q: "I bought _____ new car last week.",
      opts: ["this", "that", "these", "those"],
      answer: 0,
      explain: "نستخدم this مع المفرد القريب: this new car (هذه السيارة الجديدة)."
    },
    {
      q: "_____ flowers on the table are beautiful.",
      opts: ["This", "That", "These", "Those"],
      answer: 2,
      explain: "نستخدم These مع الجمع القريب: These flowers (هذه الزهور)."
    },
    {
      q: "Look at _____ mountains in the distance!",
      opts: ["this", "that", "these", "those"],
      answer: 3,
      explain: "نستخدم those مع الجمع البعيد: those mountains (تلك الجبال)."
    },
    {
      q: "This is Ahmad speaking. _____ I am Ahmad.",
      opts: ["I", "This is", "That is", "These are"],
      answer: 1,
      explain: "عند الرد على الهاتف نقول This is ... speaking وليس I am."
    },
    {
      q: "_____ was a great movie last night.",
      opts: ["This", "That", "These", "Those"],
      answer: 1,
      explain: "نستخدم that للإشارة لحدث في الزمان الماضي البعيد: that movie (ذلك الفيلم)."
    },
    {
      q: "_____ morning was very cold.",
      opts: ["This", "That", "These", "Those"],
      answer: 0,
      explain: "نستخدم this للإشارة للزمان القريب: this morning (هذا الصباح)."
    },
    {
      q: "_____ week has been really busy.",
      opts: ["This", "That", "These", "Those"],
      answer: 0,
      explain: "نستخدم this للزمان القريب الحاضر: this week (هذا الأسبوع)."
    },
    {
      q: "Can I borrow _____ pen?",
      opts: ["this", "that", "these", "those"],
      answer: 0,
      explain: "نستخدم this مع المفرد القريب: this pen (هذا القلم)."
    },
    {
      q: "_____ are my friends from school.",
      opts: ["This", "That", "These", "Those"],
      answer: 2,
      explain: "نستخدم these مع الجمع القريب: these friends (هؤلاء الأصدقاء)."
    },
    {
      q: "I don't like _____ coat. It's too long.",
      opts: ["this", "that", "these", "those"],
      answer: 0,
      explain: "نستخدم this مع المفرد القريب: this coat (هذا المعطف)."
    },
    {
      q: "_____ cookies are delicious! Who made them?",
      opts: ["This", "That", "These", "Those"],
      answer: 2,
      explain: "نستخدم these مع الجمع القريب: these cookies (هؤلاء البسكويت)."
    },
    {
      q: "_____ year I want to travel to Japan.",
      opts: ["This", "That", "These", "Those"],
      answer: 0,
      explain: "نستخدم this للزمان القريب: this year (هذا العام)."
    },
    {
      q: "_____ books on the shelf over there are mine.",
      opts: ["This", "That", "These", "Those"],
      answer: 3,
      explain: "نستخدم those مع الجمع البعيد: those books on the shelf (تلك الكتب على الرف)."
    },
    {
      q: "This is my house. _____ is very big.",
      opts: ["This", "That", "It", "They"],
      answer: 2,
      explain: "عند استخدام الإشارة بدون اسم نستخدم This is / That is / These are / Those are."
    },
    {
      q: "_____ afternoon we have a meeting.",
      opts: ["This", "That", "These", "Those"],
      answer: 0,
      explain: "نستخدم this للزمان القريب: this afternoon (بعد ظهر اليوم)."
    },
    {
      q: "That cake was expensive. _____ were $50.",
      opts: ["This", "That", "It", "They"],
      answer: 3,
      explain: "عند الإشارة لجمع بدون اسم نستخدم Those were للاشارة للشيء البعيد."
    }
  ]);
  currentQ = 0;
  score = 0;
  document.getElementById('quiz-score').textContent = '';
  document.getElementById('quiz-nav').innerHTML = '';
  renderQuiz();
}

function renderQuiz() {
  const q = quizQuestions[currentQ];
  const total = quizQuestions.length;
  const pct = ((currentQ) / total) * 100;

  document.getElementById('quiz-progress-fill').style.width = pct + '%';
  document.getElementById('quiz-question').innerHTML = q.q;
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-nav').innerHTML = '';

  const optsHtml = q.opts.map((o, i) =>
    `<button class="quiz-opt" onclick="answerQuiz(${i})">${o}</button>`
  ).join('');
  document.getElementById('quiz-options').innerHTML = optsHtml;
}

function answerQuiz(idx) {
  const q = quizQuestions[currentQ];
  const btns = document.querySelectorAll('.quiz-opt');
  btns.forEach(b => b.disabled = true);

  const fb = document.getElementById('quiz-feedback');
  if (idx === q.answer) {
    score++;
    btns[idx].classList.add('correct');
    fb.textContent = '✅ أحسنت! إجابة صحيحة';
    fb.className = 'quiz-feedback good';
  } else {
    btns[idx].classList.add('wrong');
    btns[q.answer].classList.add('correct');
    fb.textContent = '❌ ' + q.explain;
    fb.className = 'quiz-feedback bad';
  }

  if (currentQ < quizQuestions.length - 1) {
    document.getElementById('quiz-nav').innerHTML =
      `<button class="btn btn-primary" onclick="nextQ()">التالي ➡️</button>`;
  } else {
    document.getElementById('quiz-nav').innerHTML =
      `<button class="btn btn-primary" onclick="showResult()">عرض النتيجة 🏆</button>`;
  }
}

function nextQ() {
  currentQ++;
  renderQuiz();
}

function showResult() {
  const total = quizQuestions.length;
  const pct = Math.round((score / total) * 100);
  document.getElementById('quiz-progress-fill').style.width = '100%';

  let msg = '';
  if (pct === 100) msg = 'ممتاز! إجابة على كل الأسئلة بشكل صحيح! 🎉';
  else if (pct >= 80) msg = 'أحسنت! أداؤك رائع! 🌟';
  else if (pct >= 50) msg = 'جيد، واصل التدريب! 💪';
  else msg = 'حاول مرة أخرى وراجع القواعد! 📚';

  document.getElementById('quiz-question').textContent = '';
  document.getElementById('quiz-options').innerHTML = '';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-score').innerHTML =
    `<div class="quiz-result"><span class="big">${score}/${total}</span><p class="msg">${msg}</p><br><button class="btn btn-primary" onclick="startQuiz()">إعادة التدريب 🔄</button></div>`;
  document.getElementById('quiz-nav').innerHTML = '';
}
