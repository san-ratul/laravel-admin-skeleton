import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

export default function AppEmptyState({
    title = 'Nothing here yet',
    description,
    icon: Icon = Inbox,
    action,
    className,
}) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-2 px-6 py-12 text-center',
                className
            )}
        >
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Icon className="size-5 text-muted-foreground" />
            </div>

            <div className="space-y-1">
                <p className="text-sm font-medium">{title}</p>

                {description && (
                    <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
