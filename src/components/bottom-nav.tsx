import { Link } from '@tanstack/react-router';
import { Home, Pizza, Play, ShoppingBag } from 'lucide-react';
import { usePizzaStore } from '@/components/pizza-store';

export function BottomNav() {
  const { count } = usePizzaStore();
  return (
    <nav className="bottom-nav" aria-label="Navigazione mobile">
      <Link to="/" className="bottom-nav-item" activeOptions={{ exact: true }}>
        <Home />
        <span>Home</span>
      </Link>
      <Link to="/pizze" className="bottom-nav-item">
        <Pizza />
        <span>Pizze</span>
      </Link>
      <a href="/#film" className="bottom-nav-item">
        <Play />
        <span>Film</span>
      </a>
      <button type="button" className="bottom-nav-item" onClick={() => (document.querySelector('.bag-trigger') as HTMLButtonElement)?.click()}>
        <ShoppingBag />
        <span>Carrello</span>
        {count > 0 && <span className="bottom-nav-badge">{count}</span>}
      </button>
    </nav>
  );
}
