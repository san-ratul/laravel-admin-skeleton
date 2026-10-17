import { Head, Link } from '@inertiajs/react';

import AppPageHeader from '@/Components/app/AppPageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';

import RoleForm from '@/Pages/Roles/Partials/RoleForm';

export default function Create({ groupedPermissions = [] }) {
    return (
        <AuthenticatedLayout title="Create Role">
            <Head title="Create Role" />

            <div className="space-y-6">
                <AppPageHeader
                    title="Create Role"
                    description="Define a new role and attach the permissions it needs."
                    actions={
                        <Button
                            variant="outline"
                            render={<Link href={route('admin.roles.index')} />}
                        >
                            Back to Roles
                        </Button>
                    }
                />

                <RoleForm
                    groupedPermissions={groupedPermissions}
                    submitUrl={route('admin.roles.store')}
                />
            </div>
        </AuthenticatedLayout>
    );
}
