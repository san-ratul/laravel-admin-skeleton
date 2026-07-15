import { usePage } from '@inertiajs/react';

export default function useConfig() {
    return usePage().props.config;
}
