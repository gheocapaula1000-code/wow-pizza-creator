import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mp4 from '@/assets/hero-correct-long.mp4.asset.json';
import webm from '@/assets/hero-correct-long.webm.asset.json';

// The uploaded process film only. Keep the promotional film independent.
export function HeroVideo({ poster }: { poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const play = () => {
      if (userPaused.current || document.hidden) return;
      if (motion.matches || connection?.saveData) {
        video.pause();
        setNeedsPlay(true);
        return;
      }
      void video.play().catch(() => setNeedsPlay(true));
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) play();
      else video.pause();
    }, { threshold: 0.1 });
    observer.observe(video);
    const resume = () => {
      const bounds = video.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) play();
    };
    video.addEventListener('canplay', play);
    window.addEventListener('pageshow', resume);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', resume);
    play();
    return () => {
      observer.disconnect();
      video.removeEventListener('canplay', play);
      window.removeEventListener('pageshow', resume);
      document.removeEventListener('visibilitychange', resume);
      motion.removeEventListener('change', resume);
    };
  }, []);

  const togglePlayback = () => {
    const video = ref.current;
    if (!video) return;
    if (!video.paused) {
      userPaused.current = true;
      video.pause();
    } else {
      userPaused.current = false;
      void video.play().catch(() => setNeedsPlay(true));
    }
  };
  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused && !userPaused.current) void video.play().catch(() => setNeedsPlay(true));
  };

  return <>
    <video ref={ref} className="hero-photo" poster={poster} autoPlay muted={muted} loop playsInline preload="auto"
      aria-label="Condimenti sulla base cotta al 90%, forno di casa e formaggio filante"
      onPlay={() => { setPlaying(true); setNeedsPlay(false); }} onPause={() => setPlaying(false)}
      onError={() => setNeedsPlay(true)}>
      <source src={mp4.url} type="video/mp4" />
      <source src={webm.url} type="video/webm" />
    </video>
    <div className="hero-video-controls">
      {needsPlay ? <Button className="hero-replay" variant="secondary" onClick={togglePlayback}><Play />Riproduci il video</Button>
        : <Button className="hero-video-pause" variant="secondary" size="icon" onClick={togglePlayback}
          aria-label={playing ? 'Metti in pausa il video iniziale' : 'Riprendi il video iniziale'} title={playing ? 'Pausa' : 'Riprendi'}>{playing ? <Pause /> : <Play />}</Button>}
      <Button className="hero-sound" variant="secondary" size="icon" onClick={toggleSound}
        aria-label={muted ? 'Attiva audio del video' : 'Disattiva audio del video'} title={muted ? 'Attiva audio' : 'Disattiva audio'}>{muted ? <VolumeX /> : <Volume2 />}</Button>
    </div>
  </>;
}