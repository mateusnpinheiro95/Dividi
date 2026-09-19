import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AddPersonModal,
  BottomNavigation,
  Button,
  OrderDivisionCard,
  PageHeader,
} from '@/components';
import { DEFAULT_MESA_ID, ROUTES } from '@/constants';
import { useOrders, usePeople } from '@/hooks';
import { getInitials } from '@/utils';

export const PeoplePage = () => {
  const navigate = useNavigate();
  const { pedidos } = useOrders();
  const {
    pessoas,
    addPessoa,
    removePessoa,
    atribuirPessoaAoPedido,
    removerPessoaDoPedido,
    getPessoasDoPedido,
    todosOsPedidosTemPessoas,
    getNextColor,
  } = usePeople();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasPedidos = pedidos.length > 0;
  const hasPessoas = pessoas.length > 0;
  const canProceed = hasPedidos && hasPessoas && todosOsPedidosTemPessoas(pedidos);
  const pedidosSemPessoas = pedidos.filter(
    (pedido) => getPessoasDoPedido(pedido.id).length === 0
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader
        title="Pessoas"
        subtitle={DEFAULT_MESA_ID}
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div className="flex-1 flex flex-col container-mobile py-5 pb-4 min-h-0">
        <section className="mb-6" aria-label="Pessoas da mesa">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 leading-7">Pessoas</h2>
              <p className="text-sm text-gray-600 mt-0.5">Adicione as pessoas da mesa</p>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 !px-3 !py-2 !min-h-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Adicionar
            </Button>
          </div>

          {!hasPessoas ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">
                Nenhuma pessoa adicionada.
                <br />
                Toque em Adicionar para começar.
              </p>
            </div>
          ) : (
            <ul
              className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="list"
              aria-label="Lista de pessoas (role horizontalmente)"
            >
              {pessoas.map((pessoa) => (
                <li
                  key={pessoa.id}
                  className="shrink-0 w-[calc((100%-0.75rem)/2)] snap-start"
                >
                  <div className="card flex flex-col items-center gap-2 py-4 relative h-full min-h-[104px]">
                    <span
                      className="inline-flex items-center justify-center size-12 rounded-full text-white text-lg font-semibold"
                      style={{ backgroundColor: pessoa.cor }}
                      aria-hidden="true"
                    >
                      {getInitials(pessoa.nome)}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate max-w-full px-1">
                      {pessoa.nome}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePessoa(pessoa.id)}
                      aria-label={`Remover ${pessoa.nome}`}
                      className="absolute top-1 right-1 flex items-center justify-center size-11 text-gray-400 rounded-lg active:bg-gray-100 active:text-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}

              <li className="shrink-0 w-[calc((100%-0.75rem)/2)] snap-start">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  aria-label="Adicionar pessoa"
                  className="card w-full h-full flex flex-col items-center justify-center gap-2 py-4 min-h-[104px] border-dashed text-gray-400 active:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-8"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </li>
            </ul>
          )}
        </section>

        <section className="flex-1 flex flex-col min-h-0" aria-label="Divisão dos pedidos">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 leading-7">
              Divisão dos pedidos
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Selecione quem consumiu cada item
            </p>
          </div>

          {!hasPedidos ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-sm text-gray-400 text-center">
                Nenhum pedido na comanda.
                <br />
                Volte e adicione itens primeiro.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto min-h-0 pb-2">
              {pedidos.map((pedido) => (
                <OrderDivisionCard
                  key={pedido.id}
                  pedido={pedido}
                  pessoasAtribuidas={getPessoasDoPedido(pedido.id)}
                  todasPessoas={pessoas}
                  onAddPerson={(pessoaId) => atribuirPessoaAoPedido(pedido.id, pessoaId)}
                  onRemovePerson={(pessoaId) => removerPessoaDoPedido(pedido.id, pessoaId)}
                />
              ))}
            </div>
          )}
        </section>

        <div className="mt-4 shrink-0 flex flex-col gap-3">
          {hasPedidos && hasPessoas && pedidosSemPessoas > 0 ? (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" role="status">
              {pedidosSemPessoas === 1
                ? '1 pedido ainda sem pessoas atribuídas.'
                : `${pedidosSemPessoas} pedidos ainda sem pessoas atribuídas.`}
            </p>
          ) : null}

          <Button
            type="button"
            variant="primary"
            fullWidth
            disabled={!canProceed}
            onClick={() => {
              // Próxima etapa (Gorjeta) será implementada depois
            }}
          >
            Próximo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Button>
        </div>
      </div>

      <BottomNavigation currentStep={2} />

      <AddPersonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addPessoa}
        nextColor={getNextColor()}
      />
    </div>
  );
};
