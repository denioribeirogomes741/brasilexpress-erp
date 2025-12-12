import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  message = "Tem certeza que deseja deletar?",
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-51">
      <div className="bg-white rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4">{message}</h2>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={onConfirm}
          >
            Deletar
            <Trash2 className="ml-1" size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
}
