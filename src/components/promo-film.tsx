import { useEffect, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import webm from '@/assets/strano-ma-vero-promo-21s.webm.asset.json';
import mp4 from '@/assets/strano-ma-vero-promo-21s.mp4.asset.json';
import poster from '@/assets/strano-ma-vero-promo-21s-poster.jpg.asset.json';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

export function PromoFilm() {
  const { ref, enabled, playing, started, showReplay, toggle, onPlay, onPause, onEnded } = usePizzaVideo();
  const [muted, setMuted] = useState(true);
  const [webmOk, setWebmOk] = useState(false);
  useEffect(() => {
    if (document.createElement('video').canPlayType('video/webm; codecs="vp9, opus"')) setWebmOk(true);
  }, []);
  const filmSrc = enabled ? (webmOk ? webm.url : mp4.url) : undefined;
  return (
    <section className="promo-band" id="film" aria-labelledby="promo-title">
      <div className="promo-heading">
        <div>
          <div className="eyebrow">IL VIDEO. 21 SECONDI, TUTTA LA STORIA.</div>
          <h2 id="promo-title">Scopri Strano Ma Vero.<br/><em>La base cotta al 90%.</em></h2>
        </div>
        <span>STRANO MA VERO! / IL PROMO · 00:21</span>
      </div>
      <div className="promo-stage">
        <video ref={ref} src={filmSrc} poster={poster.url} preload="none" playsInline muted={muted} onPlay={onPlay} onPause={onPause} onEnded={onEnded} aria-label="Promo Strano Ma Vero: un ragazzo con gli amici in cucina presenta le basi pizza cotte al 90% con ingredienti freschi"/>
        {!playing && (
          <Button
            className={showReplay ? 'promo-button promo-replay' : 'promo-button'}
            variant="secondary"
            onClick={() => { setMuted(true); if (ref.current) ref.current.muted = true; toggle(); }}
          >
            <Play/> {showReplay ? 'Guarda di nuovo' : 'Guarda il promo'} <span>00:21</span>
          </Button>
        )}
        {playing && (
          <>
            <Button className="promo-button promo-icon" variant="secondary" size="icon" aria-label="Metti in pausa il promo" onClick={toggle}><Pause/></Button>
            <Button className="promo-button promo-icon promo-sound" variant="secondary" size="icon" aria-label={muted ? 'Attiva audio del promo' : 'Disattiva audio del promo'} title={muted ? 'Attiva audio' : 'Disattiva audio'} onClick={() => {
              const next = !muted;
              setMuted(next);
              if (ref.current) ref.current.muted = next;
            }}>{muted ? <VolumeX/> : <Volume2/>}</Button>
          </>
        )}
      </div>
      <div className="promo-caption"><span>Un ragazzo, gli amici, la cucina di casa: le basi cotte al 90% e ingredienti freschi. Il gran finale è tuo.</span></div>
    </section>
  );
}
