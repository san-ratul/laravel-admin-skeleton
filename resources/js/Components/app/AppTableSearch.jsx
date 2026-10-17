import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

import { cn } from '@/lib/utils';

import { Input } from '@/Components/ui/input';

export default function AppTableSearch({
    search = '',
    placeholder = 'Search...',
    className,
}) {
    const [value, setValue] = useState(search);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                window.location.pathname,
                { search: value || undefined },
                { preserveState: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className={cn('relative', className)}>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 sm:w-64"
            />
        </div>
    );
}
