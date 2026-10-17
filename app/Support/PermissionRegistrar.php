<?php

namespace App\Support;

use App\Models\Permission;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;

class PermissionRegistrar
{
    /**
     * Whether the gate callbacks have been registered.
     */
    protected bool $registered = false;

    /**
     * Register permission based gates.
     *
     * Super admins bypass every check through Gate::before.
     */
    public function register(): void
    {
        if (! $this->registered) {
            Gate::before(function ($user, string $ability) {
                if ($user->isSuperAdmin()) {
                    return true;
                }

                return null;
            });

            $this->registered = true;
        }

        foreach ($this->permissionKeys() as $key) {
            Gate::define($key, function ($user) use ($key) {
                return $user->hasPermission($key);
            });
        }
    }

    /**
     * All registered permission keys, cached.
     *
     * @return array<int, string>
     */
    public function permissionKeys(): array
    {
        [$key, $ttl] = $this->cacheConfig();

        return Cache::remember(
            $key,
            now()->addMinutes($ttl),
            function () {
                if (! Schema::hasTable('permissions')) {
                    return [];
                }

                return Permission::query()->pluck('key')->all();
            },
        );
    }

    /**
     * Flush the cached permission keys and re-register the gates so
     * newly created or seeded permissions become usable immediately.
     */
    public function forgetCachedPermissions(): void
    {
        [$key] = $this->cacheConfig();

        Cache::forget($key);

        $this->register();
    }

    /**
     * The cache key and lifetime from the permissions config.
     *
     * @return array{0: string, 1: int}
     */
    protected function cacheConfig(): array
    {
        return [
            (string) config('permissions.cache.key'),
            (int) config('permissions.cache.ttl'),
        ];
    }
}
