import * as React from 'react';
import { clsx } from 'clsx';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        "h-9 rounded-md border border-border bg-background text-foreground px-2 text-sm shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
