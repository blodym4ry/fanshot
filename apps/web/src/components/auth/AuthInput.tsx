'use client';

import { useState } from 'react';
import { useT } from '@/src/lib/i18n';

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
}

export function AuthInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const t = useT('auth');

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-oswald text-[11px] font-medium uppercase tracking-[0.15em] text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-white/[0.06] bg-bg-card px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-gold focus:shadow-[0_0_12px_rgba(212,175,55,0.1)]"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted transition-colors hover:text-text-secondary"
          >
            {showPassword ? t('hidePassword') : t('showPassword')}
          </button>
        )}
      </div>
    </div>
  );
}
