<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRoleAssignmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_super_admin_can_view_users_index(): void
    {
        User::factory()->count(3)->create();

        $this->actingAs($this->superAdmin())
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Users/Index'));
    }

    public function test_users_without_users_update_permission_cannot_edit_roles(): void
    {
        $user = User::factory()->create();
        $target = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.users.edit', $target))
            ->assertForbidden();

        $this->actingAs($user)
            ->put(route('admin.users.roles.update', $target), [])
            ->assertForbidden();
    }

    public function test_super_admin_can_assign_multiple_roles_to_a_user(): void
    {
        $admin = $this->superAdmin();
        $target = User::factory()->create();

        $editor = Role::query()->create(['name' => 'Editor', 'slug' => 'editor']);
        $viewer = Role::query()->create(['name' => 'Viewer', 'slug' => 'viewer']);

        $this->actingAs($admin)
            ->put(route('admin.users.roles.update', $target), [
                'roles' => [$editor->id, $viewer->id],
            ])
            ->assertRedirect(route('admin.users.index'));

        $target->refresh();

        $this->assertTrue($target->hasRole('editor'));
        $this->assertTrue($target->hasRole('viewer'));
        $this->assertSame(
            [$editor->id, $viewer->id],
            $target->roles()->orderBy('roles.id')->pluck('roles.id')->all(),
        );
    }

    public function test_syncing_roles_removes_previously_assigned_roles(): void
    {
        $admin = $this->superAdmin();
        $target = User::factory()->create();

        $editor = Role::query()->create(['name' => 'Editor', 'slug' => 'editor']);
        $viewer = Role::query()->create(['name' => 'Viewer', 'slug' => 'viewer']);

        $target->roles()->attach($editor);

        $this->actingAs($admin)
            ->put(route('admin.users.roles.update', $target), [
                'roles' => [$viewer->id],
            ])
            ->assertRedirect(route('admin.users.index'));

        $target->refresh();

        $this->assertFalse($target->hasRole('editor'));
        $this->assertTrue($target->hasRole('viewer'));
    }

    public function test_super_admin_cannot_remove_their_own_super_role(): void
    {
        $admin = $this->superAdmin();
        $viewer = Role::query()->create(['name' => 'Viewer', 'slug' => 'viewer']);

        $this->actingAs($admin)
            ->put(route('admin.users.roles.update', $admin), [
                'roles' => [$viewer->id],
            ])
            ->assertRedirect();

        $admin->refresh();

        $this->assertTrue($admin->isSuperAdmin());
    }

    public function test_removing_role_revokes_its_permissions(): void
    {
        $target = User::factory()->create();

        $editor = Role::query()->create(['name' => 'Editor', 'slug' => 'editor']);
        $editor->givePermissions(['users.view']);

        $target->roles()->attach($editor);

        $this->assertTrue($target->hasPermission('users.view'));

        $target->syncRoles([]);

        $this->assertFalse($target->fresh()->hasPermission('users.view'));
    }

    protected function superAdmin(): User
    {
        return User::query()->where('email', 'admin@example.com')->firstOrFail();
    }
}
