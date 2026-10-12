import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import film from '@/assets/pizza-film-web.asset.json';
import poster from '@/assets/pizza-editorial.jpg';

export function PizzaFilm() {
 const ref = useRef<HTMLVideoElement>(null);
 const [playing, setPlaying] = useState(false);
 const [enabled, setEnabled] = useState(false);
 useEffect(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
  setEnabled(!motion.matches && !connection.connection?.saveData);
  const onChange = () => setEnabled(!motion.matches);
  motion.addEventListener('change', onChange);
  return () => motion.removeEventListener('change', onChange);
 }, []);
 useEffect(() => {
  const video = ref.current;
  if (!video || !enabled) return;
  const observer = new IntersectionObserver(([entry]) => {
   if (entry?.isIntersecting) video.play().catch(() => setPlaying(false));
   else video.pause();
  });
  observer.observe(video);
  return () => observer.disconnect();
 }, [enabled]);
 const toggle = () => {
  if (!enabled) { setEnabled(true); return; }
  const video = ref.current;
  if (!video) return;
  if (video.paused) video.play().catch(() => setPlaying(false));
  else video.pause();
 };
 return <>
  <video ref={ref} className="hero-film" src={enabled ? film.url : undefined} poster={poster} muted loop playsInline preload="none" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
  <Button className="film-control" variant="outline" size="icon" onClick={toggle} aria-label={playing ? 'Metti in pausa il video' : 'Riproduci il video'} title={playing ? 'Metti in pausa il video' : 'Riproduci il video'}>{playing ? <Pause/> : <Play/>}</Button>
 </>;
}