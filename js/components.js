/* Tiny DOM + UI helpers shared across features. No framework. */
(function () {
  "use strict";

  // Create an element from a tag, attributes, and children.
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      } else if (attrs[k] !== null && attrs[k] !== undefined) {
        node.setAttribute(k, attrs[k]);
      }
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // Fisher–Yates shuffle (returns a new array).
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Transient toast notification (used for XP gains and badges).
  function toast(msg) {
    var host = document.getElementById("toast-host");
    if (!host) return;
    var t = el("div", { class: "toast", text: msg });
    host.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 2200);
  }

  function xpToast(amount) { if (amount > 0) toast("+" + amount + " XP"); }

  // Linear progress bar element.
  function progressBar(pct) {
    return el("div", { class: "bar" }, [
      el("div", { class: "bar-fill", style: "width:" + Math.max(0, Math.min(100, pct)) + "%" })
    ]);
  }

  // SVG mastery ring (0-100) with a label in the centre.
  function ring(pct, label) {
    var r = 26, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "ring"); svg.setAttribute("viewBox", "0 0 64 64");
    function circle(cls, dash) {
      var el2 = document.createElementNS(ns, "circle");
      el2.setAttribute("class", cls); el2.setAttribute("cx", "32"); el2.setAttribute("cy", "32");
      el2.setAttribute("r", r); el2.setAttribute("fill", "none"); el2.setAttribute("stroke-width", "6");
      if (dash) { el2.setAttribute("stroke-dasharray", c); el2.setAttribute("stroke-dashoffset", off); }
      return el2;
    }
    svg.appendChild(circle("ring-bg"));
    svg.appendChild(circle("ring-fg", true));
    var txt = document.createElementNS(ns, "text");
    txt.setAttribute("x", "32"); txt.setAttribute("y", "37"); txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("class", "ring-text"); txt.textContent = (label !== undefined ? label : pct + "%");
    svg.appendChild(txt);
    return svg;
  }

  function conceptById(id) {
    return (window.CONCEPTS || []).filter(function (c) { return c.id === id; })[0];
  }

  // Which tabs a concept actually has content for.
  function availableTabs(c) {
    var tabs = [{ id: "flashcards", label: "Flash Cards" }];
    if (c.diagram) tabs.push({ id: "diagram", label: "Diagram" });
    if (c.quiz && c.quiz.length) tabs.push({ id: "quiz", label: "Quiz" });
    if (c.scenarios && c.scenarios.length) tabs.push({ id: "scenarios", label: "Scenarios" });
    if (c.games) tabs.push({ id: "game", label: "Game" });
    return tabs;
  }

  // Build the tab bar for a concept page (only tabs with content).
  function tabBar(conceptId, active) {
    var c = conceptById(conceptId) || {};
    return el("div", { class: "tabs" }, availableTabs(c).map(function (t) {
      return el("a", {
        class: "tab" + (t.id === active ? " active" : ""),
        href: "#/concept/" + conceptId + "/" + t.id,
        text: t.label
      });
    }));
  }

  // Standard "back to concept" / breadcrumb header.
  function pageHeader(title, sub, backHref) {
    return el("div", { class: "page-head" }, [
      backHref ? el("a", { class: "back", href: backHref, html: "&larr; Back" }) : null,
      el("h2", { text: title }),
      sub ? el("p", { class: "muted", text: sub }) : null
    ]);
  }

  window.NL = {
    el: el, clear: clear, shuffle: shuffle, toast: toast, xpToast: xpToast,
    progressBar: progressBar, ring: ring, conceptById: conceptById,
    tabBar: tabBar, availableTabs: availableTabs, pageHeader: pageHeader
  };
})();
