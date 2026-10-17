<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Seed the default roles.
     *
     * The super admin role bypasses every permission check and gets all
     * registered permissions attached.
     */
    public function run(): void
    {
        $superAdmin = Role::query()->updateOrCreate(
            ['slug' => 'super-admin'],
            [
                'name' => 'Super Admin',
                'description' => 'Full access to the admin panel, bypasses every permission check.',
                'is_super' => true,
            ],
        );

        $superAdmin->syncPermissions(
            Permission::query()->pluck('id')->all(),
        );

        $this->command?->info('Seeded roles.');
    }
}
