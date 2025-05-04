---
seo:
  title: Laravel Rest Api:: Generate powerful Api automatically with Laravel
  description: |
    Fully integrated with Laravel, take the advantage of a 
    powerful API without destructuring your codebase. Secured and customizable, be ready to get in! 
---

:::u-page-hero
---
orientation: horizontal
---
  :::prose-pre
  ---
  code: composer require lomkit/laravel-rest-api
  filename: Terminal
  ---
  ```bash
  composer require lomkit/laravel-rest-api
  php artisan rest:quick-start
  ```
  :::

#title
Generate API in seconds.

#description
Fully integrated with Laravel, take the advantage of a powerful API without destructuring your codebase.

#links
  :::u-button
  ---
  size: xl
  to: /getting-started/installation
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  color: neutral
  icon: i-simple-icons-github
  size: xl
  target: _blank
  to: https://github.com/lomkit/laravel-rest-api
  variant: subtle
  ---
  Star on github
  :::
:::

:::u-page-section
#title
Start your next project with a powerful API

#features
  :::u-page-feature
  ---
  icon: i-simple-icons-laravel
  ---
  #title
  Laravel built-in
  
  #description
  Fully integrates with Laravel (Gates / relationships / ...)
  :::

  :::u-page-feature
  ---
  icon: i-mdi-cog-outline
  ---
  #title
  Customizable
  
  #description
  Benefit the power of full customization for your needs.
  :::

  :::u-page-feature
  ---
  icon: i-mdi-flash-outline
  ---
  #title
  Powerful
  
  #description
  The search operation gives your API consumers a lot of possibilities.
  :::

  :::u-page-feature
  ---
  icon: i-mdi-lock-outline
  ---
  #title
  Secured
  
  #description
  Control what your API exposes and avoid unwanted actions.
  :::

  :::u-page-feature
  ---
  icon: i-mdi-file-document-box-multiple-outline
  ---
  #title
  Documentation
  
  #description
  Automatic documentation generation with a single command.
  :::

  :::u-page-feature
  ---
  icon: i-mdi-call-split
  ---
  #title
  Reduce API calls
  
  #description
  The mutate endpoints allows you to operate multiple operations in a single call.
  :::
:::

:::u-page-section
---
ui:
  container: sm:py-6 lg:py-7 py-6
title: First setup
id: first-setup
---
:::

:::u-page-section
---
ui:
  container: sm:py-6 lg:py-7 py-6
title: First, define your resource
orientation: horizontal
variant: naked
links:
  - label: Configure your resource
    to: /resources/basics
    trailingIcon: i-heroicons-arrow-right-20-solid
    target: _blank
    color: neutral
    variant: outline
---
#description
:::prose-pre
---
code: php artisan rest:resource UserResource
filename: Terminal
---
```bash
php artisan rest:resource UserResource
```
:::

#default
:::prose-pre
---
filename: UserResource.php
---
```php
<?php

namespace App\Rest\Resources;

use App\Rest\Resource;

class UserResource extends Resource
{
  /**
  * The model the resource corresponds to.
  *
  * @var class-string<\Illuminate\Database\Eloquent\Model>
  */
  public static $model = \App\Models\User::class;
}
```
:::
:::

:::u-page-section
---
ui:
  container: sm:py-6 lg:py-7 py-6
title: After, create your controller
orientation: horizontal
variant: naked
reverse: true
---
#description
:::prose-pre
---
filename: Terminal
---
```bash
php artisan rest:controller UsersController
```
:::

#default
:::prose-pre
---
filename: UsersController.php
---
```php
<?php

namespace App\Rest\Controllers;

use App\Rest\Controller;

class UsersController extends Controller
{
    /**
    * Fully-qualified resource class name
    */
    public static $resource = App\Resources\UserResource::class;
}
```
:::
:::

:::u-page-section
---
ui:
  container: sm:py-6 lg:py-7 py-6
title: Finally, register the routes
orientation: horizontal
variant: naked
---
#description
:::prose-pre
---
filename: api.php
---
```php
use \Lomkit\Rest\Facades\Rest;

Rest::resource('users', \App\Rest\Controllers\UsersController::class)
```
:::

#default
:::prose-pre
---
filename: Terminal
---
```php
  +--------+----------------------------+-------------------+
  | Method | URI                        | Name              |
  +--------+----------------------------+-------------------+
  | GET    | api/users                  | api.users.details |
  | POST   | api/users/search           | api.users.search  |
  | POST   | api/users/actions/{action} | api.users.operate |
  | POST   | api/users/mutate           | api.users.mutate  |
  | DELETE | api/users                  | api.users.destroy |
  +--------+----------------------------+-------------------+
```
:::
:::

:::u-page-section
---
ui:
  container: sm:py-6 lg:py-7 py-6
orientation: horizontal
variant: naked
---
#title
Or use our <span class="text-primary">Quick Start</span>

#description
It generated all the files listed above automatically !

#default
:::prose-pre
---
filename: Terminal
---
```bash
php artisan rest:quick-start
```
:::
:::

:::u-page-section
---
ui:
  container: sm:py-6 lg:py-7 py-6
---
#links
  :::u-button
  ---
  color: primary
  size: xl
  to: /getting-started/installation
  trailingIcon: i-lucide-arrow-right
  ---
  Get started
  :::
