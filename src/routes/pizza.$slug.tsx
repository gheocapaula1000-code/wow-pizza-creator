import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Minus, Plus, PackageOpen, Flame } from 'lucide-react';
import { pizzas, euro } from '@/lib/pizzas';
import { usePizzaStore } from '@/components/pizza-store';
import { Button } from '@/components/ui/button';
import base from '@/assets/pizza-base.jpg';
import { RelatedPizzas } from '@/components/related-pizzas';
import { PizzaComparison } from '@/components/pizza-comparison';

export const Route = createFileRoute('/pizza/$slug')({
  loader: ({ params }) => {
    const product = pizzas.find(p => p.slug === params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData: p }) => ({
    meta: [
      { title: p ? `${p.name} — Base pizza e condimenti | Strano Ma Vero!` : 'Pizza non disponibile | Strano Ma Vero!' },
      { name: 'description', content: p ? `${p.name}: base pizza standard cotta al 90% e condimenti preconfezionati con ${p.toppings.join(', ')}.` : 'Pizza non disponibile.' },
    ],
  }),
  component: ProductPage,
  remountDeps: ({ params }) => params.slug,
  notFoundComponent: () => <main><h1>Pizza non trovata</h1><Link to="/pizze">Torna alle pizze</Link></main>,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const { add, bag, showBag } = usePizzaStore();
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="product-page section-space">
      <div className="breadcrumbs"><Link to="/">Home</Link> / <Link to="/pizze">Le pizze</Link> / {p.name}</div>
      <div className="product-detail">
        <div>
          <PizzaComparison base={base} finished={p.image} finishedAlt={`${p.name} con i condimenti della ricetta`} />
          <small className="image-disclaimer">Slider: da base plain a pizza farcita con gli ingredienti di questa ricetta.</small>
        </div>
        <div className="detail-copy">
          <div className="eyebrow">BASE + CONDIMENTI</div>
          <h1>{p.name}</h1>
          <p>{p.note}</p>
          <strong>{euro(p.price)}</strong>
          <div className="topping-list">{p.toppings.map(t => <span key={t}>{t}</span>)}</div>
          <div className="detail-purchase">
            <div className="quantity">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(n => Math.max(1, n - 1))}><Minus /></Button>
              <output>{quantity}</output>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(n => Math.min(20, n + 1))}><Plus /></Button>
            </div>
            <Button onClick={() => add(p.slug, quantity)}>Aggiungi al carrello</Button>
          </div>
          {(bag[p.slug] ?? 0) > 0 && <Button variant="link" onClick={showBag}>Vedi carrello</Button>}
        </div>
      </div>
      <RelatedPizzas slug={p.slug} />
    </main>
  );
}
