import { Head, Link, useForm } from '@inertiajs/react'

import { Button } from '@/Components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import { Checkbox } from '@/Components/ui/checkbox'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/Components/ui/field'
import { Input } from '@/Components/ui/input'

import GuestLayout from '@/Layouts/GuestLayout'

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit = (e) => {
        e.preventDefault()

        post(route('login'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <GuestLayout>
            <Head title="Login" />

            <Card>
                <CardHeader>
                    <CardTitle>Welcome back</CardTitle>

                    <CardDescription>
                        Sign in to your account to continue.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {status && (
                        <p className="mb-4 text-sm text-green-600">
                            {status}
                        </p>
                    )}

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
                                    autoFocus
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
                                    autoComplete="current-password"
                                    aria-invalid={!!errors.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />

                                <FieldError>
                                    {errors.password}
                                </FieldError>
                            </Field>
                        </FieldGroup>

                        <div className="flex items-center justify-between gap-4">
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData('remember', Boolean(checked))
                                    }
                                />

                                <span className="text-sm">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    )
}
