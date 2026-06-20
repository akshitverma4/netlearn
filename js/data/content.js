/* Content layer: merges built-in flashcards/quiz (from concepts.js +
 * more-questions.js) with the learner's own custom items, which are stored
 * separately in localStorage so they survive reloads and never touch the
 * built-in data.
 *
 * Stable keys let progress (seen/review) survive additions and deletions:
 *   built-in card key = "b" + index    (index within concept.flashcards)
 *   custom card  key = "c" + id
 */
(function () {
  "use strict";

  var KEY = "netlearn.custom.v1";
  var nextId = 1;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var data = raw ? JSON.parse(raw) : { cards: {}, quiz: {}, seq: 1 };
      data.cards = data.cards || {};
      data.quiz = data.quiz || {};
      nextId = data.seq || 1;
      return data;
    } catch (e) { return { cards: {}, quiz: {}, seq: 1 }; }
  }
  var custom = load();

  function save() {
    custom.seq = nextId;
    try { localStorage.setItem(KEY, JSON.stringify(custom)); } catch (e) {}
  }
  function newId() { return nextId++; }

  function base(conceptId) {
    return (window.CONCEPTS || []).filter(function (c) { return c.id === conceptId; })[0];
  }

  /* -------- flashcards -------- */
  function flashcards(conceptId) {
    var c = base(conceptId);
    if (!c) return [];
    var out = c.flashcards.map(function (card, i) {
      return { front: card.front, back: card.back, key: "b" + i, custom: false };
    });
    (custom.cards[conceptId] || []).forEach(function (card) {
      out.push({ front: card.front, back: card.back, key: "c" + card.id, custom: true, id: card.id });
    });
    return out;
  }

  function addCard(conceptId, front, back) {
    if (!front || !back) return false;
    custom.cards[conceptId] = custom.cards[conceptId] || [];
    custom.cards[conceptId].push({ id: newId(), front: front, back: back });
    save();
    return true;
  }

  function deleteCard(conceptId, id) {
    var arr = custom.cards[conceptId] || [];
    custom.cards[conceptId] = arr.filter(function (x) { return x.id !== id; });
    save();
  }

  /* -------- quiz -------- */
  function quiz(conceptId) {
    var c = base(conceptId);
    if (!c) return [];
    var out = c.quiz.map(function (q) {
      return { q: q.q, choices: q.choices, answer: q.answer, explain: q.explain, custom: false };
    });
    (custom.quiz[conceptId] || []).forEach(function (q) {
      out.push({ q: q.q, choices: q.choices, answer: q.answer, explain: q.explain, custom: true, id: q.id });
    });
    return out;
  }

  function addQuiz(conceptId, q, choices, answer, explain) {
    choices = (choices || []).filter(function (x) { return x && x.trim(); });
    if (!q || choices.length < 2 || answer < 0 || answer >= choices.length) return false;
    custom.quiz[conceptId] = custom.quiz[conceptId] || [];
    custom.quiz[conceptId].push({ id: newId(), q: q, choices: choices, answer: answer, explain: explain || "" });
    save();
    return true;
  }

  function deleteQuiz(conceptId, id) {
    var arr = custom.quiz[conceptId] || [];
    custom.quiz[conceptId] = arr.filter(function (x) { return x.id !== id; });
    save();
  }

  function customCounts(conceptId) {
    return {
      cards: (custom.cards[conceptId] || []).length,
      quiz: (custom.quiz[conceptId] || []).length
    };
  }

  window.Content = {
    flashcards: flashcards, addCard: addCard, deleteCard: deleteCard,
    quiz: quiz, addQuiz: addQuiz, deleteQuiz: deleteQuiz,
    customCounts: customCounts
  };
})();
