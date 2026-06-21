/* Persistent progress store backed by localStorage.
 * Tracks XP, level, per-concept mastery, daily streak, badges, and the set of
 * flashcards a learner has marked for review. Exposes a tiny pub/sub so the UI
 * can re-render when progress changes.
 */
(function () {
  "use strict";

  var KEY = "netlearn.progress.v1";
  var XP_PER_LEVEL = 100;

  var DEFAULT = {
    xp: 0,
    byConcept: {},        // id -> { xp, quizBest, scenarioBest, gamesPlayed, mastered:{} }
    review: {},           // "conceptId:cardIndex" -> true  (cards to revisit)
    seenCards: {},        // "conceptId:cardIndex" -> true  (awarded recall XP already)
    badges: {},           // badgeId -> true
    streak: { count: 0, lastDay: null },
    bestTest: 0           // best knowledge-test percentage
  };

  var listeners = [];
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULT);
      var parsed = JSON.parse(raw);
      // shallow-merge so new fields appear for older saves
      return Object.assign(clone(DEFAULT), parsed);
    } catch (e) {
      return clone(DEFAULT);
    }
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    listeners.forEach(function (fn) { fn(state); });
  }

  function concept(id) {
    if (!state.byConcept[id]) {
      state.byConcept[id] = { xp: 0, quizBest: 0, scenarioBest: 0, gamesPlayed: 0, mastered: {} };
    }
    return state.byConcept[id];
  }

  /* ---- derived values ---- */
  function level() { return Math.floor(state.xp / XP_PER_LEVEL) + 1; }
  function levelFloorXp() { return (level() - 1) * XP_PER_LEVEL; }
  function xpIntoLevel() { return state.xp - levelFloorXp(); }
  function levelProgressPct() { return Math.round((xpIntoLevel() / XP_PER_LEVEL) * 100); }

  // Mastery 0-100 per concept: blends quiz %, scenario %, flashcards seen, games played.
  function mastery(id) {
    var c = state.byConcept[id];
    if (!c) return 0;
    var data = (window.CONCEPTS || []).filter(function (x) { return x.id === id; })[0];
    // mastery is anchored to built-in cards so the target doesn't move when
    // the learner adds their own cards. Built-in keys are "b" + index.
    // Only components that exist for this concept are weighted (so a topic
    // with no scenarios/game can still reach 100%).
    var cardCount = data && data.flashcards ? data.flashcards.length : 0;
    var seen = 0;
    for (var i = 0; i < cardCount; i++) { if (state.seenCards[id + ":b" + i]) seen++; }
    var cardPct = cardCount ? (seen / cardCount) * 100 : 0;

    var parts = [{ v: cardPct, w: 0.25 }, { v: c.quizBest, w: 0.35 }];
    if (data && data.scenarios && data.scenarios.length) parts.push({ v: c.scenarioBest, w: 0.25 });
    if (data && data.games) parts.push({ v: Math.min(c.gamesPlayed, 1) * 100, w: 0.15 });
    var totW = parts.reduce(function (a, p) { return a + p.w; }, 0);
    var score = parts.reduce(function (a, p) { return a + p.v * p.w; }, 0) / totW;
    return Math.round(Math.min(100, score));
  }

  function overallMastery() {
    var ids = (window.CONCEPTS || []).map(function (c) { return c.id; });
    if (!ids.length) return 0;
    var sum = ids.reduce(function (a, id) { return a + mastery(id); }, 0);
    return Math.round(sum / ids.length);
  }

  /* ---- mutations (all award XP via addXp) ---- */
  function addXp(conceptId, amount) {
    if (amount <= 0) return;
    state.xp += amount;
    if (conceptId) concept(conceptId).xp += amount;
    bumpStreak();
    checkBadges();
    persist();
  }

  // Flashcard recall: award XP only the first time a card is marked "got it".
  // cardKey is a stable key ("b<index>" for built-in, "c<id>" for custom).
  function markCard(conceptId, cardKey, gotIt) {
    var k = conceptId + ":" + cardKey;
    if (gotIt) {
      delete state.review[k];
      if (!state.seenCards[k]) { state.seenCards[k] = true; addXp(conceptId, 5); return; }
    } else {
      state.review[k] = true;
    }
    persist();
  }

  function isReview(conceptId, cardKey) { return !!state.review[conceptId + ":" + cardKey]; }

  // Record a quiz/scenario result; award XP scaled to score, bonus for new best.
  function recordQuiz(conceptId, pct) {
    var c = concept(conceptId);
    var gained = Math.round(pct / 10); // up to 10 XP
    if (pct > c.quizBest) { gained += 10; c.quizBest = pct; }
    addXp(conceptId, gained);
  }

  function recordScenario(conceptId, pct) {
    var c = concept(conceptId);
    var gained = Math.round(pct / 10);
    if (pct > c.scenarioBest) { gained += 10; c.scenarioBest = pct; }
    addXp(conceptId, gained);
  }

  function recordGame(conceptId, won) {
    concept(conceptId).gamesPlayed += 1;
    addXp(conceptId, won ? 15 : 5);
  }

  function recordTest(pct) {
    if (pct > state.bestTest) state.bestTest = pct;
    addXp(null, Math.round(pct / 5)); // up to 20 XP
  }

  /* ---- streak (UTC-day granularity) ---- */
  function todayKey() {
    var d = new Date();
    return d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate();
  }
  function bumpStreak() {
    var t = todayKey();
    var s = state.streak;
    if (s.lastDay === t) return;
    // consecutive-day detection
    var prev = new Date();
    prev.setUTCDate(prev.getUTCDate() - 1);
    var prevKey = prev.getUTCFullYear() + "-" + (prev.getUTCMonth() + 1) + "-" + prev.getUTCDate();
    s.count = (s.lastDay === prevKey) ? s.count + 1 : 1;
    s.lastDay = t;
  }

  /* ---- badges ---- */
  var BADGES = [
    { id: "first-steps", name: "First Steps", icon: "👣", test: function () { return state.xp >= 10; } },
    { id: "port-master", name: "Port Master", icon: "🚪", test: function () { var c = state.byConcept["firewall"]; return c && c.quizBest >= 100; } },
    { id: "raid-pro", name: "RAID Pro", icon: "💽", test: function () { var c = state.byConcept["storage"]; return c && c.quizBest >= 100; } },
    { id: "vlan-wizard", name: "VLAN Wizard", icon: "🔀", test: function () { var c = state.byConcept["vlan-setup"]; return c && c.quizBest >= 100; } },
    { id: "level-5", name: "Level 5", icon: "⭐", test: function () { return level() >= 5; } },
    { id: "streak-3", name: "3-Day Streak", icon: "🔥", test: function () { return state.streak.count >= 3; } },
    { id: "exam-ace", name: "Exam Ace", icon: "🎓", test: function () { return state.bestTest >= 80; } },
    { id: "all-rounder", name: "All-Rounder", icon: "🏆", test: function () { return overallMastery() >= 80; } }
  ];

  function checkBadges() {
    BADGES.forEach(function (b) {
      if (!state.badges[b.id] && b.test()) {
        state.badges[b.id] = true;
        if (window.NL && window.NL.toast) window.NL.toast("🏅 Badge unlocked: " + b.name);
      }
    });
  }

  function reset() {
    state = clone(DEFAULT);
    persist();
  }

  window.Store = {
    XP_PER_LEVEL: XP_PER_LEVEL,
    get: function () { return state; },
    subscribe: function (fn) { listeners.push(fn); },
    level: level,
    xp: function () { return state.xp; },
    xpIntoLevel: xpIntoLevel,
    levelProgressPct: levelProgressPct,
    mastery: mastery,
    overallMastery: overallMastery,
    streak: function () { return state.streak.count; },
    badges: BADGES,
    earnedBadges: function () { return BADGES.filter(function (b) { return state.badges[b.id]; }); },
    bestTest: function () { return state.bestTest; },
    addXp: addXp,
    markCard: markCard,
    isReview: isReview,
    recordQuiz: recordQuiz,
    recordScenario: recordScenario,
    recordGame: recordGame,
    recordTest: recordTest,
    reset: reset
  };
})();
