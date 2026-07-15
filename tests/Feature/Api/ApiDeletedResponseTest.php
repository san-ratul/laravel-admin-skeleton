<?php

namespace Tests\Feature\Api;

class ApiDeletedResponseTest extends ApiTestCase
{
    public function test_deleted_response(): void
    {
        $this->deleteJson('/api/testing/deleted')
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
            ->assertJsonPath('code', 'DELETED')
            ->assertJsonPath('message', 'Deleted.')
            ->assertJsonPath('data', null);
    }
}
