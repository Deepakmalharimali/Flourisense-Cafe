export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string; // Emoji
  category: Category;
  isPopular?: boolean;
  isNew?: boolean;
}

export type Category = 'Coffee' | 'Espresso' | 'Tea' | 'Pastries' | 'Sandwiches' | 'All';

export const categories: Category[] = ['All', 'Coffee', 'Espresso', 'Tea', 'Pastries', 'Sandwiches'];

export const menuItems: MenuItem[] = [
  // Coffee
  {
    id: 'cappuccino',
    name: 'Classic Cappuccino',
    price: 120,
    description: 'Velvety espresso with steamed milk and perfect foam art.',
    image: '☕',
    category: 'Coffee',
    isPopular: true,
  },
  {
    id: 'latte',
    name: 'Vanilla Latte',
    price: 140,
    description: 'Smooth espresso with vanilla syrup and creamy milk.',
    image: '🥛',
    category: 'Coffee',
    isNew: true,
  },
  {
    id: 'americano',
    name: 'Americano',
    price: 100,
    description: 'Bold espresso diluted with hot water for a lighter taste.',
    image: '☕',
    category: 'Coffee',
  },
  {
    id: 'mocha',
    name: 'Chocolate Mocha',
    price: 150,
    description: 'Rich espresso mixed with chocolate and whipped cream.',
    image: '🍫',
    category: 'Coffee',
    isPopular: true,
  },

  // Espresso
  {
    id: 'espresso',
    name: 'Single Espresso',
    price: 80,
    description: 'Pure, bold shot of premium coffee.',
    image: '☕',
    category: 'Espresso',
  },
  {
    id: 'double-espresso',
    name: 'Double Espresso',
    price: 120,
    description: 'Double the intensity for coffee purists.',
    image: '☕',
    category: 'Espresso',
    isPopular: true,
  },
  {
    id: 'ristretto',
    name: 'Ristretto',
    price: 90,
    description: 'Short, concentrated espresso shot.',
    image: '☕',
    category: 'Espresso',
  },

  // Tea
  {
    id: 'green-tea',
    name: 'Matcha Green Tea',
    price: 110,
    description: 'Premium matcha whisked with hot water.',
    image: '🍵',
    category: 'Tea',
    isNew: true,
  },
  {
    id: 'chai',
    name: 'Masala Chai',
    price: 90,
    description: 'Spiced black tea with milk and aromatic spices.',
    image: '🍵',
    category: 'Tea',
    isPopular: true,
  },
  {
    id: 'earl-grey',
    name: "Earl Grey",
    price: 100,
    description: 'Bergamot-infused black tea.',
    image: '🍵',
    category: 'Tea',
  },

  // Pastries
  {
    id: 'croissant',
    name: 'Butter Croissant',
    price: 85,
    description: "Flaky, golden French croissant.",
    image: '🥐',
    category: 'Pastries',
    isPopular: true,
  },
  {
    id: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    price: 110,
    description: 'Croissant filled with dark chocolate batons.',
    image: '🍫',
    category: 'Pastries',
  },
  {
    id: 'muffin',
    name: 'Blueberry Muffin',
    price: 95,
    description: 'Fresh baked with real blueberries.',
    image: '🧁',
    category: 'Pastries',
    isNew: true,
  },
  {
    id: 'danish',
    name: 'Almond Danish',
    price: 105,
    description: 'Flaky pastry with almond cream filling.',
    image: '🥮',
    category: 'Pastries',
  },

  // Sandwiches
  {
    id: 'club-sandwich',
    name: 'Chicken Club Sandwich',
    price: 180,
    description: 'Grilled chicken, bacon, lettuce, tomato, mayo.',
    image: '🥪',
    category: 'Sandwiches',
    isPopular: true,
  },
  {
    id: 'veggie-wrap',
    name: 'Veggie Wrap',
    price: 150,
    description: 'Fresh veggies, hummus, feta in whole wheat wrap.',
    image: '🥬',
    category: 'Sandwiches',
    isNew: true,
  },
  {
    id: 'grilled-cheese',
    name: 'Gourmet Grilled Cheese',
    price: 130,
    description: 'Artisan bread with multiple cheeses and herbs.',
    image: '🧀',
    category: 'Sandwiches',
  },
];

