import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { pizzas, euro } from '@/lib/pizzas';
import ovenFilm from '@/assets/oven-film-web.asset.json';
import ovenPoster from '@/assets/oven-frame.jpg';

export function OvenFilm() {
 const video = useRef<HTMLVideoElement>(null);
 const [playing, setPlaying] = useState(false);
 const [enabled, setEnabled] = useState(false);
 useEffect(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (reduced || saveData) return;
  setEnabled(true);
 }, []);
 useEffect(() => {
  if (!enabled) return;
  const player = video.current;
  if (!player) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if (entry.isIntersecting) { player.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
   else { player.pause(); setPlaying(false); }
  }), { threshold: 0.35 });
  observer.observe(player);
  return () => observer.disconnect();
 }, [enabled]);
 const toggle = () => {
  const player = video.current;
  if (!player) return;
  if (playing) { player.pause(); setPlaying(false); }
  else { player.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
 };
 return <section className="oven-film" aria-labelledby="oven-title">
  {enabled
   ? <video ref={video} src={ovenFilm.url} poster={ovenPoster} preload="metadata" playsInline muted loop aria-label="Filmato cinematografico di una pizza che cuoce nel forno a legna"/>
   : <img src={ovenPoster} alt="Pizza Margherita che cuoce nel forno a legna tra le fiamme" width={1536} height={1024} loading="lazy"/>}
  <div className="oven-overlay" aria-hidden="true"/>
  <div className="oven-copy" data-reveal>
   <div className="eyebrow">IL FORNO FA IL RESTO</div>
   <h2 id="oven-title">Novanta secondi.<br/><em>E profuma di pizzeria.</em></h2>
   <p>La base è già cotta al 90%: nel tuo forno le manca solo il gran finale. La mozzarella fila, il cornicione si colora, la casa profuma.</p>
  </div>
  {enabled && <Button className="oven-toggle" variant="secondary" size="icon" aria-label={playing ? 'Metti in pausa il filmato del forno' : 'Riproduci il filmato del forno'} onClick={toggle}>{playing ? <Pause/> : <Play/>}</Button>}
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
 const current = pizzas[index];
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
