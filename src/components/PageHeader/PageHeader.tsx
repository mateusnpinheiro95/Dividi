interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMenuClick?: () => void;
  onOptionsClick?: () => void;
}

export const PageHeader = ({
  title,
  subtitle,
  onBack,
  onMenuClick,
  onOptionsClick,
}: PageHeaderProps) => {
  const showBack = typeof onBack === 'function';
  const showMenu = !showBack && typeof onMenuClick === 'function';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
      <div className="container-mobile flex items-center justify-between py-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="flex items-center justify-center size-11 -ml-2 text-gray-900 rounded-lg active:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        ) : showMenu ? (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Abrir menu"
            className="flex items-center justify-center size-11 -ml-2 text-gray-900 rounded-lg active:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        ) : (
          <span className="size-11 -ml-2" aria-hidden="true" />
        )}

        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-semibold leading-7 text-gray-900">{title}</h1>
          {subtitle ? (
            <p className="text-sm font-medium text-primary-600">{subtitle}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onOptionsClick}
          aria-label="Mais opções"
          className="flex items-center justify-center size-11 -mr-2 text-gray-900 rounded-lg active:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
