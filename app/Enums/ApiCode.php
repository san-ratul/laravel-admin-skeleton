<?php

namespace App\Enums;

use Symfony\Component\HttpFoundation\Response;

enum ApiCode: string
{
    case SUCCESS = 'SUCCESS';
    case CREATED = 'CREATED';
    case UPDATED = 'UPDATED';
    case DELETED = 'DELETED';

    case VALIDATION_ERROR = 'VALIDATION_ERROR';
    case UNAUTHORIZED = 'UNAUTHORIZED';
    case FORBIDDEN = 'FORBIDDEN';
    case RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND';
    case CONFLICT = 'CONFLICT';
    case RATE_LIMITED = 'RATE_LIMITED';

    case SERVER_ERROR = 'SERVER_ERROR';

    public function status(): int
    {
        return match ($this) {
            self::SUCCESS, self::UPDATED, self::DELETED => Response::HTTP_OK,
            self::CREATED => Response::HTTP_CREATED,

            self::VALIDATION_ERROR => Response::HTTP_UNPROCESSABLE_ENTITY,
            self::UNAUTHORIZED => Response::HTTP_UNAUTHORIZED,
            self::FORBIDDEN => Response::HTTP_FORBIDDEN,
            self::RESOURCE_NOT_FOUND => Response::HTTP_NOT_FOUND,
            self::CONFLICT => Response::HTTP_CONFLICT,
            self::RATE_LIMITED => Response::HTTP_TOO_MANY_REQUESTS,

            self::SERVER_ERROR => Response::HTTP_INTERNAL_SERVER_ERROR,
        };
    }
}
