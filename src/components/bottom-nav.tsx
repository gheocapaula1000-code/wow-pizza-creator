import { Link } from '@tanstack/react-router';
import { Home, Pizza, Play, ShoppingBag } from 'lucide-react';
import { usePizzaStore } from '@/components/pizza-store';
import { Button } from '@/components/ui/button';

export function BottomNav() {
  const { bag, showBag } = usePizzaStore();
  const count = Object.values(bag).reduce((total, quantity) => total + quantity, 0);
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
      <Button variant="ghost" className="bottom-nav-item" onClick={showBag}>
        <ShoppingBag />
        <span>Carrello</span>
        {count > 0 && <span className="bottom-nav-badge">{count}</span>}
      </Button>
    </nav>
  );
}
