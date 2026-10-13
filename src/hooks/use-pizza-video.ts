import { useEffect, useRef, useState } from 'react';

export function usePizzaVideo({ once = true }: { once?: boolean } = {}) {
 const ref = useRef<HTMLVideoElement>(null);
 const attempted = useRef(false);
 const userPaused = useRef(false);
 const [enabled, setEnabled] = useState(false);
 const [playing, setPlaying] = useState(false);
 const [ended, setEnded] = useState(false);
 const [started, setStarted] = useState(false);
 useEffect(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const update = () => setEnabled(!motion.matches && !connection?.saveData);
  update(); motion.addEventListener('change', update);
  return () => motion.removeEventListener('change', update);
 }, []);
 useEffect(() => {
  const player = ref.current;
  if (!player) return;
  if (!enabled) { player.pause(); return; }
  const observer = new IntersectionObserver(([entry]) => {
   if (!entry?.isIntersecting) { player.pause(); return; }
   if (userPaused.current || (once && attempted.current)) return;
   attempted.current = true;
   player.play().catch(() => setPlaying(false));
  }, { threshold: once ? .4 : .05 });
  observer.observe(player);
  return () => observer.disconnect();
 }, [enabled, once]);
 const toggle = () => {
  const player = ref.current;
  if (!player) return;
  if (!player.paused) { userPaused.current = true; player.pause(); return; }
  userPaused.current = false;
  attempted.current = true;
  if (player.ended) player.currentTime = 0;
  setEnded(false);
  if (!enabled) { setEnabled(true); return; }
  player.play().catch(() => setPlaying(false));
 };
 // An explicit play request also works when automatic playback is disabled.
 useEffect(() => {
  if (enabled && attempted.current && !userPaused.current && !ended) ref.current?.play().catch(() => setPlaying(false));
 }, [enabled]);
 return { ref, enabled, playing, ended, started, toggle,
  onPlay: () => { setPlaying(true); setEnded(false); setStarted(true); },
  onPause: () => setPlaying(false),
  onEnded: () => { setPlaying(false); setEnded(true); },
 };
}