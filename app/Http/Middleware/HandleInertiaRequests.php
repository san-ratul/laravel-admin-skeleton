<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'avatar_url' => $user->avatar_url,
                ] : null,
            ],

            'config' => [
                'pagination' => [
                    'per_page' => config('admin.pagination.per_page'),
                ],

                'avatar' => [
                    'width' => config('admin.avatar.width'),
                    'height' => config('admin.avatar.height'),
                    'max_size' => config('admin.avatar.max_size'),
                    'mimes' => config('admin.avatar.mimes'),

                    'label' => sprintf(
                        '%s • %d × %d px • Max %d MB',
                        strtoupper(implode(', ', config('admin.avatar.mimes'))),
                        config('admin.avatar.width'),
                        config('admin.avatar.height'),
                        config('admin.avatar.max_size') / 1024,
                    ),
                ],
            ],
        ];
    }
}
