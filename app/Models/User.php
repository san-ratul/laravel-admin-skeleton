<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'name',
    'email',
    'password',
    'avatar',
])]
#[Hidden([
    'password',
    'remember_token',
])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's avatar URL.
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar
                ? Storage::url($this->avatar)
                : null,
        );
    }

    /**
     * The roles that are assigned to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Determine if the user is a super admin.
     *
     * Super admins bypass every permission check.
     */
    public function isSuperAdmin(): bool
    {
        return $this->roles()
            ->where('is_super', true)
            ->exists();
    }

    /**
     * Determine if the user has any of the given role slugs.
     *
     * @param  string|array<int, string>  ...$slugs
     */
    public function hasRole(string|array ...$slugs): bool
    {
        $slugs = collect($slugs)
            ->flatten()
            ->map(fn (string $slug) => str($slug)->slug()->toString())
            ->unique()
            ->values();

        if ($slugs->isEmpty()) {
            return false;
        }

        return $this->roles()
            ->whereIn('slug', $slugs->all())
            ->exists();
    }

    /**
     * All permission keys granted to the user through their roles.
     */
    public function permissionKeys(): Collection
    {
        $this->loadMissing('roles.permissions');

        return $this->roles
            ->flatMap(fn (Role $role) => $role->permissions)
            ->pluck('key')
            ->unique()
            ->values();
    }

    /**
     * Determine if the user has any of the given permission keys.
     *
     * @param  string|array<int, string>  ...$keys
     */
    public function hasPermission(string|array ...$keys): bool
    {
        $keys = collect($keys)->flatten()->unique()->values();

        if ($keys->isEmpty()) {
            return false;
        }

        return $this->permissionKeys()
            ->intersect($keys)
            ->isNotEmpty();
    }

    /**
     * Sync the given role ids to the user.
     *
     * @param  array<int, int|string>  $roleIds
     */
    public function syncRoles(array $roleIds): array
    {
        return $this->roles()->sync($roleIds);
    }
}
