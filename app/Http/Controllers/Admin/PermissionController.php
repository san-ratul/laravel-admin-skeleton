<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    /**
     * Display all permissions grouped by their key prefix.
     *
     * Permissions are managed through the `permission:create` command
     * and the `PermissionSeeder`. They are read only in the panel.
     */
    public function index(): Response
    {
        return Inertia::render('Permissions/Index', [
            'groupedPermissions' => Permission::grouped(),
            'total' => Permission::query()->count(),
        ]);
    }
}
