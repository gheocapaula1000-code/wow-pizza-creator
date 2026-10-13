import { useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Props {
  base: string;
  finished: string;
  baseAlt?: string;
  finishedAlt?: string;
}

export function PizzaComparison({ base, finished, baseAlt = 'La base pizza precotta al 90%', finishedAlt = 'Il risultato finale' }: Props) {
  const [amount, setAmount] = useState(50);
  return (
    <div className="comparison">
      <div className="comparison-images">
        <img src={base} alt={baseAlt} width={1024} height={1024} />
        <img
          className="comparison-final"
          style={{ clipPath: `inset(0 ${100 - amount}% 0 0)` }}
          src={finished}
          alt={finishedAlt}
          width={1024}
          height={1024}
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
        onValueChange={(values) => setAmount(values[0] ?? 50)}
        aria-label="Confronta base e pizza finita"
      />
      <div className="comparison-ends">
        <span>La base</span>
        <span>Il gran finale</span>
      </div>
    </div>
  );
}
