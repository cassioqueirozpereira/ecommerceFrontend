'use client';

import AdminGuard from '@/components/layout/AdminGuard';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link href="/admin/products" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Gerenciar Produtos</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Crie, edite ou remova produtos e variações.</p>
          </Link>

          <Link href="/admin/categories" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Categorias</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Organize a hierarquia do seu catálogo.</p>
          </Link>

          <Link href="/admin/orders" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Pedidos</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Acompanhe as vendas e pagamentos realizados.</p>
          </Link>

        </div>
      </div>
    </AdminGuard>
  );
}