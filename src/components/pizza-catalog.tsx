import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pizzas, euro } from '@/lib/pizzas';
import { usePizzaStore } from '@/components/pizza-store';

export function PizzaCatalog() {
 const [filter,setFilter] = useState('Tutte');
 const { bag,add } = usePizzaStore();
 return <>
  <div className="catalog-toolbar"><div className="catalog-filters" aria-label="Filtra le pizze">{['Tutte','Classiche','Vegetariane','Piccanti'].map(category => <Button key={category} variant={filter===category ? 'default':'ghost'} aria-pressed={filter===category} onClick={() => setFilter(category)}>{category}</Button>)}</div><span>Base + condimenti inclusi · Prezzi d’esempio</span></div>
  <div className="product-grid">{pizzas.filter(p => filter==='Tutte' || p.category===filter || (filter==='Classiche')).map((p,i) => <article className="product-card" key={p.slug}>
   <Link className="product-photo" to="/pizza/$slug" params={{slug:p.slug}} aria-label={`Scopri ${p.name}`}><img src={p.image} alt={`Pizza ${p.name}: esempio del risultato dopo la cottura a casa`} width={1024} height={1024} loading="lazy"/><span className="product-tag">{p.label}</span><span className="photo-arrow"><ArrowUpRight/></span></Link>
   <div className="product-topline"><span>0{i+1} / BASE + CONDIMENTI</span><strong>{euro(p.price)}</strong></div>
   <h3><Link to="/pizza/$slug" params={{slug:p.slug}}>{p.name}</Link></h3><p className="product-note">{p.note}</p><p className="product-toppings">{p.toppings.join(' · ')}</p>
   <Button variant="outline" className="product-add" onClick={() => add(p.slug)} aria-label={`Aggiungi ${p.name} alla borsa`}>{(bag[p.slug] ?? 0)>0 ? <Check/> : <Plus/>} Aggiungi alla borsa{(bag[p.slug] ?? 0)>0 && <span>{bag[p.slug]}</span>}</Button>
  </article>)}</div>
 </>;
}