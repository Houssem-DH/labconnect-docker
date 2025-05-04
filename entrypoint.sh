#!/usr/bin/env bash
set -e

# 1) Copy .env & generate APP_KEY if missing
if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi

# 2) Install PHP dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader

# 3) Install JS dependencies & build assets
npm ci --legacy-peer-deps
npm run build -- --outDir=public/build

# 4) Wait for PostgreSQL
echo "Waiting for PostgreSQL to become available..."
max_retries=10; retry_count=0
until nc -z db 5432; do
  retry_count=$((retry_count+1))
  if [ "$retry_count" -ge "$max_retries" ]; then
    echo "PostgreSQL unavailable after $max_retries attempts" >&2
    exit 1
  fi
  sleep 3
done

# 5) Run migrations
php artisan migrate
php artisan make:seeder SuperAdminSeeder





# 6) Clear & cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

# 7) Fix permissions
chown -R www-data:www-data storage/ public/build
chmod -R 775 storage/ public/build

# 8) Start PHP-FPM
echo "Starting PHP-FPM..."
exec php-fpm
