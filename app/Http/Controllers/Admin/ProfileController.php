<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the authenticated user's profile.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();

        $disk = config('admin.avatar.disk');
        $directory = config('admin.avatar.directory');

        if ($request->email !== $user->email) {
            $user->email_verified_at = null;
        }

        $user->fill([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->hasFile('avatar')) {
            if (
                $user->avatar &&
                Storage::disk($disk)->exists($user->avatar)
            ) {
                Storage::disk($disk)->delete($user->avatar);
            }

            $user->avatar = $request
                ->file('avatar')
                ->store($directory, $disk);
        }

        $user->save();

        return back();
    }

    /**
     * Delete the authenticated user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        //
    }
}
