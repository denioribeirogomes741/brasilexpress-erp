export default interface Venda {
  id: number;
  codigo?: string;
  cliente: string;
  items: { produto: string; quantidade: number; preco: number }[];
  total: number;
  pagamento: string;
  data: string;
}