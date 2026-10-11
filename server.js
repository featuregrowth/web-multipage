#!/usr/bin/env node
/* ==========================================================================
   Feature Growth · Servidor de desarrollo local
   Sirve el sitio estático y expone el escáner como /api/scan y
   /.netlify/functions/scan (misma función que en producción).

   Uso:  node server.js [puerto]
   ========================================================================== */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const scanFn = require("./functions/scan.js");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT || 8000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

function readBody(req) {
  return new Promise(function (resolve) {
    let data = "";
    req.on("data", function (c) { data += c; if (data.length > 1e6) req.destroy(); });
    req.on("end", function () { resolve(data); });
  });
}

async function handleScan(req, res) {
  const body = await readBody(req);
  const url = new URL(req.url, "http://localhost");
  const result = await scanFn.handler({
    httpMethod: req.method,
    headers: req.headers,
    body: body || null,
    queryStringParameters: Object.fromEntries(url.searchParams.entries()),
  });
  res.writeHead(result.statusCode, result.headers || {});
  res.end(result.body || "");
}

function serveStatic(req, res) {
  const url = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(url.pathname);

  // Evitar path traversal
  let filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, function (err, stat) {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    fs.readFile(filePath, function (err2, data) {
      if (err2) {
        res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
        return res.end("<h1>404</h1><p>No encontrado: " + pathname + "</p>");
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
      res.end(data);
    });
  });
}

const server = http.createServer(function (req, res) {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/scan" || url.pathname === "/.netlify/functions/scan") {
    return handleScan(req, res);
  }
  return serveStatic(req, res);
});

server.listen(PORT, function () {
  console.log("Feature Growth · dev server en http://localhost:" + PORT);
  console.log("Inspector: http://localhost:" + PORT + "/herramientas/inspector-senal-tracking/");
});
