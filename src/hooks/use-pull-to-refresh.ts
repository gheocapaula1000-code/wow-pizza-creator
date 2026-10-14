import { useEffect, useState } from 'react';

const THRESHOLD = 72;
const MAX_DISTANCE = 108;
type PullState = { distance: number; refreshing: boolean };

export function usePullToRefresh(onRefresh: () => void) {
  const [state, setState] = useState<PullState>({ distance: 0, refreshing: false });

  useEffect(() => {
    let start: { x: number; y: number } | null = null;
    let distance = 0;
    let refreshing = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reset = () => {
      start = null;
      distance = 0;
      if (!refreshing) setState({ distance: 0, refreshing: false });
    };
    const onStart = (event: TouchEvent) => {
      reset();
      const touch = event.touches[0];
      if (refreshing || !touch || event.touches.length !== 1 || window.scrollY > 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (document.querySelector('[role="dialog"][data-state="open"]') || target.closest('button, a, input, textarea, select, video[controls], [role="slider"], [role="dialog"]')) return;
      // Never take over a scrollable panel's own gesture.
      for (let element: Element | null = target; element && element !== document.body && element !== document.documentElement; element = element.parentElement) {
        const overflow = getComputedStyle(element).overflowY;
        if (/(auto|scroll)/.test(overflow) && element.scrollHeight > element.clientHeight) return;
      }
      start = { x: touch.clientX, y: touch.clientY };
    };
    const onMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!start || !touch || refreshing) return;
      const dy = touch.clientY - start.y;
      const dx = Math.abs(touch.clientX - start.x);
      if (event.touches.length !== 1 || window.scrollY > 0 || dy < 0 || dx > Math.max(12, dy)) {
        reset();
        return;
      }
      if (dy <= 8) return;
      if (event.cancelable) event.preventDefault();
      distance = Math.min(MAX_DISTANCE, (dy - 8) * 0.5);
      setState({ distance, refreshing: false });
    };
    const onEnd = (event: TouchEvent) => {
      if (!start || refreshing) return;
      const touch = event.changedTouches[0];
      const releasedDistance = touch ? Math.min(MAX_DISTANCE, Math.max(0, touch.clientY - start.y - 8) * 0.5) : distance;
      if (distance >= THRESHOLD && releasedDistance >= THRESHOLD && window.scrollY <= 0) {
        refreshing = true;
        start = null;
        setState({ distance: THRESHOLD, refreshing: true });
        // Give the spinner a frame to paint before a real page navigation.
        timer = setTimeout(onRefresh, 120);
      } else reset();
    };
    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd, { passive: true });
    document.addEventListener('touchcancel', reset, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', reset);
      if (timer) clearTimeout(timer);
    };
  }, [onRefresh]);

  return { ...state, ready: state.distance >= THRESHOLD };
}