import { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import webm from '@/assets/strano-ma-vero-promo-21s.webm.asset.json';
import mp4 from '@/assets/strano-ma-vero-promo-21s.mp4.asset.json';
import poster from '@/assets/strano-ma-vero-promo-21s-poster.jpg.asset.json';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

export function PromoFilm() {
  const [muted, setMuted] = useState(true);
  const [webmOk, setWebmOk] = useState(false);
  const { ref, enabled, playing, started, showReplay, toggle, onPlay, onPause, onEnded } = usePizzaVideo({ maxAutoPlays: 1 });
  useEffect(() => {
    if (document.createElement('video').canPlayType('video/webm; codecs="vp9, opus"')) setWebmOk(true);
  }, []);
  const filmSrc = enabled ? (webmOk ? webm.url : mp4.url) : undefined;
  const playWithSound = () => {
    setMuted(false);
    if (ref.current) ref.current.muted = false;
    toggle();
  };
  return (
    <section className="film-section" id="film">
      <div className="film-heading">
        <div>
          <div className="eyebrow">DALLA BASE AL PRIMO MORSO</div>
          <h2>Non immaginarla.<br/><em>Guardala succedere.</em></h2>
        </div>
        <span>STRANO MA VERO! / IL FILM · 00:21</span>
      </div>
      <div className="preparation-stage promo-stage">
        <video ref={ref} src={filmSrc} poster={poster.url} preload="none" playsInline muted={muted} onPlay={onPlay} onPause={onPause} onEnded={onEnded} aria-label="Strano Ma Vero: un ragazzo con gli amici in cucina presenta le basi pizza cotte al 90% con ingredienti freschi"/>
        {!playing && (
          <Button className="film-play" variant="secondary" onClick={playWithSound}>
            <Play/> {showReplay ? 'Guarda ancora' : started ? 'Riprendi il film' : 'Guarda il film'} <span>00:21</span>
          </Button>
        )}
        {playing && (
          <>
            <Button className="preparation-toggle" variant="secondary" size="icon" aria-label="Metti in pausa il film" onClick={toggle}><Pause/></Button>
            <Button className="preparation-toggle promo-sound" variant="secondary" size="icon" aria-label={muted ? 'Attiva audio del film' : 'Disattiva audio del film'} title={muted ? 'Attiva audio' : 'Disattiva audio'} onClick={() => {
              const next = !muted;
              setMuted(next);
              if (ref.current) ref.current.muted = next;
            }}>{muted ? <VolumeX/> : <Volume2/>}</Button>
          </>
        )}
      </div>
      <div className="film-caption"><span>Un ragazzo, gli amici, la cucina di casa: le basi cotte al 90% e ingredienti freschi. Il gran finale è tuo.</span><small>Strano Ma Vero · Film promozionale</small></div>
    </section>
  );
}
