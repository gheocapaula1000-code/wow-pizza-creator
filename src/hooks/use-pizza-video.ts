import { useEffect, useRef, useState } from 'react';

export function usePizzaVideo({ maxAutoPlays = 2 }: { maxAutoPlays?: number } = {}) {
  const ref = useRef<HTMLVideoElement>(null);
  const attempted = useRef(false);
  const userPaused = useRef(false);
  const playCount = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setEnabled(!motion.matches && !connection?.saveData);
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    if (!enabled) {
      player.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          player.pause();
          return;
        }
        if (userPaused.current || playCount.current >= maxAutoPlays) return;
        if (!attempted.current) {
          attempted.current = true;
          playCount.current = 1;
          player.play().catch(() => setPlaying(false));
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(player);
    return () => observer.disconnect();
  }, [enabled, maxAutoPlays]);

  const toggle = () => {
    const player = ref.current;
    if (!player) return;
    if (!player.paused) {
      userPaused.current = true;
      player.pause();
      return;
    }
    userPaused.current = false;
    attempted.current = true;
    setShowReplay(false);
    if (player.ended || playCount.current >= maxAutoPlays) {
      player.currentTime = 0;
      playCount.current = 1;
    }
    setEnded(false);
    if (!enabled) {
      setEnabled(true);
      return;
    }
    player.play().catch(() => setPlaying(false));
  };

  useEffect(() => {
    if (enabled && attempted.current && !userPaused.current && !ended && playCount.current < maxAutoPlays) {
      ref.current?.play().catch(() => setPlaying(false));
    }
  }, [enabled, ended, maxAutoPlays]);

  const onEnded = () => {
    setPlaying(false);
    setEnded(true);
    if (playCount.current < maxAutoPlays) {
      playCount.current += 1;
      const player = ref.current;
      if (player) {
        player.currentTime = 0;
        player.play().catch(() => setPlaying(false));
      }
    } else {
      setShowReplay(true);
    }
  };

  return {
    ref,
    enabled,
    playing,
    ended,
    started,
    showReplay,
    toggle,
    onPlay: () => {
      setPlaying(true);
      setEnded(false);
      setStarted(true);
      setShowReplay(false);
    },
    onPause: () => setPlaying(false),
    onEnded,
  };
}
