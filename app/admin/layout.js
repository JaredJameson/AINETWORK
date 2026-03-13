'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return children;
  }

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
