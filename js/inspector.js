/* ==========================================================================
   Feature Growth · Inspector de Señal de Tracking (frontend)
   - Envía la URL al escáner server-side y renderiza el reporte.
   - Etiqueta cada dato: Medido / Estimado / Requiere acceso.
   - Fallback honesto: si el backend no está disponible en el despliegue,
     ofrece una autoevaluación guiada (marcada como ESTIMADO).
   ========================================================================== */

(function () {
  "use strict";

  var ENDPOINTS = ["/.netlify/functions/scan", "/api/scan"];

  function track(name, params) {
    if (typeof window.fgTrack === "function") window.fgTrack(name, params);
  }
  function el(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleString("es-CL"); } catch (e) { return iso; }
  }

  /* ------------------------------- Copiar ------------------------------- */
  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { legacy(text, done); });
    } else { legacy(text, done); }
  }
  function legacy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = document.querySelector(btn.getAttribute("data-copy-target"));
      if (!src) return;
      copyText((src.innerText || src.textContent || "").trim(), function () {
        var note = btn.parentNode.querySelector(".copy-note");
        if (note) { note.textContent = "¡Copiado al portapapeles!"; setTimeout(function () { note.textContent = ""; }, 2500); }
        track("inspector_copy", { event_category: "Linkbaiting Engagement", event_label: btn.getAttribute("data-copy-target") });
      });
    });
  });

  /* ------------------------------- Fetch -------------------------------- */
  function postScan(url) {
    var i = 0;
    function attempt() {
      return fetch(ENDPOINTS[i], {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url })
      }).then(function (res) {
        if (res.status === 404 && i < ENDPOINTS.length - 1) { i++; return attempt(); }
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, status: res.status, data: data };
        });
      }).catch(function () {
        if (i < ENDPOINTS.length - 1) { i++; return attempt(); }
        throw new Error("no-backend");
      });
    }
    return attempt();
  }

  /* ----------------------------- Render reporte ------------------------- */
  var STATUS = {
    ok:   { cls: "ok",   label: "OK" },
    warn: { cls: "warn", label: "Atención" },
    fail: { cls: "fail", label: "Falta" },
    na:   { cls: "na",   label: "No aplica" },
    info: { cls: "info", label: "Info" }
  };

  function scoreClass(v) { return v >= 80 ? "ok" : v >= 50 ? "warn" : "fail"; }

  function renderReport(r) {
    var host = escapeHtml(r.host);
    var checks = (r.checks || []).map(function (c) {
      var st = STATUS[c.status] || STATUS.info;
      var fix = c.fix ? '<p class="check__fix"><strong>Recomendación:</strong> ' + escapeHtml(c.fix) + "</p>" : "";
      return (
        '<li class="check check--' + st.cls + '">' +
          '<div class="check__head">' +
            '<span class="check__id">' + escapeHtml(c.id) + "</span>" +
            '<span class="check__label">' + escapeHtml(c.label) + "</span>" +
            '<span class="check__status">' + st.label + "</span>" +
          "</div>" +
          '<p class="check__evidence">' + escapeHtml(c.evidence) + "</p>" +
          fix +
        "</li>"
      );
    }).join("");

    var stack = (r.stack && r.stack.length)
      ? r.stack.map(function (s) {
          return '<span class="chip"><strong>' + escapeHtml(s.platform) + "</strong>" +
            (s.id && s.id !== "detectado" ? " · " + escapeHtml(s.id) : "") + "</span>";
        }).join("")
      : '<span class="chip chip--muted">No se detectaron tags de medición</span>';

    var tier2 = (r.tier2 && r.tier2.items || []).map(function (t) {
      return "<li><strong>" + escapeHtml(t.label) + "</strong><span>" + escapeHtml(t.reason) +
        "</span><em>Cómo: " + escapeHtml(t.how) + "</em></li>";
    }).join("");

    var limits = (r.limitations || []).map(function (l) { return "<li>" + escapeHtml(l) + "</li>"; }).join("");

    var idx = r.index || { value: 0, confidence: "estimated", rubric: "" };

    return (
      '<div class="report__head">' +
        '<div>' +
          '<p class="report__eyebrow">Reporte de escaneo · <span class="tag tag--measured">Medido</span></p>' +
          '<h3 class="report__url">' + host + "</h3>" +
          '<p class="report__meta">' + escapeHtml(r.url) + " · " + escapeHtml(fmtDate(r.scannedAt)) +
            " · HTTP " + escapeHtml(r.http && r.http.status) + " · modo " + escapeHtml(r.mode) + "</p>" +
        "</div>" +
      "</div>" +

      '<div class="report__grid">' +
        '<div class="signal-card signal-card--' + scoreClass(idx.value) + '">' +
          '<p class="signal-card__label">Índice de señal</p>' +
          '<p class="signal-card__value">' + escapeHtml(idx.value) + '<span>/100</span></p>' +
          '<div class="signal-bar"><div class="signal-bar__fill" style="width:' + Number(idx.value) + '%"></div></div>' +
          '<p class="signal-card__note"><span class="tag tag--estimated">Estimado</span> Rúbrica propia y transparente. No es el EMQ de Meta.</p>' +
        "</div>" +
        '<div class="report__blocks">' +
          '<div class="report-block">' +
            "<h4>Stack de medición</h4>" +
            '<div class="stack-chips">' + stack + "</div>" +
          "</div>" +
          '<div class="report-block">' +
            "<h4>Server-side de primera parte <span class=\"tag tag--estimated\">Estimado</span></h4>" +
            "<p>" + escapeHtml(r.serverSide && r.serverSide.evidence) + "</p>" +
          "</div>" +
        "</div>" +
      "</div>" +

      '<div class="report-block">' +
        "<h4>Checks observables <span class=\"tag tag--measured\">Medido</span></h4>" +
        '<ul class="checks">' + checks + "</ul>" +
      "</div>" +

      '<div class="report-block report-block--tier2">' +
        "<h4>Requiere acceso <span class=\"tag tag--access\">Requiere acceso</span></h4>" +
        '<p>Estas métricas no son observables desde el servidor. Se miden en un diagnóstico con permisos de solo lectura:</p>' +
        '<ul class="tier2">' + tier2 + "</ul>" +
        '<a class="btn btn--primary" href="../../contacto.html" data-tier2>Agendar diagnóstico</a>' +
      "</div>" +

      '<div class="report-block report-block--limits">' +
        "<h4>Limitaciones del escaneo</h4>" +
        "<ul>" + limits + "</ul>" +
      "</div>" +

      '<div class="report__actions">' +
        '<button class="btn btn--outline" type="button" id="report-download">Descargar JSON</button>' +
        '<button class="btn btn--outline" type="button" id="report-recopy">Copiar reporte</button>' +
      "</div>"
    );
  }

  function bindReportActions(r) {
    var dl = el("report-download");
    if (dl) dl.addEventListener("click", function () {
      var blob = new Blob([JSON.stringify(r, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "inspector-senal-" + (r.host || "sitio") + ".json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      track("inspector_download", { event_category: "Technical Tool", event_label: r.host || "" });
    });
    var rc = el("report-recopy");
    if (rc) rc.addEventListener("click", function () {
      var text = buildTextSummary(r);
      copyText(text, function () {
        rc.textContent = "¡Copiado!";
        setTimeout(function () { rc.textContent = "Copiar reporte"; }, 2500);
      });
    });
    var t2 = document.querySelector("[data-tier2]");
    if (t2) t2.addEventListener("click", function () {
      track("inspector_tier2_cta", { event_category: "Lead Generation" });
    });
  }

  function buildTextSummary(r) {
    var lines = [
      "Inspector de Señal de Tracking — " + r.host,
      "Índice de señal: " + (r.index ? r.index.value : "?") + "/100 (estimado)",
      "Escaneado: " + r.scannedAt,
      "",
      "Stack: " + (r.stack || []).map(function (s) { return s.platform; }).join(", "),
      "",
      "Checks:"
    ];
    (r.checks || []).forEach(function (c) {
      lines.push("- [" + (STATUS[c.status] || {}).label + "] " + c.label + " — " + c.evidence);
    });
    lines.push("", "Requiere acceso: EMQ real, % de bloqueo real, pérdida de señal medida.");
    lines.push("Fuente: https://featuregrowth.cl/herramientas/inspector-senal-tracking/");
    return lines.join("\n");
  }

  /* --------------------- Fallback: autoevaluación ----------------------- */
  var QUIZ = [
    { q: "¿Tienes GTM o gtag instalado y publicado?", w: 15 },
    { q: "¿GA4 recibe eventos en tiempo real?", w: 15 },
    { q: "¿Envías el mismo event_id en el Pixel y en Meta CAPI?", w: 20 },
    { q: "¿Hasheas la PII (SHA-256) antes de enviarla a las plataformas?", w: 15 },
    { q: "¿Una CMP/Consent Mode bloquea los tags hasta el consentimiento?", w: 15 },
    { q: "¿Tienes un subdominio server-side de primera parte activo?", w: 20 }
  ];

  function renderQuiz() {
    var items = QUIZ.map(function (item, i) {
      return (
        '<li class="quiz__item">' +
          '<p class="quiz__q">' + escapeHtml(item.q) + "</p>" +
          '<div class="quiz__opts">' +
            '<label><input type="radio" name="q' + i + '" value="yes" data-w="' + item.w + '" /> Sí</label>' +
            '<label><input type="radio" name="q' + i + '" value="no" data-w="' + item.w + '" /> No</label>' +
            '<label><input type="radio" name="q' + i + '" value="na" data-w="' + item.w + '" /> No sé</label>' +
          "</div>" +
        "</li>"
      );
    }).join("");

    return (
      '<div class="report__head">' +
        '<p class="report__eyebrow">Autoevaluación · <span class="tag tag--estimated">Estimado</span></p>' +
        "<h3 class=\"report__url\">El escáner no está disponible en este despliegue</h3>" +
        '<p class="report__meta">El backend server-side no está activo. Mientras tanto, completa esta autoevaluación para obtener un índice orientativo.</p>' +
      "</div>" +
      '<ul class="quiz" id="quiz-list">' + items + "</ul>" +
      '<div class="report__actions">' +
        '<button class="btn btn--primary" type="button" id="quiz-score">Calcular índice</button>' +
      "</div>" +
      '<div id="quiz-result" class="signal-card signal-card--neutral" hidden></div>'
    );
  }

  function bindQuiz() {
    var btn = el("quiz-score");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var earned = 0, total = 0, answered = 0;
      QUIZ.forEach(function (item, i) {
        var sel = document.querySelector('input[name="q' + i + '"]:checked');
        if (!sel) return;
        answered++;
        if (sel.value === "na") return;
        total += item.w;
        if (sel.value === "yes") earned += item.w;
      });
      if (!answered) return;
      var value = total > 0 ? Math.round((earned / total) * 100) : 0;
      var box = el("quiz-result");
      box.className = "signal-card signal-card--" + scoreClass(value);
      box.innerHTML =
        '<p class="signal-card__label">Índice estimado (autoevaluación)</p>' +
        '<p class="signal-card__value">' + value + '<span>/100</span></p>' +
        '<div class="signal-bar"><div class="signal-bar__fill" style="width:' + value + '%"></div></div>' +
        '<p class="signal-card__note">Estimación según tus respuestas. Para medirlo de verdad, necesita el escáner activo o un diagnóstico con acceso.</p>';
      box.hidden = false;
      track("inspector_quiz_score", { event_category: "Technical Tool", value: value });
    });
  }

  /* ------------------------------ Flujo --------------------------------- */
  var form = el("inspector-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = el("inspector-url");
    var url = input ? input.value.trim() : "";
    var note = el("inspector-note");
    var statusBox = el("inspector-status");
    var statusText = el("inspector-status-text");
    var report = el("inspector-report");

    if (!url) { if (input) input.focus(); return; }

    if (note) note.hidden = true;
    if (report) { report.hidden = true; report.innerHTML = ""; }
    if (statusBox) statusBox.hidden = false;
    if (statusText) statusText.textContent = "Descargando el sitio y analizando el marcado…";

    track("inspector_scan_start", { event_category: "Technical Tool", event_label: url });

    postScan(url).then(function (result) {
      if (statusBox) statusBox.hidden = true;
      if (!report) return;

      if (!result.ok) {
        report.hidden = false;
        if (result.status === 404 || result.status === 405) {
          report.innerHTML = renderQuiz();
          bindQuiz();
          track("inspector_backend_missing", { event_category: "Technical Tool" });
          return;
        }
        report.innerHTML =
          '<div class="report__error"><strong>No se pudo escanear.</strong> ' +
          escapeHtml(result.data && result.data.error || "Error " + result.status) + "</div>";
        track("inspector_scan_error", { event_category: "Technical Tool", event_label: String(result.status) });
        return;
      }

      report.innerHTML = renderReport(result.data);
      report.hidden = false;
      bindReportActions(result.data);
      report.scrollIntoView({ behavior: "smooth", block: "start" });
      track("inspector_scan_done", {
        event_category: "Technical Tool",
        event_label: result.data.host || url,
        value: result.data.index ? result.data.index.value : 0
      });
    }).catch(function () {
      if (statusBox) statusBox.hidden = true;
      if (!report) return;
      report.hidden = false;
      report.innerHTML = renderQuiz();
      bindQuiz();
      track("inspector_backend_missing", { event_category: "Technical Tool" });
    });
  });
})();
