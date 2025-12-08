import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import type Cliente from '../objects/Cliente';
import { ConfirmDeleteModal } from './modal/DeleteConfimation';
import { listarClientes } from '../services/clienteService';

export function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    ficha: '',
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
  });

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tel = formData.telefone.replace(/\D/g, "");

    const novoCliente: Cliente = {
      id: clientes.length + 1,
      ...formData,
      telefone: tel,
      totalServicos: 0,
    };
    setClientes([...clientes, novoCliente]);
    setFormData({ ficha: '', nome: '', email: '', telefone: '', endereco: '' });
    setShowModal(false);
  };

  const handleDelete = (id: number | null) => {
    setShowConfirmDelete(false);

    if (!id) return;
    
    setClientes(clientes.filter(c => c.id !== id));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    if (value.length > 11) value = value.substring(0, 11);

    if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      value = value.replace(/(\d{0,2})/, "($1");
    }

    setFormData({ ...formData, telefone: value });
  };


  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await listarClientes();
        setClientes(data);
      } catch (err) {
        console.error("Erro ao listar clientes:", err);
      }
    };
    fetchClientes();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>Clientes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar clientes..."
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
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Código/Ficha</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Serviços</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div>CL-{cliente.id.toString().padStart(3, "0")}</div>
                      <div className="text-sm text-gray-500">{cliente.ficha ? cliente.ficha : "Sem ficha"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div>{cliente.nome}</div>
                      <div className="text-sm text-gray-500">{cliente.endereco}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        {`(${cliente.telefone.substring(0, 2)}) ${cliente.telefone.substring(2, 7)}-${cliente.telefone.substring(7, 11)}`}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-400" />
                        {cliente.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-sm">
                      {cliente.totalServicos} serviços
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(cliente.id);
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
            <h2 className="mb-4">Novo Cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Ficha</label>
                <input
                  type="text"
                  value={formData.ficha}
                  onChange={(e) => setFormData({ ...formData, ficha: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Nome*</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Email*</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Telefone*</label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={handleTelefoneChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Endereço*</label>
                <input
                  type="text"
                  required
                  value={formData.endereco}
                  maxLength={50}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
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
                  Salvar
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
