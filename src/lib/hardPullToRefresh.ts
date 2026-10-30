/**
 * Trascina in giù per aggiornare (pull-to-refresh) con hard refresh.
 *
 * Un solo modulo, senza dipendenze, montato una volta nel layout radice:
 * copre tutte le pagine. Funziona su iPhone (Safari e app installata, dove il
 * gesto nativo non c'è) e su Android Chrome (il gesto nativo viene spento con
 * overscroll-behavior, così non c'è un doppio aggiornamento).
 *
 * Hard refresh: svuota solo la cache runtime BasexPizza e verifica aggiornamenti,
 * senza reinstallare o attivare worker. La shell offline resta disponibile.
 * Ricarica con un cache-buster. localStorage, IndexedDB e la sessione restano:
 * l'utente resta dentro e non perde i dati.
 */

export const PTR_THRESHOLD_PX = 72;
const PTR_MAX_PX = 120;
const PTR_RESISTANCE = 0.5;
const REFRESH_PARAM = "_aggiorna";
const INSTALLED_FLAG = "__pigiHardPullToRefresh";

export interface PullToRefreshLabels {
  pull: string;
  release: string;
  refreshing: string;
  /** Mostrato quando nella pagina c'è qualcosa di scritto e non ancora salvato. */
  unsaved: string;
}

export const LABELS_IT: PullToRefreshLabels = {
  pull: "Trascina per aggiornare",
  release: "Rilascia per aggiornare",
  refreshing: "Aggiorno…",
  unsaved: "Hai scritto qualcosa: salvalo prima di aggiornare",
};

export interface HardPullToRefreshOptions {
  threshold?: number;
  labels?: PullToRefreshLabels | (() => PullToRefreshLabels);
  /** Blocco in più deciso dall'app (es. foto o salvataggio in corso). */
  blocked?: () => boolean;
  /** Sostituisce l'hard refresh (solo per i test). */
  onRefresh?: () => void | Promise<void>;
}

const BLOCKED_SELECTOR = [
  "[data-no-pull-refresh]",
  "[role='dialog']",
  "[role='alertdialog']",
  "[aria-modal='true']",
  "[data-vaul-drawer]",
  "[data-radix-popper-content-wrapper]",
  "[role='listbox']",
  "[role='menu']",
  "dialog",
  ".leaflet-container",
  ".maplibregl-map",
  ".mapboxgl-map",
  ".gm-style",
  "canvas",
  "video",
  "input",
  "textarea",
  "select",
  "[contenteditable='']",
  "[contenteditable='true']",
].join(",");

const OPEN_OVERLAY_SELECTOR = [
  "[role='dialog'][data-state='open']",
  "[role='alertdialog'][data-state='open']",
  "[aria-modal='true']",
  "[data-vaul-drawer][data-state='open']",
  "dialog[open]",
].join(",");

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([p, new Promise<undefined>((r) => setTimeout(() => r(undefined), ms))]);
}

/** Il sito risponde davvero? (HEAD senza cache: il service worker non la serve dalla cache.) */
async function serverReachable(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  if (typeof fetch !== "function") return true;
  try {
    const res = await withTimeout(
      fetch(window.location.href, {
        method: "HEAD",
        cache: "no-store",
        credentials: "same-origin",
      }),
      3000,
    );
    return !!res?.ok;
  } catch {
    return false;
  }
}

/**
 * Svuota la cache runtime BasexPizza, verifica aggiornamenti e ricarica da zero.
 * Senza rete non svuota niente: ricarica soltanto, così l'app offline continua ad aprirsi.
 */
