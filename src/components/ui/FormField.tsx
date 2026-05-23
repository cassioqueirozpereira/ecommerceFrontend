import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** Visual variant to match each section's design language.
   * - "default": base input with bottom border, used in login/register
   * - "admin": same base but compatible with admin panel's labelClass/inputClass tokens
   */
  variant?: 'default' | 'admin';
  className?: string;
  inputClassName?: string;
}

const baseLabel = 'block text-xs font-medium uppercase tracking-widest text-graphite mb-2';
const adminLabel = 'block text-[10px] font-semibold uppercase tracking-widest text-graphite mb-1.5';

const baseInput =
  'w-full bg-transparent border-b border-obsidian/20 px-0 py-3 text-obsidian focus:outline-none focus:border-obsidian transition-colors rounded-none placeholder-graphite/40 text-sm';

/**
 * Premium form field: label + underline input.
 * Shared across login, register, and admin pages.
 */
export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  disabled,
  variant = 'default',
  className,
  inputClassName,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={variant === 'admin' ? adminLabel : baseLabel}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(baseInput, inputClassName)}
      />
    </div>
  );
}
