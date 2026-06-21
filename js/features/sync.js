/* Sync — move progress + custom content between devices without a backend.
 * Export bundles {progress, custom} into a base64 "sync code" (also downloadable
 * as a .json backup). Import accepts a pasted code or an uploaded file, with
 * Merge (combine both devices) or Replace (overwrite this device) modes.
 */
(function () {
  "use strict";
  var el = NL.el;

  var BUNDLE_V = 1;

  function buildBundle() {
    return { app: "netlearn", v: BUNDLE_V, progress: Store.exportState(), custom: Content.exportCustom() };
  }

  // base64 of UTF-8 JSON (btoa needs latin1, so encode first).
  function encode(obj) {
    var json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)));
  }
  function decode(code) {
    var json = decodeURIComponent(escape(atob(code.trim())));
    return JSON.parse(json);
  }

  function applyBundle(bundle, mode) {
    if (!bundle || bundle.app !== "netlearn") throw new Error("Not a NetLearn sync bundle");
    if (bundle.progress) Store.importState(bundle.progress, mode);
    if (bundle.custom) Content.importCustom(bundle.custom, mode);
  }

  function render(view) {
    view.appendChild(NL.pageHeader("🔄 Sync & Backup",
      "Move your progress and custom cards/questions between devices.", "#/home"));

    view.appendChild(el("div", { class: "panel" }, [
      el("p", { class: "muted", html: "Progress is stored on each device separately. Use this to copy it from one device to another, or to keep a backup. <strong>Tip:</strong> export on your laptop, then import on your phone." })
    ]));

    /* ---- EXPORT ---- */
    var code = encode(buildBundle());
    var codeArea = el("textarea", { class: "input mono", rows: "5", readonly: "", text: code });
    view.appendChild(el("div", { class: "panel" }, [
      el("h3", { text: "1. Export from this device" }),
      el("p", { class: "muted", text: "This code contains your XP, mastery, badges, streak and any custom cards/questions." }),
      codeArea,
      el("div", { class: "row" }, [
        el("button", { class: "btn", text: "📋 Copy code", onClick: function () {
          codeArea.select();
          try { navigator.clipboard.writeText(code); } catch (e) { document.execCommand("copy"); }
          NL.toast("Sync code copied");
        }}),
        el("button", { class: "btn ghost", text: "⬇ Download backup (.json)", onClick: function () { download(code); } })
      ])
    ]));

    /* ---- IMPORT ---- */
    var pasteArea = el("textarea", { class: "input mono", rows: "5", placeholder: "Paste a sync code here…" });
    var fileInput = el("input", { type: "file", accept: ".json,.txt", class: "input" });
    var modeMerge = el("input", { type: "radio", name: "syncmode", id: "m-merge", checked: "" });
    var modeReplace = el("input", { type: "radio", name: "syncmode", id: "m-replace" });

    function chosenMode() { return modeReplace.checked ? "replace" : "merge"; }

    function doImport(code) {
      var bundle;
      try { bundle = decode(code); } catch (e) { NL.toast("That doesn't look like a valid sync code"); return; }
      var mode = chosenMode();
      var msg = mode === "replace"
        ? "REPLACE all progress on this device with the imported data? This overwrites what's here."
        : "MERGE the imported progress into this device? (Keeps the best of both.)";
      if (!confirm(msg)) return;
      try {
        applyBundle(bundle, mode);
        NL.toast("Sync complete ✓");
        Router.go("/badges");
      } catch (e) { NL.toast(e.message || "Import failed"); }
    }

    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () { pasteArea.value = String(r.result).trim(); NL.toast("File loaded — now choose a mode and import"); };
      r.readAsText(f);
    });

    view.appendChild(el("div", { class: "panel" }, [
      el("h3", { text: "2. Import to this device" }),
      pasteArea,
      el("p", { class: "muted", text: "…or load a backup file:" }),
      fileInput,
      el("div", { class: "sync-modes" }, [
        el("label", { class: "sync-mode" }, [modeMerge, el("span", {}, [el("strong", { text: " Merge " }), el("span", { class: "muted", text: "combine with what's here (recommended)" })])]),
        el("label", { class: "sync-mode" }, [modeReplace, el("span", {}, [el("strong", { text: " Replace " }), el("span", { class: "muted", text: "overwrite this device" })])])
      ]),
      el("div", { class: "row" }, [
        el("button", { class: "btn good", text: "Import now", onClick: function () {
          if (!pasteArea.value.trim()) { NL.toast("Paste a code or load a file first"); return; }
          doImport(pasteArea.value);
        }})
      ])
    ]));
  }

  // Download as a file. Uses a Blob URL; filename has no timestamp (Date is fine here at runtime).
  function download(code) {
    try {
      var blob = new Blob([code], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = el("a", { href: url, download: "netlearn-backup.json" });
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      NL.toast("Backup downloaded");
    } catch (e) { NL.toast("Download not supported here — copy the code instead"); }
  }

  window.Features = window.Features || {};
  window.Features.sync = render;
})();
