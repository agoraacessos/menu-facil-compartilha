import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category, Product, StoreSettings } from '@/types/database';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    await fetchCategories();
    return data;
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    await fetchCategories();
    return data;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchCategories();
  };

  return { categories, loading, createCategory, updateCategory, deleteCategory, refetch: fetchCategories };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    await fetchProducts();
    return data;
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    await fetchProducts();
    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchProducts();
  };

  return { products, loading, createProduct, updateProduct, deleteProduct, refetch: fetchProducts };
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data as StoreSettings);
    } catch (error) {
      console.error('Error fetching store settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    if (settings) {
      const { data, error } = await supabase
        .from('store_settings')
        .update(newSettings)
        .eq('id', settings.id)
        .select()
        .single();
      
      if (error) throw error;
      setSettings(data as StoreSettings);
      return data as StoreSettings;
    } else {
      const { data, error } = await supabase
        .from('store_settings')
        .insert(newSettings)
        .select()
        .single();
      
      if (error) throw error;
      setSettings(data as StoreSettings);
      return data as StoreSettings;
    }
  };

  return { settings, loading, updateSettings, refetch: fetchSettings };
}