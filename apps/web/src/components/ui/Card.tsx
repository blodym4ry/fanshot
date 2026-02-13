'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', selected = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl bg-bg-card p-5
        border transition-all duration-300
        ${
          selected
            ? 'border-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.12)]'
            : 'border-white/[0.04] hover:-translate-y-0.5 hover:border-white/[0.08] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
        }
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Selected gold glow ring */}
      {selected && (
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-gold/20 to-transparent opacity-60" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
