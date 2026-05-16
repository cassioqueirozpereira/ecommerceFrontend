export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">Lumina</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          Experiência premium de compras com design moderno e performance excepcional.
        </p>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Lumina E-commerce MVP. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}