import { Head, Link, router } from '@inertiajs/react';

import useFlashToast from '@/hooks/useFlashToast';

import AppDeleteDialog from '@/Components/app/AppDeleteDialog';
import AppPageHeader from '@/Components/app/AppPageHeader';
import AppStatusBadge from '@/Components/app/AppStatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';

import RoleForm from '@/Pages/Roles/Partials/RoleForm';

export default function Edit({ role, groupedPermissions = [] }) {
    useFlashToast();

    return (
        <AuthenticatedLayout title={`Edit ${role.name}`}>
            <Head title={`Edit ${role.name}`} />

            <div className="space-y-6">
                <AppPageHeader
                    title={`Edit ${role.name}`}
                    description={`Update the role details or change its ${role.permission_ids.length} assigned permissions.`}
                    actions={
                        <>
                            <Button
                                variant="outline"
                                render={
                                    <Link href={route('admin.roles.index')} />
                                }
                            >
                                Back to Roles
                            </Button>

                            {!role.is_super && (
                                <AppDeleteDialog
                                    title={`Delete ${role.name}?`}
                                    description="Users and permissions assigned to this role will be detached. This action cannot be undone."
                                    onConfirm={() =>
                                        router.delete(
                                            route('admin.roles.destroy', role.id),
                                            { preserveScroll: false }
                                        )
                                    }
                                />
                            )}
                        </>
                    }
                />

                {role.is_super && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                        This is the super admin role. It bypasses every
                        permission check and grants full access to{' '}
                        {role.users_count}{' '}
                        {role.users_count === 1 ? 'user' : 'users'}.
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <AppStatusBadge
                        label={role.slug}
                        variant="outline"
                        className="font-mono"
                    />

                    <AppStatusBadge
                        label={`${role.users_count} ${
                            role.users_count === 1 ? 'user' : 'users'
                        }`}
                        variant="muted"
                    />
                </div>

                <RoleForm
                    role={role}
                    groupedPermissions={groupedPermissions}
                    submitUrl={route('admin.roles.update', role.id)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
