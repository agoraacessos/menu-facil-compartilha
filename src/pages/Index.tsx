import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { useCart } from '@/hooks/useCart';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockProducts, mockCategories } from '@/data/mockData';
import { Product } from '@/types/menu';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products] = useLocalStorage<Product[]>('products', mockProducts);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const { 
    cartItems, 
    addToCart, 
    updateQuantity, 
    removeItem, 
    getItemQuantity,
    generateWhatsAppLink 
  } = useCart();

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      if (selectedCategory === 'promocoes') {
        filtered = filtered.filter(product => product.isPromotion);
      } else {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  const handleCheckout = () => {
    const whatsappLink = generateWhatsAppLink();
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    }
  };

  const generateMenuImage = () => {
    const menuText = products.map(product => {
      const price = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(product.price);
      
      const unit = product.unit === 'unidade' ? 'un' : product.unit;
      const promo = product.isPromotion ? ' 🔥' : '';
      
      return `${product.name} - ${price}/${unit}${promo}`;
    }).join('\n');

    const blob = new Blob([menuText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cardapio.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAdmin={() => setShowAdmin(true)}
        onGenerateMenu={generateMenuImage}
        showAdminLink={true}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <CategoryFilter
              categories={mockCategories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  cartQuantity={getItemQuantity(product.id)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  Nenhum produto encontrado
                </p>
                <p className="text-muted-foreground mt-2">
                  Tente ajustar sua busca ou filtros
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Cart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;