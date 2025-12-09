import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Eye } from 'lucide-react';
import type Servico from '../objects/Servico';
import { ConfirmDeleteModal } from './modal/DeleteConfimation';
import { createCode } from '../util/CodeCreator';
import { listarServicos } from '../services/servicoService';
import MoreInfoServicos from '../components/modal/MoreInfoServicos';
import EditServico from '../components/modal/EditServico';

export function Servicos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showEditServico, setShowEditServico] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

  const [formData, setFormData] = useState({
    cliente: '',
    descricao: '',
    previsaoEntrega: '',
    valor: '',
  });

  const filteredServicos = servicos.filter(servico =>
    servico.codigo!.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const abrirMaisInfo = (servico: Servico) => {
    setSelectedServico(servico);
    setShowMoreInfo(true);
  }

  const abrirEditServico = (servico: Servico) => {
    setSelectedServico(servico);
    setShowMoreInfo(false);
    setShowEditServico(true);
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluído':
      case 'entregue':
        return 'text-green-700 bg-green-100';
      case 'em andamento':
        return 'text-blue-700 bg-blue-100';
      case 'aguardando peça':
        return 'text-yellow-700 bg-yellow-100';
      case 'aguardando aprovação':
        return 'text-orange-700 bg-orange-100';
      case 'aprovado':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    const novoServico: Servico = {
      id: servicos.length + 1,
      codigo: createCode("OS", servicos.length + 1),
      cliente: formData.cliente,
      descricao: formData.descricao,
      status: 'Aguardando aprovação',
      equipamento: 'PC GAMER',
      dataEntrada: hoje,
      previsaoEntrega: formData.previsaoEntrega,
      valor: parseFloat(formData.valor),
    };
    
    setServicos([...servicos, novoServico]);
    setFormData({ cliente: '', descricao: '', previsaoEntrega: '', valor: ''});
    setShowModal(false);
  };

  const handleDelete = (id: number | null) => {
    setShowConfirmDelete(false);

    if (!id) return;

    setServicos(servicos.filter(s => s.id !== id));
  };

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await listarServicos();
        const newData = data.map((item: Servico) => ({
          ...item,
          codigo: createCode("OS", item.id)
        }));
        setServicos(newData);
      } catch (e) {
        console.error("Erro ao listar clientes:", e);
      }
    };
    fetchServicos();
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>Ordens de Serviço</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Nova OS
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por OS, cliente ou serviço..."
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
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">OS</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Entrada/Previsão</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServicos.map((servico) => (
                <tr key={servico.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{servico.codigo}</td>
                  <td className="px-6 py-4">{servico.cliente}</td>
                  <td className="px-6 py-4">{servico.descricao}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusColor(servico.status)}`}>
                      {servico.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">R$ {servico.valor.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">{servico.dataEntrada.substring(0, 5)} - {servico.previsaoEntrega.substring(0, 5)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => abrirMaisInfo(servico)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(servico.id);
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
            <h2 className="mb-4">Nova Ordem de Serviço</h2>
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
                <label className="block text-sm mb-1 text-gray-700">Descrição do Serviço</label>
                <textarea
                  required
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Previsão de Entrega</label>
                <input
                  type="date"
                  required
                  value={formData.previsaoEntrega}
                  onChange={(e) => setFormData({ ...formData, previsaoEntrega: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Valor Orçado (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                  Criar OS
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
      <MoreInfoServicos
        open={showMoreInfo}
        onClose={() => setShowMoreInfo(false)}
        servico={selectedServico} 
        onEdit={() => abrirEditServico(selectedServico!)}
      />
      <EditServico
        open={showEditServico}
        onClose={() => setShowEditServico(false)}
        servico={selectedServico} 
        onSave={() => setShowEditServico(false)}
      />
    </div>
  );
}