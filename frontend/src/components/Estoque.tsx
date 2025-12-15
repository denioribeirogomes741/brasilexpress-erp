import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, XIcon, AlignEndVertical, Eye } from 'lucide-react';
import type Item from '../objects/Item';
import { ConfirmDeleteModal } from './modal/DeleteConfimation';
import { criarItem, deleteItem, listarItens } from '../services/itemService';
import type Categoria from '../objects/Categoria';
import { atualizarCategoria, criarCategoria, deletarCategoria, listarCategorias } from '../services/categoriaService';
import { EditCategoria } from './modal/EditCategoria';
import MoreInfoEstoque from './modal/MoreInfoEstoque';
import { EditItem } from './modal/EditItem';
import { toast } from 'react-toastify';
import { criarSubItem, deletarSubItem, listarSubItens } from '../services/subItensService';
import type SubItem from '../objects/SubItem';
import { CreateSubItem } from './modal/CreateSubItem';

export function Estoque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<string>('item');
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showCreateSubItem, setShowCreateSubItem] = useState(false);
  const [itens, setItens] = useState<Item[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subItens, setSubItens] = useState<SubItem[]>([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  

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

  const [formCatData, setFormCatData] = useState({
    nome: '',
    prefix: ''
  });

  const filteredItens = itens.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo!.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const abrirMaisInfo = (item: Item) => {
    setSelectedItem(item);
    console.log("Condição: ", item.condicao);
    setShowMoreInfo(true);
  }
  
  const abrirEditItem = (item: Item) => {
    setSelectedItem(item);
    setShowMoreInfo(false);
    setShowEditItem(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoria) {
      toast.error("Por favor, selecione uma categoria!");
      return;
    }
    
    console.log(formData.nome, formData.descricao, Number(formData.estoque_minimo), Number(formData.quantidade), Number(formData.categoria), formData.condicao, Number(formData.preco_custo), Number(formData.preco_venda));
    
    try {
      const response = await criarItem(formData.nome, formData.descricao, Number(formData.estoque_minimo), Number(formData.quantidade), Number(formData.categoria), formData.condicao, Number(formData.preco_custo), Number(formData.preco_venda));
      const novoItem: Item = {
        id: response.COD_ITEM,
        codigo: response.IDENTIFICADOR,
        nome: response.NOME_ITEM,
        descricao: response.DESCRICAO,
        categoria: response.NOME_CATEGORIA,
        quantidade: response.QNT,
        estoque_minimo: response.MIN_QNT,
        preco_custo: response.PR_CUSTO,
        preco_venda: response.PR_VENDA,
        condicao: response.CONDICAO
      };
      console.log(novoItem);
      setItens([...itens, novoItem]);
      setFormData({ nome: '', categoria: '', quantidade: '', estoque_minimo: '', preco_custo: '', preco_venda: '', condicao: '', descricao: '' });
      setShowModal(false);
      toast.success("Item criado com sucesso!");
    } catch (e) {
      console.error("Erro ao criar item: ", e);
      toast.error("Erro ao criar item! Para mais detalhes, verifique o log.");
    };
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await criarCategoria(formCatData.nome, formCatData.prefix);

      const novaCategoria: Categoria = {
        id: response.COD_CATEGORIA,
        nome: response.NOME_CATEGORIA,
        prefix: response.PREFIXO
      }

      setCategorias([...categorias, novaCategoria]);
      setFormCatData({ nome: '', prefix: '' });
      setShowCreateCategory(false);
      toast.success("Categoria criada com sucesso!");
    } catch (e) {
      console.error("Erro ao criar categoria: ", e);
      toast.error("Erro ao criar categoria! Para mais detalhes, verifique o log.");
    }
    
  };

  const handleDelete = async (id: number | null) => {
    setShowConfirmDelete(false);

    if (!id) return;

    if (deleteType == 'categoria') {
      try {
        const response = await deletarCategoria(id);
        if (response.ok) {
          setCategorias(categorias.filter((c) => c.id !== id));
          toast.success("Categoria deletada com sucesso!");
        };
      } catch (e) {
        console.error("Erro ao deletar categoria: ", e);
        toast.error("Erro ao deletar categoria! Para mais detalhes, verifique o log.");
      };
    } else if (deleteType == 'item') {
      try {
        const response = await deleteItem(id);
        if (response.ok) {
          setItens(itens.filter((i) => i.id !== id));
          toast.success("Item deletado com sucesso!");
        };
      } catch (e) {
        console.error("Erro ao deletar item: ", e);
        toast.error("Erro ao deletar item! Para mais detalhes, verifique o log.");
      };
    } else if (deleteType == 'subitem') {
      try {
        const response = await deletarSubItem(id);
        if (response.ok) {
          toast.success("Sub-item deletado com sucesso!");
          setSubItens(subItens.filter((subItem) => subItem.id !== id))
        }
      } catch (e) {
        console.error("Erro ao deletar sub-item: ", e);
        toast.error("Erro ao deletar sub-item! Para mais detalhes, verifique o log.");
      };
    }
  };

  const handleCategoryEdit = async (categoria: Categoria) => {
    setShowEditCategory(false);
    try {
      const response = await atualizarCategoria(categoria.id, categoria.nome, categoria.prefix);
      if (response.ok) {
        const updatedCategorias = categorias.map((cat) => {
          if (cat.id == categoria.id) {
            return ({
              id: categoria.id,
              nome: categoria.nome,
              prefix: categoria.prefix
            });
          } else {
            return ({
              id: cat.id,
              nome: cat.nome,
              prefix: cat.prefix
            });
          };
        })
        setCategorias(updatedCategorias);
        toast.success("Categoria atualizada com sucesso!");
      };
    } catch (e) {
      console.error("Erro ao atualizar categoria: ", e);
      console.error("Erro ao editar categoria! Para mais detalhes, verifique o log.");
    }
  };

  const handleCreateSubItem = async (nome_subitem: string, descricao: string) => {
    setShowCreateSubItem(false);
    try {
      const response = await criarSubItem(selectedItem!.id, nome_subitem, descricao);

      const newSubItem: SubItem = {
        id: response.COD_SUBITEM,
        cod_item: response.COD_ITEM,
        nome: response.NOME_SUBITEM,
        descricao: response.DESCRICAO
      };

      setSubItens([...subItens, newSubItem]);
      toast.success("Sub-item criado com sucesso!");
    } catch (e) {
      console.error("Erro ao criar sub-item: ", e);
      toast.error("Erro ao criar sub-item! Para mais detalhes, verifique o log.");
    };
  };

  const filterSubItens = (): SubItem[] => {
    return selectedItem ? subItens.filter((subItem) => subItem.cod_item === selectedItem.id) : [];
  }

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const data = await listarItens();
        setItens(data);
      } catch (e) {
        console.error("Erro ao listar itens: ", e);
      };
    };
    fetchItens();

    const fetchCategorias = async () => {
      try {
        const categoriaData = await listarCategorias();
        setCategorias(categoriaData);
      } catch (e) {
        console.error("Erro ao listar categorias: ", e);
      };
    };
    fetchCategorias();

    const fetchSubItens = async () => {
      try {
        const subItensData = await listarSubItens();
        setSubItens(subItensData);
      } catch (e) {
        console.error("Erro ao listar sub-itens: ", e);
      };
    };
    fetchSubItens();
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
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Condição</th>
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
                    <span className="px-3 py-1 rounded-full text-white text-sm bg-blue-600 shadow-sm">
                      {item.condicao}
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
                      
                      {item.estoque_minimo > 0 && <p className='ml-3 opacity-50'>({item.estoque_minimo})</p>} 
                    </div>
                  </td>
                  <td className="px-6 py-4">R$ {item.preco_custo.toFixed(2)}</td>
                  <td className="px-6 py-4">R$ {item.preco_venda.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1"
                      onClick={() => abrirMaisInfo(item)}>
                         
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteType('item');
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
              <div className="">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Categoria</label>
                  <div className='flex h-10 gap-2 justify-between'>
                    <select
                      required
                      className="w-full px-1 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.categoria || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, categoria: e.target.value })
                      }
                      name="categoria"
                      id="categoria"
                    >
                      {/* opção default inválida */}
                      <option value="" disabled hidden>
                        Selecione uma categoria
                      </option>

                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowCategories(true)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                    >
                      <AlignEndVertical size={20} />
                      Categorias
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Nome do Produto</label>
                  <input
                    type="text"
                    maxLength={30}
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className='block text-sm mb-1 text-gray-700'>Condição</label>
                  <select
                    required
                    className="w-full px-1 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const condicao = e.target.value;
                      if (condicao === "Usado") {
                        setFormData({
                          ...formData,
                          condicao,
                          quantidade: "0",
                          estoque_minimo: "0",
                        });
                      } else {
                        setFormData({
                          ...formData,
                          condicao,
                        });
                      }
                    }}
                    name="condicao"
                    id="condicao"
                    value={formData.condicao || ""} // garante que o estado inicial seja vazio
                  >
                    <option value="" disabled hidden>
                      Selecione uma condição
                    </option>
                    <option value="Novo">Novo</option>
                    <option value="Usado">Usado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Descrição</label>
                <textarea
                  required
                  value={formData.descricao}
                  maxLength={200}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    required={formData.condicao !== "Usado"}
                    disabled={formData.condicao === "Usado"}
                    value={formData.quantidade ?? ""}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.condicao === "Usado" ? "bg-gray-200" : "bg-white"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Estoque Mínimo</label>
                  <input
                    type="number"
                    required={formData.condicao !== "Usado"}
                    disabled={formData.condicao === "Usado"}
                    value={formData.estoque_minimo ?? ""}
                    onChange={(e) => setFormData({ ...formData, estoque_minimo: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.condicao === "Usado" ? "bg-gray-200" : "bg-white"}`}
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
                  onClick={() => {
                    setShowModal(false)
                    setFormData({ nome: '', categoria: '', quantidade: '', estoque_minimo: '', preco_custo: '', preco_venda: '', condicao: '', descricao: '' });
                  }}
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
      {showCategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] min-h-[50vh] overflow-y-auto">
            <div className='flex justify-between items-center mb-4'>
              <h2 className="">Categorias</h2>
              <div className='flex'>
                <button
                  onClick={() => {
                    setShowCreateCategory(true);
                  }}
                  className="text-blue-700 px-2 py-2 rounded-lg transition hover:bg-gray-100 flex items-center gap-2"
                >
                  <Plus size={25} />
                </button>
                <button
                  onClick={() => {
                    setShowCategories(false);
                  }}
                  className="text-gray-700 px-2 py-2 rounded-lg transition hover:bg-gray-100 flex items-center gap-2"
                >
                  <XIcon size={25} />
                </button>
              </div>
            </div>
            
            <table className='w-full'>
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Nome da categoria</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Prefixo</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categorias.map((categoria) => (
                  <tr key={categoria.id} className="hover:bg-gray-50">
                    <td className="px-6 py-2">{categoria.nome}</td>
                    <td className="px-6 py-2">{categoria.prefix}</td>
                    <td className="px-6 py-2 flex gap-3">
                      <button 
                        className='hover:scale-110 transition'
                        onClick={() => {
                          setSelectedCategoria(categoria);
                          setShowEditCategory(true);
                        }}
                      >
                        <Edit2 size={20} className='text-blue-700' />
                      </button>
                      <button 
                        className='hover:scale-110 transition'
                        onClick={() => {
                          setDeleteType('categoria');
                          setDeleteId(categoria.id);
                          setShowConfirmDelete(true);
                        }}
                      >
                        <Trash2 size={20} className='text-red-700' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4">Nova Categoria</h2>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Nome da Categoria</label>
                <input
                  type="text"
                  maxLength={30}
                  required
                  value={formCatData.nome}
                  onChange={(e) => setFormCatData({ ...formCatData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Prefixo da Categoria</label>
                <input
                  type="text"
                  maxLength={30}
                  required
                  value={formCatData.prefix}
                  onChange={(e) => setFormCatData({ ...formCatData, prefix: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateCategory(false)}
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
      <EditCategoria
        open={showEditCategory}
        categoria={selectedCategoria}
        onClose={() => setShowEditCategory(false)}
        onSave={(newCategoria) => handleCategoryEdit(newCategoria)}
      />
      <MoreInfoEstoque
        open={showMoreInfo}
        onClose={() => setShowMoreInfo(false)}
        item={selectedItem} 
        onAddSubItem={() => setShowCreateSubItem(true)}
        onEdit={() => abrirEditItem(selectedItem!)}
        subItens={filterSubItens()}
        onDelete={(id) => {
          setDeleteType('subitem');
          setDeleteId(id);
          setShowConfirmDelete(true);
        }}
      />
      <CreateSubItem
        open={showCreateSubItem}
        onClose={() => setShowCreateSubItem(false)}
        onSave={(nome_subitem, descricao) => handleCreateSubItem(nome_subitem, descricao)}
      />
      <EditItem
        open={showEditItem}
        onClose={() => setShowEditItem(false)}
        item={selectedItem} 
        onSave={() => setShowEditItem(false)}
      />
    </div>
  );
}
