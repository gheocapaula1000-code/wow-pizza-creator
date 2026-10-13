import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import film from '@/assets/hero-correct.webm.asset.json';
import poster from '@/assets/finale-table.jpg';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

export function PizzaFilm() {
  const { ref, enabled, playing, started, showReplay, toggle, onPlay, onPause, onEnded } = usePizzaVideo();
  return <>
    <video ref={ref} className="hero-film" src={enabled ? film.url : undefined} poster={poster} muted playsInline preload={enabled ? 'auto' : 'none'} aria-hidden="true" onPlay={onPlay} onPause={onPause} onEnded={onEnded} />
    <Button className="film-control" variant="outline" size="icon" onClick={toggle} aria-label={playing ? 'Metti in pausa il video' : started ? 'Guarda ancora il video iniziale' : 'Riproduci il video'} title={playing ? 'Metti in pausa il video' : started ? 'Guarda ancora' : 'Riproduci il video'}>{playing ? <Pause/> : <Play/>}</Button>
    {(started && !playing && showReplay) && <Button className="hero-replay" variant="secondary" onClick={toggle}><Play/> Guarda ancora</Button>}
  </>;
}
