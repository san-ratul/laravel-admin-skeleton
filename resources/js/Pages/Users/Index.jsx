import { Head, Link, router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

import useAuth from '@/hooks/useAuth';
import useFlashToast from '@/hooks/useFlashToast';

import AppPageHeader from '@/Components/app/AppPageHeader';
import AppPagination from '@/Components/app/AppPagination';
import AppStatusBadge from '@/Components/app/AppStatusBadge';
import AppTable from '@/Components/app/AppTable';
import AppTableSearch from '@/Components/app/AppTableSearch';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';

export default function Index({ users, filters = {} }) {
    const { can } = useAuth();

    useFlashToast();

    const columns = [
        {
            key: 'name',
            header: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            user.name
                                .split(' ')
                                .slice(0, 2)
                                .map((part) => part.charAt(0).toUpperCase())
                                .join('')
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-medium">{user.name}</p>

                        <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'roles',
            header: 'Roles',
            render: (user) => (
                <div className="flex flex-wrap gap-1">
                    {user.roles.length === 0 ? (
                        <span className="text-sm text-muted-foreground">
                            No roles
                        </span>
                    ) : (
                        user.roles.map((role) => (
                            <AppStatusBadge
                                key={role.id}
                                label={role.name}
                                variant={role.is_super ? 'warning' : 'secondary'}
                            />
                        ))
                    )}
                </div>
            ),
        },
        {
            key: 'email_verified_at',
            header: 'Status',
            className: 'hidden md:table-cell',
            cellClassName: 'hidden md:table-cell',
            render: (user) => (
                <AppStatusBadge
                    label={user.email_verified_at ? 'Verified' : 'Unverified'}
                    variant={user.email_verified_at ? 'success' : 'muted'}
                />
            ),
        },
        {
            key: 'actions',
            header: '',
            className: 'text-right',
            cellClassName: 'text-right',
            render: (user) =>
                can('users.update') && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        render={
                            <Link href={route('admin.users.edit', user.id)} />
                        }
                        aria-label={`Edit ${user.name}`}
                    >
                        <Pencil />
                    </Button>
                ),
        },
    ];

    return (
        <AuthenticatedLayout title="Users">
            <Head title="Users" />

            <div className="space-y-6">
                <AppPageHeader
                    title="Admin Users"
                    description="Assign roles to admin users to control what they can access."
                />

                <AppTableSearch
                    search={filters.search}
                    placeholder="Search users..."
                />

                <AppTable
                    columns={columns}
                    rows={users.data}
                    emptyTitle="No users found"
                    emptyDescription="Try a different search term."
                />

                <AppPagination paginator={users} />
            </div>
        </AuthenticatedLayout>
    );
}
