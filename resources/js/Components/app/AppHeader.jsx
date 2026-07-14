import { SidebarTrigger } from '@/Components/ui/sidebar'
import { Separator } from '@/Components/ui/separator'

import AppNotifications from '@/Components/app/AppNotifications'
import AppSearch from '@/Components/app/AppSearch'
import ThemeToggle from '@/Components/app/ThemeToggle'
import UserNav from '@/Components/app/UserNav'

export default function AppHeader({
    user,
    title = 'Dashboard',
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <SidebarTrigger />

                <Separator
                    orientation="vertical"
                    className="h-5"
                />

                <h1 className="truncate text-lg font-semibold">
                    {title}
                </h1>
            </div>

            <div className="flex shrink-0 items-center gap-1 md:gap-2">
                <div className="hidden xl:block">
                    <AppSearch />
                </div>

                <AppNotifications />

                <ThemeToggle />

                <UserNav user={user} />
            </div>
        </header>
    )
}
