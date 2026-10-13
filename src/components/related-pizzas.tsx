import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pizzas, euro } from '@/lib/pizzas';

export function RelatedPizzas({ slug }: { slug: string }) {
 const track = useRef<HTMLDivElement>(null);
 const [paused, setPaused] = useState(false);
 const [interacting, setInteracting] = useState(false);
 const related = pizzas.filter(p => p.slug !== slug);
 const move = (direction: number) => {
  const el = track.current;
  if (!el) return;
  const step = (el.firstElementChild?.getBoundingClientRect().width ?? 300) + 24;
  const end = el.scrollWidth - el.clientWidth;
  const next = direction > 0 && el.scrollLeft >= end - 4 ? 0 : direction < 0 && el.scrollLeft <= 4 ? end : el.scrollLeft + direction * step;
  el.scrollTo({ left: next, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
 };
 useEffect(() => {
  const el = track.current;
  if (!el || paused || interacting || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let visible = false;
  const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; });
  observer.observe(el);
  const timer = window.setInterval(() => { if (visible) move(1); }, 4200);
  return () => { observer.disconnect(); window.clearInterval(timer); };
 }, [paused, interacting, slug]);
 return <section className="related-section" aria-labelledby="related-title" aria-roledescription="carosello" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
  <div className="related-heading"><div><div className="eyebrow">ALTRE VOGLIE, STESSA BASE.</div><h2 id="related-title">Potresti amare <em>anche.</em></h2></div><div className="related-controls"><Button variant="outline" size="icon" aria-label="Prodotti correlati precedenti" onClick={() => move(-1)}><ArrowLeft/></Button><Button variant="outline" size="icon" aria-label={paused ? 'Avvia scorrimento prodotti correlati' : 'Ferma scorrimento prodotti correlati'} onClick={() => setPaused(value => !value)}>{paused ? <Play/> : <Pause/>}</Button><Button variant="outline" size="icon" aria-label="Prodotti correlati successivi" onClick={() => move(1)}><ArrowRight/></Button></div></div>
  <div className="related-track" ref={track} tabIndex={0} aria-label="Altre pizze" onTouchStart={() => setPaused(true)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); setPaused(true); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
   {related.map(p => <article className="related-product" key={p.slug}><Link to="/pizza/$slug" params={{ slug: p.slug }} className="product-photo" aria-label={`Scopri ${p.name}`}><img src={p.image} alt={`Pizza ${p.name}`} width={1024} height={1024} loading="lazy"/><span className="product-tag">{p.label}</span><span className="photo-arrow"><ArrowUpRight/></span></Link><div className="related-product-title"><h3><Link to="/pizza/$slug" params={{slug:p.slug}}>{p.name}</Link></h3><strong>{euro(p.price)}</strong></div><p>{p.note}</p><small>Base + condimenti · Prezzo d’esempio</small></article>)}
  </div>
 </section>;
}