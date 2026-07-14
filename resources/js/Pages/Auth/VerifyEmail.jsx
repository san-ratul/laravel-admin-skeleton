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

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({})

    const submit = (e) => {
        e.preventDefault()

        post(route('verification.send'))
    }

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <Card>
                <CardHeader>
                    <CardTitle>Verify your email</CardTitle>

                    <CardDescription>
                        Before continuing, please verify your email address by
                        clicking the link we sent to your inbox.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {status === 'verification-link-sent' && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                            A new verification link has been sent to your email
                            address.
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing
                                ? 'Sending...'
                                : 'Resend Verification Email'}
                        </Button>

                        <div className="text-center">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                            >
                                Log out
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    )
}
