// ============================================================
// Glass Card Component
// ============================================================
import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use stronger glass blur */
  strong?: boolean;
  /** Add gradient border */
  gradientBorder?: boolean;
  /** Add glow on hover */
  glow?: boolean;
  /** Padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClass: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

/**
 * Glassmorphism card component.
 * Supports strong variant, gradient border, and glow effects.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ strong = false, gradientBorder = false, glow = false, padding = 'md', className = '', children, ...props }, ref) => {
    const baseClass = strong ? 'glass-card-strong' : 'glass-card';
    const glowClass = glow ? 'glow' : '';
    const borderClass = gradientBorder ? 'gradient-border' : '';
    const pad = paddingClass[padding];

    return (
      <div
        ref={ref}
        className={`${baseClass} ${glowClass} ${borderClass} ${pad} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
