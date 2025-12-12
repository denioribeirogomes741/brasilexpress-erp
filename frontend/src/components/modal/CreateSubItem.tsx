import React, { useState } from "react";


interface ModalCreateSubItemProps {
  open: boolean;
  onClose: () => void;
  onSave: (nome_subitem: string, descricao: string) => void;
}

export const CreateSubItem: React.FC<ModalCreateSubItemProps> = ({
  open,
  onClose,
  onSave,
}) => {
  if (!open) return null;

  const [form, setForm] = useState({ 
    nome_subitem: '',
    descricao: ''
   });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4">Novo Sub-Item</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(form.nome_subitem, form.descricao)
        }} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700">Nome do sub-item</label>
            <input
              type="text"
              maxLength={30}
              required
              value={form.nome_subitem}
              onChange={(e) => setForm({ ...form, nome_subitem: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700">Descrição</label>
            <input
              type="text"
              maxLength={30}
              required
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onClose()}
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
  );
};
