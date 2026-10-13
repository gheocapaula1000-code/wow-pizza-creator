import { useState } from 'react';
import { Play, ArrowUpRight, MoveHorizontal, Pause } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import base from '@/assets/pizza-base.jpg';
import finished from '@/assets/diavola.jpg';
import preparation from '@/assets/film-correct.webm.asset.json';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

export function PizzaTransformation() {
 const [amount,setAmount] = useState(50);
 return <section className="transformation section-space" id="il-finale">
  <div className="transformation-copy"><div className="eyebrow">IL NOSTRO 90%. IL TUO 10%.</div><h2>La magia?<br/>È l’ultimo <em>tocco.</em></h2><p>La base è sempre la stessa, cotta al 90%. Ogni pizza ha i suoi condimenti già preconfezionati. A casa li aggiungi alla base e completi la pizza con gli ultimi 3 minuti di cottura nel tuo forno.</p><div className="transformation-stats"><div><strong>90%</strong><span>La base è già cotta</span></div><div><strong>100%</strong><span>La ricetta che scegli</span></div></div><Button asChild variant="outline"><Link to="/pizze">Trova la tua preferita <ArrowUpRight/></Link></Button></div>
  <div className="comparison"><div className="comparison-images"><img src={base} alt="La base pizza precotta al 90%, senza condimenti" width={1024} height={1024} loading="lazy"/><img className="comparison-final" style={{clipPath:`inset(0 ${100-amount}% 0 0)`}} src={finished} alt="Esempio di Diavola dopo l’aggiunta dei condimenti e la cottura" width={1024} height={1024} loading="lazy"/><div className="comparison-divider" style={{left:`${amount}%`}} aria-hidden="true"><MoveHorizontal/></div><span className="comparison-label before">IL TUO FINALE</span><span className="comparison-label after">LA NOSTRA BASE</span></div><Slider className="comparison-slider" min={0} max={100} step={1} value={[amount]} onValueChange={values => setAmount(values[0] ?? 50)} aria-label="Confronta base e pizza finita"/><div className="comparison-ends"><span>La base</span><span>Il gran finale</span></div></div>
 </section>;
}
export function PreparationFilm() {
 const { ref, enabled, playing, started, toggle, onPlay, onPause, onEnded } = usePizzaVideo();
 return <section className="film-section" id="film"><div className="film-heading"><div><div className="eyebrow">DALLA BASE AL PRIMO MORSO</div><h2>Non immaginarla.<br/><em>Guardala succedere.</em></h2></div><span>STRANO MA VERO! / IL FILM · 00:31</span></div><div className="preparation-stage"><video ref={ref} src={enabled ? preparation.url : undefined} poster={finished} preload="none" playsInline muted onPlay={onPlay} onPause={onPause} onEnded={onEnded} aria-label="Filmato dimostrativo della preparazione della pizza"/>{!playing && <Button className="film-play" variant="secondary" onClick={toggle}><Play/> {started ? 'Guarda di nuovo' : 'Guarda il film'} <span>00:31</span></Button>}{playing && <Button className="preparation-toggle" variant="secondary" size="icon" aria-label="Metti in pausa la preparazione" onClick={toggle}><Pause/></Button>}</div><div className="film-caption"><span>La ricetta è pronta. Il gesto finale è tuo.</span><small>Filmato illustrativo generato per il concept</small></div></section>;
}