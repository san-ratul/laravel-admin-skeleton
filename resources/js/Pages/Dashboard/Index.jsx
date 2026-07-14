import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Index() {
    return (
        <AuthenticatedLayout title="Dashboard">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h2>

                    <p className="text-muted-foreground">
                        Welcome to your Laravel Admin Skeleton.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Users
                        </h3>

                        <p className="mt-2 text-3xl font-bold">0</p>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Revenue
                        </h3>

                        <p className="mt-2 text-3xl font-bold">৳0</p>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Orders
                        </h3>

                        <p className="mt-2 text-3xl font-bold">0</p>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Growth
                        </h3>

                        <p className="mt-2 text-3xl font-bold">0%</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
