<?php

use App\Enums\ApiCode;
use App\Http\Middleware\AssignTraceId;
use App\Http\Middleware\HandleInertiaRequests;
use App\Support\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: [
            __DIR__.'/../routes/web.php',
            __DIR__.'/../routes/auth.php',
            __DIR__.'/../routes/admin.php',
        ],
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->api(append: [
            AssignTraceId::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->expectsJson() || $request->is('api/*'),
        );

        $exceptions->render(function (ValidationException $e) {
            return ApiResponse::error(
                code: ApiCode::VALIDATION_ERROR,
                message: 'Validation failed.',
                errors: $e->errors(),
            );
        });

        $exceptions->render(function (AuthenticationException $e) {
            return ApiResponse::error(
                code: ApiCode::UNAUTHORIZED,
                message: 'Unauthenticated.',
            );
        });

        $exceptions->render(function (AuthorizationException $e) {
            return ApiResponse::error(
                code: ApiCode::FORBIDDEN,
                message: 'This action is unauthorized.',
            );
        });

        $exceptions->render(function (ModelNotFoundException $e) {
            return ApiResponse::error(
                code: ApiCode::RESOURCE_NOT_FOUND,
                message: 'Resource not found.',
            );
        });

        $exceptions->render(function (Throwable $e) {
            return ApiResponse::error(
                code: ApiCode::SERVER_ERROR,
                message: config('app.debug')
                    ? $e->getMessage()
                    : 'Server error.',
            );
        });
    })
    ->create();
