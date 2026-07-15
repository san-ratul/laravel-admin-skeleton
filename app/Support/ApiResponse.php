<?php

namespace App\Support;

use App\Enums\ApiCode;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Request completed successfully.',
        array $meta = [],
    ): JsonResponse {
        return self::respond(ApiCode::SUCCESS, $message, $data, $meta);
    }

    public static function created(
        mixed $data = null,
        string $message = 'Resource created successfully.',
        array $meta = [],
    ): JsonResponse {
        return self::respond(ApiCode::CREATED, $message, $data, $meta);
    }

    public static function updated(
        mixed $data = null,
        string $message = 'Resource updated successfully.',
        array $meta = [],
    ): JsonResponse {
        return self::respond(ApiCode::UPDATED, $message, $data, $meta);
    }

    public static function deleted(
        string $message = 'Resource deleted successfully.',
        array $meta = [],
    ): JsonResponse {
        return self::respond(ApiCode::DELETED, $message, null, $meta);
    }

    public static function paginate(
        LengthAwarePaginator $paginator,
        mixed $data,
        string $message = 'Request completed successfully.',
        array $meta = [],
    ): JsonResponse {
        return self::respond(
            code: ApiCode::SUCCESS,
            message: $message,
            data: $data,
            meta: array_merge($meta, [
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                    'has_more_pages' => $paginator->hasMorePages(),
                ],
            ]),
        );
    }

    public static function error(
        ApiCode $code,
        string $message,
        array $errors = [],
        array $meta = [],
    ): JsonResponse {
        $meta = self::appendTraceId($meta);

        $response = [
            'success' => false,
            'status' => $code->status(),
            'code' => $code->value,
            'message' => $message,
        ];

        if (! empty($errors)) {
            $response['errors'] = $errors;
        }

        if (! empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $code->status());
    }

    protected static function respond(
        ApiCode $code,
        string $message,
        mixed $data = null,
        array $meta = [],
    ): JsonResponse {
        $meta = self::appendTraceId($meta);

        $response = [
            'success' => true,
            'status' => $code->status(),
            'code' => $code->value,
            'message' => $message,
            'data' => $data,
        ];

        if (! empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $code->status());
    }

    protected static function appendTraceId(array $meta): array
    {
        $traceId = request()->attributes->get('trace_id');

        if ($traceId) {
            $meta['trace_id'] = $traceId;
        }

        return $meta;
    }
}
