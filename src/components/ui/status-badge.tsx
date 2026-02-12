import { cn } from '@/lib/utils';
import type { InvoiceStatus, ProductCategory } from '@/lib/types';
import { statusLabels, categoryLabels } from '@/lib/types';

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const statusStyles: Record<InvoiceStatus, string> = {
  pendiente: 'bg-warning/15 text-warning border-warning/30',
  pagada: 'bg-success/15 text-success border-success/30',
  cancelada: 'bg-destructive/15 text-destructive border-destructive/30',
  vencida: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
      statusStyles[status],
      className
    )}>
      {statusLabels[status]}
    </span>
  );
}

interface CategoryBadgeProps {
  category: ProductCategory;
  className?: string;
}

const categoryStyles: Record<ProductCategory, string> = {
  electronica: 'bg-info/15 text-info border-info/30',
  ropa: 'bg-accent/15 text-accent border-accent/30',
  alimentos: 'bg-success/15 text-success border-success/30',
  servicios: 'bg-primary/15 text-primary border-primary/30',
  otros: 'bg-muted text-muted-foreground border-border',
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
      categoryStyles[category],
      className
    )}>
      {categoryLabels[category]}
    </span>
  );
}
