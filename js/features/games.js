/* Games: three lightweight engines populated from the concept data model.
 *   match    — tap a term then its definition; clear all pairs.
 *   sort     — assign each item to the correct bucket.
 *   sequence — reorder shuffled steps into the right order (move up/down).
 * Also renders the per-concept "game" tab and the cross-concept Games hub.
 */
(function () {
  "use strict";
  var el = NL.el, shuffle = NL.shuffle;

  /* ----------------------------------------------------------- MATCH */
  function matchGame(stage, conceptId, pairs, onDone) {
    NL.clear(stage);
    stage.appendChild(el("p", { class: "muted", text: "Tap a term, then its matching partner. Clear the board to win." }));
    var left = shuffle(pairs.map(function (p, i) { return { txt: p.a, id: i }; }));
    var right = shuffle(pairs.map(function (p, i) { return { txt: p.b, id: i }; }));
    var board = el("div", { class: "match-board" });
    var colA = el("div", { class: "match-col" });
    var colB = el("div", { class: "match-col" });
    board.appendChild(colA); board.appendChild(colB);
    stage.appendChild(board);
    var status = el("div", { class: "game-status", text: "0 / " + pairs.length + " matched" });
    stage.appendChild(status);

    var selected = null, matched = 0, mistakes = 0;

    function tileClick(tile, item, col) {
      if (tile.classList.contains("matched")) return;
      if (!selected) { selected = { tile: tile, item: item, col: col }; tile.classList.add("sel"); return; }
      if (selected.tile === tile) { tile.classList.remove("sel"); selected = null; return; }
      if (selected.col === col) { // re-pick within same column
        selected.tile.classList.remove("sel"); selected = { tile: tile, item: item, col: col }; tile.classList.add("sel"); return;
      }
      // attempt match
      if (selected.item.id === item.id) {
        tile.classList.add("matched"); selected.tile.classList.add("matched");
        tile.classList.remove("sel"); selected.tile.classList.remove("sel");
        selected = null; matched++;
        status.textContent = matched + " / " + pairs.length + " matched";
        if (matched === pairs.length) win();
      } else {
        var a = selected.tile, b = tile; mistakes++;
        a.classList.add("miss"); b.classList.add("miss"); a.classList.remove("sel");
        setTimeout(function () { a.classList.remove("miss"); b.classList.remove("miss"); }, 500);
        selected = null;
      }
    }

    function win() {
      Store.recordGame(conceptId, mistakes <= 1);
      NL.xpToast(mistakes <= 1 ? 15 : 5);
      status.textContent = "Cleared! " + (mistakes === 0 ? "Perfect — no mistakes! 🌟" : mistakes + " mistake(s).");
      if (onDone) onDone();
    }

    left.forEach(function (item) {
      var t = el("button", { class: "tile", text: item.txt });
      t.addEventListener("click", function () { tileClick(t, item, "a"); });
      colA.appendChild(t);
    });
    right.forEach(function (item) {
      var t = el("button", { class: "tile", text: item.txt });
      t.addEventListener("click", function () { tileClick(t, item, "b"); });
      colB.appendChild(t);
    });
  }

  /* ----------------------------------------------------------- SORT */
  function sortGame(stage, conceptId, cfg, onDone) {
    NL.clear(stage);
    stage.appendChild(el("p", { class: "muted", text: cfg.prompt }));
    var bucketNames = Object.keys(cfg.buckets);
    var answer = {}; // item -> correct bucket
    var allItems = [];
    bucketNames.forEach(function (b) {
      cfg.buckets[b].forEach(function (it) { answer[it] = b; allItems.push(it); });
    });

    var pool = el("div", { class: "sort-pool" });
    var poolWrap = el("div", { class: "panel" }, [el("h4", { text: "Items" }), pool]);
    var placed = {}; // item -> chosen bucket

    var bucketEls = {};
    var bucketsWrap = el("div", { class: "sort-buckets" });
    bucketNames.forEach(function (name) {
      var drop = el("div", { class: "bucket-drop" });
      bucketEls[name] = drop;
      bucketsWrap.appendChild(el("div", { class: "bucket" }, [el("h4", { text: name }), drop]));
    });

    var selectedItem = null;
    function makeChip(item) {
      var chip = el("button", { class: "chip", text: item });
      chip.addEventListener("click", function () {
        if (selectedItem && selectedItem.chip === chip) { chip.classList.remove("sel"); selectedItem = null; return; }
        if (selectedItem) selectedItem.chip.classList.remove("sel");
        selectedItem = { chip: chip, item: item }; chip.classList.add("sel");
      });
      return chip;
    }

    shuffle(allItems).forEach(function (it) { pool.appendChild(makeChip(it)); });

    bucketNames.forEach(function (name) {
      bucketEls[name].addEventListener("click", function () {
        if (!selectedItem) return;
        placed[selectedItem.item] = name;
        selectedItem.chip.classList.remove("sel");
        bucketEls[name].appendChild(selectedItem.chip);
        selectedItem = null;
      });
    });

    var status = el("div", { class: "game-status" });
    var checkBtn = el("button", { class: "btn", text: "Check answers", onClick: function () {
      var correct = 0;
      allItems.forEach(function (it) {
        // find the chip element by text within buckets
        var ok = placed[it] === answer[it];
        if (ok) correct++;
      });
      // colourize chips
      Array.prototype.forEach.call(bucketsWrap.querySelectorAll(".chip"), function (chip) {
        var it = chip.textContent;
        chip.classList.remove("sel");
        chip.classList.toggle("right", placed[it] === answer[it]);
        chip.classList.toggle("wrong", placed[it] !== answer[it]);
      });
      var allPlaced = allItems.every(function (it) { return placed[it]; });
      if (!allPlaced) { status.textContent = "Place every item first."; return; }
      var pct = Math.round((correct / allItems.length) * 100);
      status.textContent = correct + " / " + allItems.length + " correct (" + pct + "%).";
      Store.recordGame(conceptId, pct === 100);
      NL.xpToast(pct === 100 ? 15 : 5);
      if (onDone) onDone();
    }});

    stage.appendChild(el("div", { class: "two-col" }, [poolWrap, bucketsWrap]));
    stage.appendChild(el("div", { class: "row" }, [checkBtn]));
    stage.appendChild(status);
  }

  /* -------------------------------------------------------- SEQUENCE */
  function sequenceGame(stage, conceptId, cfg, onDone) {
    NL.clear(stage);
    stage.appendChild(el("p", { class: "muted", text: cfg.prompt + " Use the arrows to reorder, then check." }));
    var correctOrder = cfg.items.slice();
    var order = shuffle(cfg.items.slice());
    // avoid an accidentally-correct shuffle
    if (order.join("|") === correctOrder.join("|") && order.length > 1) { order.reverse(); }

    var list = el("div", { class: "seq-list" });
    var status = el("div", { class: "game-status" });

    function draw() {
      NL.clear(list);
      order.forEach(function (item, i) {
        var row = el("div", { class: "seq-item" }, [
          el("span", { class: "seq-num", text: (i + 1) }),
          el("span", { class: "seq-text", text: item }),
          el("span", { class: "seq-btns" }, [
            el("button", { class: "mini", text: "↑", disabled: i === 0 ? "" : null, onClick: function () { swap(i, i - 1); } }),
            el("button", { class: "mini", text: "↓", disabled: i === order.length - 1 ? "" : null, onClick: function () { swap(i, i + 1); } })
          ])
        ]);
        list.appendChild(row);
      });
    }
    function swap(a, b) { var t = order[a]; order[a] = order[b]; order[b] = t; draw(); }

    var checkBtn = el("button", { class: "btn", text: "Check order", onClick: function () {
      var rows = list.querySelectorAll(".seq-item");
      var correct = 0;
      order.forEach(function (item, i) {
        var ok = item === correctOrder[i];
        if (ok) correct++;
        rows[i].classList.toggle("right", ok);
        rows[i].classList.toggle("wrong", !ok);
      });
      var win = correct === correctOrder.length;
      status.textContent = win ? "Perfect order! 🌟" : correct + " / " + correctOrder.length + " in the right place.";
      Store.recordGame(conceptId, win);
      NL.xpToast(win ? 15 : 5);
      if (onDone) onDone();
    }});

    stage.appendChild(list);
    stage.appendChild(el("div", { class: "row" }, [checkBtn]));
    stage.appendChild(status);
    draw();
  }

  /* -------------------------------------------- per-concept game tab */
  function gamesFor(concept) {
    var g = concept.games || {};
    var list = [];
    if (g.match) list.push({ key: "match", label: "Match" });
    if (g.sort) list.push({ key: "sort", label: "Sort It" });
    if (g.sequence) list.push({ key: "sequence", label: "Sequence" });
    return list;
  }

  function renderConceptGame(view, conceptId) {
    var c = NL.conceptById(conceptId);
    if (!c) return;
    view.appendChild(NL.pageHeader(c.icon + " " + c.title + " — Game",
      "Quick games to lock in the facts.", "#/concept/" + conceptId));
    view.appendChild(NL.tabBar(conceptId, "game"));

    var available = gamesFor(c);
    if (!available.length) {
      view.appendChild(el("div", { class: "panel", text: "No game for this concept yet — try the quiz or scenarios." }));
      return;
    }

    var chooser = el("div", { class: "seg" }, available.map(function (gm, i) {
      return el("button", { class: "seg-btn" + (i === 0 ? " active" : ""), text: gm.label, "data-key": gm.key });
    }));
    var stage = el("div", { class: "game-stage" });
    view.appendChild(chooser);
    view.appendChild(stage);

    function launch(key) {
      if (key === "match") matchGame(stage, conceptId, c.games.match);
      else if (key === "sort") sortGame(stage, conceptId, c.games.sort);
      else if (key === "sequence") sequenceGame(stage, conceptId, c.games.sequence);
    }
    Array.prototype.forEach.call(chooser.children, function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(chooser.children, function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        launch(btn.getAttribute("data-key"));
      });
    });
    launch(available[0].key);
  }

  /* ----------------------------------------------- cross-concept hub */
  function renderHub(view) {
    view.appendChild(NL.pageHeader("🎮 Games Hub", "Every game across all concepts in one place.", "#/home"));
    var grid = el("div", { class: "card-grid" });
    window.CONCEPTS.forEach(function (c) {
      gamesFor(c).forEach(function (gm) {
        grid.appendChild(el("a", {
          class: "mini-card", href: "#/concept/" + c.id + "/game"
        }, [
          el("span", { class: "mini-icon", text: c.icon }),
          el("div", {}, [
            el("strong", { text: c.title }),
            el("span", { class: "muted block", text: gm.label + " game" })
          ])
        ]));
      });
    });
    view.appendChild(grid);
  }

  window.Features = window.Features || {};
  window.Features.game = renderConceptGame;
  window.Features.gamesHub = renderHub;
})();
