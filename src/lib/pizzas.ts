import margherita from '@/assets/margherita.jpg';
import diavola from '@/assets/diavola.jpg';
import capricciosa from '@/assets/capricciosa.jpg';
import stagioni from '@/assets/quattro-stagioni.jpg';

export const pizzas = [
 { slug: 'margherita', name: 'Margherita', note: 'Il classico che non ha bisogno di presentazioni.', label: 'L’originale', price: 7.9, image: margherita, toppings: ['Pomodoro', 'Mozzarella', 'Basilico'], category: 'Vegetariane' },
 { slug: 'diavola', name: 'Diavola', note: 'Carattere deciso. Un finale che si fa sentire.', label: 'Piccante', price: 9.9, image: diavola, toppings: ['Pomodoro', 'Mozzarella', 'Salame piccante'], category: 'Piccanti' },
 { slug: 'capricciosa', name: 'Capricciosa', note: 'Generosa, ricca, impossibile da dimenticare.', label: 'La generosa', price: 10.9, image: capricciosa, toppings: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto', 'Funghi', 'Carciofi', 'Olive nere'], category: 'Classiche' },
 { slug: 'quattro-stagioni', name: 'Quattro stagioni', note: 'Quattro gusti. Una sola, bellissima decisione.', label: 'Quattro anime', price: 10.9, image: stagioni, toppings: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto', 'Funghi', 'Carciofi', 'Olive nere'], category: 'Classiche' },
] as const;
export type PizzaProduct = typeof pizzas[number];
export const euro = (value: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);