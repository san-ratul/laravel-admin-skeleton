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

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    })

    const submit = (e) => {
        e.preventDefault()

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <Card>
                <CardHeader>
                    <CardTitle>Confirm your password</CardTitle>

                    <CardDescription>
                        This is a secure area of the application. Please confirm
                        your password before continuing.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <FieldGroup>
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
                        </FieldGroup>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? 'Confirming...' : 'Confirm Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    )
}
