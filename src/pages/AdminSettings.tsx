import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StoreSettingsForm } from '@/components/admin/StoreSettingsForm';

const AdminSettings = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações da Loja</h1>
          <p className="text-muted-foreground">Configure informações da sua loja</p>
        </div>
        <StoreSettingsForm />
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;