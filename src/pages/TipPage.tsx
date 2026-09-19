import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BottomNavigation,
  Button,
  PageHeader,
  TipAmountControl,
  TipParticipantToggle,
  TipTypeSelector,
} from '@/components';
import {
  DEFAULT_TABLE_LABEL,
  MAX_TIP_FIXED,
  MAX_TIP_PERCENTAGE,
  MIN_TIP_FIXED,
  MIN_TIP_PERCENTAGE,
  ROUTES,
  TIP_FIXED_STEP,
  TIP_PERCENTAGE_STEP,
} from '@/constants';
import { usePeople, useTip } from '@/hooks';

export const TipPage = () => {
  const navigate = useNavigate();
  const { people } = usePeople();
  const {
    config,
    setType,
    setPercentage,
    setFixedAmount,
    toggleParticipant,
    syncParticipants,
    canProceed,
  } = useTip();

  useEffect(() => {
    syncParticipants(people);
  }, [people, syncParticipants]);

  const isPercentage = config.type === 'percentage';
  const hasPeople = people.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader
        title="Gorjeta"
        subtitle={DEFAULT_TABLE_LABEL}
        onBack={() => navigate(ROUTES.PEOPLE)}
      />

      <div className="flex-1 flex flex-col container-mobile py-5 pb-4 min-h-0">
        <section className="mb-6" aria-label="Tipo de gorjeta">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 leading-7">
              Tipo de gorjeta
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Escolha como deseja aplicar a gorjeta
            </p>
          </div>

          <TipTypeSelector selected={config.type} onChange={setType} />
        </section>

        <section className="mb-6" aria-label="Valor da gorjeta">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 leading-7">
              {isPercentage ? 'Percentual da gorjeta' : 'Valor da gorjeta'}
            </h2>
          </div>

          <TipAmountControl
            value={isPercentage ? config.percentage : config.fixedAmount}
            onChange={isPercentage ? setPercentage : setFixedAmount}
            min={isPercentage ? MIN_TIP_PERCENTAGE : MIN_TIP_FIXED}
            max={isPercentage ? MAX_TIP_PERCENTAGE : MAX_TIP_FIXED}
            step={isPercentage ? TIP_PERCENTAGE_STEP : TIP_FIXED_STEP}
            suffix={isPercentage ? '%' : 'R$'}
            label={isPercentage ? 'Percentual da gorjeta' : 'Valor da gorjeta'}
          />
        </section>

        <section className="flex-1 flex flex-col min-h-0" aria-label="Participantes da gorjeta">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 leading-7">
              Quem vai participar da gorjeta?
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Por padrão, todos participam
            </p>
          </div>

          {!hasPeople ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-sm text-gray-400 text-center">
                Nenhuma pessoa na mesa.
                <br />
                Volte e adicione pessoas primeiro.
              </p>
            </div>
          ) : (
            <ul
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100"
              role="list"
            >
              {people.map((person) => (
                <li key={person.id}>
                  <TipParticipantToggle
                    person={person}
                    isParticipating={config.participants.includes(person.id)}
                    onChange={toggleParticipant}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-4 shrink-0 flex flex-col gap-3">
          {hasPeople && config.participants.length === 0 ? (
            <p
              className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
              role="status"
            >
              Selecione ao menos uma pessoa para participar da gorjeta.
            </p>
          ) : null}

          <Button
            type="button"
            variant="primary"
            fullWidth
            disabled={!canProceed || !hasPeople}
            onClick={() => navigate(ROUTES.SUMMARY)}
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

      <BottomNavigation currentStep={3} />
    </div>
  );
};
