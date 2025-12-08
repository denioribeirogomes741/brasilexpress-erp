import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Clientes } from './components/Clientes';
import { Servicos } from './components/Servicos';
import { Estoque } from './components/Estoque';
import { Vendas } from './components/Vendas';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return <Clientes />;
      case 'servicos':
        return <Servicos />;
      case 'estoque':
        return <Estoque />;
      case 'vendas':
        return <Vendas />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 p-8">
        {renderPage()}
      </main>
    </div>
  );
}
