<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', DashboardController::class)
            ->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])
            ->name('profile.edit');

        Route::post('/profile', [ProfileController::class, 'update'])
            ->name('profile.update');

        Route::delete('/profile', [ProfileController::class, 'destroy'])
            ->name('profile.destroy');

        Route::get('/users', [AdminUserController::class, 'index'])
            ->name('users.index')
            ->middleware('permission:users.view');

        Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])
            ->name('users.edit')
            ->middleware('permission:users.update');

        Route::put('/users/{user}/roles', [AdminUserController::class, 'update'])
            ->name('users.roles.update')
            ->middleware('permission:users.update');

        Route::get('/roles', [RoleController::class, 'index'])
            ->name('roles.index')
            ->middleware('permission:roles.view');

        Route::get('/roles/create', [RoleController::class, 'create'])
            ->name('roles.create')
            ->middleware('permission:roles.create');

        Route::post('/roles', [RoleController::class, 'store'])
            ->name('roles.store')
            ->middleware('permission:roles.create');

        Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])
            ->name('roles.edit')
            ->middleware('permission:roles.update');

        Route::put('/roles/{role}', [RoleController::class, 'update'])
            ->name('roles.update')
            ->middleware('permission:roles.update');

        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])
            ->name('roles.destroy')
            ->middleware('permission:roles.delete');

        Route::get('/permissions', [PermissionController::class, 'index'])
            ->name('permissions.index')
            ->middleware('permission:permissions.view');
    });
