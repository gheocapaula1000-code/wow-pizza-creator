/** Banner mostrato solo per un Service Worker installato con versione diversa dal controller attivo. */
import { isServiceWorkerAllowed } from "@/lib/serviceWorkerRegistration";

declare const __PIGI_BUILD_ID__: string | undefined;

export interface UpdateBannerOptions {
  /** Id della build in esecuzione. Se manca: il primo id letto diventa la base (siti statici). */
  currentBuildId?: string | null;
  versionUrl?: string;
  intervalMs?: number;
  /** Distanza dall'alto in px (es. altezza di un header fisso che non va coperto). */
  topOffset?: number;
  /** Pagine in cui non mostrarlo (pagamento ecc.). */
  blockedPaths?: RegExp;
  blocked?: () => boolean;
  theme?: Partial<{
    bg: string;
    fg: string;
    accent: string;
    accentFg: string;
    border: string;
    radius: string;
    font: string;
  }>;
  labels?: Partial<{
    title: string;
    text: string;
    button: string;
    updating: string;
    close: string;
  }>;
  /** Solo test. */
  onUpdate?: () => void | Promise<void>;
}

const STORE_KEY = "pigi-app-version";
const ROOT_ID = "pigi-update-banner";
const FLAG = "__pigiUpdateBanner";
const DEFAULT_BLOCKED = /(checkout|pagamento|payment|paga|abbonati\/|stripe)/i;
const OPEN_OVERLAY = [
  "[role='dialog'][data-state='open']",
  "[role='alertdialog'][data-state='open']",
  "[aria-modal='true']",
  "[data-vaul-drawer][data-state='open']",
  "dialog[open]",
].join(",");

interface Stored {
  seen?: string;
  dismissed?: string;
  updatedTo?: string;
  dismissedSwVersion?: string;
  updatedSwVersion?: string;
}

function load(): Stored {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}
function save(s: Stored) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function embeddedBuildId(): string | null {
  try {
    return typeof __PIGI_BUILD_ID__ === "string" && __PIGI_BUILD_ID__ ? __PIGI_BUILD_ID__ : null;
  } catch {
    return null;
  }
}

function isTyping(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body) return false;
  if (el.closest?.("#" + ROOT_ID)) return false;
  if (el.isContentEditable) return true;
  if (el.tagName === "TEXTAREA" || el.tagName === "SELECT") return true;
  if (el.tagName === "INPUT") {
    const t = ((el as HTMLInputElement).type || "text").toLowerCase();
    return ![
      "button",
      "submit",
      "reset",
      "checkbox",
      "radio",
      "range",
      "color",
      "file",
      "image",
    ].includes(t);
  }
  return false;
}

function overlayOpen(): boolean {
  for (const o of Array.from(document.querySelectorAll(OPEN_OVERLAY))) {
    if ((o as HTMLElement).closest("#" + ROOT_ID)) continue;
    const r = (o as HTMLElement).getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return true;
  }
  return false;
}

/** Colore dell'app: le variabili shadcn possono essere «222 47% 11%» (hsl) oppure un colore completo. */
function cssColor(name: string, fallback: string): string {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!v) return fallback;
    if (/^(#|rgb|hsl|oklch|oklab|lab|lch|color\()/i.test(v)) return `var(${name})`;
    if (/^[\d.]+(deg)?\s+[\d.]+%\s+[\d.]+%/.test(v)) return `hsl(var(${name}))`;
  } catch {
    /* ignore */
  }
  return fallback;
}

function workerVersion(worker: ServiceWorker): Promise<string | null> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const finish = (version: string | null) => {
      clearTimeout(timer);
      channel.port1.close();
      channel.port2.close();
      resolve(version);
    };
    const timer = setTimeout(() => finish(null), 2000);
    channel.port1.onmessage = (event: MessageEvent<unknown>) => {
      const data = event.data;
      const version =
        typeof data === "object" && data !== null && "version" in data ? data.version : null;
      finish(typeof version === "string" && version ? version : null);
    };
    try {
      worker.postMessage({ type: "GET_VERSION" }, [channel.port2]);
    } catch {
      finish(null);
    }
  });
}

