import { Product, Category } from '@/types/menu';
import macaFujiImg from '@/assets/maca-fuji.jpg';
import bananaPrataImg from '@/assets/banana-prata.jpg';
import cenouraImg from '@/assets/cenoura.jpg';
import tomateImg from '@/assets/tomate.jpg';
import picanhaImg from '@/assets/picanha.jpg';
import leiteIntegralImg from '@/assets/leite-integral.jpg';

export const mockCategories: Category[] = [
  { id: '1', name: 'Frutas', icon: '🍎', color: 'bg-gradient-secondary' },
  { id: '2', name: 'Vegetais', icon: '🥕', color: 'bg-gradient-primary' },
  { id: '3', name: 'Carnes', icon: '🥩', color: 'bg-gradient-accent' },
  { id: '4', name: 'Laticínios', icon: '🥛', color: 'bg-gradient-card' },
  { id: 'promocoes', name: 'Promoções', icon: '🔥', color: 'bg-gradient-accent' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Maçã Fuji',
    description: 'Maçãs frescas e crocantes, perfeitas para lanches saudáveis',
    price: 8.99,
    image: macaFujiImg,
    category: '1',
    unit: 'kg',
    available: true,
    isPromotion: false,
  },
  {
    id: '2',
    name: 'Banana Prata',
    description: 'Bananas maduras e doces, ricas em potássio',
    price: 5.49,
    originalPrice: 6.99,
    image: bananaPrataImg,
    category: '1',
    unit: 'kg',
    available: true,
    isPromotion: true,
  },
  {
    id: '3',
    name: 'Cenoura',
    description: 'Cenouras frescas e crocantes, ideais para saladas',
    price: 4.99,
    image: cenouraImg,
    category: '2',
    unit: 'kg',
    available: true,
    isPromotion: false,
  },
  {
    id: '4',
    name: 'Tomate',
    description: 'Tomates maduros e suculentos para suas receitas',
    price: 7.99,
    originalPrice: 9.99,
    image: tomateImg,
    category: '2',
    unit: 'kg',
    available: true,
    isPromotion: true,
  },
  {
    id: '5',
    name: 'Picanha',
    description: 'Picanha premium, macia e saborosa',
    price: 65.99,
    image: picanhaImg,
    category: '3',
    unit: 'kg',
    available: true,
    isPromotion: false,
  },
  {
    id: '6',
    name: 'Leite Integral',
    description: 'Leite fresco e nutritivo',
    price: 4.99,
    image: leiteIntegralImg,
    category: '4',
    unit: 'litro',
    available: true,
    isPromotion: false,
  },
];