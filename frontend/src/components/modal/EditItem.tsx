import React, { useState } from "react";
import type Item from "../../objects/Item";


interface ModalDetalhesOSProps {
  open: boolean;
  onClose: () => void;
  item: Item | null;
  onSave: (itemEditado: Item) => void;
}




const EditItem: React.FC<ModalDetalhesOSProps> = ({
  open,
  onClose,
  item,
  onSave,
}) => {
  if (!open || !item) return null;

  const [form, setForm] = useState({ ...item });

  const handleChange = (field: keyof Item, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Editar Item</h2>

          
        </div>

        <div className="space-y-6">

          {/* BLOCO: Informações Gerais */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Informações Gerais
            </h3>

            <div className="grid grid-cols-2 gap-4 text-gray-700">

              {/* Código — NÃO editável */}
              <p>
                <span className="font-medium text-gray-900 block">Código:</span>
                {item.codigo}
              </p>

              {/* Cliente — NÃO editável */}
              <p>
                <span className="font-medium text-gray-900 block">Nome:</span>
                {item.nome}
              </p>

              {/* Descrição */}
              <div className="col-span-2">
                <span className="font-medium text-gray-900 block">Descrição:</span>
                <textarea
                  className="w-full border rounded-lg p-2"
                  value={form.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                />
              </div>

              {/* Equipamento */}
              <div className="col-span-2">
                <span className="font-medium text-gray-900 block">Categoria:</span>
                <input
                  className="w-full border rounded-lg p-2"
                  value={form.categoria}
                  onChange={(e) => handleChange("categoria", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* BLOCO: Status e Valores */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Valores</h3>

            <div className="grid grid-cols-2 gap-4 text-gray-700">

              {/* Status */}
              <div>
                <span className="font-medium text-gray-900 block">Custo:</span>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={form.preco_custo}
                  onChange={(e) => {
                const v = e.target.value;

                // Se apagou tudo → armazena string vazia
                if (v === "") {
                    handleChange("preco_custo", "");
                    return;
                }

                // Caso contrário, converte para número
                handleChange("preco_custo", Number(v));
                }}
                />
              </div>

              {/* Valor — EDITÁVEL COM PLACEHOLDER E TÍTULO NOVO */}
              <div>
                <span className="font-medium text-gray-900 block">Valor:</span>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={form.preco_venda}
                  onChange={(e) => {
                const v = e.target.value;

                // Se apagou tudo → armazena string vazia
                if (v === "") {
                    handleChange("preco_venda", "");
                    return;
                }

                // Caso contrário, converte para número
                handleChange("preco_venda", Number(v));
                }}
                />
              </div>

            </div>
          </div>

          {/* BLOCO: Datas */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Condição</h3>

            <div className="grid grid-cols-2 gap-4 text-gray-700">

              {/* Entrada */}
              <div className="col-span-2">
                <span className="font-medium text-gray-900 block">Condição:</span>
                <select value={form.condicao} name="condicao" id="condicao" className="w-full border rounded-lg p-2" onChange={(e) => handleChange("condicao", e.target.value)}>
                    <option value="Novo">Novo</option>
                    <option value="Usado">Usado</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Botão Fechar */}
        <div className="flex justify-end mt-8 gap-3">
            <button
                onClick={() => onSave(form)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Salvar
            </button>

            <button
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                onClick={onClose}
            >
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default  EditItem