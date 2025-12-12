import api from './api'

export async function listarSubItens() {
  const response = await api.get('/sub-itens');
  return response.data;
}

export async function criarSubItem(cod_item: number, nome_subitem: string, descricao: string) {
  const response = await api.post('/sub-itens', { cod_item, nome_subitem, descricao });
  return response.data;
}

export async function atualizarSubItem(id: number, cod_item: number, nome_subitem: string, descricao: string) {
  const response = await api.put(`/sub-itens/${id}`, { cod_item, nome_subitem, descricao })
  return response.data;
}

export async function deletarSubItem(id: number) {
  const response = await api.delete(`/sub-itens/${id}`);
  return response.data;
}