import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

export default function useAuth() {
    const { auth } = usePage().props;

    const user = auth?.user ?? null;

    const initials = useMemo(() => {
        if (!user?.name) {
            return '?';
        }

        return user.name
            .trim()
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('');
    }, [user?.name]);

    const avatarUrl = useMemo(() => {
        return user?.avatar_url ?? null;
    }, [user?.avatar_url]);

    const hasAvatar = useMemo(() => {
        return Boolean(avatarUrl);
    }, [avatarUrl]);

    const isVerified = useMemo(() => {
        return Boolean(user?.email_verified_at);
    }, [user?.email_verified_at]);

    return {
        user,
        initials,
        avatarUrl,
        hasAvatar,
        isVerified,
    };
}
