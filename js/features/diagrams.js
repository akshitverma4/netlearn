/* Diagram learning: show the concept's rendered PNG with key takeaways and
 * clickable hotspot notes. Zoom toggle + prev/next between concepts.
 */
(function () {
  "use strict";
  var el = NL.el;

  function render(view, conceptId) {
    var c = NL.conceptById(conceptId);
    if (!c || !c.diagram) return;
    var d = c.diagram;

    view.appendChild(NL.pageHeader(c.icon + " " + c.title + " — Diagram",
      "Study the diagram, then read the takeaways and hotspots.", "#/concept/" + conceptId));
    view.appendChild(NL.tabBar(conceptId, "diagram"));

    var zoomed = false;
    var img = el("img", { class: "diagram-img", src: d.img, alt: c.title + " diagram",
      onClick: function () { zoomed = !zoomed; figure.classList.toggle("zoomed", zoomed); } });
    var figure = el("figure", { class: "diagram-figure" }, [
      img,
      el("figcaption", { class: "muted", text: "Tap the image to zoom." })
    ]);

    var takeaways = el("div", { class: "panel" }, [
      el("h3", { text: "Key takeaways" }),
      el("ul", { class: "takeaways" }, (d.takeaways || []).map(function (t) {
        return el("li", { text: t });
      }))
    ]);

    var hotspots = null;
    if (d.hotspots && d.hotspots.length) {
      hotspots = el("div", { class: "panel" }, [
        el("h3", { text: "Hotspots" }),
        el("div", { class: "hotspots" }, d.hotspots.map(function (h) {
          var body = el("p", { class: "hotspot-body", text: h.text });
          var item = el("div", { class: "hotspot" }, [
            el("button", {
              class: "hotspot-label", text: h.label + "  +",
              onClick: function () { item.classList.toggle("open"); }
            }),
            body
          ]);
          return item;
        }))
      ]);
    }

    // prev / next concept nav (only concepts that have diagrams)
    var withDiagrams = window.CONCEPTS.filter(function (x) { return x.diagram; });
    var i = withDiagrams.map(function (x) { return x.id; }).indexOf(conceptId);
    var prev = withDiagrams[(i - 1 + withDiagrams.length) % withDiagrams.length];
    var next = withDiagrams[(i + 1) % withDiagrams.length];
    var nav = el("div", { class: "row between" }, [
      el("a", { class: "btn ghost", href: "#/concept/" + prev.id + "/diagram", text: "‹ " + prev.title }),
      el("a", { class: "btn ghost", href: "#/concept/" + next.id + "/diagram", text: next.title + " ›" })
    ]);

    view.appendChild(figure);
    var grid = el("div", { class: "two-col" }, [takeaways, hotspots]);
    view.appendChild(grid);
    view.appendChild(nav);

    // mark study activity (small XP, once per session handled by store seenCards-like? just small)
    Store.addXp(conceptId, 1);
  }

  window.Features = window.Features || {};
  window.Features.diagram = render;
})();
