import { Badge, badgeVariants } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

export default function AppStatusBadge({
    label,
    variant = 'muted',
    className,
    ...props
}) {
    return (
        <Badge
            variant={variant}
            className={cn('max-w-full truncate', className)}
            {...props}
        >
            {label}
        </Badge>
    );
}

export { badgeVariants };
