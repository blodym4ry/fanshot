interface CreditBadgeProps {
  amount: number;
  size?: 'default' | 'large';
  className?: string;
}

export function CreditBadge({ amount, size = 'default', className = '' }: CreditBadgeProps) {
  const sizeClasses =
    size === 'large'
      ? 'px-4 py-1.5 text-base gap-2'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <div
      className={`
        inline-flex items-center rounded-full font-oswald font-semibold
        bg-gold/10 text-gold border border-gold/20
        ${sizeClasses} ${className}
      `}
    >
      <span className={size === 'large' ? 'text-lg' : 'text-sm'}>🪙</span>
      <span>{amount}</span>
    </div>
  );
}