export async function hardRefresh(
  reload: () => void = () => window.location.reload(),
): Promise<void> {
  if (!(await serverReachable())) {
    reload();
    return;
  }
  try {
    if (typeof caches !== "undefined") {
      const keys = await withTimeout(caches.keys(), 2000);
      if (keys)
        await withTimeout(
          Promise.all(
            keys.filter((k) => /^basexpizza-runtime-v\d+$/.test(k)).map((k) => caches.delete(k)),
          ),
          2000,
        );
    }
  } catch {
    /* ignore */
  }
  try {
    if ("serviceWorker" in navigator) {
      const regs = (await withTimeout(navigator.serviceWorker.getRegistrations(), 1500)) ?? [];
      await withTimeout(
        Promise.all(
          regs.map(async (reg) => {
            const worker = reg.active ?? reg.waiting ?? reg.installing;
            if (!worker || new URL(worker.scriptURL, window.location.origin).pathname !== "/sw.js")
              return;
            try {
              await reg.update();
            } catch {
              /* offline o sw non raggiungibile */
            }
          }),
        ),
        4000,
      );
    }
  } catch {
    /* ignore */
  }
  // Cache-buster nell'indirizzo + reload: la pagina arriva dalla rete e lo stato della
  // cronologia (es. dati passati tra le pagine) resta, come in un normale «ricarica».
  const url = new URL(window.location.href);
  url.searchParams.set(REFRESH_PARAM, Date.now().toString(36));
  try {
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    reload();
  } catch {
    window.location.replace(url.toString());
  }
}

/** Toglie il cache-buster dall'indirizzo dopo la ricarica (l'URL resta pulito). */
export function stripRefreshParam(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(REFRESH_PARAM)) return;
    url.searchParams.delete(REFRESH_PARAM);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  } catch {
    /* ignore */
  }
}

function isTyping(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (el && el !== document.body) {
    if (el.isContentEditable) return true;
    const tag = el.tagName;
    if (tag === "TEXTAREA" || tag === "SELECT") return true;
    if (tag === "INPUT") {
      const type = ((el as HTMLInputElement).type || "text").toLowerCase();
      if (
        ![
          "button",
          "submit",
          "reset",
          "checkbox",
          "radio",
          "range",
          "color",
          "file",
          "image",
        ].includes(type)
      )
        return true;
    }
  }
  const vv = window.visualViewport;
  if (vv && vv.height < window.innerHeight * 0.7) return true; // tastiera aperta
  return false;
}

const TEXT_INPUT_TYPES = [
  "",
  "text",
  "email",
  "tel",
  "url",
  "number",
  "password",
  "date",
  "datetime-local",
  "month",
  "time",
  "week",
];

/** Un campo in cui l'utente sta compilando dati (non le ricerche). */
function isDataField(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.closest("[data-no-unsaved-guard]")) return false;
  if (el.isContentEditable || el.tagName === "TEXTAREA" || el.tagName === "SELECT") return true;
  if (el.tagName !== "INPUT") return false;
  const input = el as HTMLInputElement;
  const type = (input.getAttribute("type") || "").toLowerCase();
  if (!TEXT_INPUT_TYPES.includes(type)) return false;
  const hint =
    `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute("aria-label") ?? ""} ${input.getAttribute("role") ?? ""}`.toLowerCase();
  return !/search|cerca|ricerca|filtra|filter/.test(hint);
}

/** Il campo contiene testo scritto e diverso da quello di partenza? */
function fieldHasNewText(el: HTMLElement): boolean {
  if (el.isContentEditable) return (el.textContent ?? "").trim() !== "";
  if (el.tagName === "SELECT") {
    const select = el as HTMLSelectElement;
    return Array.from(select.options).some((o) => o.selected !== o.defaultSelected);
  }
  const field = el as HTMLInputElement | HTMLTextAreaElement;
  return field.value.trim() !== "" && field.value !== field.defaultValue;
}

function isBlocked(target: EventTarget | null): boolean {
  if (document.body?.hasAttribute("data-scroll-locked")) return true;
  for (const o of Array.from(document.querySelectorAll(OPEN_OVERLAY_SELECTOR))) {
    if (o.getClientRects().length > 0 && getComputedStyle(o).visibility !== "hidden") return true;
  }
  const el = target instanceof Element ? target : null;
  return !!el?.closest(BLOCKED_SELECTOR);
}

