import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

import useAuth from '@/hooks/useAuth';
import useFlashToast from '@/hooks/useFlashToast';

import AppDeleteDialog from '@/Components/app/AppDeleteDialog';
import AppPageHeader from '@/Components/app/AppPageHeader';
import AppPagination from '@/Components/app/AppPagination';
import AppStatusBadge from '@/Components/app/AppStatusBadge';
import AppTable from '@/Components/app/AppTable';
import AppTableSearch from '@/Components/app/AppTableSearch';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';

export default function Index({ roles, filters = {} }) {
    const { can } = useAuth();

    useFlashToast();

    const columns = [
        {
            key: 'name',
            header: 'Role',
            render: (role) => (
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="truncate font-medium">
                            {role.name}
                        </span>

                        {role.is_super && (
                            <AppStatusBadge
                                label="Super"
                                variant="warning"
                            />
                        )}
                    </div>

                    <p className="truncate text-xs text-muted-foreground">
                        {role.slug}
                    </p>
                </div>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            className: 'hidden lg:table-cell',
            cellClassName: 'hidden lg:table-cell max-w-sm',
            render: (role) => (
                <span className="line-clamp-1 text-muted-foreground">
                    {role.description ?? '—'}
                </span>
            ),
        },
        {
            key: 'permissions_count',
            header: 'Permissions',
            render: (role) => (
                <AppStatusBadge
                    label={`${role.permissions_count} permissions`}
                />
            ),
        },
        {
            key: 'users_count',
            header: 'Users',
            render: (role) => (
                <span className="text-muted-foreground">
                    {role.users_count}
                </span>
            ),
        },
        {
            key: 'actions',
            header: '',
            className: 'text-right',
            cellClassName: 'text-right',
            render: (role) => (
                <div className="flex items-center justify-end gap-1">
                    {can('roles.update') && (
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            render={
                                <Link
                                    href={route('admin.roles.edit', role.id)}
                                />
                            }
                            aria-label={`Edit ${role.name}`}
                        >
                            <Pencil />
                        </Button>
                    )}

                    {can('roles.delete') && !role.is_super && (
                        <AppDeleteDialog
                            title={`Delete ${role.name}?`}
                            description="Users and permissions assigned to this role will be detached. This action cannot be undone."
                            onConfirm={() =>
                                router.delete(
                                    route('admin.roles.destroy', role.id),
                                    { preserveScroll: true }
                                )
                            }
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout title="Roles">
            <Head title="Roles" />

            <div className="space-y-6">
                <AppPageHeader
                    title="Roles"
                    description="Group permissions into roles and assign them to admin users."
                    actions={
                        can('roles.create') && (
                            <Button
                                render={
                                    <Link
                                        href={route('admin.roles.create')}
                                    />
                                }
                            >
                                <Plus data-icon="inline-start" />
                                Create Role
                            </Button>
                        )
                    }
                />

                <AppTableSearch
                    search={filters.search}
                    placeholder="Search roles..."
                />

                <AppTable
                    columns={columns}
                    rows={roles.data}
                    emptyTitle="No roles found"
                    emptyDescription="Create your first role to start assigning permissions."
                />

                <AppPagination paginator={roles} />
            </div>
        </AuthenticatedLayout>
    );
}
