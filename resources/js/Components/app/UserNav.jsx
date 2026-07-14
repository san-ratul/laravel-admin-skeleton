import {Link, router} from '@inertiajs/react'
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

export default function UserNav({
                                    user = {
                                        name: 'John Doe',
                                        email: 'john@example.com',
                                    },
                                }) {
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
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
                <DropdownMenuItem>
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
