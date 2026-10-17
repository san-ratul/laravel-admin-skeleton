import { Head, Link, useForm } from '@inertiajs/react';

import useFlashToast from '@/hooks/useFlashToast';

import AppPageHeader from '@/Components/app/AppPageHeader';
import AppStatusBadge from '@/Components/app/AppStatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { FieldError } from '@/Components/ui/field';

export default function Edit({ user, allRoles = [] }) {
    useFlashToast();

    const { data, setData, put, processing, errors } = useForm({
        roles: user.role_ids ?? [],
    });

    const isSelf = user.is_self ?? false;

    const isSelected = (id) => data.roles.includes(id);
    const toggleRole = (id) => {
        setData(
            'roles',
            isSelected(id)
                ? data.roles.filter((value) => value !== id)
                : [...data.roles, id]
        );
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.users.roles.update', user.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout title={`Edit ${user.name}`}>
            <Head title={`Edit ${user.name}`} />

            <div className="mx-auto max-w-3xl space-y-6">
                <AppPageHeader
                    title={`Edit ${user.name}`}
                    description={`Assign or remove roles for ${user.email}.`}
                    actions={
                        <Button
                            variant="outline"
                            render={
                                <Link href={route('admin.users.index')} />
                            }
                        >
                            Back to Users
                        </Button>
                    }
                />

                {isSelf && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                        You are editing your own account. Your super admin role
                        cannot be removed.
                    </div>
                )}

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Roles</CardTitle>

                            <CardDescription>
                                {data.roles.length} role
                                {data.roles.length === 1 ? '' : 's'} selected.
                                Roles control which permissions the user has.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <FieldError>{errors.roles}</FieldError>

                            {allRoles.map((role) => (
                                <label
                                    key={role.id}
                                    className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50 has-[[data-slot=checkbox]:checked]:border-primary/40 has-[[data-slot=checkbox]:checked]:bg-primary/5"
                                >
                                    <Checkbox
                                        className="mt-0.5"
                                        checked={isSelected(role.id)}
                                        onCheckedChange={() =>
                                            toggleRole(role.id)
                                        }
                                    />

                                    <span className="min-w-0 flex-1">
                                        <span className="flex flex-wrap items-center gap-2">
                                            <span className="font-medium">
                                                {role.name}
                                            </span>

                                            {role.is_super && (
                                                <AppStatusBadge
                                                    label="Super"
                                                    variant="warning"
                                                />
                                            )}
                                        </span>

                                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                            {role.description ??
                                                `Role: ${role.slug}`}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </CardContent>

                        <CardFooter className="justify-end">
                            <Button type="submit" disabled={processing}>
                                Save Roles
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
