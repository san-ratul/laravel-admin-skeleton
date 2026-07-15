import {Link, router, usePage} from '@inertiajs/react'
import {
    ChevronDown,
    LogOut,
    User,
} from 'lucide-react'

import { Button } from '@/Components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import {useMemo} from "react";
import useAuth from "@/hooks/useAuth.js";

export default function UserNav() {
    const { user, hasAvatar, avatarUrl, initials } = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-2"
                    />
                }
            >
                <div className="flex p-1 h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground overflow-hidden">
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

                <div className="hidden text-left md:block">
                    <p className="text-sm font-medium leading-none">
                        {user.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {user.email}
                    </p>
                </div>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-56"
            >
                <DropdownMenuItem
                    render={
                        <Link href={route('admin.profile.edit')} />
                    }
                >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.post(route('logout'))}
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
