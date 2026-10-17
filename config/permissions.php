<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Permission Registry
    |--------------------------------------------------------------------------
    |
    | This registry is the single source of truth for application
    | permissions. The `PermissionSeeder` seeds every `group.action`
    | combination defined below, and the `permission:create` command
    | follows the same `{key}.{action}` format.
    |
    | Permissions are never deleted from the admin panel. To introduce
    | new permissions permanently, add them here and re-run:
    |
    |   php artisan db:seed --class=PermissionSeeder
    |
    */

    'groups' => [
        'dashboard' => ['view'],

        'users' => ['view', 'create', 'update', 'delete'],

        'roles' => ['view', 'create', 'update', 'delete'],

        'permissions' => ['view'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Action Labels
    |--------------------------------------------------------------------------
    |
    | Human readable labels used when generating permission names.
    |
    */

    'actions' => [
        'view' => 'View',
        'create' => 'Create',
        'update' => 'Update',
        'delete' => 'Delete',
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Command Actions
    |--------------------------------------------------------------------------
    |
    | The actions created by `permission:create` when no --actions option
    | is provided. This is the "full CRUD" set.
    |
    */

    'crud_actions' => ['view', 'create', 'update', 'delete'],

    /*
    |--------------------------------------------------------------------------
    | Registrar Cache
    |--------------------------------------------------------------------------
    |
    | Permission keys are cached so the gate definitions do not hit the
    | database on every request. The cache is flushed automatically when
    | permissions change.
    |
    */

    'cache' => [
        'key' => 'admin.permissions.keys',

        'ttl' => 60 * 24, // minutes
    ],
];
