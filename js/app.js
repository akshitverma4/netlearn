/* App boot: header score bar, home dashboard, concept landing, badges page,
 * and route registration. Mounts everything into #view.
 */
(function () {
  "use strict";
  var el = NL.el;
  var view = document.getElementById("view");

  /* -------------------------------------------------- header score bar */
  function renderHeader() {
    var host = document.getElementById("scorebar");
    NL.clear(host);
    host.appendChild(el("div", { class: "sb-level" }, [
      el("span", { class: "sb-badge", text: "LV " + Store.level() }),
      el("div", { class: "sb-bar" }, [NL.progressBar(Store.levelProgressPct())]),
      el("span", { class: "sb-xp", text: Store.xpIntoLevel() + "/" + Store.XP_PER_LEVEL + " XP" })
    ]));
    host.appendChild(el("div", { class: "sb-stats" }, [
      el("span", { class: "sb-stat", title: "Daily streak", text: "🔥 " + Store.streak() }),
      el("span", { class: "sb-stat", title: "Overall mastery", text: "🎯 " + Store.overallMastery() + "%" })
    ]));
  }

  /* ------------------------------------------------------- home / dash */
  function home() {
    NL.clear(view);
    view.appendChild(el("div", { class: "hero" }, [
      el("h1", { text: "NetLearn" }),
      el("p", { class: "muted", text: "Master computer networking for CCTV / Avigilon support — flashcards, diagrams, games, quizzes, scenarios and exams." })
    ]));

    // continue learning: lowest-mastery concept
    var sorted = window.CONCEPTS.slice().sort(function (a, b) { return Store.mastery(a.id) - Store.mastery(b.id); });
    var next = sorted[0];
    view.appendChild(el("div", { class: "resume panel" }, [
      el("div", {}, [
        el("span", { class: "muted", text: "Continue learning" }),
        el("h3", { text: next.icon + " " + next.title })
      ]),
      el("a", { class: "btn", href: "#/concept/" + next.id, text: "Resume ›" })
    ]));

    // mode shortcuts
    view.appendChild(el("div", { class: "mode-row" }, [
      modeCard("📝", "Knowledge Test", "Timed cross-concept exam", "#/test"),
      modeCard("🎮", "Games Hub", "All games in one place", "#/games"),
      modeCard("🏅", "Badges & Progress", "See what you've earned", "#/badges")
    ]));

    // concept grid with mastery rings
    view.appendChild(el("h2", { class: "section-title", text: "Concepts" }));
    var grid = el("div", { class: "card-grid" });
    window.CONCEPTS.forEach(function (c) {
      var m = Store.mastery(c.id);
      grid.appendChild(el("a", { class: "concept-card", href: "#/concept/" + c.id }, [
        el("div", { class: "cc-top" }, [
          el("span", { class: "cc-icon", text: c.icon }),
          NL.ring(m)
        ]),
        el("strong", { class: "cc-title", text: c.title }),
        el("span", { class: "muted cc-blurb", text: c.blurb })
      ]));
    });
    view.appendChild(grid);
  }

  function modeCard(icon, title, sub, href) {
    return el("a", { class: "mode-card", href: href }, [
      el("span", { class: "mode-icon", text: icon }),
      el("strong", { text: title }),
      el("span", { class: "muted block", text: sub })
    ]);
  }

  /* --------------------------------------------------- concept landing */
  function conceptLanding(params) {
    var c = NL.conceptById(params.id);
    if (!c) return notFound();
    NL.clear(view);
    view.appendChild(NL.pageHeader(c.icon + " " + c.title, c.blurb, "#/home"));

    view.appendChild(el("div", { class: "landing-top" }, [
      el("div", { class: "panel grow" }, [
        el("h3", { text: "Key facts" }),
        el("ul", { class: "takeaways" }, c.keyFacts.map(function (f) { return el("li", { text: f }); }))
      ]),
      el("div", { class: "panel mastery-panel" }, [
        NL.ring(Store.mastery(c.id)),
        el("span", { class: "muted", text: "mastery" })
      ])
    ]));

    view.appendChild(el("h3", { class: "section-title", text: "Learn & test" }));
    var tabs = [
      { id: "flashcards", icon: "🃏", label: "Flash Cards", sub: c.flashcards.length + " cards" },
      { id: "diagram", icon: "🗺️", label: "Diagram", sub: "Visual + takeaways" },
      { id: "quiz", icon: "❓", label: "Quiz", sub: c.quiz.length + " questions · best " + (Store.get().byConcept[c.id] ? Store.get().byConcept[c.id].quizBest : 0) + "%" },
      { id: "scenarios", icon: "🧩", label: "Scenarios", sub: c.scenarios.length + " situations" },
      { id: "game", icon: "🎮", label: "Game", sub: c.games ? "Play" : "—" }
    ];
    var grid = el("div", { class: "card-grid" });
    tabs.forEach(function (t) {
      grid.appendChild(el("a", { class: "mini-card", href: "#/concept/" + c.id + "/" + t.id }, [
        el("span", { class: "mini-icon", text: t.icon }),
        el("div", {}, [el("strong", { text: t.label }), el("span", { class: "muted block", text: t.sub })])
      ]));
    });
    view.appendChild(grid);
  }

  /* ------------------------------------------------------- badges page */
  function badges() {
    NL.clear(view);
    view.appendChild(NL.pageHeader("🏅 Badges & Progress", "Earn badges by studying, scoring, and keeping your streak.", "#/home"));

    view.appendChild(el("div", { class: "panel stat-strip" }, [
      stat("Level", Store.level()),
      stat("Total XP", Store.xp()),
      stat("Overall mastery", Store.overallMastery() + "%"),
      stat("Day streak", Store.streak()),
      stat("Best test", Store.bestTest() + "%")
    ]));

    var grid = el("div", { class: "badge-grid" });
    Store.badges.forEach(function (b) {
      var earned = Store.earnedBadges().some(function (e) { return e.id === b.id; });
      grid.appendChild(el("div", { class: "badge" + (earned ? " earned" : "") }, [
        el("span", { class: "badge-icon", text: b.icon }),
        el("span", { class: "badge-name", text: b.name }),
        el("span", { class: "badge-state", text: earned ? "Unlocked" : "Locked" })
      ]));
    });
    view.appendChild(el("h3", { class: "section-title", text: "Badges" }));
    view.appendChild(grid);

    view.appendChild(el("h3", { class: "section-title", text: "Mastery by concept" }));
    var rows = window.CONCEPTS.map(function (c) {
      return el("div", { class: "breakdown-row" }, [
        el("a", { class: "breakdown-name", href: "#/concept/" + c.id, text: c.icon + " " + c.title }),
        NL.progressBar(Store.mastery(c.id)),
        el("span", { class: "breakdown-pct", text: Store.mastery(c.id) + "%" })
      ]);
    });
    view.appendChild(el("div", { class: "panel" }, rows));

    view.appendChild(el("div", { class: "row" }, [
      el("button", { class: "btn danger ghost", text: "Reset all progress", onClick: function () {
        if (confirm("Reset all XP, mastery, badges and streak? This cannot be undone.")) { Store.reset(); Router.go("/home"); }
      }})
    ]));
  }
  function stat(label, val) {
    return el("div", { class: "stat" }, [el("span", { class: "stat-val", text: val }), el("span", { class: "stat-label", text: label })]);
  }

  function notFound() {
    NL.clear(view);
    view.appendChild(el("div", { class: "panel" }, [
      el("h2", { text: "Page not found" }),
      el("a", { class: "btn", href: "#/home", text: "Go home" })
    ]));
  }

  /* ------------------------------------------------------------ routes */
  function tabHandler(params) {
    NL.clear(view);
    var fn = window.Features[params.tab];
    if (fn) fn(view, params.id);
    else conceptLanding(params);
  }

  Router.add("/home", function () { NL.clear(view); home(); });
  Router.add("/concept/:id", conceptLanding);
  Router.add("/concept/:id/:tab", tabHandler);
  Router.add("/test", function () { NL.clear(view); window.Features.test(view); });
  Router.add("/games", function () { NL.clear(view); window.Features.gamesHub(view); });
  Router.add("/badges", badges);
  Router.setNotFound(notFound);

  // keep header in sync with store changes
  Store.subscribe(renderHeader);

  renderHeader();
  Router.resolve();
})();
