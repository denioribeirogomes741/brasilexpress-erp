import React from "react";
import type Item from "../../objects/Item";
import { Edit2, Plus, Trash2, Eye } from "lucide-react";
import type SubItem from "../../objects/SubItem";

interface ModalDetalhesOSProps {
  open: boolean;
  onClose: () => void;
  onEdit: (item: Item) => void;
  onAddSubItem: () => void;
  onDelete: (id: number) => void;
  item: Item | null;
  subItens: SubItem[];
}

const MoreInfoEstoque: React.FC<ModalDetalhesOSProps> = ({
  open,
  onClose,
  item,
  onEdit,
  subItens,
  onAddSubItem,
  onDelete,
}) => {
  if (!open || !item) return null;

  console.log(item.condicao);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] p-8 shadow-2xl flex flex-col">
        {/* Cabeçalho */}
        <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
          Detalhes da OS
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded hover:bg-gray-100 transition"
            title="Editar OS"
          >
            <Edit2 size={20} className="text-gray-700" />
          </button>
        </h2>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Informações Gerais */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Informações Gerais
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-medium text-gray-900 block">Código:</span>
                {item.codigo}
              </p>
              <p>
                <span className="font-medium text-gray-900 block">Nome:</span>
                {item.nome}
              </p>
              <p className="col-span-2">
                <span className="font-medium text-gray-900 block">
                  Descrição:
                </span>
                {item.descricao}
              </p>
              <p>
                <span className="font-medium text-gray-900 block">
                  Categoria:
                </span>
                {item.categoria}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-gray-900 block">
                  Condição:
                </span>
                <span className="px-3 py-1 rounded-full text-white text-sm bg-blue-600 shadow-sm">
                  {item.condicao}
                </span>
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Valores</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-medium text-gray-900 block">Custo:</span>
                R$ {item.preco_custo.toFixed(2)}
              </p>
              <p>
                <span className="font-medium text-gray-900 block">Venda:</span>
                R$ {item.preco_venda.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Sub-Itens */}
          {item.condicao == "Usado" &&
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Sub-Itens</h3>
                <button
                  onClick={onAddSubItem}
                  className="text-blue-700 px-3 py-2 rounded-lg transition hover:bg-gray-100 flex items-center gap-2"
                >
                  <Plus size={20} />
                  <span className="text-sm font-medium">Adicionar</span>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Nome
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Descrição
                      </th>
                      <th className="px-4 py-2 text-center text-gray-600 font-medium">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subItens.map((subItem) => (
                      <tr key={subItem.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{subItem.nome}</td>
                        <td className="px-4 py-2">{subItem.descricao}</td>
                        <td className="px-4 py-2 text-center flex justify-center gap-2">
                          <button
                            className="p-1 rounded hover:bg-gray-100 transition"
                            title="Visualizar"
                          >
                            <Eye size={18} className="text-blue-700" />
                          </button>
                          <button
                            className="p-1 rounded hover:bg-gray-100 transition"
                            onClick={() => onDelete(subItem.id)}
                            title="Excluir"
                          >
                            <Trash2 size={18} className="text-red-700" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>

        {/* Rodapé fixo dentro do modal */}
        <div className="flex justify-end mt-4 border-t pt-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoEstoque;