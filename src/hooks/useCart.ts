import { useState, useCallback } from 'react';
import { CartItem, Product } from '@/types/menu';
import { useLocalStorage } from './useLocalStorage';
import { toast } from 'sonner';

export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart', []);

  const addToCart = useCallback((product: Product, quantity: number) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        toast.success(`${product.name} atualizado no carrinho`);
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success(`${product.name} adicionado ao carrinho`);
        return [...currentItems, { product, quantity }];
      }
    });
  }, [setCartItems]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(currentItems => currentItems.filter(item => item.product.id !== productId));
      toast.success('Item removido do carrinho');
    } else {
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  }, [setCartItems]);

  const removeItem = useCallback((productId: string) => {
    setCartItems(currentItems => currentItems.filter(item => item.product.id !== productId));
    toast.success('Item removido do carrinho');
  }, [setCartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success('Carrinho limpo');
  }, [setCartItems]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  const generateWhatsAppLink = useCallback(() => {
    if (cartItems.length === 0) return '';

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const itemsList = cartItems.map(item => 
      `• ${item.product.name} - ${item.quantity}x ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(item.product.price)} = ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(item.product.price * item.quantity)}`
    ).join('\n');

    const message = `🛒 *Pedido do Cardápio Digital*\n\n${itemsList}\n\n💰 *Total: ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(total)}*\n\nGostaria de confirmar este pedido!`;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    generateWhatsAppLink,
  };
}