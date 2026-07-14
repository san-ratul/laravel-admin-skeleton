import GuestLayout from '@/Layouts/GuestLayout'

import { Head, Link, useForm } from '@inertiajs/react'

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

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit = (e) => {
        e.preventDefault()

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <GuestLayout>
            <Head title="Register" />

            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>

                    <CardDescription>
                        Enter your information below to create your account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Name
                                </FieldLabel>

                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    autoComplete="name"
                                    autoFocus
                                    required
                                    aria-invalid={!!errors.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />

                                <FieldError>
                                    {errors.name}
                                </FieldError>
                            </Field>

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
                                    aria-invalid={!!errors.password_confirmation}
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

                        <div className="flex items-center justify-between gap-4">
                            <Link
                                href={route('login')}
                                className="text-sm text-primary hover:underline"
                            >
                                Already have an account?
                            </Link>

                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Creating...' : 'Create account'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    )
}
