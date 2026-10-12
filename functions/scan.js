/* ==========================================================================
   Feature Growth · Inspector de Señal de Tracking
   Motor de escaneo (Netlify Function · Node · SIN dependencias).

   Qué hace: descarga el HTML público de una URL y extrae, con evidencia,
   el inventario de tags de medición y una serie de checks de calidad
   observables en el marcado (deduplicación, PII, consent, server-side).

   Principio de honestidad del producto:
     - MEDIDO            → se observó directamente en el HTML/headers.
     - ESTIMADO          → se deriva de lo medido (ej: índice, DNS).
     - REQUIERE ACCESO   → no observable desde afuera (EMQ real, % adblock).

   Seguridad: protección SSRF (bloquea IPs privadas/reservadas y valida
   cada salto de redirección), límite de tamaño de descarga, timeout y
   rate-limit best-effort por IP.
   ========================================================================== */

"use strict";

const dns = require("dns").promises;

const VERSION = "1.0.0";
const MAX_BYTES = 2_000_000; // 2 MB de HTML como máximo
const FETCH_TIMEOUT = 12000; // ms por salto
const MAX_REDIRECTS = 5;

const UA =
  "FeatureGrowth-SignalInspector/" +
  VERSION +
  " (+https://featuregrowth.cl/herramientas/inspector-senal-tracking/)";

/* ----------------------------- Rate limit ----------------------------- */
/* Best-effort: vive en memoria de la instancia (se reinicia con cold start).
   Suficiente para frenar abuso casual, no es un límite distribuido. */
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 15;
const rateHits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const arr = (rateHits.get(ip) || []).filter(function (t) {
    return now - t < RATE_WINDOW_MS;
  });
  arr.push(now);
  rateHits.set(ip, arr);
  return arr.length > RATE_MAX;
}

/* --------------------------- Protección SSRF -------------------------- */
function isPrivateIPv4(ip) {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some(function (n) { return !Number.isInteger(n); })) return true;
  if (p[0] === 0 || p[0] === 10 || p[0] === 127) return true;
  if (p[0] === 192 && p[1] === 168) return true;
  if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
  if (p[0] === 169 && p[1] === 254) return true; // link-local / metadata
  if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true; // CGNAT
  if (p[0] === 198 && (p[1] === 18 || p[1] === 19)) return true; // benchmarks
  if (p[0] >= 224) return true; // multicast / reservado
  return false;
}

function isPrivateIPv6(ip) {
  const s = ip.toLowerCase();
  if (s === "::1" || s === "::") return true;
  if (s.indexOf("fe80") === 0) return true; // link-local
  if (s[0] === "f" && (s[1] === "c" || s[1] === "d")) return true; // ULA
  if (s.indexOf("::ffff:") === 0) return isPrivateIPv4(s.replace("::ffff:", ""));
  return false;
}

async function assertPublicHost(hostname) {
  const host = String(hostname || "").toLowerCase();
  if (!host) throw new Error("URL sin host");
  if (
    host === "localhost" ||
    /\.(local|internal|localhost|home|lan|corp)$/.test(host)
  ) {
    throw new Error("host no permitido");
  }
  let results;
  try {
    results = await dns.lookup(host, { all: true });
  } catch (e) {
    throw new Error("no se pudo resolver el host");
  }
  for (const r of results) {
    const bad = r.family === 6 ? isPrivateIPv6(r.address) : isPrivateIPv4(r.address);
    if (bad) throw new Error("el host resuelve a una dirección privada o reservada");
  }
}

/* ---------------------- Descarga segura (manual) ---------------------- */
async function safeFetch(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch (e) {
    throw new Error("URL inválida");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("solo se permiten URLs http o https");
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicHost(url.hostname);

    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, FETCH_TIMEOUT);
    let res;
    try {
      res = await fetch(url.toString(), {
        redirect: "manual",
        signal: ctrl.signal,
        headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*" },
      });
    } catch (e) {
      throw new Error(
        e && e.name === "AbortError" ? "el sitio tardó demasiado en responder" : "no se pudo conectar al sitio"
      );
    } finally {
      clearTimeout(timer);
    }

    if ([301, 302, 303, 307, 308].indexOf(res.status) !== -1) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error("redirección sin destino");
      url = new URL(loc, url);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("redirección a un protocolo no permitido");
      }
      continue;
    }

    const body = await readLimited(res);
    return { res: res, url: url, html: body };
  }
  throw new Error("demasiadas redirecciones");
}

