/** Una sola registrazione; mai cache dell'app in sviluppo o nelle anteprime dell'editor. */
export function isServiceWorkerAllowed(
  production: boolean,
  hostname: string,
  framed: boolean,
  search: string,
): boolean {
  return (
    production &&
    !framed &&
    !new URLSearchParams(search).has("sw") &&
    !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname) &&
    !/^(id-preview--|preview--)/.test(hostname) &&
    !/(^|\.)(lovableproject\.com|lovableproject-dev\.com|beta\.lovable\.dev)$/.test(hostname)
  );
}

export async function registerAppServiceWorker(): Promise<void> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const allowed = isServiceWorkerAllowed(
    import.meta.env.PROD,
    window.location.hostname,
    window.self !== window.top,
    window.location.search,
  );
  try {
    if (!allowed) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations
          .filter((reg) => {
            const worker = reg.active ?? reg.waiting ?? reg.installing;
            return worker && new URL(worker.scriptURL).pathname === "/sw.js";
          })
          .map((reg) => reg.unregister()),
      );
      return;
    }
    const reg = await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
    void reg.update().catch(() => undefined);
  } catch {
    // L'app online resta disponibile anche se il browser rifiuta la registrazione.
  }
}
