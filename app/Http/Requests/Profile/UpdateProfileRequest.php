<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string|\Illuminate\Contracts\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')
                    ->ignore($this->user()),
            ],

            'avatar' => [
                'nullable',
                'image',
                'mimes:' . implode(',', config('admin.avatar.mimes')),
                'max:' . config('admin.avatar.max_size'),
                sprintf(
                    'dimensions:width=%d,height=%d',
                    config('admin.avatar.width'),
                    config('admin.avatar.height'),
                ),
            ],
        ];
    }

    /**
     * Get the validation error messages.
     */
    public function messages(): array
    {
        return [
            'avatar.dimensions' => sprintf(
                'The avatar image must be exactly %d × %d pixels.',
                config('admin.avatar.width'),
                config('admin.avatar.height'),
            ),
        ];
    }
}
