import margherita from '@/assets/margherita.jpg';
import diavola from '@/assets/diavola.jpg';
import capricciosa from '@/assets/capricciosa.jpg';
import stagioni from '@/assets/quattro-stagioni.jpg';

const images = [margherita, diavola, capricciosa, stagioni];

export const pizzas = [
  { slug: 'margherita', name: 'Margherita', note: 'Il classico che non ha bisogno di presentazioni.', label: 'L’originale', price: 7.9, image: images[0], toppings: ['Pomodoro', 'Mozzarella', 'Basilico'], category: 'Vegetariane' },
  { slug: 'marinara', name: 'Marinara', note: 'Semplice e aromatica, senza mozzarella.', label: 'La pura', price: 6.9, image: images[1], toppings: ['Pomodoro', 'Aglio', 'Origano'], category: 'Vegetariane' },
  { slug: 'diavola', name: 'Diavola', note: 'Carattere deciso. Un finale che si fa sentire.', label: 'Piccante', price: 9.9, image: images[2], toppings: ['Pomodoro', 'Mozzarella', 'Salame piccante'], category: 'Piccanti' },
  { slug: 'capricciosa', name: 'Capricciosa', note: 'Generosa, ricca, impossibile da dimenticare.', label: 'La generosa', price: 10.9, image: images[3], toppings: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto', 'Funghi', 'Carciofi', 'Olive nere'], category: 'Classiche' },
  { slug: 'quattro-stagioni', name: 'Quattro stagioni', note: 'Quattro gusti. Una sola, bellissima decisione.', label: 'Quattro anime', price: 10.9, image: images[0], toppings: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto', 'Funghi', 'Carciofi', 'Olive nere'], category: 'Classiche' },
  { slug: 'prosciutto', name: 'Prosciutto', note: 'Il comfort food per eccellenza.', label: 'Classica', price: 8.9, image: images[1], toppings: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto'], category: 'Classiche' },
  { slug: 'funghi', name: 'Funghi', note: 'Terrosa e avvolgente.', label: 'Autunnale', price: 8.5, image: images[2], toppings: ['Pomodoro', 'Mozzarella', 'Funghi'], category: 'Vegetariane' },
  { slug: 'prosciutto-funghi', name: 'Prosciutto e Funghi', note: 'L’equilibrio perfetto.', label: 'Equilibrio', price: 9.5, image: images[3], toppings: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto', 'Funghi'], category: 'Classiche' },
  { slug: 'tonno-cipolla', name: 'Tonno e Cipolla', note: 'Fresca e saporita.', label: 'Marina', price: 9.9, image: images[0], toppings: ['Pomodoro', 'Mozzarella', 'Tonno', 'Cipolla'], category: 'Classiche' },
  { slug: 'salsiccia', name: 'Salsiccia', note: 'Rustica e soddisfacente.', label: 'Rustica', price: 9.5, image: images[1], toppings: ['Pomodoro', 'Mozzarella', 'Salsiccia'], category: 'Classiche' },
  { slug: 'ortolana', name: 'Ortolana', note: 'Un orto intero sulla pizza.', label: 'Verde', price: 9.9, image: images[2], toppings: ['Pomodoro', 'Mozzarella', 'Zucchine', 'Melanzane', 'Peperoni'], category: 'Vegetariane' },
  { slug: 'quattro-formaggi', name: 'Quattro Formaggi', note: 'Un trionfo di formaggi.', label: 'Formaggi', price: 10.5, image: images[3], toppings: ['Mozzarella', 'Gorgonzola', 'Fontina', 'Parmigiano'], category: 'Vegetariane' },
  { slug: 'bufalina', name: 'Bufalina', note: 'La mozzarella di bufala fa la differenza.', label: 'Premium', price: 10.9, image: images[0], toppings: ['Pomodoro', 'Mozzarella di bufala', 'Basilico'], category: 'Vegetariane' },
  { slug: 'romana', name: 'Romana', note: 'Con le acciughe, come tradizione.', label: 'Tradizione', price: 8.9, image: images[1], toppings: ['Pomodoro', 'Mozzarella', 'Acciughe', 'Origano'], category: 'Classiche' },
  { slug: 'napoli', name: 'Napoli', note: 'Capperi e olive per un tocco mediterraneo.', label: 'Mediterranea', price: 9.5, image: images[2], toppings: ['Pomodoro', 'Mozzarella', 'Acciughe', 'Capperi', 'Olive'], category: 'Classiche' },
  { slug: 'frutti-di-mare', name: 'Frutti di Mare', note: 'Per gli amanti del mare.', label: 'Mare', price: 12.9, image: images[3], toppings: ['Pomodoro', 'Frutti di mare', 'Aglio', 'Prezzemolo'], category: 'Classiche' },
  { slug: 'prosciutto-crudo', name: 'Prosciutto Crudo', note: 'Elegante e delicata.', label: 'Elegante', price: 11.5, image: images[0], toppings: ['Pomodoro', 'Mozzarella', 'Prosciutto crudo'], category: 'Classiche' },
  { slug: 'rucola-grana', name: 'Rucola e Grana', note: 'Fresca e pepata.', label: 'Fresca', price: 10.9, image: images[1], toppings: ['Pomodoro', 'Mozzarella', 'Rucola', 'Grana padano'], category: 'Vegetariane' },
  { slug: 'boscaiola', name: 'Boscaiola', note: 'Sapore di bosco.', label: 'Bosco', price: 10.5, image: images[2], toppings: ['Mozzarella', 'Funghi', 'Salsiccia', 'Pancetta'], category: 'Classiche' },
  { slug: 'contadina', name: 'Contadina', note: 'Ricca di sapori di campagna.', label: 'Campagna', price: 9.9, image: images[3], toppings: ['Pomodoro', 'Mozzarella', 'Verdure miste', 'Salame'], category: 'Classiche' },
  { slug: 'patate', name: 'Patate', note: 'Semplice e confortante.', label: 'Confort', price: 8.9, image: images[0], toppings: ['Mozzarella', 'Patate', 'Rosmarino'], category: 'Vegetariane' },
  { slug: 'wurstel', name: 'Wurstel', note: 'Per i più piccoli e non solo.', label: 'Famiglia', price: 8.5, image: images[1], toppings: ['Pomodoro', 'Mozzarella', 'Wurstel'], category: 'Classiche' },
  { slug: 'americana', name: 'Americana', note: 'Wurstel e patatine, la classica.', label: 'Street', price: 9.5, image: images[2], toppings: ['Pomodoro', 'Mozzarella', 'Wurstel', 'Patatine'], category: 'Classiche' },
  { slug: 'siciliana', name: 'Siciliana', note: 'Sapori intensi del sud.', label: 'Sud', price: 9.9, image: images[3], toppings: ['Pomodoro', 'Acciughe', 'Capperi', 'Olive'], category: 'Classiche' },
  { slug: 'hawaii', name: 'Hawaii', note: 'Dolce e salato, controversa ma amata.', label: 'Dolce-salata', price: 9.5, image: images[0], toppings: ['Pomodoro', 'Mozzarella', 'Prosciutto', 'Ananas'], category: 'Classiche' },
  { slug: 'speck', name: 'Speck e Rucola', note: 'Affumicata e fresca.', label: 'Alpina', price: 11.5, image: images[1], toppings: ['Mozzarella', 'Speck', 'Rucola'], category: 'Classiche' },
  { slug: 'gorgonzola-noci', name: 'Gorgonzola e Noci', note: 'Intensa e croccante.', label: 'Intensa', price: 10.9, image: images[2], toppings: ['Mozzarella', 'Gorgonzola', 'Noci'], category: 'Vegetariane' },
  { slug: 'calabrese', name: 'Calabrese', note: 'Piccante e corposa.', label: 'Piccante+', price: 10.5, image: images[3], toppings: ['Pomodoro', 'Mozzarella', 'Nduja', 'Cipolla'], category: 'Piccanti' },
  { slug: 'margherita-dop', name: 'Margherita DOP', note: 'La versione premium dell’originale.', label: 'Premium', price: 9.9, image: images[0], toppings: ['Pomodoro San Marzano', 'Mozzarella di bufala', 'Basilico'], category: 'Vegetariane' },
  { slug: 'bianca', name: 'Pizza Bianca', note: 'Senza pomodoro, solo olio e aromi.', label: 'Bianca', price: 7.5, image: images[1], toppings: ['Olio extravergine', 'Rosmarino', 'Sale', 'Aglio'], category: 'Vegetariane' },
] as const;

export type PizzaProduct = typeof pizzas[number];

export const euro = (value: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
