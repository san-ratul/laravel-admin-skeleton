<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'name',
    'slug',
    'description',
    'is_super',
])]
class Role extends Model
{
    /** @use HasFactory<Factory<self>> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_super' => 'boolean',
        ];
    }

    /**
     * The permissions that belong to the role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * The users that are assigned to the role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Determine if the role is the super admin role.
     */
    public function isSuper(): bool
    {
        return $this->is_super;
    }

    /**
     * Sync the given permission ids to the role.
     *
     * @param  array<int, int|string>  $permissionIds
     */
    public function syncPermissions(array $permissionIds): array
    {
        return $this->permissions()->sync($permissionIds);
    }

    /**
     * Give the given permission keys to the role.
     *
     * @param  array<int, string>  $keys
     */
    public function givePermissions(array $keys): void
    {
        $ids = Permission::query()
            ->whereIn('key', $keys)
            ->pluck('id');

        $this->permissions()->syncWithoutDetaching($ids);
    }

    /**
     * Boot the model and its event listeners.
     */
    protected static function booted(): void
    {
        static::deleting(function (Role $role): void {
            $role->permissions()->detach();

            $role->users()->detach();
        });
    }
}
