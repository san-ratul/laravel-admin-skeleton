import AppHeader from '@/Components/app/AppHeader'
import AppSidebar from '@/Components/app/AppSidebar'

import {
    SidebarInset,
    SidebarProvider,
    SidebarRail,
} from '@/Components/ui/sidebar'

export default function AuthenticatedLayout({
    children,
    user,
    title,
}) {
    return (
        <SidebarProvider>
            <AppSidebar>
                <SidebarRail />
            </AppSidebar>

            <SidebarInset>
                <AppHeader
                    user={user}
                    title={title}
                />

                <main className="min-w-0 flex-1 overflow-x-hidden p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
