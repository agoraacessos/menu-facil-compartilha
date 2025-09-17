export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  unit: 'kg' | '100g' | 'unidade' | 'litro' | '500g';
  available: boolean;
  isPromotion: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderSummary {
  items: CartItem[];
  total: number;
  customerInfo?: {
    name: string;
    phone: string;
  };
}