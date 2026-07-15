<?php

namespace Tests\Feature\Api;

class ApiCreatedResponseTest extends ApiTestCase
{
    public function test_created_response(): void
    {
        $this->getJson('/api/testing/created')
            ->assertCreated()
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
            ->assertJsonPath('status', 201)
            ->assertJsonPath('code', 'CREATED')
            ->assertJsonPath('message', 'Created.')
            ->assertJsonPath('data.id', 1);
    }
}
