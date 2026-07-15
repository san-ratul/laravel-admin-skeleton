import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Profile
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage your account settings and personal information.
                    </p>
                </div>

                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />

                <UpdatePasswordForm />
            </div>
        </AuthenticatedLayout>
    );
}
