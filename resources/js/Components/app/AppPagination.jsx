import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/Components/ui/button';

export default function AppPagination({
    paginator,
    className,
}) {
    if (!paginator || (paginator.last_page ?? 1) <= 1) {
        return null;
    }

    const links = (paginator.links ?? []).filter(
        (link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
    );

    const previous = paginator.prev_page_url;
    const next = paginator.next_page_url;

    const disabledClasses = 'pointer-events-none opacity-50';

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-between gap-3 sm:flex-row',
                className
            )}
        >
            <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">
                    {paginator.from ?? 0}
                </span>{' '}
                to{' '}
                <span className="font-medium text-foreground">
                    {paginator.to ?? 0}
                </span>{' '}
                of{' '}
                <span className="font-medium text-foreground">
                    {paginator.total ?? 0}
                </span>{' '}
                results
            </p>

            <div className="flex items-center gap-1">
                {previous ? (
                    <Link
                        href={previous}
                        preserveScroll
                        aria-label="Previous page"
                        className={cn(
                            buttonVariants({ variant: 'outline', size: 'icon-sm' })
                        )}
                    >
                        <ChevronLeft />
                    </Link>
                ) : (
                    <span
                        aria-label="Previous page"
                        className={cn(
                            buttonVariants({ variant: 'outline', size: 'icon-sm' }),
                            disabledClasses
                        )}
                    >
                        <ChevronLeft />
                    </span>
                )}

                {links.map((link, index) => (
                    <Fragment key={index}>
                        {link.label === '...' ? (
                            <span className="px-1.5 text-sm text-muted-foreground">
                                …
                            </span>
                        ) : link.url ? (
                            <Link
                                href={link.url}
                                preserveScroll
                                aria-label={`Page ${link.label}`}
                                aria-current={link.active ? 'page' : undefined}
                                className={cn(
                                    buttonVariants({
                                        variant: link.active ? 'default' : 'outline',
                                        size: 'icon-sm',
                                    })
                                )}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <span
                                aria-label={`Page ${link.label}`}
                                className={cn(
                                    buttonVariants({
                                        variant: link.active ? 'default' : 'outline',
                                        size: 'icon-sm',
                                    }),
                                    disabledClasses
                                )}
                            >
                                {link.label}
                            </span>
                        )}
                    </Fragment>
                ))}

                {next ? (
                    <Link
                        href={next}
                        preserveScroll
                        aria-label="Next page"
                        className={cn(
                            buttonVariants({ variant: 'outline', size: 'icon-sm' })
                        )}
                    >
                        <ChevronRight />
                    </Link>
                ) : (
                    <span
                        aria-label="Next page"
                        className={cn(
                            buttonVariants({ variant: 'outline', size: 'icon-sm' }),
                            disabledClasses
                        )}
                    >
                        <ChevronRight />
                    </span>
                )}
            </div>
        </div>
    );
}
