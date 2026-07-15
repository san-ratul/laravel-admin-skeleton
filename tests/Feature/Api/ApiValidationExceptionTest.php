<?php

namespace Tests\Feature\Api;

class ApiValidationExceptionTest extends ApiTestCase
{
    public function test_validation_exception_response(): void
    {
        $this->postJson('/api/testing/validation', [])
            ->assertUnprocessable()
            ->assertHeader('X-Trace-Id')
            ->assertJsonStructure([
                'success',
                'status',
                'code',
                'message',
                'errors',
                'meta' => [
                    'trace_id',
                ],
            ])
            ->assertJsonPath('success', false)
            ->assertJsonPath('status', 422)
            ->assertJsonPath('code', 'VALIDATION_ERROR')
            ->assertJsonPath('message', 'Validation failed.')
            ->assertJsonValidationErrors([
                'name',
                'email',
            ]);
    }
}
