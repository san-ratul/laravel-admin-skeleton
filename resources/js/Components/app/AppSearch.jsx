import { Search } from 'lucide-react'

import { Input } from '@/Components/ui/input'

export default function AppSearch({
    value = '',
    onChange,
    placeholder = 'Search...',
    className = '',
}) {
    return (
        <div className={`relative hidden md:block ${className}`}>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-64 pl-9"
            />
        </div>
    )
}
