/* Flash Cards: flip a card, mark Got it / Review.
 * Review cards resurface first; first correct recall of a card awards XP.
 */
(function () {
  "use strict";
  var el = NL.el;

  function render(view, conceptId) {
    var c = NL.conceptById(conceptId);
    if (!c) return;

    // Order: review cards first, then the rest, preserving original index.
    var order = c.flashcards.map(function (card, i) { return i; });
    order.sort(function (a, b) {
      var ra = Store.isReview(conceptId, a) ? 0 : 1;
      var rb = Store.isReview(conceptId, b) ? 0 : 1;
      return ra - rb;
    });

    var pos = 0;
    var flipped = false;

    view.appendChild(NL.pageHeader(c.icon + " " + c.title + " — Flash Cards",
      "Click the card to flip. Mark how you did to track mastery.", "#/concept/" + conceptId));
    view.appendChild(NL.tabBar(conceptId, "flashcards"));

    var stage = el("div", { class: "fc-stage" });
    view.appendChild(stage);

    function draw() {
      NL.clear(stage);
      var idx = order[pos];
      var card = c.flashcards[idx];
      var isReview = Store.isReview(conceptId, idx);

      var inner = el("div", { class: "fc-inner" + (flipped ? " flipped" : "") }, [
        el("div", { class: "fc-face fc-front" }, [
          el("span", { class: "fc-tag", text: "Q" + (isReview ? " · review" : "") }),
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
        el("button", {
          class: "btn bad", onClick: function () { mark(idx, false); }, text: "Review again"
        }),
        el("button", {
          class: "btn good", onClick: function () { mark(idx, true); }, text: "Got it ✓"
        }),
        el("button", { class: "btn ghost", onClick: next, text: "Next ›" })
      ]);

      stage.appendChild(el("div", { class: "fc-counter", text: (pos + 1) + " / " + order.length }));
      stage.appendChild(cardEl);
      stage.appendChild(controls);
    }

    function mark(idx, gotIt) {
      Store.markCard(conceptId, idx, gotIt);
      if (gotIt) NL.toast("Got it!");
      next();
    }
    function next() { if (pos < order.length - 1) { pos++; flipped = false; draw(); } else finish(); }
    function prev() { if (pos > 0) { pos--; flipped = false; draw(); } }

    function finish() {
      NL.clear(stage);
      stage.appendChild(el("div", { class: "done-card" }, [
        el("h3", { text: "Deck complete! 🎉" }),
        el("p", { class: "muted", text: "Cards you marked for review will come up first next time." }),
        el("div", { class: "row" }, [
          el("button", { class: "btn", onClick: function () { pos = 0; flipped = false; draw(); }, text: "Restart deck" }),
          el("a", { class: "btn ghost", href: "#/concept/" + conceptId + "/quiz", text: "Try the quiz ›" })
        ])
      ]));
    }

    draw();
  }

  window.Features = window.Features || {};
  window.Features.flashcards = render;
})();
