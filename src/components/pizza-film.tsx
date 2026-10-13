import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import film from '@/assets/hero-long.webm.asset.json';
import poster from '@/assets/finale-table.jpg';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

export function PizzaFilm() {
 const { ref, enabled, playing, toggle, onPlay, onPause } = usePizzaVideo();
 return <>
  <video ref={ref} className="hero-film" src={enabled ? film.url : undefined} poster={poster} muted autoPlay={enabled} loop playsInline preload={enabled ? 'auto' : 'none'} aria-hidden="true" onPlay={onPlay} onPause={onPause} />
  <Button className="film-control" variant="outline" size="icon" onClick={toggle} aria-label={playing ? 'Metti in pausa il video' : 'Riproduci il video'} title={playing ? 'Metti in pausa il video' : 'Riproduci il video'}>{playing ? <Pause/> : <Play/>}</Button>
 </>;
}