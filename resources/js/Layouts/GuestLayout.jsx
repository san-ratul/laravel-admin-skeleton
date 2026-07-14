import ApplicationLogo from '@/Components/ApplicationLogo'
import ThemeToggle from '@/Components/app/ThemeToggle'

import { Link } from '@inertiajs/react'

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-muted/30 p-6">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-6">
                <div className="flex justify-center">
                    <Link href="/">
                        <ApplicationLogo className="h-16 w-16 fill-current text-primary" />
                    </Link>
                </div>

                {children}
            </div>
        </div>
    )
}
