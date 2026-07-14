import GuestLayout from '@/Layouts/GuestLayout'

import {Head, useForm, usePage} from '@inertiajs/react'

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

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    })

    const submit = (e) => {
        e.preventDefault()

        post(route('password.email'))
    }

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Card>
                <CardHeader>
                    <CardTitle>Forgot your password?</CardTitle>

                    <CardDescription>
                        Enter your email address and we'll send you a password
                        reset link.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {status && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                            {status}
                        </div>
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
                        </FieldGroup>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing
                                ? 'Sending...'
                                : 'Email Password Reset Link'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    )
}
