import { createContext, useContext } from 'react';

export type Bag = Record<string, number>;
export type PizzaStore = {
  bag: Bag;
  add: (slug: string, quantity?: number) => void;
  showBag: () => void;
};

// Keep context identity independent of the refreshable provider component.
export const PizzaStoreContext = createContext<PizzaStore | null>(null);

export function usePizzaStore() {
  const store = useContext(PizzaStoreContext);
  if (!store) throw new Error('PizzaStoreProvider is required');
  return store;
}