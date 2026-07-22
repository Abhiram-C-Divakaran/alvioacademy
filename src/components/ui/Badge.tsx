// ============================================================
// Badge Component
// ============================================================

type BadgeVariant = 'accent' | 'success' | 'warning' | 'error';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  accent: 'badge-accent',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
};

/**
 * Small pill badge for status indicators, labels, and tags.
 */
export default function Badge({ variant = 'accent', children, className = '' }: BadgeProps) {
  return (
    <span className={`badge ${variantClass[variant]} ${className}`}>
      {children}
    </span>
  );
}
