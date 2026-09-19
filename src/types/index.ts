// Tipos globais da aplicação

export interface Pedido {
  id: string;
  nome: string;
  valorUnitario: number;
  quantidade: number;
}

export interface Mesa {
  id: string;
  pedidos: Pedido[];
}
