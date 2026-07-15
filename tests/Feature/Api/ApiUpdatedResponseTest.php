<?php

namespace Tests\Feature\Api;

class ApiUpdatedResponseTest extends ApiTestCase
{
    public function test_updated_response(): void
    {
        $this->getJson('/api/testing/updated')
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
            ->assertJsonPath('code', 'UPDATED')
            ->assertJsonPath('message', 'Updated.')
            ->assertJsonPath('data.id', 1);
    }
}
