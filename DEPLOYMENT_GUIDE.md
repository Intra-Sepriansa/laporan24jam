# 🚀 DEPLOYMENT GUIDE - Sistem Laporan Shift 3 Alfamart

## Prerequisites

### Server Requirements:
- PHP 8.2 or higher
- MySQL 8.0 or higher
- Node.js 18.x or higher
- Composer 2.x
- npm or pnpm

### PHP Extensions:
- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML
- GD or Imagick

---

## 🔧 Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/Intra-Sepriansa/laporan24jam.git
cd laporan24jam
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node dependencies
npm install
```

### 3. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database
Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laporan_shift
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 5. Run Migrations & Seeders
```bash
# Run migrations
php artisan migrate

# Seed database with initial data
php artisan db:seed
```

### 6. Build Frontend Assets
```bash
# For production
npm run build

# For development
npm run dev
```

### 7. Storage Link
```bash
php artisan storage:link
```

### 8. Set Permissions
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## 🌐 Web Server Configuration

### Apache (.htaccess already included)
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/laporan24jam/public

    <Directory /path/to/laporan24jam/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/laporan-error.log
    CustomLog ${APACHE_LOG_DIR}/laporan-access.log combined
</VirtualHost>
```

### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/laporan24jam/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 🔒 SSL Configuration (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## ⚙️ Optimization

### 1. Cache Configuration
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Optimize Autoloader
```bash
composer dump-autoload --optimize
```

### 3. Queue Worker (Optional)
```bash
# Install supervisor
sudo apt install supervisor

# Create supervisor config
sudo nano /etc/supervisor/conf.d/laporan-worker.conf
```

Supervisor config:
```ini
[program:laporan-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/laporan24jam/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/laporan24jam/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Start supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laporan-worker:*
```

---

## 📊 Database Backup

### Manual Backup
```bash
# Backup database
mysqldump -u username -p laporan_shift > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u username -p laporan_shift < backup_20260203.sql
```

### Automated Backup (Cron)
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * mysqldump -u username -p'password' laporan_shift > /backups/laporan_$(date +\%Y\%m\%d).sql
```

---

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Enable HTTPS/SSL
- [ ] Set proper file permissions
- [ ] Configure firewall
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Monitor error logs
- [ ] Use strong passwords
- [ ] Disable debug mode in production

---

## 📝 Environment Variables

### Production `.env`:
```env
APP_NAME="Sistem Laporan Shift 3"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laporan_shift
DB_USERNAME=your_username
DB_PASSWORD=your_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@alfamart.com"
MAIL_FROM_NAME="${APP_NAME}"
```

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=LoginTest
```

---

## 📈 Monitoring

### Laravel Telescope (Development Only)
```bash
php artisan telescope:install
php artisan migrate
```

Access at: `https://your-domain.com/telescope`

### Error Logging
Check logs at: `storage/logs/laravel.log`

---

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Update dependencies
composer install --optimize-autoloader --no-dev
npm install

# Run migrations
php artisan migrate --force

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild assets
npm run build

# Restart queue workers
php artisan queue:restart
```

---

## 🆘 Troubleshooting

### Common Issues:

**1. 500 Internal Server Error**
- Check file permissions
- Check error logs
- Clear caches
- Check .env configuration

**2. Database Connection Error**
- Verify database credentials
- Check MySQL service status
- Test database connection

**3. Assets Not Loading**
- Run `npm run build`
- Check public directory permissions
- Clear browser cache

**4. Queue Not Processing**
- Check queue worker status
- Restart supervisor
- Check database queue table

---

## 📞 Support

For issues or questions:
- Check documentation
- Review error logs
- Contact system administrator

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible via domain
- [ ] SSL certificate installed
- [ ] Database migrations completed
- [ ] Initial data seeded
- [ ] File permissions set correctly
- [ ] Caches optimized
- [ ] Queue workers running (if needed)
- [ ] Backup system configured
- [ ] Monitoring enabled
- [ ] Error logging working
- [ ] Test login functionality
- [ ] Test report creation
- [ ] Test PDF/Excel export
- [ ] Mobile responsiveness checked

---

**Deployment Complete!** 🎉

Your Sistem Laporan Shift 3 Alfamart is now live and ready to use!
