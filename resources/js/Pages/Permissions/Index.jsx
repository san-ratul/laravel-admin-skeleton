import { Head } from '@inertiajs/react';
import { KeyRound, Lock } from 'lucide-react';

import AppPageHeader from '@/Components/app/AppPageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';

export default function Index({ groupedPermissions = [], total = 0 }) {
    return (
        <AuthenticatedLayout title="Permissions">
            <Head title="Permissions" />

            <div className="space-y-6">
                <AppPageHeader
                    title="Permissions"
                    description={`Read-only registry of ${total} permissions. Permissions are created with the permission:create command or the permission seeder and can never be deleted.`}
                />

                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {groupedPermissions.map((group) => (
                        <Card key={group.group}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <KeyRound className="size-4 text-muted-foreground" />

                                    {group.label}
                                </CardTitle>

                                <CardDescription>
                                    {group.permissions.length}{' '}
                                    {group.permissions.length === 1
                                        ? 'permission'
                                        : 'permissions'}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                {group.permissions.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
                                    >
                                        <span className="truncate text-sm">
                                            {permission.name}
                                        </span>

                                        <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                            {permission.key}
                                        </code>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="size-3.5" />
                    Permissions cannot be created or deleted from the panel.
                    Use `php artisan permission:create {'{key}'}` to add full
                    CRUD permissions for a new key.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
