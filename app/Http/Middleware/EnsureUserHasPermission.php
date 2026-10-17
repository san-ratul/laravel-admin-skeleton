<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    /**
     * Handle an incoming request.
     *
     * Allows access when the user has ANY of the given permissions.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        abort_unless(
            collect($permissions)->contains(fn (string $permission) => Gate::forUser($request->user())->allows($permission)),
            403,
        );

        return $next($request);
    }
}
