import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Check, Flame, PackageOpen, Pizza, ShoppingBag, Plus, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import heroImage from '@/assets/pizza-editorial.jpg';
import kitImage from '@/assets/pizza-kit.jpg';

export const Route = createFileRoute('/')({
 head: () => ({ meta: [
  { title: 'Novanta — La tua pizza, il tuo finale' },
  { name: 'description', content: 'Una base pizza cotta al 90%, ingredienti separati e tutta la libertà di creare la tua pizza a casa. Concept dimostrativo Novanta.' },
  { property: 'og:title', content: 'Novanta — La tua pizza, il tuo finale' },
  { property: 'og:description', content: 'Scopri il concept pizza kit Novanta: scegli la ricetta, aggiungi i tuoi ingredienti e completa la pizza a casa.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
 ] }), component: Index,
});
const ingredients = ['Pomodoro', 'Mozzarella', 'Basilico', 'Salame piccante', 'Funghi', 'Carciofi', 'Olive nere', 'Prosciutto cotto'];
const recipes: Record<string, string[]> = {
 'Margherita': ['Pomodoro', 'Mozzarella', 'Basilico'],
 'Diavola': ['Pomodoro', 'Mozzarella', 'Salame piccante'],
 'Capricciosa': ['Pomodoro', 'Mozzarella', 'Funghi', 'Carciofi', 'Olive nere', 'Prosciutto cotto'],
 'Quattro stagioni': ['Pomodoro', 'Mozzarella', 'Funghi', 'Carciofi', 'Olive nere', 'Prosciutto cotto'],
 'La tua creazione': ['Pomodoro', 'Mozzarella'],
};
function Index() {
 const [recipe,setRecipe] = useState('Diavola');
 const [selected,setSelected] = useState<string[]>(recipes.Diavola);
 const [box,setBox] = useState<string[] | null>(null);
 const [open,setOpen] = useState(false);
 const toggle = (ingredient: string) => { setSelected(previous => previous.includes(ingredient) ? previous.filter(item => item !== ingredient) : [...previous,ingredient]); };
 return <>
  <div className="announcement">IL 90% LO FACCIAMO NOI. IL TOCCO FINALE È TUO.</div>
  <header className="site-header">
   <a className="wordmark" href="#" aria-label="Novanta, home">novanta<span>°</span></a>
   <nav aria-label="Navigazione principale"><a href="#crea">Le nostre pizze</a><a href="#come-funziona">Il metodo Novanta</a><a href="#crea">Crea la tua pizza</a></nav>
   <Button variant="ghost" size="icon" aria-label="Apri il tuo kit" onClick={() => setOpen(true)} className="relative h-11 w-11"><ShoppingBag/>{box && <span className="absolute right-0 top-0 text-xs text-primary">1</span>}</Button>
  </header>
  <main>
   <section className="hero" aria-labelledby="hero-title">
    <img className="hero-photo" src={heroImage} alt="Pizza diavola con mozzarella, salame piccante e basilico, esempio del risultato finale" width={1536} height={1024}/>
    <div className="hero-copy">
     <div className="eyebrow">Nata in pizzeria. Finita da te.</div>
     <h1 id="hero-title">Novanta.<br/>La tua pizza,<br/><em>il tuo finale.</em></h1>
     <p>La base è cotta al 90%. Gli ingredienti li scegli tu. L’ultimo tocco? A casa tua, come piace a te.</p>
     <div className="hero-actions"><Button asChild size="lg"><a href="#crea">Crea la tua pizza <ArrowUpRight/></a></Button><Button variant="link" asChild><a href="#come-funziona">Scopri il kit <ArrowRight/></a></Button></div>
     <div className="hero-footnote"><Leaf size={14}/> Una base. Ingredienti separati. Infinite possibilità.</div>
    </div>
    <div className="round-seal"><span>COTTA AL</span><strong>90%</strong><span>100% TUA</span></div>
   </section>
   <div className="promise-bar">
    <div className="promise"><Pizza/><div><strong>La base, quella vera</strong><span>Formato pizza standard</span></div></div>
    <div className="promise"><PackageOpen/><div><strong>Ogni ingrediente, a parte</strong><span>Solo quello che scegli tu</span></div></div>
    <div className="promise"><Flame/><div><strong>Il finale, a casa tua</strong><span>Da completare nel tuo forno</span></div></div>
   </div>
   <section id="crea" className="section">
    <div className="section-heading"><div><div className="eyebrow text-primary">Il tuo piccolo capolavoro</div><h2>Stasera, il pizzaiolo sei tu.</h2></div><p className="text-sm text-muted-foreground">Parti da un classico. Finisci a modo tuo.</p></div>
    <div className="recipe-tabs" aria-label="Scegli la ricetta">{Object.keys(recipes).map(name => <Button key={name} variant={recipe === name ? 'default' : 'outline'} onClick={() => { setRecipe(name); setSelected(recipes[name]); }} aria-pressed={recipe === name}>{name}</Button>)}</div>
    <div className="builder">
     <img className="kit-photo" src={kitImage} alt="Esempio di kit: base pizza precotta con pomodoro, mozzarella e altri ingredienti in ciotole separate" width={1024} height={1024} loading="lazy"/>
     <div><div className="eyebrow text-primary">La tua pizza kit</div><h3 className="mt-3">{recipe}</h3><p className="builder-description">La nostra base cotta al 90%, in formato standard.<br/>Aggiungi gli ingredienti che ami: arrivano tutti separati.</p>
      <div className="ingredient-grid">{ingredients.map(item => <Button className="ingredient" variant="outline" key={item} data-selected={selected.includes(item)} aria-pressed={selected.includes(item)} onClick={() => toggle(item)}>{item}{selected.includes(item) ? <Check/> : <Plus/>}</Button>)}</div>
      <div className="selection-footer"><div aria-live="polite"><small>Il tuo kit</small><strong>{selected.length} ingredienti</strong></div><Button size="lg" onClick={() => {setBox([...selected]); setOpen(true);}}>Componi il kit <ArrowRight/></Button></div>
     </div>
    </div>
   </section>
   <section className="story" id="come-funziona"><div><div className="eyebrow">Il metodo Novanta</div><h2 className="mt-5">Noi mettiamo la base.<br/>Tu ci metti la firma.</h2></div><div className="steps">{[['Scegli la tua combinazione','Un grande classico o una ricetta tutta tua.'],['Ogni ingrediente al suo posto','La base precotta e gli ingredienti separati nel tuo kit.'],['Condisci. Inforna. Goditela.','Completa la cottura a casa e porta in tavola la tua pizza.']].map(([title,description],i) => <div className="step" key={title}><b>0{i+1}</b><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
  </main>
  <footer><a href="#" className="wordmark">novanta°</a><span>Il 90% è nostro. Tutto il gusto è tuo.</span><span>Concept dimostrativo · Nessuna vendita attiva</span></footer>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogTitle>Il tuo kit Novanta</DialogTitle><DialogDescription>{box ? 'Base pizza cotta al 90% e ingredienti separati.' : 'Il tuo kit è ancora da comporre.'}</DialogDescription>{box ? <><ul className="space-y-3 py-3"><li className="flex items-center gap-3"><Pizza size={18}/> Base pizza standard</li>{box.map(item => <li className="flex items-center gap-3" key={item}><Check size={16} className="text-primary"/>{item}</li>)}</ul><p className="border-t pt-4 text-sm text-muted-foreground">Questa è una dimostrazione: nessun ordine viene inviato e non sono previsti pagamenti.</p></> : <p className="py-4 text-sm">Scegli una ricetta e gli ingredienti per creare la tua combinazione.</p>}<Button onClick={() => setOpen(false)}>Continua a creare <ArrowRight/></Button></DialogContent></Dialog>
 </>;
}
