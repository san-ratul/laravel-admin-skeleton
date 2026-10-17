<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUser\UpdateUserRolesRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Display a paginated list of admin users.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->with('roles:id,name,slug,is_super')
            ->when(
                $request->string('search')->trim()->toString(),
                fn ($query, string $search) => $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                }),
            )
            ->orderBy('name')
            ->paginate((int) config('admin.pagination.per_page', 15))
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => ['search' => $request->string('search')->trim()->toString()],
        ]);
    }

    /**
     * Show the form for assigning roles to a user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'is_self' => auth()->user()?->is($user) ?? false,
                'role_ids' => $user->roles()->pluck('roles.id'),
                'roles' => $user->roles->map(fn (Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'is_super' => $role->is_super,
                ]),
            ],
            'allRoles' => Role::query()
                ->orderBy('is_super', 'desc')
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'description', 'is_super']),
        ]);
    }

    /**
     * Sync the roles assigned to the given user.
     */
    public function update(UpdateUserRolesRequest $request, User $user): RedirectResponse
    {
        $roleIds = collect($request->input('roles', []))
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values();

        if ($request->user()->is($user)) {
            $superRoleIds = Role::query()
                ->where('is_super', true)
                ->pluck('id');

            $lostSuperRole = $request->user()->isSuperAdmin()
                && $superRoleIds->intersect($roleIds)->isEmpty();

            if ($lostSuperRole) {
                return back()->with('error', 'You cannot remove your own super admin role.');
            }
        }

        $user->syncRoles($roleIds->all());

        return redirect()
            ->route('admin.users.index')
            ->with('success', "Roles updated for [{$user->name}].");
    }
}
