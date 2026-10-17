<?php

namespace Tests\Feature\Admin;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_super_admin_can_view_roles_index(): void
    {
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->get(route('admin.roles.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Roles/Index'));
    }

    public function test_users_without_permission_are_forbidden(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.roles.index'))
            ->assertForbidden();

        $this->actingAs($user)
            ->post(route('admin.roles.store'), ['name' => 'Nope'])
            ->assertForbidden();
    }

    public function test_super_admin_can_create_a_role_with_permissions(): void
    {
        $admin = $this->superAdmin();

        $permissionIds = Permission::query()
            ->whereIn('key', ['users.view', 'users.update'])
            ->pluck('id')
            ->all();

        $response = $this->actingAs($admin)
            ->post(route('admin.roles.store'), [
                'name' => 'Editor',
                'description' => 'Can edit users.',
                'permissions' => $permissionIds,
            ]);

        $response->assertRedirect(route('admin.roles.index'));

        $role = Role::query()->where('slug', 'editor')->first();

        $this->assertNotNull($role);
        $this->assertSame(
            ['users.update', 'users.view'],
            $role->permissions()->orderBy('key')->pluck('key')->all(),
        );
    }

    public function test_role_creation_validates_unique_slug(): void
    {
        $admin = $this->superAdmin();

        Role::query()->create(['name' => 'Editor', 'slug' => 'editor']);

        $this->actingAs($admin)
            ->post(route('admin.roles.store'), ['name' => 'Editor'])
            ->assertInvalid('slug');
    }

    public function test_super_admin_can_update_a_role_and_sync_permissions(): void
    {
        $admin = $this->superAdmin();

        $role = Role::query()->create([
            'name' => 'Editor',
            'slug' => 'editor',
        ]);

        $role->givePermissions(['users.view']);

        $keepId = Permission::query()->where('key', 'users.view')->value('id');
        $addId = Permission::query()->where('key', 'users.delete')->value('id');

        $this->actingAs($admin)
            ->put(route('admin.roles.update', $role), [
                'name' => 'Senior Editor',
                'permissions' => [$keepId, $addId],
            ])
            ->assertRedirect(route('admin.roles.index'));

        $role->refresh();

        $this->assertSame('senior-editor', $role->slug);
        $this->assertSame(
            ['users.delete', 'users.view'],
            $role->permissions()->orderBy('key')->pluck('key')->all(),
        );
    }

    public function test_super_admin_can_delete_a_role_and_relations_are_removed(): void
    {
        $admin = $this->superAdmin();

        $user = User::factory()->create();

        $role = Role::query()->create([
            'name' => 'Editor',
            'slug' => 'editor',
        ]);

        $role->givePermissions(['users.view', 'users.update']);
        $user->roles()->attach($role);

        $this->actingAs($admin)
            ->delete(route('admin.roles.destroy', $role))
            ->assertRedirect(route('admin.roles.index'));

        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
        $this->assertDatabaseMissing('role_user', ['role_id' => $role->id]);
        $this->assertDatabaseMissing('permission_role', ['role_id' => $role->id]);

        $user->refresh();

        $this->assertFalse($user->hasPermission('users.view'));
    }

    public function test_super_admin_role_cannot_be_deleted(): void
    {
        $admin = $this->superAdmin();
        $superRole = Role::query()->where('slug', 'super-admin')->first();

        $this->actingAs($admin)
            ->delete(route('admin.roles.destroy', $superRole))
            ->assertRedirect();

        $this->assertDatabaseHas('roles', ['id' => $superRole->id]);
    }

    public function test_roles_index_can_be_searched(): void
    {
        $admin = $this->superAdmin();

        Role::query()->create(['name' => 'Editor', 'slug' => 'editor']);
        Role::query()->create(['name' => 'Viewer', 'slug' => 'viewer']);

        $this->actingAs($admin)
            ->get(route('admin.roles.index', ['search' => 'edi']))
            ->assertOk()
            ->assertInertia(
                fn ($page) => $page
                    ->has('roles.data', 1)
                    ->where('roles.data.0.name', 'Editor')
            );
    }

    protected function superAdmin(): User
    {
        return User::query()->where('email', 'admin@example.com')->firstOrFail();
    }
}
