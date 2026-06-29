import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClassName: Record<ButtonVariant, string> = {
  primary: 'primary-btn',
  secondary: 'secondary-btn',
  ghost: 'ghost-btn',
};

function ActionButton({ variant = 'primary', className = '', children, ...props }: PropsWithChildren<ActionButtonProps>) {
  return (
    <button className={`${variantClassName[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default ActionButton;
