FROM php:8.2-apache

RUN apt-get update && apt-get install -y tesseract-ocr
RUN docker-php-ext-install mysqli

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html

RUN echo "upload_max_filesize=20M" >> /usr/local/etc/php/php.ini
RUN echo "post_max_size=20M" >> /usr/local/etc/php/php.ini

EXPOSE 80