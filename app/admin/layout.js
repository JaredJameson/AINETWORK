import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Admin — AI NETWORK' };

export default function AdminLayout({ children }) {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#0D0D0D', color: '#FFFFFF',
      fontFamily: 'Montserrat, -apple-system, sans-serif',
    }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
