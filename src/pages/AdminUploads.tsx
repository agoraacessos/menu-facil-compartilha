import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FileUploadManager } from '@/components/admin/FileUploadManager';

const AdminUploads = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload de Arquivos</h1>
          <p className="text-muted-foreground">Gerencie imagens e outros arquivos</p>
        </div>
        <FileUploadManager />
      </div>
    </AdminLayout>
  );
};

export default AdminUploads;