import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { pizzas, euro } from '@/lib/pizzas';
import ovenFilm from '@/assets/oven-correct.webm.asset.json';
import ovenPoster from '@/assets/plain-base-oven.jpg';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

export function OvenFilm() {
 const { ref, enabled, playing, started, toggle, onPlay, onPause, onEnded } = usePizzaVideo();
 return <section className="oven-film" aria-labelledby="oven-title">
  <video ref={ref} src={enabled ? ovenFilm.url : undefined} poster={ovenPoster} preload="none" playsInline muted onPlay={onPlay} onPause={onPause} onEnded={onEnded} aria-label="Base di pasta senza condimenti che cuoce nel forno a legna"/>
  <div className="oven-overlay" aria-hidden="true"/>
  <div className="oven-copy" data-reveal>
   <div className="eyebrow">A LEGNA, SOLO LA BASE.</div>
   <h2 id="oven-title">Noi cuociamo la base.<br/><em>Il finale è a casa tua.</em></h2>
   <p>Nel forno a legna entra soltanto la pasta, senza ingredienti. A casa aggiungi i condimenti della tua ricetta e completi la pizza con gli ultimi 3 minuti nel tuo forno.</p>
  </div>
  <Button className={`oven-toggle ${playing ? '' : 'oven-replay'}`} variant="secondary" size={playing ? 'icon' : 'default'} aria-label={playing ? 'Metti in pausa il filmato del forno' : started ? 'Guarda di nuovo la base nel forno' : 'Guarda la base nel forno'} onClick={toggle}>{playing ? <Pause/> : <><Play/> {started ? 'Guarda di nuovo' : 'Guarda la base'}</>}</Button>
 </section>;
}

export function PizzaShowcase() {
 const [index, setIndex] = useState(0);
 const [paused, setPaused] = useState(false);
 const count = pizzas.length;
 const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
 useEffect(() => {
  if (paused) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const timer = window.setInterval(() => setIndex(current => (current + 1) % count), 4200);
  return () => window.clearInterval(timer);
 }, [paused, count]);
 const current = pizzas[index] ?? pizzas[0];
 return <section className="showcase section-space" aria-labelledby="showcase-title" aria-roledescription="carosello" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
  <div className="section-heading" data-reveal>
   <div><div className="eyebrow">LE QUATTRO. IN GRANDE.</div><h2 id="showcase-title">Una base.<br/><em>Quattro leggende.</em></h2></div>
   <div className="heading-aside"><p>Scorrono da sole, ma il comando è tuo.<br/>Tocca, guarda, scegli.</p></div>
  </div>
  <div className="showcase-stage" data-reveal>
   <div className="showcase-track" style={{ transform: `translateX(-${index * 100}%)` }}>
    {pizzas.map((pizza, i) => <article className="showcase-slide" key={pizza.slug} aria-hidden={i !== index}>
     <img src={pizza.image} alt={`${pizza.name}: ${pizza.note}`} width={1024} height={1024} loading={i === 0 ? 'eager' : 'lazy'}/>
     <div className="showcase-info">
      <span className="showcase-label">{pizza.label}</span>
      <h3>{pizza.name}</h3>
      <p>{pizza.note}</p>
      <div className="showcase-meta"><strong>{euro(pizza.price)}</strong><span>{pizza.toppings.join(' · ')}</span></div>
      <Button asChild variant="secondary"><Link to="/pizza/$slug" params={{ slug: pizza.slug }} tabIndex={i === index ? 0 : -1}>Scopri la {pizza.name} <ArrowUpRight/></Link></Button>
     </div>
    </article>)}
   </div>
   <div className="showcase-controls">
    <Button variant="secondary" size="icon" aria-label="Pizza precedente" onClick={() => go(index - 1)}><ArrowLeft/></Button>
    <div className="showcase-dots" role="tablist" aria-label="Scegli la pizza da mostrare">
     {pizzas.map((pizza, i) => <button key={pizza.slug} role="tab" aria-selected={i === index} aria-label={`Mostra la ${pizza.name}`} className={i === index ? 'is-active' : ''} onClick={() => go(i)}/>)}
    </div>
    <Button variant="secondary" size="icon" aria-label="Pizza successiva" onClick={() => go(index + 1)}><ArrowRight/></Button>
   </div>
   <span className="showcase-counter" aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} — {current.name}</span>
  </div>
 </section>;
}
