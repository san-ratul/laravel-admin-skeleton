import { Link, useForm } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import useAuth from '@/hooks/useAuth';
import useConfig from '@/hooks/useConfig';

import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/Components/ui/field';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { user, initials, avatarUrl } = useAuth();
    const { avatar } = useConfig();

    const fileInputRef = useRef(null);

    const [preview, setPreview] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        recentlySuccessful,
    } = useForm({
        _method: 'POST',
        name: user.name,
        email: user.email,
        avatar: null,
    });

    useEffect(() => {
        if (!data.avatar) {
            setPreview(null);

            return;
        }

        const objectUrl = URL.createObjectURL(data.avatar);

        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.avatar]);

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>

                <CardDescription>
                    Update your account profile information and email address.
                </CardDescription>
            </CardHeader>

            <form onSubmit={submit}>
                <CardContent className="space-y-6 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border bg-muted">
                            {preview || avatarUrl ? (
                                <img
                                    src={preview || avatarUrl}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-xl font-semibold">
                                    {initials}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="mr-2 h-4 w-4" />
                                Upload Photo
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    setData('avatar', e.target.files?.[0] ?? null)
                                }
                            />

                            <p className="text-xs text-muted-foreground">
                                {avatar.label}
                            </p>

                            <FieldError>{errors.avatar}</FieldError>
                        </div>
                    </div>

                    <FieldGroup>
                        <Field>
                            <FieldLabel>Name</FieldLabel>

                            <Input
                                value={data.name}
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                            />

                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel>Email</FieldLabel>

                            <Input
                                type="email"
                                value={data.email}
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <FieldError>{errors.email}</FieldError>
                        </Field>
                    </FieldGroup>

                    {mustVerifyEmail && !user.email_verified_at && (
                        <div className="rounded-lg border p-4">
                            <p className="text-sm">
                                Your email address is unverified.
                            </p>

                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="mt-2 text-sm font-medium underline underline-offset-4"
                            >
                                Click here to re-send the verification email.
                            </Link>

                            {status === 'verification-link-sent' && (
                                <p className="mt-2 text-sm text-green-600">
                                    A new verification link has been sent to your
                                    email address.
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="justify-between">
                    <p className="text-sm text-green-600">
                        {recentlySuccessful && 'Saved.'}
                    </p>

                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
