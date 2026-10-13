import { useEffect, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import webm from '@/assets/strano-ma-vero-promo-21s.webm.asset.json';
import mp4 from '@/assets/strano-ma-vero-promo-21s.mp4.asset.json';
import poster from '@/assets/strano-ma-vero-promo-21s-poster.jpg.asset.json';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

export function HeroPromoFilm() {
  const { ref, enabled, playing, started, showReplay, toggle, onPlay, onPause, onEnded } = usePizzaVideo({ maxAutoPlays: 1 });
  const [muted, setMuted] = useState(true);
  const [webmOk, setWebmOk] = useState(false);
  useEffect(() => {
    if (document.createElement('video').canPlayType('video/webm; codecs="vp9, opus"')) setWebmOk(true);
  }, []);
  const filmSrc = enabled ? (webmOk ? webm.url : mp4.url) : undefined;
  return <>
    <video ref={ref} className="hero-film" src={filmSrc} poster={poster.url} muted={muted} playsInline preload={enabled ? 'auto' : 'none'} aria-hidden="true" onPlay={onPlay} onPause={onPause} onEnded={onEnded}/>
    {playing && <>
      <Button className="film-control" variant="outline" size="icon" onClick={toggle} aria-label="Metti in pausa il video"><Pause/></Button>
      <Button className="film-control film-sound" variant="outline" size="icon" aria-label={muted ? 'Attiva audio del video' : 'Disattiva audio del video'} title={muted ? 'Attiva audio' : 'Disattiva audio'} onClick={() => {
        const next = !muted;
        setMuted(next);
        if (ref.current) ref.current.muted = next;
      }}>{muted ? <VolumeX/> : <Volume2/>}</Button>
    </>}
    {started && !playing && <Button className="hero-replay" variant="secondary" onClick={toggle}><Play/> {showReplay ? 'Guarda ancora' : 'Riprendi il video'}</Button>}
  </>;
}