function isAtTop(target: EventTarget | null): boolean {
  const se = document.scrollingElement || document.documentElement;
  if ((window.scrollY || 0) > 0 || (se && se.scrollTop > 0)) return false;
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    if (el.scrollTop > 0) {
      const oy = getComputedStyle(el).overflowY;
      if (oy === "auto" || oy === "scroll" || oy === "overlay") return false;
    }
    el = el.parentElement;
  }
  return true;
}

const ARROW_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>';

function createIndicator(): { root: HTMLDivElement; icon: HTMLSpanElement; text: HTMLSpanElement } {
  const root = document.createElement("div");
  root.setAttribute("data-ptr-indicator", "");
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");
  root.style.cssText = [
    "position:fixed",
    "left:50%",
    "top:calc(env(safe-area-inset-top, 0px) + 10px)",
    "z-index:2147483000",
    "display:flex",
    "align-items:center",
    "gap:8px",
    "padding:9px 16px",
    "border-radius:999px",
    "background:#ffffff",
    "color:#111827",
    "font:600 14px/1.2 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
    "box-shadow:0 6px 20px rgba(0,0,0,.18)",
    "border:1px solid rgba(0,0,0,.08)",
    "pointer-events:none",
    "white-space:nowrap",
    "max-width:calc(100vw - 24px)",
    "opacity:0",
    "transform:translate(-50%,-80px)",
    "will-change:transform,opacity",
  ].join(";");
  const icon = document.createElement("span");
  icon.style.cssText = "display:inline-flex;transition:transform .12s linear";
  icon.innerHTML = ARROW_SVG;
  const text = document.createElement("span");
  root.append(icon, text);
  return { root, icon, text };
}

let spinStyleAdded = false;
function ensureSpinStyle() {
  if (spinStyleAdded) return;
  spinStyleAdded = true;
  const s = document.createElement("style");
  s.textContent =
    "@keyframes pigi-ptr-spin{to{transform:rotate(360deg)}}" +
    "html,body{overscroll-behavior-y:none}";
  document.head.appendChild(s);
}

/**
 * Attiva il gesto su tutta l'app. Restituisce la funzione per spegnerlo.
 * Chiamarla più volte non crea doppioni.
 */
