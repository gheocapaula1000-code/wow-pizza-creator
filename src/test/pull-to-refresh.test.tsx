import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';

afterEach(() => { cleanup(); vi.useRealTimers(); Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 }); });

function gesture(type: string, y: number, x = 100, target: Element = document.body) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    touches: { value: type === 'touchend' ? [] : [{ clientX: x, clientY: y }] },
    changedTouches: { value: [{ clientX: x, clientY: y }] },
  });
  fireEvent(target, event);
}

describe('Pull to refresh', () => {
  it('shows progress and refreshes once only after a sufficient pull is released', () => {
    vi.useFakeTimers();
    const reload = vi.fn();
    const { result } = renderHook(() => usePullToRefresh(reload));
    gesture('touchstart', 100);
    gesture('touchmove', 180);
    expect(result.current.distance).toBeGreaterThan(0);
    expect(result.current.ready).toBe(false);
    gesture('touchmove', 270);
    expect(result.current.ready).toBe(true);
    expect(reload).not.toHaveBeenCalled();
    gesture('touchend', 270);
    expect(result.current.refreshing).toBe(true);
    gesture('touchend', 270);
    act(() => vi.advanceTimersByTime(120));
    expect(reload).toHaveBeenCalledOnce();
  });

  it('does not refresh on short, cancelled, horizontal or away-from-top gestures', () => {
    vi.useFakeTimers();
    const reload = vi.fn();
    renderHook(() => usePullToRefresh(reload));
    gesture('touchstart', 100); gesture('touchmove', 130); gesture('touchend', 130);
    gesture('touchstart', 100); gesture('touchmove', 280); gesture('touchcancel', 280); gesture('touchend', 280);
    gesture('touchstart', 100); gesture('touchmove', 200, 350); gesture('touchend', 280);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 200 });
    gesture('touchstart', 100); gesture('touchmove', 280); gesture('touchend', 280);
    act(() => vi.runAllTimers());
    expect(reload).not.toHaveBeenCalled();
  });

  it('leaves interactive controls alone and removes listeners on unmount', () => {
    vi.useFakeTimers();
    const reload = vi.fn();
    const { unmount } = renderHook(() => usePullToRefresh(reload));
    const button = document.createElement('button');
    document.body.append(button);
    gesture('touchstart', 100, 100, button); gesture('touchmove', 280); gesture('touchend', 280);
    button.remove();
    unmount();
    gesture('touchstart', 100); gesture('touchmove', 280); gesture('touchend', 280);
    act(() => vi.runAllTimers());
    expect(reload).not.toHaveBeenCalled();
  });
});