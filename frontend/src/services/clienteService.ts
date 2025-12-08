import api from './api'

export async function listarClientes() {
  const response = await api.get('/clientes');
  return response.data;
}