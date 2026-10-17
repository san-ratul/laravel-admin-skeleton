<?php

namespace App\Support;

use App\Models\Permission;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Throwable;

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
     * Returns an empty set when the database is not available yet,
     * e.g. during `composer install` on a fresh clone before the
     * database has been created or migrated.
     *
     * @return array<int, string>
     */
    public function permissionKeys(): array
    {
        [$key, $ttl] = $this->cacheConfig();

        if (! $this->databaseReady()) {
            return [];
        }

        return Cache::remember(
            $key,
            now()->addMinutes($ttl),
            fn () => Permission::query()->pluck('key')->all(),
        );
    }

    /**
     * Determine whether the permissions table is readable.
     */
    protected function databaseReady(): bool
    {
        try {
            return Schema::hasTable('permissions');
        } catch (Throwable) {
            return false;
        }
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
