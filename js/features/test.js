/* Knowledge Test: timed, cross-concept exam.
 * Pulls a mix of quiz + scenario questions from every concept, no per-question
 * feedback, then shows a scored report with per-concept breakdown and weak-area
 * suggestions.
 */
(function () {
  "use strict";
  var el = NL.el, shuffle = NL.shuffle;

  var QUESTION_COUNT = 15;
  var SECONDS_PER_Q = 30;

  function buildPool() {
    var pool = [];
    window.CONCEPTS.forEach(function (c) {
      Content.quiz(c.id).forEach(function (q) {
        pool.push({ conceptId: c.id, concept: c.title, prompt: q.q, choices: q.choices, answer: q.answer, explain: q.explain });
      });
      (c.scenarios || []).forEach(function (s) {
        pool.push({ conceptId: c.id, concept: c.title, prompt: s.situation, choices: s.choices, answer: s.answer, explain: s.explain });
      });
    });
    return pool;
  }

  function render(view) {
    view.appendChild(NL.pageHeader("📝 Knowledge Test",
      "Timed exam across all concepts. No feedback until the end — just like the real thing.", "#/home"));

    var intro = el("div", { class: "panel" }, [
      el("p", { html: "<strong>" + QUESTION_COUNT + " questions</strong> drawn from every concept." }),
      el("p", { html: "Timer: <strong>" + (QUESTION_COUNT * SECONDS_PER_Q) + " seconds</strong> total (~" + SECONDS_PER_Q + "s each)." }),
      el("p", { class: "muted", text: "Your best test score: " + Store.bestTest() + "%" }),
      el("button", { class: "btn lg", text: "Start test", onClick: start })
    ]);
    view.appendChild(intro);

    function start() {
      var questions = shuffle(buildPool()).slice(0, QUESTION_COUNT);
      var answers = new Array(questions.length).fill(-1);
      var pos = 0;
      var remaining = QUESTION_COUNT * SECONDS_PER_Q;
      var timer = null;

      NL.clear(view);
      view.appendChild(NL.pageHeader("📝 Knowledge Test", "", "#/home"));
      var bar = el("div", { class: "exam-top" });
      var timeEl = el("span", { class: "timer" });
      bar.appendChild(timeEl);
      bar.appendChild(el("span", { class: "muted", id: "exam-count" }));
      view.appendChild(bar);
      var stage = el("div", { class: "quiz-stage" });
      view.appendChild(stage);

      function tick() {
        remaining--;
        renderTime();
        if (remaining <= 0) { clearInterval(timer); finish(); }
      }
      function renderTime() {
        var m = Math.floor(remaining / 60), s = remaining % 60;
        timeEl.textContent = "⏱ " + m + ":" + (s < 10 ? "0" : "") + s;
        timeEl.classList.toggle("low", remaining <= 30);
      }
      timer = setInterval(tick, 1000);
      renderTime();

      function draw() {
        NL.clear(stage);
        document.getElementById("exam-count").textContent = "Q " + (pos + 1) + " / " + questions.length;
        var q = questions[pos];
        stage.appendChild(NL.progressBar((pos / questions.length) * 100));
        stage.appendChild(el("span", { class: "pill", text: q.concept }));
        stage.appendChild(el("div", { class: "quiz-q", text: q.prompt }));
        var wrap = el("div", { class: "choices" });
        q.choices.forEach(function (choice, idx) {
          var btn = el("button", {
            class: "choice" + (answers[pos] === idx ? " picked" : ""), text: choice,
            onClick: function () { answers[pos] = idx; draw(); }
          });
          wrap.appendChild(btn);
        });
        stage.appendChild(wrap);
        stage.appendChild(el("div", { class: "row between" }, [
          el("button", { class: "btn ghost", text: "‹ Prev", disabled: pos === 0 ? "" : null, onClick: function () { if (pos > 0) { pos--; draw(); } } }),
          pos < questions.length - 1
            ? el("button", { class: "btn", text: "Next ›", onClick: function () { pos++; draw(); } })
            : el("button", { class: "btn good", text: "Finish test", onClick: function () { clearInterval(timer); finish(); } })
        ]));
      }

      function finish() {
        var correct = 0;
        var perConcept = {};
        questions.forEach(function (q, i) {
          perConcept[q.concept] = perConcept[q.concept] || { right: 0, total: 0 };
          perConcept[q.concept].total++;
          if (answers[i] === q.answer) { correct++; perConcept[q.concept].right++; }
        });
        var pct = Math.round((correct / questions.length) * 100);
        Store.recordTest(pct);

        NL.clear(view);
        view.appendChild(NL.pageHeader("📝 Test Results", "", "#/home"));
        view.appendChild(el("div", { class: "done-card" }, [
          el("div", { class: "big-score", text: pct + "%" }),
          el("p", { text: "You scored " + correct + " / " + questions.length + (remaining <= 0 ? "  (time expired)" : "") }),
          el("p", { class: "muted", text: pct >= 80 ? "Excellent — exam-ready!" : pct >= 60 ? "Good — a bit more revision will get you there." : "Keep studying the weak areas below." })
        ]));

        // per-concept breakdown + weak areas
        var rows = Object.keys(perConcept).map(function (name) {
          var d = perConcept[name];
          var p = Math.round((d.right / d.total) * 100);
          return el("div", { class: "breakdown-row" }, [
            el("span", { class: "breakdown-name", text: name }),
            NL.progressBar(p),
            el("span", { class: "breakdown-pct", text: d.right + "/" + d.total })
          ]);
        });
        view.appendChild(el("div", { class: "panel" }, [el("h3", { text: "By concept" })].concat(rows)));

        var weak = Object.keys(perConcept).filter(function (n) {
          var d = perConcept[n]; return (d.right / d.total) < 0.6;
        });
        if (weak.length) {
          view.appendChild(el("div", { class: "panel warn" }, [
            el("h3", { text: "Suggested focus areas" }),
            el("ul", {}, weak.map(function (n) {
              var c = window.CONCEPTS.filter(function (x) { return x.title === n; })[0];
              return el("li", {}, [
                el("a", { href: "#/concept/" + (c ? c.id : ""), text: n }),
                el("span", { text: " — revisit flashcards & diagram" })
              ]);
            }))
          ]));
        }

        view.appendChild(el("div", { class: "row" }, [
          el("button", { class: "btn", text: "Retake test", onClick: function () { Router.resolve(); } }),
          el("a", { class: "btn ghost", href: "#/home", text: "Home" })
        ]));
      }

      draw();
    }
  }

  window.Features = window.Features || {};
  window.Features.test = render;
})();
