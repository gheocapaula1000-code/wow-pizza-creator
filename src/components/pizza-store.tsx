import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Pizza, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { pizzas, euro } from '@/lib/pizzas';

type Bag = Record<string, number>;
type Store = { bag: Bag; add: (slug: string, quantity?: number) => void; showBag: () => void };
const StoreContext = createContext<Store | null>(null);
export function usePizzaStore() {
 const store = useContext(StoreContext);
 if (!store) throw new Error('PizzaStoreProvider is required');
 return store;
}
export function PizzaStoreProvider({ children }: { children: ReactNode }) {
 const [bag, setBag] = useState<Bag>({});
 const [open, setOpen] = useState(false);
 const [menu, setMenu] = useState(false);
 const [notice, setNotice] = useState('');
 useEffect(() => {
  if (!notice) return;
  const timer = window.setTimeout(() => setNotice(''), 5000);
  return () => window.clearTimeout(timer);
 }, [notice,bag]);
 const count = Object.values(bag).reduce((a,b) => a+b,0);
 const add = (slug: string, quantity = 1) => {
  setBag(previous => ({ ...previous, [slug]: Math.min(20, (previous[slug] ?? 0) + quantity) }));
  setNotice(`${pizzas.find(p => p.slug === slug)?.name ?? 'Pizza'} aggiunta al carrello`);
 };
 const change = (slug: string, amount: number) => setBag(previous => ({ ...previous, [slug]: Math.max(0, Math.min(20, (previous[slug] ?? 0) + amount)) }));
 const total = pizzas.reduce((sum,p) => sum + p.price * (bag[p.slug] ?? 0), 0);
 return <StoreContext.Provider value={{ bag, add, showBag: () => setOpen(true) }}>
  <div className="announcement">UNA BASE COTTA AL 90%. I CONDIMENTI DELLA TUA PIZZA. IL FINALE È TUO.</div>
  <header className="store-header">
   <Link to="/" className="wordmark" aria-label="Strano Ma Vero! Home">STRANO<span>MA VERO!</span></Link>
   <nav aria-label="Navigazione principale"><Link to="/pizze">Le nostre pizze</Link><Link to="/" hash="il-finale">Dal 90 al 100</Link><Link to="/" hash="film">Guarda il film</Link></nav>
   <div className="header-tools"><Button className="mobile-menu" variant="ghost" size="icon" aria-label="Apri menu" onClick={() => setMenu(true)}><Menu/></Button><Button variant="ghost" className="bag-trigger" onClick={() => setOpen(true)} aria-label={`Apri carrello, ${count} pizze`}><ShoppingBag/><span className="bag-label">Il tuo carrello</span><span className="bag-count">{count}</span></Button></div>
  </header>
  {children}
  <footer className="store-footer"><Link to="/" className="wordmark">STRANO<span>MA VERO!</span></Link><div>La stessa base. Mille voglie diverse.<small>Dimostrazione per il cliente · Prezzi e ricette d’esempio · Nessun ordine o pagamento</small></div><Link to="/pizze">Scegli la tua pizza <ArrowRight size={16}/></Link><div className="footer-legal"><nav aria-label="Pagine legali"><Link to="/privacy-policy">Privacy Policy</Link><Link to="/cookie-policy">Cookie Policy</Link><Link to="/termini-e-condizioni">Termini e Condizioni</Link></nav><small>Strano Ma Vero Di Zoja Manuelito – Via Po 1, 35135 Padova (PD) – P.IVA 02682910282</small></div></footer>
  <div className="sr-only" role="status">{notice}</div>
  {notice && <div className="bag-notice" key={`${notice}-${count}`}><Pizza size={18}/><span>{notice}</span><Button variant="ghost" onClick={() => {setOpen(true);setNotice('');}}>Vedi carrello <ArrowRight/></Button><Button variant="ghost" size="icon" aria-label="Chiudi notifica" onClick={() => setNotice('')}>×</Button></div>}
  <Dialog open={menu} onOpenChange={setMenu}><DialogContent><DialogTitle>Strano Ma Vero!</DialogTitle><DialogDescription>La pizzeria, a casa tua.</DialogDescription><nav className="mobile-nav"><Link to="/pizze" onClick={() => setMenu(false)}>Le nostre pizze <ArrowRight/></Link><Link to="/" hash="il-finale" onClick={() => setMenu(false)}>Dal 90 al 100 <ArrowRight/></Link><Link to="/" hash="film" onClick={() => setMenu(false)}>Guarda il film <ArrowRight/></Link></nav></DialogContent></Dialog>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent className="bag-dialog"><DialogTitle>La tua serata pizza <span className="text-primary">({count})</span></DialogTitle><DialogDescription>Ogni articolo comprende una base e i condimenti preconfezionati della ricetta.</DialogDescription>
   {count === 0 ? <div className="bag-empty"><ShoppingBag/><h3>La serata è ancora tutta da scrivere.</h3><Button asChild onClick={() => setOpen(false)}><Link to="/pizze">Scegli le tue pizze <ArrowRight/></Link></Button></div> : <><div className="bag-lines">{pizzas.filter(p => (bag[p.slug] ?? 0)>0).map(p => <div className="bag-line" key={p.slug}><img src={p.image} alt={p.name} width={80} height={80}/><div><Link to="/pizza/$slug" params={{slug:p.slug}} onClick={() => setOpen(false)}>{p.name}</Link><small>Base + condimenti {p.name}</small><div className="quantity"><Button variant="ghost" size="icon" aria-label={`Riduci ${p.name}`} onClick={() => change(p.slug,-1)}><Minus/></Button><output aria-live="polite">{bag[p.slug]}</output><Button variant="ghost" size="icon" disabled={(bag[p.slug] ?? 0)>=20} aria-label={`Aumenta ${p.name}`} onClick={() => change(p.slug,1)}><Plus/></Button></div></div><div className="line-price"><strong>{euro(p.price*(bag[p.slug] ?? 0))}</strong><Button variant="ghost" size="icon" aria-label={`Rimuovi ${p.name}`} onClick={() => setBag(previous => ({...previous,[p.slug]:0}))}><Trash2/></Button></div></div>)}</div><div className="bag-total" aria-live="polite"><span>Totale dimostrativo</span><strong>{euro(total)}</strong></div><p className="demo-note">Questo carrello è solo una dimostrazione: non invia ordini e non accetta pagamenti.</p><Button onClick={() => setOpen(false)}>Continua a scegliere <ArrowRight/></Button></>}
  </DialogContent></Dialog>
 </StoreContext.Provider>;
}