import GuestLayout from '@/Layouts/GuestLayout'

import { Head, useForm } from '@inertiajs/react'

import { Button } from '@/Components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/Components/ui/field'
import { Input } from '@/Components/ui/input'

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    })

    const submit = (e) => {
        e.preventDefault()

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <Card>
                <CardHeader>
                    <CardTitle>Reset your password</CardTitle>

                    <CardDescription>
                        Enter your new password below to complete your password
                        reset.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">
                                    Email
                                </FieldLabel>

                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    required
                                    aria-invalid={!!errors.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />

                                <FieldError>
                                    {errors.email}
                                </FieldError>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="new-password"
                                    autoFocus
                                    required
                                    aria-invalid={!!errors.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />

                                <FieldError>
                                    {errors.password}
                                </FieldError>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password_confirmation">
                                    Confirm Password
                                </FieldLabel>

                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    required
                                    aria-invalid={
                                        !!errors.password_confirmation
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value
                                        )
                                    }
                                />

                                <FieldError>
                                    {errors.password_confirmation}
                                </FieldError>
                            </Field>
                        </FieldGroup>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing
                                ? 'Resetting...'
                                : 'Reset Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    )
}
