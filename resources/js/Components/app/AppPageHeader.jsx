import { cn } from '@/lib/utils'

export default function AppPageHeader({
    title,
    description,
    actions,
    className,
}) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 md:flex-row md:items-start md:justify-between',
                className
            )}
        >
            <div className="min-w-0 space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h1>

                {description && (
                    <p className="text-muted-foreground text-sm">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    )
}
