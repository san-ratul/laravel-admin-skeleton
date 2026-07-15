import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

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

export default function UpdatePasswordForm({
                                               className = '',
                                           }) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () =>
                reset(
                    'current_password',
                    'password',
                    'password_confirmation',
                ),
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Update Password</CardTitle>

                <CardDescription>
                    Ensure your account is using a long, random password to stay secure.
                </CardDescription>
            </CardHeader>

            <form onSubmit={submit}>
                <CardContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Current Password</FieldLabel>

                            <div className="relative">
                                <Input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={data.current_password}
                                    onChange={(e) =>
                                        setData('current_password', e.target.value)
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                                    onClick={() =>
                                        setShowCurrentPassword((value) => !value)
                                    }
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            <FieldError>
                                {errors.current_password}
                            </FieldError>
                        </Field>

                        <Field>
                            <FieldLabel>New Password</FieldLabel>

                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            <FieldError>
                                {errors.password}
                            </FieldError>
                        </Field>

                        <Field className="mb-4">
                            <FieldLabel>Confirm Password</FieldLabel>

                            <div className="relative">
                                <Input
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                                    onClick={() =>
                                        setShowPasswordConfirmation(
                                            (value) => !value,
                                        )
                                    }
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            <FieldError>
                                {errors.password_confirmation}
                            </FieldError>
                        </Field>
                    </FieldGroup>
                </CardContent>

                <CardFooter className="justify-between">
                    <p className="text-sm text-green-600">
                        {recentlySuccessful && 'Password updated.'}
                    </p>

                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        Update Password
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
