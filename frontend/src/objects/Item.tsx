export default interface Item {
  id: number;
  codigo?: string;
  nome: string;
  descricao: string;
  categoria: string;
  quantidade: number;
  estoque_minimo: number;
  preco_custo: number;
  preco_venda: number;
  condicao: string;
};