async function readLimited(res) {
  if (!res.body || typeof res.body.getReader !== "function") {
    const txt = await res.text();
    return txt.slice(0, MAX_BYTES);
  }
  const reader = res.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const step = await reader.read();
    if (step.done) break;
    total += step.value.length;
    chunks.push(Buffer.from(step.value));
    if (total > MAX_BYTES) {
      try { await reader.cancel(); } catch (e) {}
      break;
    }
  }
  return Buffer.concat(chunks).toString("utf8");
}

/* --------------------------- Utilidades regex -------------------------- */
function uniq(arr) {
  return Array.from(new Set(arr));
}
function findAll(re, str) {
  const out = [];
  const r = new RegExp(re.source, re.flags.indexOf("g") === -1 ? re.flags + "g" : re.flags);
  let m;
  while ((m = r.exec(str))) out.push(m[1] != null ? m[1] : m[0]);
  return uniq(out);
}
function has(re, str) {
  return re.test(str);
}
function inlineScripts(html) {
  const out = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) out.push({ attrs: m[1] || "", code: m[2] || "" });
  return out;
}

/* --------------------------- Checks estáticos -------------------------- */
function runChecks(html, finalUrl) {
  const scripts = inlineScripts(html);
  const code = scripts.map(function (s) { return s.code; }).join("\n;\n");
  const checks = [];

  /* A1 · Google Tag Manager */
  const gtmIds = findAll(/\b(GTM-[A-Z0-9]{4,})\b/g, html);
  const gtmPlaceholder = /GTM-X{3,}/i.test(html) || /GTM-XXXX/i.test(html);
  checks.push({
    id: "A1",
    label: "Google Tag Manager",
    status: gtmIds.length && !gtmPlaceholder ? "ok" : gtmPlaceholder ? "warn" : "fail",
    weight: 8,
    evidence: gtmIds.length ? "Contenedor " + gtmIds.join(", ") : "No se encontró contenedor GTM",
    fix: "Instalar el snippet de GTM en <head> y publicar el contenedor.",
  });

  /* A2 · GA4 */
  const ga4Ids = findAll(/\b(G-[A-Z0-9]{6,})\b/g, html);
  const ga4ByScript = has(/googletagmanager\.com\/gtag\/js\?id=G-|google-analytics\.com\/g\/collect/i, html);
  checks.push({
    id: "A2",
    label: "Google Analytics 4",
    status: ga4Ids.length || ga4ByScript ? "ok" : "fail",
    weight: 8,
    evidence: ga4Ids.length
      ? "ID de medición " + ga4Ids.join(", ")
      : ga4ByScript
      ? "Se detectó el endpoint de GA4 / gtag"
      : "No se detectó GA4 ni gtag",
    fix: "Agregar la etiqueta GA4 (G-XXXXXXX) vía gtag o GTM.",
  });

  /* A3 · Meta Pixel */
  const metaPixelIds = findAll(/fbq\(\s*['"]init['"]\s*,\s*['"](\d{6,})['"]/g, html);
  const metaByScript = has(/connect\.facebook\.net/i, html) || has(/fbevents\.js/i, html);
  const hasMeta = metaPixelIds.length || metaByScript;
  checks.push({
    id: "A3",
    label: "Meta Pixel",
    status: metaPixelIds.length ? "ok" : metaByScript ? "warn" : "na",
    weight: 8,
    evidence: metaPixelIds.length
      ? "Pixel ID " + metaPixelIds.join(", ")
      : metaByScript
      ? "Se cargó fbevents.js pero no se pudo leer el ID de init"
      : "No se detectó Meta Pixel (sitio sin campañas Meta)",
    fix: "Si usás Meta Ads, instalar el Pixel base con fbq('init', 'PIXEL_ID').",
  });

  /* A4 · Otras plataformas (informativo) */
  const others = [];
  if (has(/analytics\.tiktok\.com|ttq\.(load|track|page)/i, html)) others.push("TikTok Pixel");
  if (has(/snap\.licdn\.com|_linkedin_partner_id/i, html)) others.push("LinkedIn Insight");
  if (has(/static\.hotjar\.com|hjid/i, html)) others.push("Hotjar");
  if (has(/clarity\.ms/i, html)) others.push("Microsoft Clarity");
  if (has(/googleadservices\.com|AW-\d{6,}/i, html)) others.push("Google Ads");
  if (has(/static\.ads-twitter\.com|twq\(/i, html)) others.push("X/Twitter Pixel");
  checks.push({
    id: "A4",
    label: "Otras plataformas de medición",
    status: "info",
    weight: 0,
    evidence: others.length ? others.join(", ") : "Ninguna adicional detectada",
    fix: "",
  });

  /* A5 · Consent Management Platform */
  const cmpTokens = [
    ["OneTrust", /onetrust/i],
    ["Cookiebot", /cookiebot/i],
    ["Osano", /osano/i],
    ["CookieYes", /cookieyes/i],
    ["Didomi", /didomi/i],
    ["Complianz", /complianz/i],
    ["Tarteaucitron", /tarteaucitron/i],
    ["Termly", /termly/i],
    ["Google Consent Mode (gtag consent)", /gtag\(\s*['"]consent/i],
  ];
  const cmpFound = cmpTokens.filter(function (t) { return t[1].test(html); }).map(function (t) { return t[0]; });
  checks.push({
    id: "A5",
    label: "Consentimiento (CMP / Consent Mode)",
    status: cmpFound.length ? "ok" : "fail",
    weight: 15,
    evidence: cmpFound.length && cmpFound[0] !== undefined
      ? "Detectado: " + cmpFound.join(", ")
      : "No se detectó CMP ni Consent Mode en el HTML",
    fix: "Implementar una CMP y Consent Mode para bloquear tags hasta el consentimiento (Ley 19.628 / GDPR).",
  });

  /* A6 · Deduplicación event_id (solo si hay Meta) */
  const eventIdRef = has(/event_id/i, code) || has(/eventID/i, code) || has(/['"]eid['"]/i, code);
  checks.push({
    id: "A6",
    label: "Deduplicación browser↔server (event_id)",
    status: hasMeta ? (eventIdRef ? "ok" : "fail") : "na",
    weight: 20,
    evidence: eventIdRef
      ? "Se encontraron referencias a event_id en el código del sitio"
      : hasMeta
      ? "No se encontraron referencias a event_id en el marcado inline"
      : "Sin Meta Pixel: no aplica",
    fix: "Generar un event_id único y enviarlo idéntico en el Pixel y en Meta CAPI para deduplicar.",
  });

  /* A7 · PII en claro dentro de scripts */
  const emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
  const clearEmails = uniq(
    (code.match(emailRe) || []).filter(function (e) {
      return !/@(facebook|example|sentry|schema|w3)\./i.test(e);
    })
  );
  checks.push({
    id: "A7",
    label: "Datos personales sin hashear en scripts",
    status: clearEmails.length ? "fail" : "ok",
    weight: 12,
    evidence: clearEmails.length
      ? clearEmails.length + " correo(s) en claro dentro de bloques <script> (enmascarados)"
      : "No se detectaron correos en claro en los scripts inline",
    fix: "Hashear PII (SHA-256) antes de enviarla a plataformas; nunca enviar email/teléfono en claro.",
  });

  /* A10 · Parámetros de matching hasheados */
  const hashedToken = has(/[a-f0-9]{64}/i, code);
  const matchingParam = has(/['"](em|ph|external_id|fn|ln|ct|st|zp|country)['"]\s*:/i, code);
  checks.push({
    id: "A10",
    label: "Parámetros de matching avanzado",
    status: hasMeta ? (hashedToken || matchingParam ? "ok" : "fail") : "na",
    weight: 4,
    evidence: hashedToken
      ? "Se detectaron valores con formato SHA-256"
      : matchingParam
      ? "Se referencian parámetros de matching (em/ph/…)"
      : hasMeta
      ? "No se detectaron parámetros de matching avanzado"
      : "Sin Meta Pixel: no aplica",
    fix: "Enviar parámetros hasheados (em, ph, external_id, _fbp, _fbc) para subir el Event Match Quality.",
  });

  return { checks: checks, hasMeta: hasMeta, gtmIds: gtmIds, ga4Ids: ga4Ids, others: others };
}

/* ------------------- Server-side de primera parte (estimado) ------------- */
async function detectServerSide(html, host) {
  const inlineRef = has(/https?:\/\/(ss|gtm|track|data|measure|collect|server)\./i, html);
  if (inlineRef) {
    return {
      found: true,
      evidence: "El HTML referencia un subdominio de primera parte (ss./gtm./track.…)",
      confidence: "estimated",
    };
  }
  const apex = host.replace(/^www\./i, "");
  const candidates = ["ss." + apex, "gtm." + apex, "track." + apex];
  for (const c of candidates) {
    try {
      const addrs = await Promise.race([
        dns.lookup(c, { all: true }),
        new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, 2500); }),
      ]);
      if (addrs && addrs.length) {
        return { found: true, evidence: "Resuelve el subdominio " + c, confidence: "estimated" };
      }
    } catch (e) {
      /* no resuelve: seguimos */
    }
  }
  return {
    found: false,
    evidence: "No se detectó un subdominio server-side de primera parte",
    confidence: "estimated",
  };
}

/* ------------------------------- Rúbrica ------------------------------- */
function computeIndex(checks, serverSide) {
  let earned = 0;
  let total = 0;
  checks.forEach(function (c) {
    if (c.status === "na" || c.weight === 0) return;
    total += c.weight;
    if (c.status === "ok") earned += c.weight;
    else if (c.status === "warn") earned += c.weight / 2;
  });
  // Bloque server-side (estimado) suma como check ponderado.
  total += 15;
  if (serverSide.found) earned += 15;

  const value = total > 0 ? Math.round((earned / total) * 100) : 0;
  return {
    value: value,
    confidence: "estimated",
    rubric:
      "Índice ponderado sobre checks observables (dedup, PII, consent, server-side, stack, placeholders). " +
      "No es el EMQ de Meta ni mide bloqueo real de usuarios.",
  };
}

/* ------------------------------- Escaneo ------------------------------- */
async function scanSite(rawUrl) {
  let input = String(rawUrl || "").trim();
  if (!input) throw new Error("Falta la URL");
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) {
    input = "https://" + input; // sin esquema: asumimos https
  } else if (!/^https?:\/\//i.test(input)) {
    throw new Error("solo se permiten URLs http o https");
  }

  const { res, url, html } = await safeFetch(input);
  const contentType = res.headers.get("content-type") || "";
  const serverHeader = res.headers.get("server") || "";

  const { checks, hasMeta, gtmIds, ga4Ids, others } = runChecks(html, url.toString());
  const serverSide = await detectServerSide(html, url.hostname);

  const stack = [];
  if (gtmIds.length) stack.push({ platform: "Google Tag Manager", id: gtmIds.join(", "), confidence: "measured" });
  if (ga4Ids.length) stack.push({ platform: "Google Analytics 4", id: ga4Ids.join(", "), confidence: "measured" });
  checks
    .filter(function (c) { return c.id === "A3" && c.status !== "na"; })
    .forEach(function () {
      stack.push({ platform: "Meta Pixel", id: "detectado", confidence: "measured" });
    });
  others.forEach(function (o) { stack.push({ platform: o, id: "detectado", confidence: "measured" }); });

  return {
    version: VERSION,
    mode: "static",
    url: url.toString(),
    host: url.hostname,
    scannedAt: new Date().toISOString(),
    http: {
      status: res.status,
      contentType: contentType,
      server: serverHeader || null,
    },
    stack: stack,
    checks: checks,
    serverSide: serverSide,
    index: computeIndex(checks, serverSide),
    tier2: {
      available: true,
      items: [
        { label: "Event Match Quality (EMQ) real", reason: "Solo lo calcula Meta sobre su grafo de usuarios.", how: "Marketing API / Events Manager con acceso al dataset." },
        { label: "% real de bloqueo (adblock/ITP)", reason: "Depende del navegador de cada visitante, no es observable desde el servidor.", how: "Medición instalada en el sitio o cruce de datos CAPI/GA4." },
        { label: "Pérdida de señal medida", reason: "Requiere comparar eventos browser vs server-side por event_id.", how: "Acceso de solo lectura a Meta CAPI y GA4." },
      ],
    },
    limitations: [
      "Escaneo estático: se lee el HTML servido, no se ejecuta JavaScript. Los tags inyectados en runtime no aparecen (Fase B).",
      "El índice es una rúbrica propia y transparente, no un estándar de mercado.",
      "La detección de server-side es estimada (referencias o DNS).",
    ],
  };
}

/* ------------------------------- Handler ------------------------------- */
function json(code, obj, extraHeaders) {
  const headers = Object.assign(
    {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    extraHeaders || {}
  );
  return { statusCode: code, headers: headers, body: JSON.stringify(obj) };
}

function clientIp(event) {
  const h = event.headers || {};
  const xff = h["x-forwarded-for"] || h["X-Forwarded-For"] || "";
  return (
    h["x-nf-client-connection-ip"] ||
    h["client-ip"] ||
    (xff ? String(xff).split(",")[0].trim() : "") ||
    "unknown"
  );
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: {}, body: "" };
  }

  let url = "";
  if (event.httpMethod === "GET") {
    url = (event.queryStringParameters && event.queryStringParameters.url) || "";
  } else if (event.httpMethod === "POST") {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      url = body.url || "";
    } catch (e) {
      return json(400, { error: "Cuerpo JSON inválido" });
    }
  } else {
    return json(405, { error: "Método no permitido" });
  }

  if (!url) return json(400, { error: "Ingrese la URL del sitio a escanear." });

  if (isRateLimited(clientIp(event))) {
    return json(429, { error: "Demasiadas solicitudes. Pruebe de nuevo en un rato." });
  }

  try {
    const report = await scanSite(url);
    return json(200, report);
  } catch (e) {
    return json(422, { error: (e && e.message) || "No se pudo escanear el sitio." });
  }
};

/* Expuesto para reutilización (servidor de desarrollo local). */
exports.scanSite = scanSite;
