import { useEffect, useRef, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mp4 from '@/assets/hero-correct-long.mp4.asset.json';
import webm from '@/assets/hero-correct-long.webm.asset.json';

export function HeroVideo({ poster }: { poster: string }) {
 const ref = useRef<HTMLVideoElement>(null);
 const [src, setSrc] = useState(mp4.url);
 const [muted, setMuted] = useState(true);
 const [needsPlay, setNeedsPlay] = useState(false);
 const [failed, setFailed] = useState(false);
 const [automatic, setAutomatic] = useState(true);
 const play = () => {
  const player = ref.current;
  if (!player) return;
  void player.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
 };

 useEffect(() => {
  const player = ref.current;
  if (!player) return;
  player.defaultMuted = true;
  player.muted = true;
  // MP4 is the primary source on Safari/iOS; WebM is only a decoder fallback.
  if (!player.canPlayType('video/mp4; codecs="avc1.64001F"')) setSrc(webm.url);
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const allowed = !motion.matches && !connection?.saveData;
  setAutomatic(allowed);
  if (!allowed) { player.pause(); setNeedsPlay(true); }
  else play(); // Start immediately, without waiting for viewport observation.
  const observer = new IntersectionObserver(([entry]) => {
   if (!entry?.isIntersecting || document.hidden) { player.pause(); return; }
   if (allowed) play();
  }, { threshold: 0.1 });
  const resume = () => {
   if (document.hidden) { player.pause(); return; }
   const rect = player.getBoundingClientRect();
   if (allowed && rect.bottom > 0 && rect.top < window.innerHeight) play();
  };
  observer.observe(player);
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('pageshow', resume);
  return () => {
   observer.disconnect();
   document.removeEventListener('visibilitychange', resume);
   window.removeEventListener('pageshow', resume);
  };
 }, []);

 return <>
  {/* Keep the original image underneath: never hide the video to show its poster. */}
  <img className="hero-photo" src={poster} alt="" aria-hidden="true" width={1536} height={1024}/>
  {!failed && <video ref={ref} className="hero-film hero-film-video" src={src} poster={poster}
   autoPlay={automatic} muted={muted} loop playsInline preload="auto"
   onCanPlay={() => { if (automatic) play(); }} onPlaying={() => setNeedsPlay(false)}
   onError={() => {
    if (src === mp4.url) { setSrc(webm.url); return; }
    setFailed(true); setNeedsPlay(true);
   }}
   aria-label="La base al 90%, i condimenti che cadono, il forno di casa e il formaggio che fila"/>}
  <Button className="hero-sound" variant="secondary" size="icon" disabled={failed}
   aria-pressed={!muted} aria-label={muted ? 'Attiva audio del video' : 'Disattiva audio del video'}
   title={muted ? 'Attiva audio' : 'Disattiva audio'} onClick={() => {
    const player = ref.current;
    if (!player) return;
    player.muted = !muted; setMuted(!muted); play();
   }}>{muted ? <VolumeX/> : <Volume2/>}</Button>
  {needsPlay && <Button className="hero-replay" variant="secondary" onClick={() => {
   if (failed) { setFailed(false); setSrc(mp4.url); }
   else play();
  }}><Play/>Riproduci il video</Button>}
 </>;
}