import React, { useState } from "react";
import type Servico from "../../objects/Servico";


interface ModalDetalhesOSProps {
  open: boolean;
  onClose: () => void;
  servico: Servico | null;
  onSave: (servicoEditado: Servico) => void;
}

const brToInputDate = (brDate: string) => {
  const [dia, mes, ano] = brDate.split("/");
  return `${ano}-${mes}-${dia}`;
}


const EditServico: React.FC<ModalDetalhesOSProps> = ({
  open,
  onClose,
  servico,
  onSave,
}) => {
  if (!open || !servico) return null;

  const [form, setForm] = useState({ ...servico, dataEntrada: brToInputDate(servico.dataEntrada), previsaoEntrega: brToInputDate(servico.previsaoEntrega) });

  const handleChange = (field: keyof Servico, value: any) => {
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

          {/* BLOCO: Informações Gerais */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Informações Gerais
            </h3>

            <div className="grid grid-cols-2 gap-4 text-gray-700">

              {/* Código — NÃO editável */}
              <p>
                <span className="font-medium text-gray-900 block">Código:</span>
                {servico.codigo}
              </p>

              {/* Cliente — NÃO editável */}
              <p>
                <span className="font-medium text-gray-900 block">Cliente:</span>
                {servico.cliente}
              </p>

              {/* Descrição */}
              <div className="col-span-2">
                <span className="font-medium text-gray-900 block">Serviço:</span>
                <input
                  className="w-full border rounded-lg p-2"
                  value={form.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                />
              </div>

              {/* Equipamento */}
              <div className="col-span-2">
                <span className="font-medium text-gray-900 block">Equipamento:</span>
                <input
                  className="w-full border rounded-lg p-2"
                  value={form.equipamento}
                  onChange={(e) => handleChange("equipamento", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* BLOCO: Status e Valores */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Status e Valores</h3>

            <div className="grid grid-cols-2 gap-4 text-gray-700">

              {/* Status */}
              <div>
                <span className="font-medium text-gray-900 block">Status:</span>
                <input
                  className="w-full border rounded-lg p-2"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                />
              </div>

              {/* Valor — EDITÁVEL COM PLACEHOLDER E TÍTULO NOVO */}
              <div>
                <span className="font-medium text-gray-900 block">Valor:</span>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={form.valor}
                  onChange={(e) => {
                const v = e.target.value;

                // Se apagou tudo → armazena string vazia
                if (v === "") {
                    handleChange("valor", "");
                    return;
                }

                // Caso contrário, converte para número
                handleChange("valor", Number(v));
                }}
                />
              </div>

            </div>
          </div>

          {/* BLOCO: Datas */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Datas</h3>

            <div className="grid grid-cols-2 gap-4 text-gray-700">

              {/* Entrada */}
              <div>
                <span className="font-medium text-gray-900 block">Entrada:</span>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  value={form.dataEntrada}
                  onChange={(e) => handleChange("dataEntrada", e.target.value)}
                />
              </div>

              {/* Previsão */}
              <div>
                <span className="font-medium text-gray-900 block">Previsão de Entrega:</span>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  value={form.previsaoEntrega}
                  onChange={(e) =>
                    handleChange("previsaoEntrega", e.target.value)
                  }
                />
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

export default  EditServico;