export function installHardPullToRefresh(options: HardPullToRefreshOptions = {}): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};
  stripRefreshParam();
  const w = window as unknown as Record<string, unknown>;
  if (w[INSTALLED_FLAG]) return () => {};
  const touchCapable = "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0;
  if (!touchCapable) return () => {};
  w[INSTALLED_FLAG] = true;
  ensureSpinStyle();

  const threshold = options.threshold ?? PTR_THRESHOLD_PX;
  const getLabels = (): PullToRefreshLabels =>
    typeof options.labels === "function" ? options.labels() : (options.labels ?? LABELS_IT);
  const doRefresh = options.onRefresh ?? (() => hardRefresh());

  // Dati scritti e non salvati: il gesto non ricarica finché non si invia il modulo o si cambia pagina.
  // Se un pulsante «Salva» svuota il campo (o lo rimette com'era), non c'è più niente da perdere.
  let dirtyPath: string | null = null;
  const edited = new Set<HTMLElement>();
  const onInput = (e: Event) => {
    if (!isDataField(e.target)) return;
    if (dirtyPath !== window.location.pathname) edited.clear();
    dirtyPath = window.location.pathname;
    edited.add(e.target as HTMLElement);
  };
  const onSubmit = () => {
    dirtyPath = null;
    edited.clear();
  };
  const hasUnsaved = () => {
    if (dirtyPath === null || dirtyPath !== window.location.pathname) return false;
    for (const el of edited) {
      if (!el.isConnected) edited.delete(el);
      else if (fieldHasNewText(el)) return true;
      else edited.delete(el);
    }
    return false;
  };
  document.addEventListener("input", onInput, true);
  document.addEventListener("submit", onSubmit, true);

  const ui = createIndicator();
  let mounted = false;
  const mount = () => {
    if (!mounted) {
      document.body.appendChild(ui.root);
      mounted = true;
    }
  };

  let startX = 0;
  let startY = 0;
  let armed = false;
  let pulling = false;
  let distance = 0;
  let busy = false;
  let passed = false;

  const render = () => {
    mount();
    const labels = getLabels();
    const ready = distance >= threshold;
    const y = Math.min(distance, PTR_MAX_PX) - 60;
    ui.root.style.transition = "none";
    ui.root.style.opacity = String(Math.min(1, distance / (threshold * 0.6)));
    ui.root.style.transform = `translate(-50%, ${y}px)`;
    ui.icon.style.animation = "";
    ui.icon.style.transform = `rotate(${Math.round((distance / threshold) * 270)}deg)`;
    if (hasUnsaved()) {
      ui.text.textContent = labels.unsaved;
      return;
    }
    ui.text.textContent = ready ? labels.release : labels.pull;
    if (ready && !passed) {
      passed = true;
      try {
        navigator.vibrate?.(8);
      } catch {
        /* ignore */
      }
    } else if (!ready) passed = false;
  };

  const hide = () => {
    ui.root.style.transition = "transform .2s ease-out, opacity .2s ease-out";
    ui.root.style.opacity = "0";
    ui.root.style.transform = "translate(-50%,-80px)";
  };

  const reset = () => {
    armed = false;
    pulling = false;
    distance = 0;
    passed = false;
  };

  const onStart = (e: TouchEvent) => {
    reset();
    if (busy || e.touches.length !== 1) return;
    if (isTyping() || isBlocked(e.target) || !isAtTop(e.target)) return;
    try {
      if (options.blocked?.()) return;
    } catch {
      /* ignore */
    }
    const t = e.touches[0];
    if (!t) return;
    startX = t.clientX;
    startY = t.clientY;
    armed = true;
  };

  const onMove = (e: TouchEvent) => {
    if (!armed || busy) return;
    if (e.touches.length !== 1) {
      reset();
      hide();
      return;
    }
    const t = e.touches[0];
    if (!t) return;
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (!pulling) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        reset();
        return;
      }
      if (dy < 0) {
        reset();
        return;
      }
      if (dy < 12) return;
      if (!isAtTop(e.target)) {
        reset();
        return;
      }
      pulling = true;
    }
    if (e.cancelable) e.preventDefault();
    distance = Math.max(0, dy * PTR_RESISTANCE);
    if (distance === 0) {
      hide();
      return;
    }
    render();
  };

  const onEnd = () => {
    if (!pulling) {
      reset();
      return;
    }
    const fire = distance >= threshold && !busy && !hasUnsaved();
    reset();
    if (!fire) {
      hide();
      return;
    }
    busy = true;
    mount();
    ui.root.style.transition = "transform .15s ease-out";
    ui.root.style.opacity = "1";
    ui.root.style.transform = "translate(-50%, 6px)";
    ui.icon.style.transform = "";
    ui.icon.style.animation = "pigi-ptr-spin .8s linear infinite";
    ui.text.textContent = getLabels().refreshing;
    void Promise.resolve()
      .then(() => doRefresh())
      .catch(() => window.location.reload())
      .finally(() => {
        if (options.onRefresh) {
          busy = false;
          ui.icon.style.animation = "";
          hide();
        }
      });
  };

  const onCancel = () => {
    reset();
    hide();
  };

  const opts: AddEventListenerOptions = { capture: true, passive: false };
  window.addEventListener("touchstart", onStart, { capture: true, passive: true });
  window.addEventListener("touchmove", onMove, opts);
  window.addEventListener("touchend", onEnd, { capture: true });
  window.addEventListener("touchcancel", onCancel, { capture: true });

  return () => {
    window.removeEventListener("touchstart", onStart, { capture: true });
    window.removeEventListener("touchmove", onMove, { capture: true });
    window.removeEventListener("touchend", onEnd, { capture: true });
    window.removeEventListener("touchcancel", onCancel, { capture: true });
    document.removeEventListener("input", onInput, true);
    document.removeEventListener("submit", onSubmit, true);
    ui.root.remove();
    w[INSTALLED_FLAG] = false;
  };
}
