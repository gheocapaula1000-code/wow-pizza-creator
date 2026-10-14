import { useEffect, useRef } from "react";
import { ArrowDown, Loader2 } from "lucide-react";

const THRESHOLD = 72; // px di trascinamento (dopo resistenza) per attivare il refresh
const MAX_PULL = 120;

/**
 * Pull-to-refresh reale: tirando giù dalla cima della pagina si ricarica
 * davvero (window.location.reload()). Attivo solo su input touch, solo quando
 * lo scroll è in cima. Il gesto nativo del browser viene disattivato via CSS
 * (overscroll-behavior-y: contain) per evitare doppi refresh.
 */
export function PullToRefresh() {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const spinnerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const indicator = indicatorRef.current;
    const arrow = arrowRef.current;
    const spinner = spinnerRef.current;
    if (!indicator || !arrow || !spinner) return;

    let startY = 0;
    let pulling = false;
    let pull = 0;
    let refreshing = false;

    const setIndicator = (offset: number, progress: number) => {
      indicator.style.transform = `translate(-50%, ${offset - 56}px)`;
      indicator.style.opacity = String(Math.min(1, progress * 1.4));
      arrow.style.transform = `rotate(${progress >= 1 ? 180 : progress * 180}deg)`;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (refreshing) return;
      if (window.scrollY > 0) return;
      startY = e.touches[0]?.clientY ?? 0;
      pulling = true;
      pull = 0;
      indicator.style.transition = "none";
      arrow.style.transition = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling || refreshing) return;
      if (window.scrollY > 0) {
        pulling = false;
        setIndicator(0, 0);
        return;
      }
      const dy = (e.touches[0]?.clientY ?? 0) - startY;
      if (dy <= 0) {
        pull = 0;
        setIndicator(0, 0);
        return;
      }
      // Resistenza "gomma": più tiri, più fatica.
      pull = Math.min(MAX_PULL, dy * 0.5);
      if (e.cancelable) e.preventDefault();
      setIndicator(pull, pull / THRESHOLD);
    };

    const onTouchEnd = () => {
      if (!pulling || refreshing) return;
      pulling = false;
      if (pull >= THRESHOLD) {
        refreshing = true;
        indicator.style.transition = "transform 160ms ease, opacity 160ms ease";
        setIndicator(48, 1);
        arrow.style.display = "none";
        spinner.style.display = "inline-flex";
        // Refresh vero e proprio.
        window.location.reload();
        return;
      }
      indicator.style.transition = "transform 220ms ease, opacity 220ms ease";
      arrow.style.transition = "transform 220ms ease";
      setIndicator(0, 0);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={indicatorRef}
      className="ptr-indicator"
      aria-hidden="true"
      style={{ transform: "translate(-50%, -56px)", opacity: 0 }}
    >
      <span ref={arrowRef} className="ptr-arrow">
        <ArrowDown size={18} strokeWidth={2.4} />
      </span>
      <span ref={spinnerRef} className="ptr-spinner" style={{ display: "none" }}>
        <Loader2 size={18} strokeWidth={2.4} className="animate-spin" />
      </span>
    </div>
  );
}
