import { useEffect, useState } from 'react';
import { Plus, Search, Eye, Trash2, TrendingUp } from 'lucide-react';
import type Venda from '../objects/Venda';
import { ConfirmDeleteModal } from './modal/DeleteConfimation';
import { createCode } from '../util/CodeCreator';

export function Vendas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [vendas, setVendas] = useState<Venda[]>([]);

  const [formData, setFormData] = useState({
    cliente: '',
    produto: '',
    quantidade: '1',
    preco: '',
    pagamento: '',
  });

  const filteredVendas = vendas.filter(venda =>
    venda.codigo!.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venda.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novaVenda: Venda = {
      id: vendas.length + 1,
      codigo: `VND-${String(vendas.length + 1).padStart(3, '0')}`,
      cliente: formData.cliente,
      items: [{
        produto: formData.produto,
        quantidade: parseInt(formData.quantidade),
        preco: parseFloat(formData.preco)
      }],
      total: parseInt(formData.quantidade) * parseFloat(formData.preco),
      pagamento: formData.pagamento,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    setVendas([...vendas, novaVenda]);
    setFormData({ cliente: '', produto: '', quantidade: '1', preco: '', pagamento: '' });
    setShowModal(false);
  };

  const handleDelete = (id: number | null) => {
    setShowConfirmDelete(false);

    if (!id) return;

    setVendas(vendas.filter(v => v.id !== id));
  };

  const totalVendasMes = vendas.reduce((sum, venda) => sum + venda.total, 0);
  const totalVendasHoje = vendas
    .filter(v => v.data === new Date().toLocaleDateString('pt-BR'))
    .reduce((sum, venda) => sum + venda.total, 0);

  useEffect(() => {
    const data = [
      {
        id: 1,
        cliente: 'João Silva',
        items: [{ produto: 'SSD 240GB', quantidade: 1, preco: 280 }],
        total: 280,
        pagamento: 'Débito',
        data: '01/12/2025',
        vendedor: 'Carlos'
      },
      {
        id: 2,
        cliente: 'Maria Santos',
        items: [
          { produto: 'Memória RAM 8GB', quantidade: 2, preco: 220 },
          { produto: 'HD 1TB', quantidade: 1, preco: 350 }
        ],
        total: 790,
        pagamento: 'PIX',
        data: '02/12/2025',
        vendedor: 'Roberto'
      },
      {
        id: 3,
        cliente: 'Pedro Costa',
        items: [{ produto: 'Fonte 500W', quantidade: 1, preco: 200 }],
        total: 200,
        pagamento: 'Dinheiro',
        data: '02/12/2025',
        vendedor: 'Carlos'
      },
      {
        id: 4,
        cliente: 'Ana Oliveira',
        items: [
          { produto: 'SSD 240GB', quantidade: 1, preco: 280 },
          { produto: 'Memória RAM 8GB', quantidade: 1, preco: 220 }
        ],
        total: 500,
        pagamento: 'Crédito',
        data: '03/12/2025',
        vendedor: 'Roberto'
      },
    ]

    const newData = data.map((item) => ({
      ...item,
      codigo: createCode("VND", item.id)
    }));

    setVendas(newData);
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>Vendas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Venda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Total Hoje</p>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <p className="text-3xl text-green-600">R$ {totalVendasHoje.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Total do Mês</p>
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl text-blue-600">R$ {totalVendasMes.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Vendas Realizadas</p>
            <TrendingUp className="text-purple-600" size={20} />
          </div>
          <p className="text-3xl text-purple-600">{vendas.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar vendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Número</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Itens</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Pagamento</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendas.map((venda) => (
                <tr key={venda.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{venda.codigo}</td>
                  <td className="px-6 py-4">{venda.cliente}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {venda.items.map((item, idx) => (
                        <div key={idx} className="text-gray-600">
                          {item.quantidade}x {item.produto}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">R$ {venda.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs">
                      {venda.pagamento}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{venda.data}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(venda.id);
                          setShowConfirmDelete(true);
                        }}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="mb-4">Nova Venda</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Cliente</label>
                <input
                  type="text"
                  required
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Produto</label>
                <input
                  type="text"
                  required
                  value={formData.produto}
                  onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Preço Unit. (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Forma de Pagamento</label>
                <select
                  required
                  value={formData.pagamento}
                  onChange={(e) => setFormData({ ...formData, pagamento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                  <option value="PIX">PIX</option>
                </select>
              </div>
              {formData.quantidade && formData.preco && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total da Venda</p>
                  <p className="text-2xl text-blue-600">
                    R$ {(parseInt(formData.quantidade || '0') * parseFloat(formData.preco || '0')).toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Finalizar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDeleteModal 
        isOpen={showConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={() => handleDelete(deleteId)}
      />
    </div>
  );
}
