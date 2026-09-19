interface BottomNavigationProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  {
    step: 1 as const,
    label: 'Pedidos',
    icon: (
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
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18A2.25 2.25 0 0 0 20.25 16.5V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6.108V16.5A2.25 2.25 0 0 0 7.5 18.75h3.75m-3.75 0V21m3.75-2.25V21m0 0h3.75"
        />
      </svg>
    ),
  },
  {
    step: 2 as const,
    label: 'Pessoas',
    icon: (
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
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
  },
  {
    step: 3 as const,
    label: 'Gorjeta',
    icon: (
      <span className="text-sm font-semibold leading-none" aria-hidden="true">
        %
      </span>
    ),
  },
  {
    step: 4 as const,
    label: 'Resumo',
    icon: (
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
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
] as const;

export const BottomNavigation = ({ currentStep }: BottomNavigationProps) => {
  return (
    <nav
      className="sticky bottom-0 z-20 bg-white border-t border-gray-100"
      aria-label="Progresso do fluxo"
    >
      <div className="container-mobile py-3">
        <ol className="flex items-center justify-between">
          {STEPS.map((item, index) => {
            const isActive = item.step === currentStep;
            const isCompleted = item.step < currentStep;

            return (
              <li key={item.step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`flex items-center justify-center size-11 rounded-full transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-primary-50 text-gray-400'
                    }`}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`Etapa ${item.step}: ${item.label}${isActive ? ' (atual)' : ''}`}
                  >
                    {item.icon}
                  </span>
                </div>

                {index < STEPS.length - 1 ? (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
