/* ==========================================================================
   Feature Growth · Herramientas
   - Calculadora de presupuesto y ROI B2B
   (El Inspector de Señal de Tracking usa js/inspector.js)
   ========================================================================== */

(function () {
  "use strict";

  /* Dispara eventos a GTM/GA4 vía el helper de js/analytics.js */
  function track(name, params) {
    if (typeof window.fgTrack === "function") window.fgTrack(name, params);
  }

  /* ------------------------------ Calculadora ------------------------------ */
  var form = document.getElementById("calc-form");
  if (form) {
    var results = document.getElementById("calc-results");
    var errorNote = document.getElementById("calc-error");

    function num(id) {
      var el = document.getElementById(id);
      var v = el ? parseFloat(el.value) : NaN;
      return isFinite(v) ? v : 0;
    }
    function fmt(n) {
      return Math.round(n).toLocaleString("es-CL");
    }
    function money(n) {
      return "$" + fmt(n);
    }
    function set(key, value) {
      var el = document.querySelector('[data-out="' + key + '"]');
      if (el) el.textContent = value;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var facturacion = num("calc-facturacion");
      var ticket = num("calc-ticket");
      var cpl = num("calc-cpl");
      var mqlToSql = num("calc-mql-sql");
      var winRate = num("calc-win-rate");
      var ciclo = num("calc-ciclo");

      if (facturacion <= 0 || ticket <= 0 || cpl <= 0 || mqlToSql <= 0 || winRate <= 0) {
        if (errorNote) errorNote.hidden = false;
        return;
      }
      if (errorNote) errorNote.hidden = true;

      track("calc_b2b_submit", {
        event_category: "Engagement Tool",
        event_label: "Calculadora Presupuesto B2B"
      });

      var clientes = Math.ceil(facturacion / ticket);
      var sql = Math.ceil(clientes / (winRate / 100));
      var mql = Math.ceil(sql / (mqlToSql / 100));
      var inversion = mql * cpl;
      var cac = clientes > 0 ? inversion / clientes : 0;

      set("clientes", fmt(clientes));
      set("sql", fmt(sql));
      set("mql", fmt(mql));
      set("inversion", money(inversion));
      set("cac", money(cac));
      set("demanda", money(inversion * 0.7));
      set("captura", money(inversion * 0.3));
      set("ciclo", (ciclo > 0 ? ciclo : 0) + " meses");

      if (results) {
        results.hidden = false;
        results.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  /* -------------------- Copiar al portapapeles + imprimir -------------------- */
  function copyToClipboard(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { legacyCopy(text, done); });
    } else {
      legacyCopy(text, done);
    }
  }
  function legacyCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (err) {}
    document.body.removeChild(ta);
  }

  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-copy-target");
      var src = document.querySelector(target);
      if (!src) return;
      var text = (src.innerText || src.textContent || "").trim();
      var note = btn.parentNode.querySelector(".copy-note");
      copyToClipboard(text, function () {
        var events = {
          "#embed-calc-code": { name: "calc_b2b_embed_copy", category: "Lead Generation", label: "Calculadora Presupuesto B2B" }
        };
        var ev = events[target];
        if (ev) track(ev.name, { event_category: ev.category, event_label: ev.label });
        if (note) {
          note.textContent = "¡Copiado al portapapeles!";
          window.setTimeout(function () { note.textContent = ""; }, 2500);
        }
      });
    });
  });

  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      track("calc_b2b_print", {
        event_category: "Lead Generation",
        event_label: "Calculadora Presupuesto B2B"
      });
      window.print();
    });
  });
})();
