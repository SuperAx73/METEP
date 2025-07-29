import React, { ButtonHTMLAttributes, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children,
  className = '',
  disabled,
  onClick,
  ...props 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const touchStartTimeRef = useRef<number>(0);
  const touchEndTimeRef = useRef<number>(0);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || !onClick) return;

    // Safari-specific touch handling
    const handleTouchStart = (e: TouchEvent) => {
      touchStartTimeRef.current = Date.now();
      // Prevent default to avoid double-firing on some Safari versions
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndTimeRef.current = Date.now();
      const touchDuration = touchEndTimeRef.current - touchStartTimeRef.current;
      
      // Only trigger if it's a quick tap (less than 500ms) and not a scroll
      if (touchDuration < 500) {
        e.preventDefault();
        e.stopPropagation();
        onClick(e as any);
      }
    };

    // Add touch event listeners for Safari compatibility
    button.addEventListener('touchstart', handleTouchStart, { passive: false });
    button.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      button.removeEventListener('touchstart', handleTouchStart);
      button.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onClick]);

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 touch-target safari-button';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;