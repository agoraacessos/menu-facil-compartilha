-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Create storage policies for public access
CREATE POLICY "Public access to logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Public access to banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Public access to products" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- Admin can manage all files
CREATE POLICY "Admin can manage logos" ON storage.objects FOR ALL USING (bucket_id = 'logos');
CREATE POLICY "Admin can manage banners" ON storage.objects FOR ALL USING (bucket_id = 'banners');
CREATE POLICY "Admin can manage products" ON storage.objects FOR ALL USING (bucket_id = 'products');

-- Create categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    unit TEXT NOT NULL DEFAULT 'unidade' CHECK (unit IN ('kg', '100g', 'unidade', 'litro', '500g')),
    available BOOLEAN NOT NULL DEFAULT true,
    is_promotion BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create store settings table
CREATE TABLE public.store_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    store_name TEXT NOT NULL DEFAULT 'Minha Loja',
    logo_url TEXT,
    banner_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    instagram TEXT,
    facebook TEXT,
    opening_hours JSONB DEFAULT '{}',
    address TEXT,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    minimum_order DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);

-- Admin can manage everything (for now, we'll implement proper auth later)
CREATE POLICY "Admin can manage categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin can manage store settings" ON public.store_settings FOR ALL USING (true);

-- Insert default categories
INSERT INTO public.categories (name, icon, color) VALUES
('Frutas', '🍎', 'bg-green-100 text-green-800'),
('Verduras', '🥬', 'bg-emerald-100 text-emerald-800'),
('Carnes', '🥩', 'bg-red-100 text-red-800'),
('Laticínios', '🥛', 'bg-blue-100 text-blue-800'),
('Bebidas', '🧃', 'bg-purple-100 text-purple-800');

-- Insert default store settings
INSERT INTO public.store_settings (store_name, phone, whatsapp, opening_hours) VALUES
('Meu Mercado', '(11) 99999-9999', '5511999999999', '{"segunda": "08:00-18:00", "terca": "08:00-18:00", "quarta": "08:00-18:00", "quinta": "08:00-18:00", "sexta": "08:00-18:00", "sabado": "08:00-12:00", "domingo": "fechado"}');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON public.store_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();