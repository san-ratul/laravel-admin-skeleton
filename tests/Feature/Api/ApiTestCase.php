<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->registerRoutes();
    }

    protected function registerRoutes(): void
    {
        Route::middleware('api')
            ->prefix('api/testing')
            ->group(function () {
                Route::get('/success', fn () => ApiResponse::success(
                    data: [
                        'name' => 'Laravel Admin Skeleton',
                    ],
                    message: 'Success.',
                ));

                Route::get('/created', fn () => ApiResponse::created(
                    data: [
                        'id' => 1,
                    ],
                    message: 'Created.',
                ));

                Route::get('/updated', fn () => ApiResponse::updated(
                    data: [
                        'id' => 1,
                    ],
                    message: 'Updated.',
                ));

                Route::delete('/deleted', fn () => ApiResponse::deleted(
                    message: 'Deleted.',
                ));

                Route::get('/paginate', function () {
                    $items = collect([
                        ['id' => 1, 'name' => 'User 1'],
                        ['id' => 2, 'name' => 'User 2'],
                        ['id' => 3, 'name' => 'User 3'],
                    ]);

                    $paginator = new LengthAwarePaginator(
                        items: $items,
                        total: 10,
                        perPage: 3,
                        currentPage: 1,
                        options: [
                            'path' => request()->url(),
                        ],
                    );

                    return ApiResponse::paginate(
                        paginator: $paginator,
                        data: $items,
                        message: 'Paginated.',
                    );
                });

                Route::post('/validation', function (Request $request) {
                    $request->validate([
                        'name' => ['required', 'string'],
                        'email' => ['required', 'email'],
                    ]);

                    return ApiResponse::success(
                        message: 'Validated.',
                    );
                });
            });
    }
}
