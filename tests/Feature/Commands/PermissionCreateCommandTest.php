<?php

namespace Tests\Feature\Commands;

use App\Models\Permission;
use App\Models\Role;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionCreateCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_full_crud_permissions_for_a_key(): void
    {
        $this->artisan('permission:create', ['key' => 'posts'])
            ->assertSuccessful();

        foreach (['view', 'create', 'update', 'delete'] as $action) {
            $this->assertDatabaseHas('permissions', [
                'key' => "posts.{$action}",
                'group' => 'posts',
            ]);
        }

        $this->assertSame(4, Permission::query()->where('group', 'posts')->count());
    }

    public function test_it_generates_human_readable_names(): void
    {
        $this->artisan('permission:create', ['key' => 'blog_posts'])
            ->assertSuccessful();

        $this->assertDatabaseHas('permissions', [
            'key' => 'blog_posts.create',
            'name' => 'Blog Posts Create',
        ]);
    }

    public function test_it_never_duplicates_keys_when_run_twice(): void
    {
        $this->artisan('permission:create', ['key' => 'posts'])->assertSuccessful();
        $this->artisan('permission:create', ['key' => 'posts'])->assertSuccessful();

        $this->assertSame(4, Permission::query()->where('group', 'posts')->count());
        $this->assertSame(4, Permission::query()->count());
    }

    public function test_it_accepts_custom_actions(): void
    {
        $this->artisan('permission:create', [
            'key' => 'invoices',
            '--actions' => 'view,export,pay',
        ])->assertSuccessful();

        $this->assertSame(
            ['invoices.export', 'invoices.pay', 'invoices.view'],
            Permission::query()->where('group', 'invoices')->orderBy('key')->pluck('key')->all(),
        );
    }

    public function test_it_assigns_created_permissions_to_a_role(): void
    {
        $this->seed(PermissionSeeder::class);
        $this->seed(RoleSeeder::class);

        $role = Role::query()->create([
            'name' => 'Editor',
            'slug' => 'editor',
        ]);

        $this->artisan('permission:create', [
            'key' => 'posts',
            '--role' => 'editor',
        ])->assertSuccessful();

        $this->assertSame(
            4,
            $role->fresh()->permissions()->where('group', 'posts')->count(),
        );
    }

    public function test_it_skips_unknown_roles(): void
    {
        $this->artisan('permission:create', [
            'key' => 'posts',
            '--role' => 'missing-role',
        ])->assertSuccessful();

        $this->assertSame(4, Permission::query()->where('group', 'posts')->count());
    }

    public function test_it_rejects_invalid_keys(): void
    {
        $this->artisan('permission:create', ['key' => 'invalid key!'])
            ->assertFailed();

        $this->assertSame(0, Permission::query()->count());
    }

    public function test_permissions_can_never_be_deleted_from_the_application(): void
    {
        $this->artisan('permission:create', ['key' => 'posts'])->assertSuccessful();

        $permission = Permission::query()->where('key', 'posts.view')->first();

        $this->assertFalse($permission->delete());

        $this->assertDatabaseHas('permissions', ['key' => 'posts.view']);
    }
}
