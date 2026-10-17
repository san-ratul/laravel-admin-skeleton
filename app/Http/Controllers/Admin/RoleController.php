<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Support\PermissionRegistrar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    /**
     * Display a paginated list of roles.
     */
    public function index(Request $request): Response
    {
        $roles = Role::query()
            ->withCount(['permissions', 'users'])
            ->when(
                $request->string('search')->trim()->toString(),
                fn ($query, string $search) => $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                }),
            )
            ->orderBy('is_super', 'desc')
            ->orderBy('name')
            ->paginate(
                $request->integer('per_page', (int) config('admin.pagination.per_page', 15)),
            )
            ->withQueryString();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => ['search' => $request->string('search')->trim()->toString()],
        ]);
    }

    /**
     * Show the form for creating a role.
     */
    public function create(): Response
    {
        return Inertia::render('Roles/Create', [
            'groupedPermissions' => Permission::grouped(withAction: true),
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::query()->create($request->safe()->except('permissions'));

        $role->syncPermissions($this->integerIds($request));

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Role [{$role->name}] created.");
    }

    /**
     * Show the form for editing a role.
     */
    public function edit(Role $role): Response
    {
        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'is_super' => $role->is_super,
                'users_count' => $role->users()->count(),
                'permission_ids' => $role->permissions()->pluck('permissions.id'),
            ],
            'groupedPermissions' => Permission::grouped(withAction: true),
        ]);
    }

    /**
     * Update the given role and sync its permissions.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $role->update($request->safe()->except('permissions'));

        if ($request->has('permissions')) {
            $role->syncPermissions($this->integerIds($request));
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Role [{$role->name}] updated.");
    }

    /**
     * Remove the given role and all of its relations.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if ($role->is_super) {
            return back()->with('error', 'The super admin role cannot be deleted.');
        }

        $name = $role->name;

        $role->delete();

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Role [{$name}] deleted.");
    }

    /**
     * The permission ids from the request.
     *
     * @return array<int, int>
     */
    protected function integerIds(Request $request): array
    {
        return collect($request->input('permissions', []))
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}
