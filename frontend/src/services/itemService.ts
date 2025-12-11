import api from './api'

export async function listarItens() {
  const response = await api.get('/items');
  return response.data;
}

export async function criarItem(nome_item: string, descricao: string, min_qnt: number, qnt: number, cod_categoria: number, condicao: string, pr_custo: number, pr_venda: number) {
  const response = await api.post('/items', { nome_item, descricao, min_qnt, qnt, cod_categoria, condicao, pr_custo, pr_venda });
  return response.data;
}

export async function updateItem(id: number, nome_item: string, descricao: string, min_qnt: number, qnt: number, cod_categoria: number, condicao: string, pr_custo: number, pr_venda: number) {
  const response = await api.put(`/items/${id}`, { nome_item, descricao, min_qnt, qnt, cod_categoria, condicao, pr_custo, pr_venda });
  return response.data;
}

export async function deleteItem(id: number) {
  const response = await api.put(`/items/${id}`);
  return response.data;
}