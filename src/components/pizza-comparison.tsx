import { useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import base from '@/assets/pizza-base.jpg';

export function PizzaComparison({
  finished,
  finishedAlt = 'Pizza finita con i condimenti',
  className = '',
}: {
  finished: string;
  finishedAlt?: string;
  className?: string;
}) {
  const [amount, setAmount] = useState(50);
  return (
    <div className={`comparison ${className}`}>
      <div className="comparison-images">
        <img src={base} alt="La base pizza precotta al 90%, senza condimenti" width={1024} height={1024} loading="lazy" />
        <img
          className="comparison-final"
          style={{ clipPath: `inset(0 ${100 - amount}% 0 0)` }}
          src={finished}
          alt={finishedAlt}
          width={1024}
          height={1024}
          loading="lazy"
        />
        <div className="comparison-divider" style={{ left: `${amount}%` }} aria-hidden="true">
          <MoveHorizontal />
        </div>
        <span className="comparison-label before">IL TUO FINALE</span>
        <span className="comparison-label after">LA NOSTRA BASE</span>
      </div>
      <Slider
        className="comparison-slider"
        min={0}
        max={100}
        step={1}
        value={[amount]}
        onValueChange={values => setAmount(values[0] ?? 50)}
        aria-label="Confronta base e pizza finita"
      />
      <div className="comparison-ends">
        <span>La base</span>
        <span>Il gran finale</span>
      </div>
    </div>
  );
}
