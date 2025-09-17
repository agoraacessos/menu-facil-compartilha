import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductList } from '@/components/admin/ProductList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminProducts = () => {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-muted-foreground">Gerencie o cardápio da sua loja</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {showForm && (
          <ProductForm
            productId={editingProduct}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}

        <ProductList
          onEdit={(id) => {
            setEditingProduct(id);
            setShowForm(true);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;