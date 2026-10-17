<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Support\PermissionRegistrar;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PermissionSeeder extends Seeder
{
    /**
     * Seed the application's permissions.
     *
     * The permissions table is truncated first, then rebuilt from the
     * `config/permissions.php` registry. `firstOrCreate` on the unique
     * key guarantees no duplicate keys are inserted.
     */
    public function run(PermissionRegistrar $registrar): void
    {
        DB::transaction(function () {
            Schema::disableForeignKeyConstraints();

            DB::table('permission_role')->truncate();

            DB::table('permissions')->truncate();

            Schema::enableForeignKeyConstraints();
        });

        $count = 0;

        foreach ($this->registry() as $group => $actions) {
            foreach ((array) $actions as $action) {
                $key = "{$group}.{$action}";

                Permission::query()->firstOrCreate(
                    ['key' => $key],
                    [
                        'name' => Permission::label($key),
                        'group' => Permission::groupOf($key),
                    ],
                );

                $count++;
            }
        }

        $registrar->forgetCachedPermissions();

        $this->command?->info("Seeded {$count} permissions.");
    }

    /**
     * The permission registry from the permissions config.
     *
     * @return array<string, array<int, string>>
     */
    protected function registry(): array
    {
        $groups = (array) config('permissions.groups', []);

        ksort($groups);

        return $groups;
    }
}
