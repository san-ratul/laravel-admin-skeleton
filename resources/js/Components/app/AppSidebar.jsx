import { Link, usePage } from '@inertiajs/react'
import { LayoutDashboard } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/Components/ui/sidebar'

export default function AppSidebar() {
    const { url } = usePage()

    const menus = [
        {
            title: 'Dashboard',
            href: route('admin.dashboard'),
            icon: LayoutDashboard,
        },
    ]

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex h-16 justify-center border-b p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={
                                <Link href={route('admin.dashboard')} />
                            }
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                A
                            </div>

                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate font-semibold">
                                    Admin Panel
                                </span>

                                <span className="truncate text-xs text-muted-foreground">
                                    Laravel Skeleton
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menus.map((menu) => (
                                <SidebarMenuItem key={menu.title}>
                                    <SidebarMenuButton
                                        tooltip={menu.title}
                                        isActive={url === menu.href}
                                        render={
                                            <Link href={menu.href} />
                                        }
                                    >
                                        <menu.icon />

                                        <span>{menu.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            tooltip="Account"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted font-medium">
                                A
                            </div>

                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate text-sm font-medium">
                                    Admin
                                </span>

                                <span className="truncate text-xs text-muted-foreground">
                                    admin@example.com
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
