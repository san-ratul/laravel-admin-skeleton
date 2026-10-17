import { Link, usePage } from '@inertiajs/react'
import { KeyRound, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/Components/ui/sidebar'
import useAuth from "@/hooks/useAuth.js";

export default function AppSidebar() {
    const { url } = usePage()
    const { user, initials, hasAvatar, avatarUrl, can } = useAuth();

    const menus = [
        {
            title: 'Dashboard',
            href: route('admin.dashboard'),
            icon: LayoutDashboard,
            can: true,
        },
    ]

    const accessMenus = [
        {
            title: 'Users',
            href: route('admin.users.index'),
            icon: Users,
            can: can('users.view'),
        },
        {
            title: 'Roles',
            href: route('admin.roles.index'),
            icon: ShieldCheck,
            can: can('roles.view'),
        },
        {
            title: 'Permissions',
            href: route('admin.permissions.index'),
            icon: KeyRound,
            can: can('permissions.view'),
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
                            {menus
                                .filter((menu) => menu.can)
                                .map((menu) => (
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

                {accessMenus.some((menu) => menu.can) && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Access Control</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {accessMenus
                                    .filter((menu) => menu.can)
                                    .map((menu) => (
                                        <SidebarMenuItem key={menu.title}>
                                            <SidebarMenuButton
                                                tooltip={menu.title}
                                                isActive={
                                                    url === menu.href ||
                                                    url.startsWith(
                                                        `${menu.href}/`
                                                    )
                                                }
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
                )}
            </SidebarContent>

            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            tooltip="Account"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted font-medium overflow-hidden">
                                {hasAvatar ? (
                                    <img
                                        src={avatarUrl}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xl font-semibold">
                            {initials}
                        </span>
                                )}
                            </div>

                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate text-sm font-medium">
                                    { user.name }
                                </span>

                                <span className="truncate text-xs text-muted-foreground">
                                    { user.email }
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
