/* Basex Pizza service worker.
 * Il segnaposto di versione qui sotto è sostituito a ogni build (vite.config.ts): ogni rilascio produce un sw.js diverso.
 * Il nuovo worker NON si attiva da solo: resta in attesa finché l'utente tocca «Aggiorna» nel banner
 * (messaggio SKIP_WAITING), così nessuno perde ciò che sta facendo. */
const BUILD = "__SW_BUILD__";
const VERSION = BUILD.startsWith("__SW") ? "dev" : BUILD;
const SHELL_CACHE = `basexpizza-shell-${VERSION}`;
const RUNTIME_CACHE = "basexpizza-runtime-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE = [
  OFFLINE_URL,
  "/manifest-v6.json",
  "/favicon-v6.png",
  "/icon-192-v6.png",
  "/icon-512-v6.png",
];
const NAV_TIMEOUT_MS = 4000;
// Pagine che non vanno mai salvate: area riservata locale e diagnostica.
const NO_CACHE_PATH = /^\/(~oauth|api|_server)(\/|$)/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("basexpizza-shell-") && k !== SHELL_CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") self.skipWaiting();
  if (data.type === "GET_VERSION") {
    const port = event.ports && event.ports[0];
    if (port) port.postMessage({ version: VERSION });
  }
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await Promise.race([fetch(request), timeout(NAV_TIMEOUT_MS)]);
    if (response && response.status === 200 && response.type === "basic") {
      const path = new URL(request.url).pathname;
      if (!NO_CACHE_PATH.test(path)) cache.put(request, response.clone()).catch(() => undefined);
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: false });
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    if (offline) {
      // Un navigate non può ricevere una risposta "redirected": la ricostruiamo pulita.
      return offline.redirected
        ? new Response(await offline.blob(), {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          })
        : offline;
    }
    return new Response("Sei offline.", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response && response.status === 200 && response.type === "basic") {
    cache.put(request, response.clone()).catch(() => undefined);
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Solo stessa origine: le chiamate al Core (altro dominio) vanno sempre in rete.
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js") return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  // File con nome a impronta (immutabili): cache-first.
  if (/^\/assets\/.+-[\w-]{6,}\.(js|css|woff2?|png|svg|jpg|webp)$/.test(url.pathname)) {
    event.respondWith(cacheFirstAsset(request));
  }
});
