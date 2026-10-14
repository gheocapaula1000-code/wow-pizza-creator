import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { PizzaStoreContext, usePizzaStore, type Bag } from '@/components/pizza-store-context';

afterEach(cleanup);

function Consumer() {
  const { bag, add, showBag } = usePizzaStore();
  return <><output>{bag['margherita'] ?? 0}</output><button onClick={() => add('margherita')}>Add</button><button onClick={showBag}>Open</button></>;
}

describe('Shared pizza context', () => {
  it('keeps consumers connected when provider values rerender', () => {
    const showBag = vi.fn();
    function Provider() {
      const [bag, setBag] = useState<Bag>({});
      return <PizzaStoreContext.Provider value={{ bag, showBag, add: (slug, quantity = 1) => setBag(previous => ({ ...previous, [slug]: (previous[slug] ?? 0) + quantity })) }}><Consumer /></PizzaStoreContext.Provider>;
    }
    render(<Provider />);
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByRole('status')).toHaveTextContent('2');
    fireEvent.click(screen.getByText('Open'));
    expect(showBag).toHaveBeenCalledOnce();
  });
});