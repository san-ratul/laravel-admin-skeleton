<?php

namespace App\Console\Commands;

use App\Models\Permission;
use App\Models\Role;
use App\Support\PermissionRegistrar;
use Illuminate\Console\Command;

class PermissionCreateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permission:create
                            {key : The permission key, e.g. "users" or "blog.posts"}
                            {--actions= : Comma separated actions, defaults to full CRUD}
                            {--role=* : Role slugs the created permissions should be assigned to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create full CRUD permissions for the given key';

    /**
     * Handle the command.
     */
    public function handle(PermissionRegistrar $registrar): int
    {
        $key = str($this->argument('key'))
            ->trim()
            ->snake()
            ->toString();

        if (! preg_match('/^[a-z0-9]([a-z0-9_\/-]*[a-z0-9])?$/', $key)) {
            $this->error('The key may only contain letters, numbers, dashes, underscores and dots.');

            return self::FAILURE;
        }

        $actions = $this->resolveActions();

        if (empty($actions)) {
            $this->error('No actions given. Provide a comma separated --actions list.');

            return self::FAILURE;
        }

        $created = [];
        $existing = [];

        foreach ($actions as $action) {
            $permissionKey = "{$key}.{$action}";

            $permission = Permission::query()->firstOrCreate(
                ['key' => $permissionKey],
                [
                    'name' => Permission::label($permissionKey),
                    'group' => Permission::groupOf($permissionKey),
                ],
            );

            $permission->wasRecentlyCreated
                ? $created[] = $permissionKey
                : $existing[] = $permissionKey;
        }

        $this->report($created, $existing);

        $this->assignRoles(array_merge($created, $existing));

        $registrar->forgetCachedPermissions();

        $this->warnUnlessRegistered($key);

        return self::SUCCESS;
    }

    /**
     * Resolve the actions to create from the option or the full CRUD default.
     *
     * @return array<int, string>
     */
    protected function resolveActions(): array
    {
        $option = $this->option('actions');

        if (is_string($option)) {
            $option = [$option];
        }

        $actions = $option
            ? collect($option)->flatMap(fn (string $value) => explode(',', $value))
            : collect((array) config('permissions.crud_actions', Permission::CRUD_ACTIONS));

        return $actions
            ->map(fn (string $action) => str($action)->trim()->snake()->toString())
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Assign the created permission keys to the given role slugs.
     *
     * @param  array<int, string>  $keys
     * @return array<int, string>
     */
    protected function assignRoles(array $keys): array
    {
        $slugs = collect($this->option('role'))
            ->flatMap(fn (string $roles) => explode(',', $roles))
            ->map(fn (string $slug) => str($slug)->trim()->slug()->toString())
            ->filter()
            ->unique()
            ->values();

        if ($slugs->isEmpty()) {
            return [];
        }

        $assigned = [];

        foreach ($slugs as $slug) {
            $role = Role::query()->where('slug', $slug)->first();

            if (! $role) {
                $this->warn("Role [{$slug}] does not exist, skipping.");

                continue;
            }

            $role->givePermissions($keys);

            $assigned[] = $slug;
        }

        if ($assigned !== []) {
            $this->info('Assigned to roles: '.implode(', ', $assigned).'.');
        }

        return $assigned;
    }

    /**
     * Report what was created and what already existed.
     *
     * @param  array<int, string>  $created
     * @param  array<int, string>  $existing
     */
    protected function report(array $created, array $existing): void
    {
        if ($created !== []) {
            $this->components->info('Created permissions:');

            $this->components->bulletList($created);
        }

        if ($existing !== []) {
            $this->components->twoColumnDetail('Skipped (already exists):', implode(', ', $existing));
        }
    }

    /**
     * Remind that the key should be registered in the permissions config
     * so the seeder keeps it after a fresh seed.
     */
    protected function warnUnlessRegistered(string $key): void
    {
        $groups = (array) config('permissions.groups', []);

        if (array_key_exists($key, $groups)) {
            return;
        }

        $this->warn("Add \"{$key}\" to config/permissions.php so it survives a fresh seed.");
    }
}
