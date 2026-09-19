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

export interface Pessoa {
  id: string;
  nome: string;
  cor: string;
}

export interface DivisaoPedido {
  pedidoId: string;
  pessoaIds: string[];
}
