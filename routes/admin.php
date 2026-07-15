<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProfileController;
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
    });
