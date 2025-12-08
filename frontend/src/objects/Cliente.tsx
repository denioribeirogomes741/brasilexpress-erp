export default interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  totalServicos: number;
  ficha?: string;
}