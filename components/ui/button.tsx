import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100 text-white hover:bg-primary-200 active:scale-98',
        secondary:
          'bg-accent-100 text-white hover:bg-accent-200 active:scale-98',
        outline:
          'border border-bg-300 bg-transparent text-text-100 hover:bg-bg-300 active:scale-98',
        ghost: 'text-text-100 hover:bg-bg-300 active:scale-98',
        destructive: 'bg-error text-white hover:bg-error/90 active:scale-98',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-5 py-2',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
