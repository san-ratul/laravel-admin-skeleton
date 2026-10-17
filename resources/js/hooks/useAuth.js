import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

export default function useAuth() {
    const { auth } = usePage().props;

    const user = auth?.user ?? null;

    const roles = useMemo(() => user?.roles ?? [], [user]);

    const permissions = useMemo(() => user?.permissions ?? [], [user]);

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

    const isSuperAdmin = useMemo(() => {
        return Boolean(user?.is_super_admin);
    }, [user?.is_super_admin]);

    const hasRole = useMemo(() => {
        return (...slugs) => {
            const normalized = slugs.flat().map((slug) => String(slug).toLowerCase());

            return roles.some((role) => normalized.includes(role.slug));
        };
    }, [roles]);

    const can = useMemo(() => {
        if (isSuperAdmin) {
            return () => true;
        }

        return (...keys) => {
            const normalized = keys.flat();

            return normalized.some((key) => permissions.includes(key));
        };
    }, [isSuperAdmin, permissions]);

    return {
        user,
        roles,
        permissions,
        initials,
        avatarUrl,
        hasAvatar,
        isVerified,
        isSuperAdmin,
        hasRole,
        can,
    };
}
