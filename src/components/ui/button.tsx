import * as React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border disabled:opacity-50 disabled:pointer-events-none';

    const variants: Record<string, string> = {
      default: 'bg-primary text-primary-foreground hover:opacity-90',
      outline:
        'border border-border bg-background text-foreground hover:bg-muted',
      ghost: 'text-foreground hover:bg-muted',
    };

    const sizes: Record<string, string> = {
      sm: 'h-8 px-3',
      md: 'h-9 px-4',
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
