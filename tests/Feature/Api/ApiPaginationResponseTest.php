<?php

namespace Tests\Feature\Api;

class ApiPaginationResponseTest extends ApiTestCase
{
    public function test_paginated_response(): void
    {
        $this->getJson('/api/testing/paginate')
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
                    'pagination' => [
                        'current_page',
                        'last_page',
                        'per_page',
                        'total',
                        'from',
                        'to',
                        'has_more_pages',
                    ],
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('status', 200)
            ->assertJsonPath('code', 'SUCCESS')
            ->assertJsonPath('message', 'Paginated.')
            ->assertJsonPath('meta.pagination.current_page', 1)
            ->assertJsonPath('meta.pagination.last_page', 4)
            ->assertJsonPath('meta.pagination.per_page', 3)
            ->assertJsonPath('meta.pagination.total', 10)
            ->assertJsonPath('meta.pagination.from', 1)
            ->assertJsonPath('meta.pagination.to', 3)
            ->assertJsonPath('meta.pagination.has_more_pages', true);
    }
}
