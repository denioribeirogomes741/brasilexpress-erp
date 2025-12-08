export default interface Servico {
  id: number;
  codigo?: string;
  cliente: string;
  equipamento: string;
  acessorios?: string;
  descricao: string;
  status: string;
  dataEntrada: string;
  previsaoEntrega: string;
  valor: number;
  obs?: string;
}