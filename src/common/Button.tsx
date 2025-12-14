import clsx from 'clsx';

import { ButtonProps } from '../interface/CommonComponentProps';

function Button({
  type = 'button',
  children,
  className,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'disabled:opacity-75 disabled:cursor-not-allowed text-base font-semibold font-inter rounded-lg',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
