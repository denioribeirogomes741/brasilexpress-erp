import React from "react";
import type Item from "../../objects/Item";
import { Edit2 } from "lucide-react";

interface ModalDetalhesOSProps {
  open: boolean;
  onClose: () => void;
  onEdit: (item: Item) => void;
  item: Item | null;
}

const MoreInfoEstoque: React.FC<ModalDetalhesOSProps> = ({ open, onClose, item, onEdit }) => {
  if (!open || !item) return null;

  return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl">

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

      {/* CARD PRINCIPAL */}
      <div className="space-y-6">

        {/* BLOCO: Informações Gerais */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Informações Gerais</h3>

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
              <span className="font-medium text-gray-900 block">Descrição:</span>
              {item.descricao}
            </p>

            <p className="col-span-2">
              <span className="font-medium text-gray-900 block">Categoria:</span>
              {item.categoria}
            </p>
          </div>
        </div>

        {/* BLOCO: Status & Valores */}
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

        {/* BLOCO: Datas */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Condição</h3>

          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p className="flex items-center gap-2">
              <span className="font-medium text-gray-900 block">Condição:</span>
              <span className="px-3 py-1 rounded-full text-white text-sm bg-blue-600 shadow-sm">
                {item.condicao}
              </span>
            </p>
          </div>
        </div>

      </div>

      {/* Botão */}
      <div className="flex justify-end mt-8">
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