# Use PHP-FPM on Alpine as base
FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# 1) Install system packages, Node.js & npm
RUN apk add --no-cache \
      bash \
      git \
      unzip \
      libpq \
      postgresql-client \
      postgresql-dev \
      oniguruma-dev \
      curl \
      nodejs \
      npm   \
 && docker-php-ext-install pdo pdo_pgsql mbstring

# 2) Copy Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 3) Copy application source
COPY src/ .

# 4) Entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
