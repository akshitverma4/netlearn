/* Hash-based router. Routes:
 *   #/home
 *   #/concept/:id           -> defaults to flashcards tab
 *   #/concept/:id/:tab       (flashcards|diagram|quiz|scenarios|game)
 *   #/test                   knowledge test (cross-concept)
 *   #/games                  games hub (cross-concept)
 *   #/badges                 badges & progress
 */
(function () {
  "use strict";

  var routes = [];           // { pattern:RegExp, keys:[], handler }
  var notFound = null;

  function add(path, handler) {
    var keys = [];
    var pattern = path.replace(/:[^/]+/g, function (m) {
      keys.push(m.slice(1));
      return "([^/]+)";
    });
    routes.push({ pattern: new RegExp("^" + pattern + "$"), keys: keys, handler: handler });
  }

  function setNotFound(fn) { notFound = fn; }

  function current() {
    var h = location.hash.replace(/^#/, "");
    if (!h) h = "/home";
    return h;
  }

  function resolve() {
    var path = current();
    window.scrollTo(0, 0);
    for (var i = 0; i < routes.length; i++) {
      var m = path.match(routes[i].pattern);
      if (m) {
        var params = {};
        routes[i].keys.forEach(function (k, idx) { params[k] = decodeURIComponent(m[idx + 1]); });
        routes[i].handler(params);
        highlightNav(path);
        return;
      }
    }
    if (notFound) notFound();
  }

  function highlightNav(path) {
    var links = document.querySelectorAll("[data-nav]");
    for (var i = 0; i < links.length; i++) {
      var target = links[i].getAttribute("href").replace(/^#/, "");
      var on = path === target || (target === "/home" && path === "/home");
      links[i].classList.toggle("active", on);
    }
  }

  function go(path) { location.hash = path; }

  window.Router = { add: add, setNotFound: setNotFound, resolve: resolve, go: go, current: current };
  window.addEventListener("hashchange", resolve);
})();
