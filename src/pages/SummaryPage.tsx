import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BottomNavigation,
  Button,
  Card,
  PageHeader,
  PersonSummaryItem,
} from '@/components';
import { DEFAULT_TABLE_LABEL, ROUTES } from '@/constants';
import { useSummary } from '@/hooks';
import { formatCurrency, resetCalculation, shareSummary } from '@/utils';

export const SummaryPage = () => {
  const navigate = useNavigate();
  const {
    subtotal,
    tipAmount,
    grandTotal,
    tipPercentage,
    tipType,
    summaries,
    hasData,
  } = useSummary();

  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const tipLabel =
    tipType === 'percentage' && tipPercentage !== undefined
      ? `Gorjeta (${tipPercentage}%)`
      : 'Gorjeta';

  const handleShare = useCallback(async () => {
    setShareFeedback(null);
    const result = await shareSummary({
      tableLabel: DEFAULT_TABLE_LABEL,
      grandTotal,
      summaries,
    });

    if (result === 'copied') {
      setShareFeedback('Resumo copiado para a área de transferência.');
    } else if (result === 'failed') {
      setShareFeedback('Não foi possível compartilhar o resumo.');
    }
  }, [grandTotal, summaries]);

  const handleReset = useCallback(() => {
    resetCalculation();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden min-w-0">
      <PageHeader
        title="Resumo"
        subtitle={DEFAULT_TABLE_LABEL}
        onBack={() => navigate(ROUTES.TIP)}
      />

      <div className="flex-1 flex flex-col container-mobile py-5 pb-4 min-h-0 min-w-0">
        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <p className="text-sm text-gray-400 text-center">
              Não há dados suficientes para o resumo.
              <br />
              Volte e complete as etapas anteriores.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.HOME)}
            >
              Voltar ao início
            </Button>
          </div>
        ) : (
          <>
            <section className="mb-6" aria-label="Totais da comanda">
              <Card className="!p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-600">Total da comanda</span>
                  <span className="text-base font-semibold tabular-nums text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">{tipLabel}</span>
                  <span className="text-base font-semibold tabular-nums text-gray-900">
                    {formatCurrency(tipAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3.5 bg-primary-50 border-t border-primary-100">
                  <span className="text-sm font-semibold text-primary-600">
                    Total com gorjeta
                  </span>
                  <span className="text-[28px] font-bold leading-[34px] tabular-nums text-primary-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </Card>
            </section>

            <section
              className="flex-1 flex flex-col min-h-0 mb-6"
              aria-label="Resumo por pessoa"
            >
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 leading-6">
                  Resumo por pessoa
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  Veja quanto cada pessoa deve pagar
                </p>
              </div>

              {summaries.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Nenhuma pessoa na mesa.
                </p>
              ) : (
                <ul
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100"
                  role="list"
                >
                  {summaries.map((item) => (
                    <li key={item.personId}>
                      <PersonSummaryItem
                        name={item.name}
                        color={item.color}
                        total={item.total}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="mt-auto shrink-0 flex flex-col gap-3">
              {shareFeedback ? (
                <p
                  className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
                  role="status"
                >
                  {shareFeedback}
                </p>
              ) : null}

              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleShare}
                className="!bg-gray-100 !text-gray-900 !border-gray-200 active:!bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
                Compartilhar resumo
              </Button>

              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={handleReset}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                  />
                </svg>
                Novo cálculo
              </Button>
            </div>
          </>
        )}
      </div>

      <BottomNavigation currentStep={4} />
    </div>
  );
};
