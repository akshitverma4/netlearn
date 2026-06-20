/* Flash Cards: flip a card, mark Got it / Review.
 * Uses the merged content layer (built-in + custom). Review cards resurface
 * first; first correct recall of a card awards XP. Learners can add their own
 * cards (saved in localStorage) and delete the ones they added.
 */
(function () {
  "use strict";
  var el = NL.el;

  function render(view, conceptId) {
    var c = NL.conceptById(conceptId);
    if (!c) return;

    var pos = 0;
    var flipped = false;
    var cards = [];   // merged + ordered for this session

    function rebuild() {
      cards = Content.flashcards(conceptId);
      // review cards first, otherwise keep order
      cards.sort(function (a, b) {
        return (Store.isReview(conceptId, a.key) ? 0 : 1) - (Store.isReview(conceptId, b.key) ? 0 : 1);
      });
    }

    view.appendChild(NL.pageHeader(c.icon + " " + c.title + " — Flash Cards",
      "Click the card to flip. Mark how you did, or add your own cards.", "#/concept/" + conceptId));
    view.appendChild(NL.tabBar(conceptId, "flashcards"));

    var toolbar = el("div", { class: "row between toolbar" }, [
      el("span", { class: "muted", id: "fc-count" }),
      el("button", { class: "btn ghost sm", text: "＋ Add card", onClick: showAddForm })
    ]);
    view.appendChild(toolbar);

    var stage = el("div", { class: "fc-stage" });
    view.appendChild(stage);

    function updateCount() {
      document.getElementById("fc-count").textContent = cards.length + " cards in this deck";
    }

    function draw() {
      NL.clear(stage);
      if (!cards.length) { stage.appendChild(el("p", { class: "muted", text: "No cards yet — add one!" })); return; }
      if (pos >= cards.length) pos = cards.length - 1;
      var card = cards[pos];
      var isReview = Store.isReview(conceptId, card.key);

      var inner = el("div", { class: "fc-inner" + (flipped ? " flipped" : "") }, [
        el("div", { class: "fc-face fc-front" }, [
          el("span", { class: "fc-tag", text: "Q" + (card.custom ? " · yours" : "") + (isReview ? " · review" : "") }),
          el("p", { text: card.front }),
          el("span", { class: "fc-hint", text: "click to reveal" })
        ]),
        el("div", { class: "fc-face fc-back" }, [
          el("span", { class: "fc-tag", text: "A" }),
          el("p", { text: card.back })
        ])
      ]);
      var cardEl = el("div", { class: "fc-card", onClick: function () { flipped = !flipped; draw(); } }, [inner]);

      var controls = el("div", { class: "fc-controls" }, [
        el("button", { class: "btn ghost", onClick: prev, text: "‹ Prev" }),
        el("button", { class: "btn bad", onClick: function () { mark(card, false); }, text: "Review again" }),
        el("button", { class: "btn good", onClick: function () { mark(card, true); }, text: "Got it ✓" }),
        el("button", { class: "btn ghost", onClick: next, text: "Next ›" })
      ]);

      stage.appendChild(el("div", { class: "fc-counter", text: (pos + 1) + " / " + cards.length }));
      stage.appendChild(cardEl);
      stage.appendChild(controls);
      if (card.custom) {
        stage.appendChild(el("div", { class: "row end" }, [
          el("button", {
            class: "link-danger", text: "Delete this card",
            onClick: function () {
              Content.deleteCard(conceptId, card.id);
              rebuild(); updateCount();
              if (pos >= cards.length) pos = Math.max(0, cards.length - 1);
              flipped = false; draw();
            }
          })
        ]));
      }
    }

    function mark(card, gotIt) {
      Store.markCard(conceptId, card.key, gotIt);
      if (gotIt) NL.toast("Got it!");
      next();
    }
    function next() { if (pos < cards.length - 1) { pos++; flipped = false; draw(); } else finish(); }
    function prev() { if (pos > 0) { pos--; flipped = false; draw(); } }

    function finish() {
      NL.clear(stage);
      stage.appendChild(el("div", { class: "done-card" }, [
        el("h3", { text: "Deck complete! 🎉" }),
        el("p", { class: "muted", text: "Cards you marked for review will come up first next time." }),
        el("div", { class: "row" }, [
          el("button", { class: "btn", onClick: function () { pos = 0; flipped = false; draw(); }, text: "Restart deck" }),
          el("button", { class: "btn ghost", onClick: showAddForm, text: "＋ Add card" }),
          el("a", { class: "btn ghost", href: "#/concept/" + conceptId + "/quiz", text: "Try the quiz ›" })
        ])
      ]));
    }

    function showAddForm() {
      NL.clear(stage);
      var front = el("textarea", { class: "input", rows: "2", placeholder: "Front (question / term)" });
      var back = el("textarea", { class: "input", rows: "3", placeholder: "Back (answer / definition)" });
      stage.appendChild(el("div", { class: "panel form" }, [
        el("h3", { text: "Add a flash card" }),
        el("label", { class: "field-label", text: "Front" }), front,
        el("label", { class: "field-label", text: "Back" }), back,
        el("div", { class: "row" }, [
          el("button", { class: "btn good", text: "Save card", onClick: function () {
            if (!front.value.trim() || !back.value.trim()) { NL.toast("Fill in both sides"); return; }
            Content.addCard(conceptId, front.value.trim(), back.value.trim());
            NL.toast("Card added");
            rebuild(); updateCount();
            pos = cards.length - 1; flipped = false; draw();
          }}),
          el("button", { class: "btn ghost", text: "Cancel", onClick: function () { draw(); } })
        ])
      ]));
    }

    rebuild();
    updateCount();
    draw();
  }

  window.Features = window.Features || {};
  window.Features.flashcards = render;
})();
