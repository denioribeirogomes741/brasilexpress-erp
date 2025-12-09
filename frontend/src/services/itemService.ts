import api from './api'

export async function listarItens() {
  const response = await api.get('/items');
  return response.data;
}