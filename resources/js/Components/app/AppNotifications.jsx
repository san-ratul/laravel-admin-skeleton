import { Bell } from 'lucide-react'

import { Button } from '@/Components/ui/button'

export default function AppNotifications({
                                             count = 0,
                                         }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
        >
            <Bell className="h-5 w-5" />

            {count > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </Button>
    )
}
