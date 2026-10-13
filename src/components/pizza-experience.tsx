import { useState } from 'react';
import { Play, ArrowUpRight, MoveHorizontal, Pause, Volume2, VolumeX } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import base from '@/assets/pizza-base.jpg';
import finished from '@/assets/recipe-diavola.jpg';
import preparation from '@/assets/strano-ma-vero-promo.webm.asset.json';
import promoPoster from '@/assets/strano-ma-vero-promo-poster.jpg.asset.json';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

export function PizzaTransformation() {
 const [amount,setAmount] = useState(50);
 return <section className="transformation section-space" id="il-finale">
  <div className="transformation-copy"><div className="eyebrow">IL NOSTRO 90%. IL TUO 10%.</div><h2>La magia?<br/>È l’ultimo <em>tocco.</em></h2><p>La base è sempre la stessa, cotta al 90%. Ogni pizza ha i suoi condimenti già preconfezionati. A casa li aggiungi alla base e completi la pizza con gli ultimi 3 minuti di cottura nel tuo forno.</p><div className="transformation-stats"><div><strong>90%</strong><span>La base è già cotta</span></div><div><strong>100%</strong><span>La ricetta che scegli</span></div></div><Button asChild variant="outline"><Link to="/pizze">Trova la tua preferita <ArrowUpRight/></Link></Button></div>
  <div className="comparison"><div className="comparison-images"><img src={base} alt="La base pizza precotta al 90%, senza condimenti" width={1024} height={1024} loading="lazy"/><img className="comparison-final" style={{clipPath:`inset(0 ${100-amount}% 0 0)`}} src={finished} alt="Esempio di Diavola dopo l’aggiunta dei condimenti e la cottura" width={1024} height={1024} loading="lazy"/><div className="comparison-divider" style={{left:`${amount}%`}} aria-hidden="true"><MoveHorizontal/></div><span className="comparison-label before">IL TUO FINALE</span><span className="comparison-label after">LA NOSTRA BASE</span></div><Slider className="comparison-slider" min={0} max={100} step={1} value={[amount]} onValueChange={values => setAmount(values[0] ?? 50)} aria-label="Confronta base e pizza finita"/><div className="comparison-ends"><span>La base</span><span>Il gran finale</span></div></div>
 </section>;
}
export function PreparationFilm() {
 const [muted, setMuted] = useState(true);
 const { ref, enabled, playing, started, showReplay, toggle, onPlay, onPause, onEnded } = usePizzaVideo();
 const playWithSound = () => {
  setMuted(false);
  if (ref.current) ref.current.muted = false;
  toggle();
 };
 return <section className="film-section" id="film"><div className="film-heading"><div><div className="eyebrow">DALLA BASE AL PRIMO MORSO</div><h2>Non immaginarla.<br/><em>Guardala succedere.</em></h2></div><span>STRANO MA VERO! / IL FILM · 00:10</span></div><div className="preparation-stage promo-stage"><video ref={ref} src={enabled ? preparation.url : undefined} poster={promoPoster.url} preload="none" playsInline muted={muted} onPlay={onPlay} onPause={onPause} onEnded={onEnded} aria-label="Strano Ma Vero: pizzaiolo per un giorno, con la base cotta al 90%"/>{!playing && <Button className="film-play" variant="secondary" onClick={playWithSound}><Play/> {showReplay ? 'Guarda ancora' : 'Guarda il film'} <span>00:10</span></Button>}{playing && <><Button className="preparation-toggle" variant="secondary" size="icon" aria-label="Metti in pausa la preparazione" onClick={toggle}><Pause/></Button><Button className="preparation-toggle promo-sound" variant="secondary" size="icon" aria-label={muted ? 'Attiva audio del film' : 'Disattiva audio del film'} title={muted ? 'Attiva audio' : 'Disattiva audio'} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX/> : <Volume2/>}</Button></>}</div><div className="film-caption"><span>Pizzaiolo per un giorno. Il gran finale è tuo.</span><small>Strano Ma Vero · Film promozionale</small></div></section>;
}