export function installUpdateBanner(options: UpdateBannerOptions = {}): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};
  if (
    !isServiceWorkerAllowed(
      import.meta.env.PROD,
      window.location.hostname,
      window.self !== window.top,
      window.location.search,
    )
  )
    return () => {};
  const w = window as unknown as Record<string, unknown>;
  if (w[FLAG]) return () => {};
  w[FLAG] = true;

  const interval = options.intervalMs ?? 5 * 60 * 1000;
  const blockedPaths = options.blockedPaths ?? DEFAULT_BLOCKED;
  const L = {
    title: "Nuova Versione disponibile",
    text: "Tocca Aggiorna per caricare subito la nuova versione. I tuoi dati restano.",
    button: "Aggiorna",
    updating: "Aggiorno…",
    close: "Chiudi",
    ...options.labels,
  };

  let pending: string | null = null;
  let root: HTMLDivElement | null = null;
  let waitTimer: ReturnType<typeof setInterval> | null = null;
  let stopped = false;
  let registration: ServiceWorkerRegistration | null = null;
  let updating = false;
  let detection = 0;
  let removeWorkerListeners = () => {};

  async function detectWaitingWorker() {
    const attempt = ++detection;
    const worker = registration?.waiting;
    const controller = navigator.serviceWorker.controller;
    if (stopped || updating) return;
    if (!worker || worker.state !== "installed" || !controller) {
      pending = null;
      hide();
      return;
    }
    const [nextVersion, activeVersion] = await Promise.all([
      workerVersion(worker),
      workerVersion(controller),
    ]);
    if (
      stopped ||
      updating ||
      attempt !== detection ||
      registration?.waiting !== worker ||
      navigator.serviceWorker.controller !== controller ||
      worker.state !== "installed"
    )
      return;
    const stored = load();
    pending =
      nextVersion &&
      activeVersion &&
      nextVersion !== activeVersion &&
      stored.dismissedSwVersion !== nextVersion &&
      stored.updatedSwVersion !== nextVersion
        ? nextVersion
        : null;
    tryShow();
  }

  function attachRegistration(reg: ServiceWorkerRegistration) {
    if (stopped || registration === reg) return;
    removeWorkerListeners();
    registration = reg;
    let installing: ServiceWorker | null = null;
    const onStateChange = () => {
      detectWaitingWorker();
      // Il passaggio a waiting può essere completato dopo l'evento installed.
      void Promise.resolve().then(detectWaitingWorker);
    };
    const onUpdateFound = () => {
      installing?.removeEventListener("statechange", onStateChange);
      installing = reg.installing;
      installing?.addEventListener("statechange", onStateChange);
    };
    reg.addEventListener("updatefound", onUpdateFound);
    onUpdateFound();
    detectWaitingWorker();
    removeWorkerListeners = () => {
      reg.removeEventListener("updatefound", onUpdateFound);
      installing?.removeEventListener("statechange", onStateChange);
    };
    void reg.update().catch(() => undefined);
  }

  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker
      .getRegistration()
      .then((reg) => {
        if (reg) attachRegistration(reg);
      })
      .catch(() => undefined);
    // La registrazione in main.tsx può terminare dopo il montaggio del banner.
    void navigator.serviceWorker.ready.then(attachRegistration).catch(() => undefined);
  }

  function canShow(): boolean {
    if (document.visibilityState === "hidden") return false;
    if (blockedPaths.test(window.location.pathname)) return false;
    if (isTyping() || overlayOpen()) return false;
    if (options.blocked?.()) return false;
    return true;
  }

  function hide() {
    root?.remove();
    root = null;
  }

  function render(id: string) {
    if (root && root.dataset["version"] === id) return;
    hide();
    document.querySelectorAll("#" + ROOT_ID).forEach((n) => n.remove());
    const t = options.theme || {};
    const bg = t.bg || cssColor("--card", cssColor("--background", "#ffffff"));
    const fg = t.fg || cssColor("--card-foreground", cssColor("--foreground", "#111827"));
    const accent = t.accent || cssColor("--primary", "#2563eb");
    const accentFg = t.accentFg || cssColor("--primary-foreground", "#ffffff");
    const border = t.border || cssColor("--border", "rgba(0,0,0,.12)");
    const radius = t.radius || "0.5rem";
    const font = t.font || "inherit";

    const el = document.createElement("div");
    el.id = ROOT_ID;
    el.dataset["version"] = id;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("data-no-pull-refresh", "");
    el.style.cssText = [
      "position:fixed",
      "left:max(0.5rem, env(safe-area-inset-left))",
      "right:max(0.5rem, env(safe-area-inset-right))",
      "bottom:calc(var(--bottom-nav-total, env(safe-area-inset-bottom, 0px)) + 0.5rem)",
      "z-index:1101",
      "margin:0 auto",
      "max-width:480px",
      "box-sizing:border-box",
      `background:${bg}`,
      `color:${fg}`,
      `border:1px solid ${border}`,
      `border-radius:${radius}`,
      "box-shadow:0 10px 30px rgba(0,0,0,.18)",
      "padding:1rem",
      `font-family:${font}`,
      "font-size:15px",
      "line-height:1.35",
      "text-align:left",
    ].join(";");

    const title = document.createElement("p");
    title.textContent = L.title;
    title.style.cssText = "margin:0 0 2px;font-weight:700;font-size:16px";
    const text = document.createElement("p");
    text.textContent = L.text;
    text.style.cssText = "margin:0 0 10px;opacity:.85;font-size:14px";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = L.button;
    btn.setAttribute("data-update-now", "");
    btn.style.cssText = [
      "display:block",
      "width:100%",
      "min-height:48px",
      "border:0",
      `border-radius:${radius === "0" ? "0" : "12px"}`,
      `background:${accent}`,
      `color:${accentFg}`,
      "font:inherit",
      "font-size:16px",
      "font-weight:700",
      "cursor:pointer",
    ].join(";");

    const x = document.createElement("button");
    x.type = "button";
    x.setAttribute("aria-label", L.close);
    x.setAttribute("data-update-close", "");
    x.textContent = L.close;
    x.style.cssText =
      "display:block;width:100%;min-height:3rem;margin-top:0.5rem;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer";

    x.addEventListener("click", () => {
      const s = load();
      s.dismissedSwVersion = id;
      save(s);
      pending = null;
      hide();
    });
    btn.addEventListener("click", async () => {
      updating = true;
      btn.disabled = true;
      x.disabled = true;
      btn.textContent = L.updating;
      const s = load();
      s.updatedSwVersion = id;
      save(s);
      try {
        if (options.onUpdate) await options.onUpdate();
        else if (registration?.waiting) {
          let reloaded = false;
          const reload = () => {
            if (reloaded || stopped) return;
            reloaded = true;
            navigator.serviceWorker.removeEventListener("controllerchange", reload);
            window.location.reload();
          };
          navigator.serviceWorker.addEventListener("controllerchange", reload);
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          const timer = setTimeout(reload, 5000);
          const previousCleanup = removeWorkerListeners;
          removeWorkerListeners = () => {
            previousCleanup();
            clearTimeout(timer);
            navigator.serviceWorker.removeEventListener("controllerchange", reload);
          };
        } else window.location.reload();
      } catch {
        window.location.reload();
      }
    });

    el.append(title, text, btn, x);
    document.body.appendChild(el);
    root = el;
  }

  function tryShow() {
    if (stopped) return;
    if (!pending) {
      hide();
      return;
    }
    if (canShow()) {
      render(pending);
      if (waitTimer) {
        clearInterval(waitTimer);
        waitTimer = null;
      }
    } else if (!root && !waitTimer) {
      waitTimer = setInterval(tryShow, 3000);
    }
  }

  async function check() {
    if (stopped) return;
    if ("serviceWorker" in navigator) {
      try {
        const reg = registration ?? (await navigator.serviceWorker.getRegistration());
        if (stopped) return;
        if (reg) {
          attachRegistration(reg);
          void reg.update().catch(() => undefined);
        }
      } catch {
        /* rete non disponibile: conserva il banner corrente */
      }
    }
    await detectWaitingWorker();
  }

  const onVis = () => {
    if (document.visibilityState === "visible") void check();
  };
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("online", onVis);
  const startTimer = setTimeout(() => void check(), 2500);
  const loop = setInterval(() => void check(), interval);
  w["__pigiCheckUpdate"] = () => check();

  return () => {
    stopped = true;
    removeWorkerListeners();
    w[FLAG] = false;
    clearTimeout(startTimer);
    clearInterval(loop);
    if (waitTimer) clearInterval(waitTimer);
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("online", onVis);
    hide();
  };
}
