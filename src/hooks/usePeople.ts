import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PERSON_COLORS, STORAGE_KEYS } from '@/constants';
import type { DivisaoPedido, Pedido, Pessoa } from '@/types';

interface UsePeopleReturn {
  pessoas: Pessoa[];
  divisao: DivisaoPedido[];
  addPessoa: (nome: string) => void;
  removePessoa: (id: string) => void;
  atribuirPessoaAoPedido: (pedidoId: string, pessoaId: string) => void;
  removerPessoaDoPedido: (pedidoId: string, pessoaId: string) => void;
  getPessoasDoPedido: (pedidoId: string) => Pessoa[];
  todosOsPedidosTemPessoas: (pedidos: Pedido[]) => boolean;
  getNextColor: () => string;
}

function pickNextColor(pessoas: Pessoa[]): string {
  const usedCounts = new Map<string, number>();
  for (const cor of PERSON_COLORS) {
    usedCounts.set(cor, 0);
  }
  for (const pessoa of pessoas) {
    usedCounts.set(pessoa.cor, (usedCounts.get(pessoa.cor) ?? 0) + 1);
  }

  let bestColor: string = PERSON_COLORS[0];
  let bestCount = Number.POSITIVE_INFINITY;
  for (const cor of PERSON_COLORS) {
    const count = usedCounts.get(cor) ?? 0;
    if (count < bestCount) {
      bestCount = count;
      bestColor = cor;
    }
  }
  return bestColor;
}

export function usePeople(): UsePeopleReturn {
  const [pessoas, setPessoas] = useLocalStorage<Pessoa[]>(STORAGE_KEYS.PESSOAS, []);
  const [divisao, setDivisao] = useLocalStorage<DivisaoPedido[]>(STORAGE_KEYS.DIVISAO, []);

  const getNextColor = useCallback(() => pickNextColor(pessoas), [pessoas]);

  const addPessoa = useCallback(
    (nome: string) => {
      const trimmed = nome.trim();
      if (trimmed.length < 2) return;

      const novaPessoa: Pessoa = {
        id: crypto.randomUUID(),
        nome: trimmed,
        cor: pickNextColor(pessoas),
      };
      setPessoas((prev) => [...prev, novaPessoa]);
    },
    [pessoas, setPessoas]
  );

  const removePessoa = useCallback(
    (id: string) => {
      setPessoas((prev) => prev.filter((pessoa) => pessoa.id !== id));
      setDivisao((prev) =>
        prev
          .map((item) => ({
            ...item,
            pessoaIds: item.pessoaIds.filter((pessoaId) => pessoaId !== id),
          }))
          .filter((item) => item.pessoaIds.length > 0)
      );
    },
    [setPessoas, setDivisao]
  );

  const atribuirPessoaAoPedido = useCallback(
    (pedidoId: string, pessoaId: string) => {
      setDivisao((prev) => {
        const existing = prev.find((item) => item.pedidoId === pedidoId);
        if (!existing) {
          return [...prev, { pedidoId, pessoaIds: [pessoaId] }];
        }
        if (existing.pessoaIds.includes(pessoaId)) {
          return prev;
        }
        return prev.map((item) =>
          item.pedidoId === pedidoId
            ? { ...item, pessoaIds: [...item.pessoaIds, pessoaId] }
            : item
        );
      });
    },
    [setDivisao]
  );

  const removerPessoaDoPedido = useCallback(
    (pedidoId: string, pessoaId: string) => {
      setDivisao((prev) =>
        prev
          .map((item) =>
            item.pedidoId === pedidoId
              ? { ...item, pessoaIds: item.pessoaIds.filter((id) => id !== pessoaId) }
              : item
          )
          .filter((item) => item.pessoaIds.length > 0)
      );
    },
    [setDivisao]
  );

  const getPessoasDoPedido = useCallback(
    (pedidoId: string): Pessoa[] => {
      const entry = divisao.find((item) => item.pedidoId === pedidoId);
      if (!entry) return [];
      return entry.pessoaIds
        .map((pessoaId) => pessoas.find((pessoa) => pessoa.id === pessoaId))
        .filter((pessoa): pessoa is Pessoa => pessoa !== undefined);
    },
    [divisao, pessoas]
  );

  const todosOsPedidosTemPessoas = useCallback(
    (pedidos: Pedido[]): boolean => {
      if (pedidos.length === 0) return false;
      return pedidos.every((pedido) => {
        const entry = divisao.find((item) => item.pedidoId === pedido.id);
        return !!entry && entry.pessoaIds.length > 0;
      });
    },
    [divisao]
  );

  return {
    pessoas,
    divisao,
    addPessoa,
    removePessoa,
    atribuirPessoaAoPedido,
    removerPessoaDoPedido,
    getPessoasDoPedido,
    todosOsPedidosTemPessoas,
    getNextColor,
  };
}
