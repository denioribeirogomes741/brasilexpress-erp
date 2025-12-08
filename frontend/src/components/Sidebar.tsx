import { LayoutDashboard, Users, Wrench, Package, ShoppingCart } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'servicos', label: 'Serviços', icon: Wrench },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl mb-1">Brasil Express</h1>
        <p className="text-blue-200 text-sm">Gestão de Serviços</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
