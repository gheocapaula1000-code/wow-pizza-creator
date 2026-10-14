import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Flame, PackageOpen, Pizza, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PizzaCatalog } from '@/components/pizza-catalog';
import { PizzaTransformation } from '@/components/pizza-experience';
import { PizzaShowcase } from '@/components/pizza-showcase';
import { PromoFilm } from '@/components/promo-film';
import hero from '@/assets/pizza-editorial.jpg';
import finale from '@/assets/finale-table.jpg';
import promoWebm from '@/assets/strano-ma-vero-promo-21s.webm.asset.json';
import promoMp4 from '@/assets/strano-ma-vero-promo-21s.mp4.asset.json';
import heroCorrectWebm from '@/assets/hero-correct-long.webm.asset.json';
import heroCorrectMp4 from '@/assets/hero-correct-long.mp4.asset.json';
import { usePizzaVideo } from '@/hooks/use-pizza-video';

/* ─── HERO: punto unico di rientro ───────────────────────────────────────
   Cambia solo la riga contrassegnata con HERE.
     HERO_VIDEOS.promo → 21s: il film promozionale, con audio (attuale)
     HERO_VIDEOS.loop  → 23s con audio: condimenti aggiunti a casa + cheese pull
     null              → niente video: torna l'immagine statica pizza-editorial.jpg
   L'immagine resta in ogni caso come poster del video e come immagine di
   riserva per chi ha "riduci movimento" o "risparmio dati" attivi.        */
type HeroClip = { webm: { url: string }; mp4: { url: string } };
const HERO_VIDEOS: Record<'correct' | 'promo', HeroClip> = { correct: { webm: heroCorrectWebm, mp4: heroCorrectMp4 }, promo: { webm: promoWebm, mp4: promoMp4 } };
const HERO_VIDEO: HeroClip | null = HERO_VIDEOS.correct; // HERE
// Testo per chi non vede il video: aggiornalo insieme alla riga HERE.
const HERO_LABEL = 'La base cotta al 90%, i condimenti che cadono, il finale nel forno di casa e il cheese pull';

