// Componente Card reutilizável

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  const isClickable = !!onClick;
  const clickableClasses = isClickable ? 'active:scale-95 cursor-pointer' : '';
  
  return (
    <div
      className={`card ${clickableClasses} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
