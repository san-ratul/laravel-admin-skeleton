import { useForm } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';

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
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';

export default function RoleForm({
    role = null,
    groupedPermissions = [],
    submitUrl,
    className = '',
}) {
    const isEdit = Boolean(role);

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name ?? '',
        slug: role?.slug ?? '',
        description: role?.description ?? '',
        permissions: role?.permission_ids ?? [],
    });

    const submit = (e) => {
        e.preventDefault();

        isEdit
            ? put(submitUrl, { preserveScroll: true })
            : post(submitUrl);
    };

    const isSelected = (id) => data.permissions.includes(id);

    const togglePermission = (id) => {
        setData(
            'permissions',
            isSelected(id)
                ? data.permissions.filter((value) => value !== id)
                : [...data.permissions, id]
        );
    };

    const groupIds = (group) =>
        group.permissions.map((permission) => permission.id);

    const isGroupSelected = (group) => {
        const ids = groupIds(group);

        return ids.every((id) => data.permissions.includes(id));
    };

    const toggleGroup = (group) => {
        const ids = groupIds(group);

        setData(
            'permissions',
            isGroupSelected(group)
                ? data.permissions.filter((id) => !ids.includes(id))
                : [...new Set([...data.permissions, ...ids])]
        );
    };

    return (
        <form onSubmit={submit} className={className}>
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>

                            <CardDescription>
                                Identify the role shown across the admin panel.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Name</FieldLabel>

                                    <Input
                                        value={data.name}
                                        placeholder="e.g. Editor"
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />

                                    <FieldError>{errors.name}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel>Slug</FieldLabel>

                                    <Input
                                        value={data.slug}
                                        placeholder="editor"
                                        onChange={(e) =>
                                            setData('slug', e.target.value)
                                        }
                                    />

                                    <FieldError>{errors.slug}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel>Description</FieldLabel>

                                    <Input
                                        value={data.description}
                                        placeholder="What can this role do?"
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <FieldError>
                                        {errors.description}
                                    </FieldError>
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                </div>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Permissions</CardTitle>

                        <CardDescription>
                            Choose what this role can do.{' '}
                            {data.permissions.length} selected.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <FieldError>{errors.permissions}</FieldError>

                        {groupedPermissions.map((group) => {
                            const selected = isGroupSelected(group);

                            return (
                                <div
                                    key={group.group}
                                    className="rounded-xl border"
                                >
                                    <div className="flex items-center justify-between gap-2 border-b bg-muted/50 px-4 py-2">
                                        <p className="text-sm font-medium">
                                            {group.label}
                                        </p>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="xs"
                                            onClick={() => toggleGroup(group)}
                                        >
                                            {selected ? (
                                                <Minus data-icon="inline-start" />
                                            ) : (
                                                <Plus data-icon="inline-start" />
                                            )}

                                            {selected ? 'Remove all' : 'Select all'}
                                        </Button>
                                    </div>

                                    <div className="grid gap-x-6 gap-y-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {group.permissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex cursor-pointer items-center gap-2.5 text-sm"
                                            >
                                                <Checkbox
                                                    checked={isSelected(
                                                        permission.id
                                                    )}
                                                    onCheckedChange={() =>
                                                        togglePermission(
                                                            permission.id
                                                        )
                                                    }
                                                />

                                                <span className="min-w-0">
                                                    <span className="block truncate">
                                                        {permission.name}
                                                    </span>

                                                    <span className="block truncate font-mono text-xs text-muted-foreground">
                                                        {permission.key}
                                                    </span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>

                    <CardFooter className="justify-end">
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Save Changes' : 'Create Role'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    );
}
