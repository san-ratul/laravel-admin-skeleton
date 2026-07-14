import { useTheme } from 'next-themes'
import { Check, Monitor, Moon, Sun } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const themes = [
        {
            value: 'light',
            label: 'Light',
            icon: Sun,
        },
        {
            value: 'dark',
            label: 'Dark',
            icon: Moon,
        },
        {
            value: 'system',
            label: 'System',
            icon: Monitor,
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle theme"
                    />
                }
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {themes.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem
                        key={value}
                        onClick={() => setTheme(value)}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </div>

                        {theme === value && (
                            <Check className="h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
