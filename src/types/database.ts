export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image?: string;
  category_id?: string;
  unit: 'kg' | '100g' | 'unidade' | 'litro' | '500g';
  available: boolean;
  is_promotion: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  logo_url?: string;
  banner_url?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  opening_hours: Record<string, string>;
  address?: string;
  delivery_fee: number;
  minimum_order: number;
  created_at: string;
  updated_at: string;
}