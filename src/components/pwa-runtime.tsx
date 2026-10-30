import { useEffect } from "react";
import { installHardPullToRefresh } from "@/lib/hardPullToRefresh";
import { registerAppServiceWorker } from "@/lib/serviceWorkerRegistration";
import { installUpdateBanner } from "@/lib/updateBanner";

/**
 * Montato una sola volta nella radice: registra il service worker, mostra il banner
 * «Nuova Versione disponibile» (con «Aggiorna») e attiva «Trascina per aggiornare».
 */
export function PwaRuntime() {
  useEffect(() => {
    void registerAppServiceWorker();
    const stopBanner = installUpdateBanner({
      theme: {
        bg: "#fff8ea",
        fg: "#2b1a0e",
        accent: "#c45c26",
        accentFg: "#ffffff",
        border: "rgba(196,92,38,.35)",
      },
    });
    const stopPull = installHardPullToRefresh();
    return () => {
      stopBanner();
      stopPull();
    };
  }, []);
  return null;
}
