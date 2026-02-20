import React from 'react';

interface ButtonProps {
  variant?: string;
  size?: string;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...props
}) => {
  const classes = ['btn'];

  if (variant) classes.push(`btn--${variant}`);
  if (size) classes.push(`btn--${size}`);
  if (fullWidth) classes.push('btn--fullwidth');

  if (className) classes.push(className);

  return (
    <button className={classes.join(' ')} {...props}>
      {children}
    </button>
  );
};

export default Button;