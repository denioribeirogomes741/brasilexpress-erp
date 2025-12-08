export default interface Item {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  quantidade: number;
  estoque_minimo: number;
  preco_custo: number;
  preco_venda: number;
  fornecedor: string;
}