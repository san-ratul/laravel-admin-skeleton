<?php

namespace Tests\Feature\Admin;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\PermissionSeeder as DatabasePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionSystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_seeder_truncates_and_reseeds_permissions_without_duplicates(): void
    {
        Permission::query()->create([
            'key' => 'custom.action',
            'name' => 'Custom Action',
            'group' => 'custom',
        ]);

        $expected = Permission::query()->count();

        $this->seed(DatabasePermissionSeeder::class);

        $this->assertSame(10, Permission::query()->count());
        $this->assertDatabaseMissing('permissions', ['key' => 'custom.action']);

        // Re-running the seeder never inserts duplicate keys.
        $this->seed(DatabasePermissionSeeder::class);

        $this->assertSame(10, Permission::query()->count());
        $this->assertSame(
            10,
            Permission::query()->distinct('key')->count('key'),
        );
    }

    public function test_seeder_clears_role_permission_relations(): void
    {
        $role = Role::query()->where('slug', 'super-admin')->first();

        $this->assertGreaterThan(0, $role->permissions()->count());

        $this->seed(DatabasePermissionSeeder::class);

        $this->assertSame(0, $role->fresh()->permissions()->count());
    }

    public function test_role_seeder_grants_super_admin_all_permissions(): void
    {
        $superAdmin = Role::query()->where('slug', 'super-admin')->first();

        $this->assertTrue($superAdmin->is_super);
        $this->assertSame(
            Permission::query()->count(),
            $superAdmin->permissions()->count(),
        );
    }

    public function test_database_seeder_assigns_super_admin_role_to_admin_user(): void
    {
        $admin = User::query()->where('email', 'admin@example.com')->first();

        $this->assertNotNull($admin);
        $this->assertTrue($admin->isSuperAdmin());
    }

    public function test_super_admin_bypasses_all_permission_checks(): void
    {
        $admin = User::query()->where('email', 'admin@example.com')->first();

        $this->assertTrue($admin->can('roles.create'));
        $this->assertTrue($admin->can('anything.at.all'));
    }

    public function test_user_permissions_are_resolved_through_roles(): void
    {
        $user = User::factory()->create();

        $role = Role::query()->create([
            'name' => 'Editor',
            'slug' => 'editor',
        ]);

        $role->givePermissions(['users.view', 'users.update']);

        $user->roles()->attach($role);

        $this->assertTrue($user->hasPermission('users.view'));
        $this->assertTrue($user->hasPermission('users.update'));
        $this->assertFalse($user->hasPermission('roles.delete'));
        $this->assertTrue($user->can('users.view'));
        $this->assertFalse($user->can('users.delete'));
    }

    public function test_has_role_checks_role_slugs(): void
    {
        $user = User::factory()->create();

        $role = Role::query()->create([
            'name' => 'Editor',
            'slug' => 'editor',
        ]);

        $user->roles()->attach($role);

        $this->assertTrue($user->hasRole('editor'));
        $this->assertTrue($user->hasRole(['editor', 'admin']));
        $this->assertFalse($user->hasRole('super-admin'));
    }
}
