/* Interactive multiple-choice engine, reused by Quiz and Scenarios.
 * Instant feedback + explanation per question, running score, XP on finish.
 *   mode: "quiz" reads concept.quiz with field `q`
 *         "scenarios" reads concept.scenarios with field `situation`
 */
(function () {
  "use strict";
  var el = NL.el;

  function run(view, conceptId, mode) {
    var c = NL.conceptById(conceptId);
    if (!c) return;
    var items = (mode === "scenarios" ? c.scenarios : c.quiz) || [];
    var promptField = mode === "scenarios" ? "situation" : "q";
    var titleWord = mode === "scenarios" ? "Scenarios" : "Quiz";
    var sub = mode === "scenarios"
      ? "Real support situations — pick the best action."
      : "Choose the correct answer. You'll see why after each one.";

    view.appendChild(NL.pageHeader(c.icon + " " + c.title + " — " + titleWord, sub, "#/concept/" + conceptId));
    view.appendChild(NL.tabBar(conceptId, mode));

    var stage = el("div", { class: "quiz-stage" });
    view.appendChild(stage);

    var pos = 0, correct = 0, answered = false;

    function draw() {
      NL.clear(stage);
      var item = items[pos];
      stage.appendChild(NL.progressBar((pos / items.length) * 100));
      stage.appendChild(el("div", { class: "quiz-counter", text: "Question " + (pos + 1) + " of " + items.length +
        "   ·   Score " + correct + "/" + items.length }));
      stage.appendChild(el("div", { class: "quiz-q", text: item[promptField] }));

      var choiceWrap = el("div", { class: "choices" });
      item.choices.forEach(function (choice, idx) {
        var btn = el("button", { class: "choice", text: choice, onClick: function () { pick(idx, btn, item); } });
        choiceWrap.appendChild(btn);
      });
      stage.appendChild(choiceWrap);

      var feedback = el("div", { class: "feedback", id: "qfeedback" });
      stage.appendChild(feedback);
    }

    function pick(idx, btn, item) {
      if (answered) return;
      answered = true;
      var buttons = stage.querySelectorAll(".choice");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (i === item.answer) buttons[i].classList.add("correct");
      }
      var right = idx === item.answer;
      if (right) { correct++; } else { btn.classList.add("wrong"); }

      var fb = document.getElementById("qfeedback");
      fb.className = "feedback show " + (right ? "ok" : "no");
      fb.appendChild(el("strong", { text: right ? "Correct! " : "Not quite. " }));
      fb.appendChild(el("span", { text: item.explain }));
      fb.appendChild(el("div", { class: "row end" }, [
        el("button", {
          class: "btn", text: pos < items.length - 1 ? "Next ›" : "See results",
          onClick: nextQ
        })
      ]));
    }

    function nextQ() {
      if (pos < items.length - 1) { pos++; answered = false; draw(); }
      else finish();
    }

    function finish() {
      var pct = Math.round((correct / items.length) * 100);
      if (mode === "scenarios") Store.recordScenario(conceptId, pct);
      else Store.recordQuiz(conceptId, pct);

      NL.clear(stage);
      stage.appendChild(el("div", { class: "done-card" }, [
        el("div", { class: "big-score", text: pct + "%" }),
        el("p", { text: "You got " + correct + " of " + items.length + " correct." }),
        el("p", { class: "muted", text: pct >= 80 ? "Strong work — that counts toward mastery." :
          "Review the diagram and flashcards, then try again to raise your best score." }),
        el("div", { class: "row" }, [
          el("button", { class: "btn", onClick: function () { pos = 0; correct = 0; answered = false; draw(); }, text: "Try again" }),
          el("a", { class: "btn ghost", href: "#/concept/" + conceptId, text: "Back to concept" })
        ])
      ]));
    }

    draw();
  }

  window.Features = window.Features || {};
  window.Features.quiz = function (view, id) { run(view, id, "quiz"); };
  window.Features.scenarios = function (view, id) { run(view, id, "scenarios"); };
})();
