import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

export default function useFlash() {
    const { flash = {} } = usePage().props;

    return useMemo(
        () => ({
            success: flash.success ?? null,
            error: flash.error ?? null,
            warning: flash.warning ?? null,
            info: flash.info ?? null,
        }),
        [flash],
    );
}
