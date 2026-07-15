<?php

namespace Tests\Feature\Api;

class ApiSuccessResponseTest extends ApiTestCase
{
    public function test_success_response(): void
    {
        $this->getJson('/api/testing/success')
            ->assertOk()
            ->assertHeader('X-Trace-Id')
            ->assertJsonStructure([
                'success',
                'status',
                'code',
                'message',
                'data',
                'meta' => [
                    'trace_id',
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('status', 200)
            ->assertJsonPath('code', 'SUCCESS')
            ->assertJsonPath('message', 'Success.')
            ->assertJsonPath('data.name', 'Laravel Admin Skeleton');
    }
}
