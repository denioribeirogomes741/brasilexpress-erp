import { Users, Wrench, Package, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Clientes Ativos', value: '248', icon: Users, color: 'bg-blue-500' },
    { label: 'Serviços em Andamento', value: '12', icon: Wrench, color: 'bg-yellow-500' },
    { label: 'Itens em Estoque', value: '456', icon: Package, color: 'bg-green-500' },
    { label: 'Vendas do Mês', value: 'R$ 18.450', icon: DollarSign, color: 'bg-purple-500' },
  ];

  const servicosRecentes = [
    { id: 'OS-001', cliente: 'João Silva', servico: 'Troca de HD', status: 'Em andamento', data: '01/12/2025' },
    { id: 'OS-002', cliente: 'Maria Santos', servico: 'Limpeza + Formatação', status: 'Aguardando peça', data: '01/12/2025' },
    { id: 'OS-003', cliente: 'Pedro Costa', servico: 'Reparo placa-mãe', status: 'Concluído', data: '30/11/2025' },
    { id: 'OS-004', cliente: 'Ana Oliveira', servico: 'Instalação RAM', status: 'Em andamento', data: '02/12/2025' },
    { id: 'OS-005', cliente: 'Carlos Mendes', servico: 'Troca fonte', status: 'Aguardando aprovação', data: '02/12/2025' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'text-green-700 bg-green-100';
      case 'Em andamento':
        return 'text-blue-700 bg-blue-100';
      case 'Aguardando peça':
        return 'text-yellow-700 bg-yellow-100';
      case 'Aguardando aprovação':
        return 'text-orange-700 bg-orange-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluído':
        return <CheckCircle size={16} />;
      case 'Em andamento':
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <div>
      <h1 className="mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2>Serviços Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">OS</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {servicosRecentes.map((servico) => (
                <tr key={servico.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{servico.id}</td>
                  <td className="px-6 py-4">{servico.cliente}</td>
                  <td className="px-6 py-4">{servico.servico}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${getStatusColor(servico.status)}`}>
                      {getStatusIcon(servico.status)}
                      {servico.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{servico.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
