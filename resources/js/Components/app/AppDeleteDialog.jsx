import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export default function AppDeleteDialog({
    trigger,
    title = 'Delete record?',
    description = 'This action cannot be undone. All related data will be removed.',
    confirmLabel = 'Delete',
    onConfirm,
    disabled = false,
    className,
    children,
}) {
    const [processing, setProcessing] = useState(false);

    const confirm = (event) => {
        event.preventDefault();

        setProcessing(true);

        const done = () => setProcessing(false);

        if (onConfirm) {
            Promise.resolve(onConfirm()).finally(done);

            return;
        }

        router.delete(trigger?.href ?? window.location.pathname, {
            preserveScroll: true,
            onFinish: done,
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={disabled}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete"
                    />
                }
            >
                {children ?? <Trash2 />}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={confirm}
                        className={cn(
                            'bg-destructive text-white hover:bg-destructive/90',
                            className
                        )}
                        disabled={processing}
                    >
                        {processing && <Loader2 className="animate-spin" />}

                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
