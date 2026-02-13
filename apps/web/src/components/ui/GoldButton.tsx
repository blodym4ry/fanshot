'use client';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'large' | 'small';
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  className?: string;
}

export function GoldButton({
  children,
  onClick,
  size = 'large',
  variant = 'primary',
  disabled = false,
  className = '',
}: GoldButtonProps) {
  const sizeClasses =
    size === 'large'
      ? 'px-8 py-3.5 text-base tracking-wider'
      : 'px-5 py-2 text-sm tracking-wide';

  if (variant === 'outline') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          group relative overflow-hidden rounded-xl font-oswald font-semibold uppercase
          border border-gold/40 bg-transparent text-gold
          transition-all duration-300
          hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)]
          active:translate-y-0 active:scale-[0.98]
          disabled:pointer-events-none disabled:opacity-40
          ${sizeClasses} ${className}
        `}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative overflow-hidden rounded-xl font-oswald font-semibold uppercase
        bg-gradient-to-r from-gold-dark via-gold to-gold-light text-bg-primary
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)]
        active:translate-y-0 active:scale-[0.98]
        disabled:pointer-events-none disabled:opacity-40
        ${sizeClasses} ${className}
      `}
    >
      {/* Shimmer sweep on hover */}
      <span
        className="
          pointer-events-none absolute inset-0 z-0 -translate-x-full
          bg-gradient-to-r from-transparent via-white/25 to-transparent
          transition-transform duration-700 ease-out
          group-hover:translate-x-full
        "
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
