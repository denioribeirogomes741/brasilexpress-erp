import api from './api'

export async function listarCategorias() {
  const response = await api.get('/categorias');
  return response.data;
}

export async function criarCategoria(nome_categoria: string, prefixo: string) {
  const response = await api.post('/categorias', { nome_categoria, prefixo });
  return response.data;
}

export async function atualizarCategoria(id: number, nome_categoria: string, prefixo: string) {
  const response = await api.put(`/categorias/${id}`, { nome_categoria, prefixo })
  return response.data;
}

export async function deletarCategoria(id: number) {
  const response = await api.delete(`/categorias/${id}`);
  return response.data;
}