export const Route = createFileRoute('/')({
 head: () => ({ meta: [
  {title:'Strano Ma Vero! — Base pizza e condimenti, il finale è tuo'},
  {name:'description',content:'Margherita, Diavola, Capricciosa e Quattro stagioni: una base pizza cotta al 90% con condimenti preconfezionati per ogni ricetta, da finire a casa. Scopri il concept Strano Ma Vero!.'},
  {property:'og:title',content:'Strano Ma Vero! — La pizzeria, a casa tua'},
  {property:'og:description',content:'La stessa base, i condimenti della tua pizza preferita, l’ultimo tocco a casa tua. Scopri le pizze classiche del concept.'},
  {property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'},
 ]}), component: Home,
});
function Home() {
 useEffect(() => {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
  return () => observer.disconnect();
 },[]);
 const { ref, enabled, playing, toggle, onPlay, onPause, onEnded } = usePizzaVideo({ maxAutoPlays: 1 });
 const [muted, setMuted] = useState(true);
 const [needsPlay, setNeedsPlay] = useState(false);
 const toggleSound = () => {
  const next = !muted;
  setMuted(next);
  if (ref.current) ref.current.muted = next;
 };
 useEffect(() => {
  if (playing) { setNeedsPlay(false); return; }
  const timer = setTimeout(() => setNeedsPlay(true), 1200);
  return () => clearTimeout(timer);
 }, [playing]);
 useEffect(() => {
  const player = ref.current;
  if (!player) return;
  player.muted = true;
  player.play().catch(() => setNeedsPlay(true));
  const observer = new IntersectionObserver(([entry]) => {
   if (entry?.isIntersecting && player.paused) player.play().catch(() => setNeedsPlay(true));
  }, { threshold: .4 });
  observer.observe(player);
  return () => observer.disconnect();
 }, []);
 return <main>
  <section className="hero cinematic-hero" aria-labelledby="hero-title">
   {HERO_VIDEO ? <>
    <video ref={ref} className="hero-photo hero-film-video" poster={hero} autoPlay muted={muted} loop playsInline preload="auto" onPlay={onPlay} onPause={onPause} onEnded={onEnded} aria-label={HERO_LABEL}>
     <source src={HERO_VIDEO.mp4.url} type="video/mp4"/>
     <source src={HERO_VIDEO.webm.url} type="video/webm"/>
    </video>
    {<Button className="hero-sound" variant="secondary" size="icon" onClick={toggleSound} aria-label={muted ? 'Attiva audio del video' : 'Disattiva audio del video'} title={muted ? 'Attiva audio' : 'Disattiva audio'}>{muted ? <VolumeX/> : <Volume2/>}</Button>}
    {needsPlay && <Button className="hero-replay" variant="secondary" onClick={toggle}>Riproduci il video</Button>}
   </> : <img className="hero-photo" src={hero} alt="Pizza Diavola con salame piccante e mozzarella, esempio del risultato finale" width={1536} height={1024}/>}
    <div className="hero-copy"><div className="eyebrow">LA PIZZERIA. A CASA TUA.</div><h1 id="hero-title"><span>STRANO.</span><span>MA VERO!</span></h1><p>La base, cotta al 90%. I condimenti della tua pizza preferita, già pronti. Aggiungili a casa: gli ultimi 3 minuti nel tuo forno, e il gran finale è tuo.</p><div className="hero-actions"><Button size="lg" asChild><Link to="/pizze">Scegli la tua pizza <ArrowUpRight/></Link></Button></div></div>
   <div className="hero-edition"><span>BUONA COME UN’IDEA GENIALE.</span><span>90% NOI. 10% TU.</span></div><div className="round-seal"><span>QUASI PRONTA</span><strong>90%</strong><span>COMPLETAMENTE TUA</span></div>
  </section>
  <div className="promise-bar"><div><Pizza/><span>Una base, sempre la stessa</span></div><div><PackageOpen/><span>Condimenti pronti per ogni ricetta</span></div><div><Flame/><span>Il finale nel tuo forno</span></div></div>
  <section className="home-catalog section-space" id="crea"><div className="section-heading" data-reveal><div><div className="eyebrow">I CLASSICI. IN UNA FORMA NUOVA.</div><h2>Stasera si fa<br/><em>come in pizzeria.</em></h2></div><div className="heading-aside"><p>Non devi inventare una ricetta.<br/>Devi solo scegliere la tua preferita.</p><Link to="/pizze">Tutte le pizze <ArrowUpRight/></Link></div></div><PizzaCatalog/></section>
   <PizzaShowcase/>
   <div className="taste-ribbon" aria-hidden="true"><div>{Array.from({length:4},(_,i)=><span key={i}>STRANO MA VERO! <Pizza/> LA TUA PIZZA. IL TUO FINALE. <Flame/></span>)}</div></div>
  <PizzaTransformation/>
  <PromoFilm/>
  <section className="method-section section-space" data-reveal><div className="section-heading"><div><div className="eyebrow">TRE GESTI. UNA GRANDE SERATA.</div><h2>Il resto è<br/><em>solo appetito.</em></h2></div><p>La ricetta arriva già pensata.<br/>Il piacere di finirla è tutto tuo.</p></div><div className="method-grid">{[{title:'Scegli un classico.',copy:'Ogni articolo ha la stessa base e i condimenti preconfezionati della sua ricetta.',icon:Pizza},{title:'Dai il tuo tocco.',copy:'Apri i condimenti della pizza scelta e distribuiscili sulla base precotta al 90%.',icon:PackageOpen},{title:'Completa. Assapora.',copy:'Completa la pizza con gli ultimi 3 minuti nel tuo forno di casa.',icon:Flame}].map((step,i)=><div className="method-step" key={step.title}><span>0{i+1}</span><step.icon/><h3>{step.title}</h3><p>{step.copy}</p></div>)}</div></section>
  <section className="closing-band" data-reveal><img className="closing-photo" src={finale} alt="Pizza Diavola finita sul tavolo, una fetta sollevata con il filante della mozzarella" width={1536} height={1024} loading="lazy"/><div className="closing-copy"><span>LA SERATA È TUA.</span><h2>Falla <em>buona.</em></h2><p>Una base, quattro classici, il tuo forno. Il resto è già sulla tavola.</p><Button asChild variant="secondary" size="lg"><Link to="/pizze">Scegli le tue pizze <ArrowUpRight/></Link></Button></div></section>
 </main>;
}
