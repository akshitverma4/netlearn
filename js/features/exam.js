/* CCNA Exam Simulator — timed mock exam scoped to the CCNA 200-301 track.
 * ~100 questions drawn across all CCNA topics, no per-question feedback, a
 * countdown timer, a pass mark (~82%, matching the ~825/1000 real cut score),
 * and a detailed results report: pass/fail, per-domain breakdown, and a full
 * review of every question with the correct answer + explanation.
 */
(function () {
  "use strict";
  var el = NL.el, shuffle = NL.shuffle;

  var DEFAULT_COUNT = 100;
  var MINUTES = 120;        // real exam is ~120 min
  var PASS_PCT = 82;        // ~825/1000

  // Pool: quiz + scenarios from every CCNA-track concept (incl. custom quiz).
  function buildPool() {
    var pool = [];
    window.CONCEPTS.filter(function (c) { return c.track === "CCNA"; }).forEach(function (c) {
      Content.quiz(c.id).forEach(function (q) {
        pool.push({ concept: c.title, prompt: q.q, choices: q.choices, answer: q.answer, explain: q.explain });
      });
      (c.scenarios || []).forEach(function (s) {
        pool.push({ concept: c.title, prompt: s.situation, choices: s.choices, answer: s.answer, explain: s.explain });
      });
    });
    return pool;
  }

  function render(view) {
    view.appendChild(NL.pageHeader("🎓 CCNA Exam Simulator",
      "A timed mock of the CCNA 200-301 exam, drawn from all CCNA topics.", "#/home"));

    var poolSize = buildPool().length;
    var count = Math.min(DEFAULT_COUNT, poolSize);

    view.appendChild(el("div", { class: "panel" }, [
      el("div", { class: "exam-meta" }, [
        examStat(count, "questions"),
        examStat(MINUTES + " min", "time limit"),
        examStat(PASS_PCT + "%", "pass mark"),
        examStat(Store.bestExam() + "%", "your best")
      ]),
      el("ul", { class: "takeaways" }, [
        el("li", { text: "Questions are drawn randomly from all 9 CCNA topics (and any custom questions you've added)." }),
        el("li", { text: "No feedback during the exam — just like the real thing. You can flag and revisit questions." }),
        el("li", { text: "At the end you get a pass/fail, a per-topic breakdown, and a full answer review." })
      ]),
      el("div", { class: "row" }, [
        el("button", { class: "btn lg", text: "Start exam", onClick: function () { start(count); } }),
        el("a", { class: "btn ghost", href: "#/test", text: "Shorter knowledge test ›" })
      ])
    ]));
  }

  function examStat(val, label) {
    return el("div", { class: "stat" }, [el("span", { class: "stat-val", text: val }), el("span", { class: "stat-label", text: label })]);
  }

  function start(count) {
    var view = document.getElementById("view");
    var questions = shuffle(buildPool()).slice(0, count);
    var answers = new Array(questions.length).fill(-1);
    var flagged = {};
    var pos = 0;
    var remaining = MINUTES * 60;
    var timer = null;

    NL.clear(view);
    view.appendChild(NL.pageHeader("🎓 CCNA Exam Simulator", "", "#/home"));
    var bar = el("div", { class: "exam-top" });
    var timeEl = el("span", { class: "timer" });
    bar.appendChild(timeEl);
    bar.appendChild(el("span", { class: "muted", id: "exam-count" }));
    view.appendChild(bar);
    var stage = el("div", { class: "quiz-stage" });
    view.appendChild(stage);
    var navWrap = el("div", { class: "exam-grid-wrap" });
    view.appendChild(navWrap);

    function renderTime() {
      var m = Math.floor(remaining / 60), s = remaining % 60;
      timeEl.textContent = "⏱ " + m + ":" + (s < 10 ? "0" : "") + s;
      timeEl.classList.toggle("low", remaining <= 300);
    }
    timer = setInterval(function () {
      remaining--; renderTime();
      if (remaining <= 0) { clearInterval(timer); finish(true); }
    }, 1000);
    renderTime();

    function answeredCount() { return answers.filter(function (a) { return a >= 0; }).length; }

    function draw() {
      NL.clear(stage);
      document.getElementById("exam-count").textContent =
        "Q " + (pos + 1) + " / " + questions.length + "   ·   " + answeredCount() + " answered";
      var q = questions[pos];
      stage.appendChild(NL.progressBar((pos / questions.length) * 100));
      stage.appendChild(el("div", { class: "row between" }, [
        el("span", { class: "pill", text: q.concept }),
        el("button", {
          class: "flag-btn" + (flagged[pos] ? " on" : ""),
          text: flagged[pos] ? "⚑ Flagged" : "⚐ Flag",
          onClick: function () { flagged[pos] = !flagged[pos]; draw(); drawGrid(); }
        })
      ]));
      stage.appendChild(el("div", { class: "quiz-q", text: q.prompt }));
      var wrap = el("div", { class: "choices" });
      q.choices.forEach(function (choice, idx) {
        wrap.appendChild(el("button", {
          class: "choice" + (answers[pos] === idx ? " picked" : ""), text: choice,
          onClick: function () { answers[pos] = idx; draw(); drawGrid(); }
        }));
      });
      stage.appendChild(wrap);
      stage.appendChild(el("div", { class: "row between" }, [
        el("button", { class: "btn ghost", text: "‹ Prev", disabled: pos === 0 ? "" : null, onClick: function () { if (pos > 0) { pos--; draw(); } } }),
        pos < questions.length - 1
          ? el("button", { class: "btn", text: "Next ›", onClick: function () { pos++; draw(); } })
          : el("button", { class: "btn good", text: "Finish & submit", onClick: confirmFinish })
      ]));
    }

    // jump-grid of all questions (answered / flagged / current)
    function drawGrid() {
      NL.clear(navWrap);
      navWrap.appendChild(el("div", { class: "muted exam-grid-label", text: "Jump to question:" }));
      var grid = el("div", { class: "exam-grid" });
      questions.forEach(function (q, i) {
        var cls = "exam-cell";
        if (i === pos) cls += " current";
        else if (flagged[i]) cls += " flagged";
        else if (answers[i] >= 0) cls += " done";
        grid.appendChild(el("button", { class: cls, text: (i + 1), onClick: function () { pos = i; draw(); drawGrid(); } }));
      });
      navWrap.appendChild(grid);
      navWrap.appendChild(el("div", { class: "row" }, [
        el("button", { class: "btn good", text: "Finish & submit", onClick: confirmFinish })
      ]));
    }

    function confirmFinish() {
      var un = questions.length - answeredCount();
      var msg = un > 0 ? ("You have " + un + " unanswered question(s). Submit anyway?") : "Submit your exam?";
      if (confirm(msg)) { clearInterval(timer); finish(false); }
    }

    function finish(timedOut) {
      var correct = 0, perTopic = {};
      questions.forEach(function (q, i) {
        perTopic[q.concept] = perTopic[q.concept] || { right: 0, total: 0 };
        perTopic[q.concept].total++;
        if (answers[i] === q.answer) { correct++; perTopic[q.concept].right++; }
      });
      var pct = Math.round((correct / questions.length) * 100);
      var passed = pct >= PASS_PCT;
      Store.recordExam(pct);

      NL.clear(view);
      view.appendChild(NL.pageHeader("🎓 Exam Results", "", "#/home"));
      view.appendChild(el("div", { class: "done-card " + (passed ? "pass" : "fail") }, [
        el("div", { class: "verdict", text: passed ? "PASS ✅" : "NOT YET ❌" }),
        el("div", { class: "big-score", text: pct + "%" }),
        el("p", { text: correct + " / " + questions.length + " correct" + (timedOut ? "  · time expired" : "") }),
        el("p", { class: "muted", text: passed
          ? "Above the " + PASS_PCT + "% pass mark — you're tracking well for the real CCNA 200-301."
          : "Pass mark is " + PASS_PCT + "%. Focus on the weak topics below and retake." })
      ]));

      // per-topic breakdown
      var rows = Object.keys(perTopic).sort().map(function (name) {
        var d = perTopic[name], p = Math.round((d.right / d.total) * 100);
        var row = el("div", { class: "breakdown-row" }, [
          el("span", { class: "breakdown-name", text: name }),
          NL.progressBar(p),
          el("span", { class: "breakdown-pct", text: d.right + "/" + d.total })
        ]);
        return row;
      });
      view.appendChild(el("div", { class: "panel" }, [el("h3", { text: "By topic" })].concat(rows)));

      // full answer review
      var reviewBody = el("div", { class: "review-list" });
      questions.forEach(function (q, i) {
        var right = answers[i] === q.answer;
        var yourTxt = answers[i] >= 0 ? q.choices[answers[i]] : "(no answer)";
        reviewBody.appendChild(el("div", { class: "review-item " + (right ? "ok" : "no") }, [
          el("div", { class: "review-q" }, [el("span", { class: "pill", text: q.concept }), el("span", { text: " " + (i + 1) + ". " + q.prompt })]),
          el("div", { class: "review-line", html: (right ? "✔ " : "✗ ") + "<strong>Your answer:</strong> " + esc(yourTxt) }),
          right ? null : el("div", { class: "review-line good-text", html: "<strong>Correct:</strong> " + esc(q.choices[q.answer]) }),
          el("div", { class: "review-line muted", text: q.explain })
        ]));
      });
      var reviewPanel = el("div", { class: "panel" }, [
        el("div", { class: "row between" }, [
          el("h3", { text: "Answer review" }),
          el("button", { class: "btn ghost sm", text: "Show/Hide", onClick: function () { reviewBody.classList.toggle("collapsed"); } })
        ]),
        reviewBody
      ]);
      view.appendChild(reviewPanel);

      view.appendChild(el("div", { class: "row" }, [
        el("button", { class: "btn", text: "Retake exam", onClick: function () { Router.resolve(); } }),
        el("a", { class: "btn ghost", href: "#/home", text: "Home" })
      ]));
      window.scrollTo(0, 0);
    }

    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    draw();
    drawGrid();
  }

  window.Features = window.Features || {};
  window.Features.exam = render;
})();
