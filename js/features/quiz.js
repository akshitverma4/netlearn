/* Interactive multiple-choice engine, reused by Quiz and Scenarios.
 * Quiz mode reads the merged content layer (built-in + custom) and lets the
 * learner add / delete their own questions. Scenarios mode reads the built-in
 * situation set. Instant feedback + explanation per question, XP on finish.
 */
(function () {
  "use strict";
  var el = NL.el;

  function run(view, conceptId, mode) {
    var c = NL.conceptById(conceptId);
    if (!c) return;
    var isQuiz = mode !== "scenarios";
    var promptField = isQuiz ? "q" : "situation";
    var titleWord = isQuiz ? "Quiz" : "Scenarios";
    var sub = isQuiz
      ? "Choose the correct answer. You'll see why after each one."
      : "Real support situations — pick the best action.";

    function items() { return isQuiz ? Content.quiz(conceptId) : (c.scenarios || []); }

    view.appendChild(NL.pageHeader(c.icon + " " + c.title + " — " + titleWord, sub, "#/concept/" + conceptId));
    view.appendChild(NL.tabBar(conceptId, mode));

    if (isQuiz) {
      view.appendChild(el("div", { class: "row between toolbar" }, [
        el("span", { class: "muted", id: "q-count" }),
        el("span", { class: "row" }, [
          el("button", { class: "btn ghost sm", text: "Manage", onClick: manage }),
          el("button", { class: "btn ghost sm", text: "＋ Add question", onClick: showAddForm })
        ])
      ]));
    }

    var stage = el("div", { class: "quiz-stage" });
    view.appendChild(stage);

    var pos = 0, correct = 0, answered = false, list = items();

    function setCount() { var n = document.getElementById("q-count"); if (n) n.textContent = list.length + " questions"; }

    function draw() {
      list = items();
      setCount();
      NL.clear(stage);
      if (!list.length) { stage.appendChild(el("p", { class: "muted", text: "No questions yet — add one!" })); return; }
      if (pos >= list.length) pos = 0;
      var item = list[pos];
      stage.appendChild(NL.progressBar((pos / list.length) * 100));
      stage.appendChild(el("div", { class: "quiz-counter", text: "Question " + (pos + 1) + " of " + list.length +
        "   ·   Score " + correct + "/" + list.length + (item.custom ? "   ·   (your question)" : "") }));
      stage.appendChild(el("div", { class: "quiz-q", text: item[promptField] }));

      var choiceWrap = el("div", { class: "choices" });
      item.choices.forEach(function (choice, idx) {
        var btn = el("button", { class: "choice", text: choice, onClick: function () { pick(idx, btn, item); } });
        choiceWrap.appendChild(btn);
      });
      stage.appendChild(choiceWrap);
      stage.appendChild(el("div", { class: "feedback", id: "qfeedback" }));
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
      if (right) correct++; else btn.classList.add("wrong");

      var fb = document.getElementById("qfeedback");
      fb.className = "feedback show " + (right ? "ok" : "no");
      fb.appendChild(el("strong", { text: right ? "Correct! " : "Not quite. " }));
      if (item.explain) fb.appendChild(el("span", { text: item.explain }));
      fb.appendChild(el("div", { class: "row end" }, [
        el("button", { class: "btn", text: pos < list.length - 1 ? "Next ›" : "See results", onClick: nextQ })
      ]));
    }

    function nextQ() {
      if (pos < list.length - 1) { pos++; answered = false; draw(); }
      else finish();
    }

    function finish() {
      var pct = Math.round((correct / list.length) * 100);
      if (isQuiz) Store.recordQuiz(conceptId, pct); else Store.recordScenario(conceptId, pct);
      NL.clear(stage);
      stage.appendChild(el("div", { class: "done-card" }, [
        el("div", { class: "big-score", text: pct + "%" }),
        el("p", { text: "You got " + correct + " of " + list.length + " correct." }),
        el("p", { class: "muted", text: pct >= 80 ? "Strong work — that counts toward mastery." :
          "Review the diagram and flashcards, then try again to raise your best score." }),
        el("div", { class: "row" }, [
          el("button", { class: "btn", onClick: function () { pos = 0; correct = 0; answered = false; draw(); }, text: "Try again" }),
          el("a", { class: "btn ghost", href: "#/concept/" + conceptId, text: "Back to concept" })
        ])
      ]));
    }

    /* ---- custom question authoring (quiz mode only) ---- */
    function showAddForm() {
      NL.clear(stage);
      var q = el("textarea", { class: "input", rows: "2", placeholder: "Question text" });
      var choiceInputs = [0, 1, 2, 3].map(function (i) {
        return el("input", { class: "input", type: "text", placeholder: "Choice " + (i + 1) + (i < 2 ? " (required)" : " (optional)") });
      });
      var correctSel = el("select", { class: "input" }, [0, 1, 2, 3].map(function (i) {
        return el("option", { value: i, text: "Choice " + (i + 1) });
      }));
      var explain = el("textarea", { class: "input", rows: "2", placeholder: "Explanation (optional)" });

      var rows = choiceInputs.map(function (inp, i) {
        return el("div", { class: "choice-row" }, [el("span", { class: "choice-n", text: (i + 1) }), inp]);
      });

      stage.appendChild(el("div", { class: "panel form" }, [
        el("h3", { text: "Add a quiz question" }),
        el("label", { class: "field-label", text: "Question" }), q,
        el("label", { class: "field-label", text: "Choices" })
      ].concat(rows).concat([
        el("label", { class: "field-label", text: "Correct answer" }), correctSel,
        el("label", { class: "field-label", text: "Explanation" }), explain,
        el("div", { class: "row" }, [
          el("button", { class: "btn good", text: "Save question", onClick: function () {
            var choices = choiceInputs.map(function (x) { return x.value.trim(); });
            var ans = parseInt(correctSel.value, 10);
            if (!choices[ans]) { NL.toast("The correct choice can't be empty"); return; }
            if (!Content.addQuiz(conceptId, q.value.trim(), choices, ans, explain.value.trim())) {
              NL.toast("Need a question and at least 2 choices"); return;
            }
            NL.toast("Question added");
            pos = 0; correct = 0; answered = false; draw();
          }}),
          el("button", { class: "btn ghost", text: "Cancel", onClick: function () { pos = 0; correct = 0; answered = false; draw(); } })
        ])
      ])));
    }

    function manage() {
      NL.clear(stage);
      var customs = Content.quiz(conceptId).filter(function (x) { return x.custom; });
      var body = customs.length
        ? el("div", {}, customs.map(function (x) {
            return el("div", { class: "manage-row" }, [
              el("span", { class: "manage-q", text: x.q }),
              el("button", { class: "link-danger", text: "Delete", onClick: function () {
                Content.deleteQuiz(conceptId, x.id); NL.toast("Deleted"); manage();
              }})
            ]);
          }))
        : el("p", { class: "muted", text: "You haven't added any custom questions for this concept yet." });
      stage.appendChild(el("div", { class: "panel" }, [
        el("h3", { text: "Your custom questions" }), body,
        el("div", { class: "row" }, [
          el("button", { class: "btn ghost", text: "＋ Add question", onClick: showAddForm }),
          el("button", { class: "btn", text: "Back to quiz", onClick: function () { pos = 0; correct = 0; answered = false; draw(); } })
        ])
      ]));
    }

    draw();
  }

  window.Features = window.Features || {};
  window.Features.quiz = function (view, id) { run(view, id, "quiz"); };
  window.Features.scenarios = function (view, id) { run(view, id, "scenarios"); };
})();
