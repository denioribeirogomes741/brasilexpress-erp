import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import type Item from '../objects/Item';
import { ConfirmDeleteModal } from './modal/DeleteConfimation';
import { listarItens } from '../services/itemService';

export function Estoque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itens, setItens] = useState<Item[]>([]);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    quantidade: '',
    estoque_minimo: '',
    preco_custo: '',
    preco_venda: '',
    condicao: '',
  });

  const filteredItens = itens.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo!.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoItem: Item = {
      id: itens.length + 1,
      nome: formData.nome,
      descricao: formData.descricao,
      categoria: formData.categoria,
      quantidade: parseInt(formData.quantidade),
      estoque_minimo: parseInt(formData.estoque_minimo),
      preco_custo: parseFloat(formData.preco_custo),
      preco_venda: parseFloat(formData.preco_venda),
      condicao: formData.condicao,
    };
    setItens([...itens, novoItem]);
    setFormData({ nome: '', categoria: '', quantidade: '', estoque_minimo: '', preco_custo: '', preco_venda: '', condicao: '', descricao: '' });
    setShowModal(false);
  };

  const handleDelete = (id: number | null) => {
    setShowConfirmDelete(false);

    if (!id) return;

    setItens(itens.filter(i => i.id !== id));
    setShowConfirmDelete(false);
  };

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const data = await listarItens();
        setItens(data);
      } catch (e) {
        console.error("Erro ao listar itens: ", e);
      }
    };
    fetchItens();
  }, []);

  const itensAbaixoMinimo = itens.filter(item => item.quantidade < item.estoque_minimo);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>Estoque</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Item
        </button>
      </div>

      {itensAbaixoMinimo.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
            <div>
              <p className="text-yellow-800 mb-2">Itens abaixo do estoque mínimo:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                {itensAbaixoMinimo.map(item => (
                  <li key={item.id}>
                    <span>{item.nome}</span> - 
                    <span> Quantidade: {item.quantidade}</span> / 
                    <span> Mínimo: {item.estoque_minimo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por código, nome ou categoria..."
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
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Quantidade (Min.)</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Preço Custo</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Preço Venda</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItens.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.codigo}</td>
                  <td className="px-6 py-4">{item.nome}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full text-xs">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className='flex items-center gap-2'>
                        <span>{item.quantidade}</span>
                        {item.quantidade < item.estoque_minimo && (
                          <AlertTriangle className="text-yellow-600" size={16} />
                        )}
                      </div>
                      
                      <p className='ml-3 opacity-50'>({item.estoque_minimo})</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">R$ {item.preco_custo.toFixed(2)}</td>
                  <td className="px-6 py-4">R$ {item.preco_venda.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(item.id);
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
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4">Novo Item no Estoque</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Categoria</label>
                  <input
                    type="text"
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    required
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Estoque Mínimo</label>
                  <input
                    type="number"
                    required
                    value={formData.estoque_minimo}
                    onChange={(e) => setFormData({ ...formData, estoque_minimo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.preco_custo}
                    onChange={(e) => setFormData({ ...formData, preco_custo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.preco_venda}
                    onChange={(e) => setFormData({ ...formData, preco_venda: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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
                  Adicionar
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
