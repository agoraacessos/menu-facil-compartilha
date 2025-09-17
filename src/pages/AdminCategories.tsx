import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { CategoryList } from '@/components/admin/CategoryList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminCategories = () => {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categorias</h1>
            <p className="text-muted-foreground">Organize seus produtos por categoria</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {showForm && (
          <CategoryForm
            categoryId={editingCategory}
            onClose={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
          />
        )}

        <CategoryList
          onEdit={(id) => {
            setEditingCategory(id);
            setShowForm(true);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;