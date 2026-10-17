<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'key',
    'name',
    'group',
])]
class Permission extends Model
{
    /** @use HasFactory<Factory<self>> */
    use HasFactory;

    /**
     * The actions created for a key by the permission command.
     */
    public const CRUD_ACTIONS = ['view', 'create', 'update', 'delete'];

    /**
     * The roles that belong to the permission.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Boot the model and its event listeners.
     *
     * Permissions are managed by the `permission:create` command and the
     * `PermissionSeeder` only. Deleting is disabled application wide.
     */
    protected static function booted(): void
    {
        static::deleting(function (Permission $permission): bool {
            return false;
        });
    }

    /**
     * All permissions grouped by their key prefix for the admin panel.
     *
     * @return array<int, array{group: string, label: string, permissions: array<int, array{id: int, key: string, name: string, action?: string}>}>
     */
    public static function grouped(bool $withAction = false): array
    {
        $permissions = static::query()
            ->orderBy('group')
            ->orderBy('name')
            ->get()
            ->groupBy('group')
            ->map(fn ($groupPermissions, string $group) => [
                'group' => $group,
                'label' => str($group)->headline()->toString(),
                'permissions' => $groupPermissions
                    ->map(function (Permission $permission) use ($withAction) {
                        $item = [
                            'id' => $permission->id,
                            'key' => $permission->key,
                            'name' => $permission->name,
                        ];

                        if ($withAction) {
                            $item['action'] = str($permission->key)->after('.')->toString();
                        }

                        return $item;
                    })
                    ->values()
                    ->all(),
            ])
            ->values();

        return $permissions->all();
    }

    /**
     * Build the human readable name for a permission key.
     */
    public static function label(string $key): string
    {
        [$group, $action] = self::splitKey($key);

        return str($group)->headline().' '.str($action)->headline();
    }

    /**
     * Resolve the group part of a permission key.
     */
    public static function groupOf(string $key): string
    {
        return str($key)->before('.')->toString();
    }

    /**
     * Split a permission key into its group and action parts.
     *
     * @return array{0: string, 1: string}
     */
    public static function splitKey(string $key): array
    {
        $segments = explode('.', $key, 2);

        return [$segments[0], $segments[1] ?? ''];
    }
}
