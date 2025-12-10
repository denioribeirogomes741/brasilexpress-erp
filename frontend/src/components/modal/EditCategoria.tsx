import React, { useState } from "react";
import type Categoria from "../../objects/Categoria";


interface ModalEditCategoriaProps {
  open: boolean;
  onClose: () => void;
  categoria: Categoria | null;
  onSave: (categoriaEditada: Categoria) => void;
}

export const EditCategoria: React.FC<ModalEditCategoriaProps> = ({
  open,
  onClose,
  categoria,
  onSave,
}) => {
  if (!open || !categoria) return null;

  const [form, setForm] = useState({ ...categoria });

  const handleChange = (field: keyof Categoria, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Editar Serviço</h2>

          
        </div>

        <div className="space-y-6">

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Editar categoria
            </h3>

            <div className="grid grid-cols-2 gap-4 text-gray-700">

              <div className="col-span-2">
                <span className="font-medium text-gray-900 block">Nome:</span>
                <input
                  className="w-full border rounded-lg p-2"
                  value={form.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <span className="font-medium text-gray-900 block">Prefixo:</span>
                <input
                  className="w-full border rounded-lg p-2"
                  value={form.prefix}
                  onChange={(e) => handleChange("prefix", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botão Fechar */}
        <div className="flex justify-end mt-8 gap-3">
            <button
                onClick={() => onSave(form)}
                className="p-2 px-7 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
