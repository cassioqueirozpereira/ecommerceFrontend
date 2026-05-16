import Link from 'next/link';

export const metadata = {
  title: 'Lumina | E-commerce Premium',
  description: 'Descubra a nova coleção com a melhor experiência de compras online.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-slate-900/80 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop")' }}
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Elegância em cada <span className="text-primary-400">Detalhe</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            Explore nossa nova coleção projetada para quem valoriza design, conforto e exclusividade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary-500/30"
            >
              Explorar Coleção
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Qualidade Premium</h3>
              <p className="text-gray-600 dark:text-gray-400">Materiais selecionados com o mais alto padrão de qualidade do mercado.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Envio Expresso</h3>
              <p className="text-gray-600 dark:text-gray-400">Entregas rápidas e seguras para todo o Brasil com rastreamento em tempo real.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Compra Segura</h3>
              <p className="text-gray-600 dark:text-gray-400">Pagamento criptografado e garantia de devolução em até 30 dias.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}