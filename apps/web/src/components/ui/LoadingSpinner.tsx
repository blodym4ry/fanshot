interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  className?: string;
}

export function LoadingSpinner({ size = 'default', className = '' }: LoadingSpinnerProps) {
  const sizeMap = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const ballSize = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-3xl',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {/* Spinning gold ring */}
      <div
        className={`absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-gold border-r-gold/30 ${sizeMap[size]}`}
      />
      {/* Football in center */}
      <span className={ballSize[size]}>⚽</span>
    </div>
  );
}
