# Birthday Wishes - Premium Birthday Message Generator

A production-ready, modern birthday wishes website that generates unique, personalized birthday messages using an intelligent sentence-library system. Built with PHP 8+, MySQL (PDO), HTML5, CSS3, and Vanilla JavaScript.

![Birthday Wishes](https://img.shields.io/badge/PHP-8+-blue.svg) ![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange.svg) ![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🎯 Overview

Birthday Wishes is a sophisticated message generation platform that creates millions of unique birthday combinations without storing complete messages. Instead, it uses a modular sentence-library architecture where each category contains separate arrays for greetings, body paragraphs, and endings.

### Key Features

- **Sentence-Library System**: Generates unique wishes by combining sentences from 5 parts (Greeting + Body 1 + Body 2 + Body 3 + Ending)
- **15 Categories**: General, Friend, Best Friend, Brother, Sister, Mother, Father, Wife, Husband, Son, Daughter, Funny, Inspirational, Emotional, Religious
- **No Repeat Algorithm**: Tracks used sentences per session to ensure variety
- **Modern UI**: Glassmorphism cards, beautiful gradients, floating balloons, confetti animations
- **Dark/Light Mode**: Theme switcher with persistent preference
- **AJAX-Powered**: Smooth wish generation without page reloads
- **Social Features**: Copy to clipboard, Web Share API, Print support, Favorites system
- **Analytics**: Tracks user device info, browser, OS, timezone, screen resolution
- **Admin Dashboard**: View statistics, manage wishes, monitor usage
- **SEO Optimized**: Open Graph tags, JSON-LD structured data, sitemap.xml, robots.txt
- **Security**: CSRF protection, PDO prepared statements, input validation, rate limiting

## 🏗️ Project Architecture

### Folder Structure

```
birthday-wishes/
├── config/                 # Configuration files
│   ├── config.php          # Database connection, site settings, constants
│   └── database.sql        # Database schema and initial data
│
├── includes/               # Reusable PHP includes
│   ├── header.php          # HTML head, navigation, theme switcher
│   ├── footer.php          # Footer, scripts, modals
│   └── auth_check.php      # Admin authentication middleware
│
├── functions/              # Core PHP functions
│   ├── helpers.php         # Utility functions (CSRF, validation, rate limiting)
│   └── wish_generator.php  # WishGenerator class - core generation engine
│
├── ajax/                   # AJAX request handlers
│   ├── generate_wish.php   # Handle wish generation requests
│   ├── save_favorite.php   # Save wish to favorites
│   ├── remove_favorite.php # Remove from favorites
│   └── load_favorites.php  # Load user's favorites
│
├── admin/                  # Admin dashboard
│   ├── index.php           # Dashboard home with statistics
│   ├── login.php           # Admin login page
│   ├── logout.php          # Admin logout handler
│   ├── wishes.php          # View all generated wishes
│   ├── favorites.php       # View all favorited wishes
│   └── users.php           # View user analytics
│
├── data/                   # Sentence libraries by category
│   ├── general/            # General category sentences
│   │   ├── intro.php       # Greeting sentences
│   │   ├── body1.php       # First body paragraph options
│   │   ├── body2.php       # Second body paragraph options
│   │   ├── body3.php       # Third body paragraph options
│   │   └── ending.php      # Closing sentences
│   ├── friend/             # Friend-specific sentences
│   ├── best_friend/        # Best friend sentences
│   ├── brother/            # Brother sentences
│   ├── sister/             # Sister sentences
│   ├── mother/             # Mother sentences
│   ├── father/             # Father sentences
│   ├── wife/               # Wife sentences
│   ├── husband/            # Husband sentences
│   ├── son/                # Son sentences
│   ├── daughter/           # Daughter sentences
│   ├── funny/              # Humorous sentences
│   ├── inspirational/      # Motivational sentences
│   ├── emotional/          # Heartfelt sentences
│   └── religious/          # Faith-based sentences
│
├── assets/                 # Static resources
│   ├── css/
│   │   ├── style.css       # Main stylesheet with glassmorphism, animations
│   │   ├── dark-mode.css   # Dark theme overrides
│   │   └── print.css       # Print-specific styles
│   ├── js/
│   │   ├── main.js         # Core JavaScript (theme, animations)
│   │   ├── wish-generator.js # AJAX wish generation logic
│   │   ├── confetti.js     # Confetti animation engine
│   │   └── balloons.js     # Floating balloon animations
│   └── images/
│       ├── logo.png        # Site logo
│       ├── favicon.ico     # Browser favicon
│       └── og-image.png    # Social sharing image
│
├── logs/                   # Application logs (auto-created)
│   ├── error.log           # PHP error logs
│   └── activity.log        # User activity tracking
│
├── index.php               # Homepage - main wish generator interface
├── favorites.php           # User favorites page
├── about.php               # About page
├── privacy.php             # Privacy policy
├── terms.php               # Terms of service
├── robots.txt              # Search engine crawling rules
├── sitemap.xml             # XML sitemap for SEO
├── .htaccess               # Apache URL rewriting and security
└── README.md               # This documentation file
```

## 🛠️ Technology Stack

### Backend
- **PHP 8+**: Modern PHP with strict typing and performance optimizations
- **MySQL 5.7+ / MariaDB 10.2+**: Relational database with UTF8MB4 support
- **PDO (PHP Data Objects)**: Secure database access with prepared statements
- **Native Sessions**: PHP session management for user tracking

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, flexbox, grid, animations, glassmorphism
- **Vanilla JavaScript**: ES6+ modules, no framework dependencies
- **Fetch API**: Native AJAX requests for async operations
- **Web Animations API**: Smooth confetti and balloon effects

### Security
- **CSRF Tokens**: Session-based cross-site request forgery protection
- **Prepared Statements**: SQL injection prevention via PDO
- **Input Validation**: Server-side sanitization and validation
- **Rate Limiting**: Session-based request throttling (30 req/min)
- **XSS Protection**: Output escaping with htmlspecialchars()
- **Secure Headers**: HTTP security headers via .htaccess

### DevOps
- **Git**: Version control
- **Composer**: PHP dependency management (optional)
- **Docker**: Containerization support (docker-compose.yml)

## 📋 Prerequisites

- **PHP**: 8.0 or higher
- **MySQL**: 5.7+ or MariaDB 10.2+
- **Web Server**: Apache 2.4+ with mod_rewrite OR Nginx
- **Browser**: Modern browser with ES6 support (Chrome 80+, Firefox 75+, Safari 13+)
- **Extensions**: pdo_mysql, mbstring, json (typically enabled by default)

## 🚀 Installation & Setup

### Step 1: Clone or Download

```bash
cd /var/www/html
# If using Git
git clone <repository-url> birthday-wishes
cd birthday-wishes

# Or extract archive
unzip birthday-wishes.zip
cd birthday-wishes
```

### Step 2: Database Setup

1. **Create Database and User** (via phpMyAdmin or MySQL CLI):

```sql
CREATE DATABASE birthday_wishes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bw_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON birthday_wishes.* TO 'bw_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Import Schema**:

```bash
mysql -u bw_user -p birthday_wishes < config/database.sql
```

Or import via phpMyAdmin:
- Select `birthday_wishes` database
- Click "Import" tab
- Upload `config/database.sql`

### Step 3: Configure Environment

Edit `config/config.php`:

```php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'birthday_wishes');
define('DB_USER', 'bw_user');        // Change from 'root'
define('DB_PASS', 'your_secure_password'); // Set your password
define('DB_CHARSET', 'utf8mb4');

// Site Configuration
define('SITE_URL', 'https://yourdomain.com'); // Update to your domain
define('SITE_EMAIL', 'noreply@yourdomain.com');

// Security (Production)
ini_set('session.cookie_secure', 1);  // Enable for HTTPS
ini_set('display_errors', 0);         // Disable error display
```

### Step 4: Set Permissions

```bash
# Create logs directory
mkdir -p logs
chmod 755 logs

# Ensure web server can write
chown -R www-data:www-data /var/www/html/birthday-wishes
chmod -R 755 /var/www/html/birthday-wishes
```

### Step 5: Configure Web Server

#### Apache (.htaccess included)

Ensure mod_rewrite is enabled:

```bash
a2enmod rewrite
systemctl restart apache2
```

Verify `.htaccess` is allowed in Apache config:

```apache
<Directory /var/www/html/birthday-wishes>
    AllowOverride All
    Require all granted
</Directory>
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/birthday-wishes;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.0-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

### Step 6: Change Default Admin Password

**IMPORTANT**: The default admin credentials are:
- Username: `admin`
- Password: `admin123`

Change immediately after first login or update hash in database:

```sql
UPDATE admin_users 
SET password_hash = '$2y$10$YOUR_NEW_HASH_HERE' 
WHERE username = 'admin';
```

Generate new hash with PHP:
```php
echo password_hash('your_new_password', PASSWORD_DEFAULT);
```

### Step 7: Verify Installation

Visit `http://yourdomain.com/birthday-wishes/` and:
1. Generate a test wish
2. Try copy, share, and favorite features
3. Check admin dashboard at `/admin/`
4. Verify dark/light mode toggle
5. Test on mobile device

## 🔧 Configuration Options

### Environment Variables (Optional)

For advanced configurations, you can create a `.env` file (requires additional setup):

```env
# Database
DB_HOST=localhost
DB_NAME=birthday_wishes
DB_USER=bw_user
DB_PASS=secure_password

# Site
SITE_NAME=Birthday Wishes
SITE_URL=https://yourdomain.com
SITE_EMAIL=noreply@yourdomain.com

# Security
CSRF_TOKEN_LENGTH=32
SESSION_LIFETIME=3600
MAX_REQUESTS_PER_MINUTE=30

# Features
ENABLE_ANALYTICS=true
ENABLE_FAVORITES=true
ENABLE_SHARE=true
```

### Config.php Constants Reference

| Constant | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL server hostname | `localhost` |
| `DB_NAME` | Database name | `birthday_wishes` |
| `DB_USER` | Database username | `root` |
| `DB_PASS` | Database password | `` (empty) |
| `SITE_NAME` | Website title | `Birthday Wishes` |
| `SITE_URL` | Base URL | `http://localhost/birthday-wishes` |
| `CSRF_TOKEN_LENGTH` | CSRF token byte length | `32` |
| `SESSION_LIFETIME` | Session timeout (seconds) | `3600` |
| `MAX_REQUESTS_PER_MINUTE` | Rate limit threshold | `30` |

## 🎨 Feature Documentation

### Wish Generation Engine

The `WishGenerator` class (`functions/wish_generator.php`) is the core of the application:

```php
class WishGenerator {
    private $category;      // Selected category
    private $name;          // Optional recipient name
    private $usedSentences; // Session-tracked used sentences
    private $parts = ['intro', 'body1', 'body2', 'body3', 'ending'];
    
    public function generate();      // Generate complete wish
    public function reset();         // Reset used sentences
    public static function getCategories(); // Get all categories
}
```

**Generation Flow**:
1. User selects category and optional name
2. AJAX request sent to `ajax/generate_wish.php`
3. WishGenerator loads sentences from category folder
4. Each part (intro, body1-3, ending) selects random unused sentence
5. Sentences assembled with name personalization
6. Result stored in `wishes_generated` table
7. JSON response sent to frontend
8. Confetti animation triggers on success

**No-Repeat Algorithm**:
- Tracks used sentences in `$_SESSION['used_sentences_{category}']`
- Filters out previously used sentences before selection
- Resets automatically when all sentences exhausted
- Limited to 500 stored sentences to prevent memory issues

### Categories System

Each category folder contains 5 PHP files returning sentence arrays:

```php
// data/friend/intro.php
<?php
return [
    "Happy Birthday, [Name]! 🎉",
    "Wishing my amazing friend the best day ever! 🎂",
    // ... more sentences
];
```

**Placeholder Variables**:
- `[Name]` / `[name]` - Replaced with user-provided name
- If no name provided, replaced with "friend" or removed

**Combination Math**:
With ~20 sentences per part × 15 categories:
- Per category: 20^5 = 3.2 million combinations
- Total possible: 15 × 3.2M = **48 million unique wishes**

### User Analytics

The system automatically captures:

| Field | Source | Description |
|-------|--------|-------------|
| `ip_address` | `$_SERVER` | User's IP (respects proxies) |
| `browser` | User-Agent parsing | Chrome, Firefox, Safari, etc. |
| `operating_system` | User-Agent parsing | Windows, macOS, Linux, iOS, Android |
| `device_type` | User-Agent parsing | desktop, tablet, mobile |
| `screen_resolution` | JavaScript | Screen width × height |
| `language` | Accept-Language header | User's browser language |
| `timezone` | JavaScript | User's local timezone |
| `referrer` | HTTP Referer | Traffic source |
| `user_agent` | `$_SERVER` | Full user agent string |

**Privacy Note**: Add user consent notice before collecting analytics data (required for GDPR/CCPA compliance).

### Frontend Components

#### Theme Switcher
- Toggles between light/dark modes
- Saves preference in localStorage
- Applies CSS custom properties dynamically
- Smooth transition animations

#### Confetti Engine (`assets/js/confetti.js`)
- Canvas-based particle system
- Triggered on successful wish generation
- Customizable colors, count, duration
- Performance-optimized with requestAnimationFrame

#### Balloon Animations (`assets/js/balloons.js`)
- CSS + JavaScript floating balloons
- Random positions and speeds
- Click-to-pop interaction
- Auto-cleanup after animation

#### AJAX Wish Generation
```javascript
// Simplified flow
async function generateWish(category, name) {
    const response = await fetch('/ajax/generate_wish.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, name, csrf_token })
    });
    const data = await response.json();
    if (data.success) {
        displayWish(data.wish);
        triggerConfetti();
    }
}
```

### Copy, Share, Print Features

**Copy to Clipboard**:
```javascript
navigator.clipboard.writeText(wishText)
    .then(() => showNotification('Copied!'))
    .catch(err => console.error('Copy failed:', err));
```

**Web Share API**:
```javascript
if (navigator.share) {
    navigator.share({
        title: 'Birthday Wish',
        text: wishText,
        url: window.location.href
    });
}
```

**Print Support**:
- Dedicated `print.css` stylesheet
- Hides non-essential elements
- Formats wish for paper/PDF
- Triggered via `window.print()`

### Favorites System

**Database**: `favorites` table stores user favorites

**Flow**:
1. User clicks heart icon on generated wish
2. AJAX POST to `ajax/save_favorite.php`
3. Stored with user_id (from session/IP)
4. Retrieve via `favorites.php` page
5. Remove with `ajax/remove_favorite.php`

**Anonymous Users**: Favorites tied to IP/session
**Registered Users**: (Future) Tie to user account

## 🗄️ Database Structure

### Tables Overview

#### `users` - Visitor Information
```sql
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  browser VARCHAR(50) DEFAULT NULL,
  operating_system VARCHAR(50) DEFAULT NULL,
  language VARCHAR(20) DEFAULT NULL,
  timezone VARCHAR(50) DEFAULT NULL,
  device_type VARCHAR(20) DEFAULT NULL,
  screen_resolution VARCHAR(20) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  referrer VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes**: `ip_address`, `created_at`

#### `wishes_generated` - Generated Wishes Log
```sql
CREATE TABLE wishes_generated (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED DEFAULT NULL,
  category VARCHAR(50) NOT NULL,
  wish_text TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Indexes**: `user_id`, `category`, `generated_at`

#### `favorites` - User Favorite Wishes
```sql
CREATE TABLE favorites (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED DEFAULT NULL,
  wish_text TEXT NOT NULL,
  category VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Indexes**: `user_id`, `created_at`

#### `admin_users` - Admin Authentication
```sql
CREATE TABLE admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL DEFAULT NULL
);
```

**Default Admin**:
- Username: `admin`
- Password: `admin123` (hash: `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`)
- **CHANGE IMMEDIATELY!**

#### `wish_statistics` - Analytics View
```sql
CREATE VIEW wish_statistics AS
SELECT 
    category,
    COUNT(*) as total_wishes,
    DATE(generated_at) as wish_date
FROM wishes_generated
GROUP BY category, DATE(generated_at);
```

### Entity Relationship

```
users (1) ----< (N) wishes_generated
users (1) ----< (N) favorites
```

### Query Examples

**Most Popular Categories**:
```sql
SELECT category, COUNT(*) as count 
FROM wishes_generated 
GROUP BY category 
ORDER BY count DESC 
LIMIT 10;
```

**Daily Wish Count**:
```sql
SELECT DATE(generated_at) as date, COUNT(*) as wishes
FROM wishes_generated
GROUP BY DATE(generated_at)
ORDER BY date DESC;
```

**Device Distribution**:
```sql
SELECT device_type, COUNT(*) as count
FROM users
GROUP BY device_type;
```

## 🔐 Authentication & Authorization

### Admin Authentication Flow

1. **Login** (`admin/login.php`):
   - POST username/password
   - Verify against `admin_users` table
   - Use `password_verify()` for hash comparison
   - Set `$_SESSION['admin_logged_in'] = true`
   - Redirect to dashboard

2. **Session Middleware** (`includes/auth_check.php`):
   ```php
   if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
       redirect('/admin/login.php');
   }
   ```

3. **Logout** (`admin/logout.php`):
   - Destroy session
   - Redirect to login

### Security Measures

- **Password Hashing**: bcrypt via `password_hash()` and `password_verify()`
- **Session Security**: HttpOnly cookies, secure flag (HTTPS), regeneration on login
- **CSRF Protection**: Token validation on all state-changing requests
- **Brute Force Prevention**: Rate limiting (30 requests/minute per IP)

## 🌐 API Documentation

### AJAX Endpoints

All AJAX endpoints return JSON responses:

#### POST `/ajax/generate_wish.php`

Generate a new birthday wish.

**Request**:
```json
{
    "csrf_token": "abc123...",
    "category": "friend",
    "name": "John"
}
```

**Response (Success)**:
```json
{
    "success": true,
    "message": "Wish generated successfully",
    "data": {
        "wish_id": 12345,
        "wish_text": "Happy Birthday, John! 🎉 May this year bring you...",
        "category": "friend"
    }
}
```

**Response (Error)**:
```json
{
    "success": false,
    "error": "Invalid category"
}
```

#### POST `/ajax/save_favorite.php`

Save a wish to favorites.

**Request**:
```json
{
    "csrf_token": "abc123...",
    "wish_text": "Happy Birthday...",
    "category": "friend"
}
```

#### POST `/ajax/remove_favorite.php`

Remove a wish from favorites.

**Request**:
```json
{
    "csrf_token": "abc123...",
    "favorite_id": 42
}
```

#### GET `/ajax/load_favorites.php`

Load user's favorite wishes.

**Response**:
```json
{
    "success": true,
    "data": {
        "favorites": [
            {
                "id": 42,
                "wish_text": "...",
                "category": "friend",
                "created_at": "2024-01-15 10:30:00"
            }
        ]
    }
}
```

### Rate Limiting

- **Limit**: 30 requests per minute per IP
- **Storage**: Session-based tracking
- **Response on Exceed**: HTTP 429 Too Many Requests

```json
{
    "success": false,
    "error": "Rate limit exceeded. Please try again later."
}
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 992px) { /* Desktops */ }
@media (min-width: 1200px) { /* Large screens */ }
```

### Mobile Optimizations

- Touch-friendly button sizes (minimum 44×44px)
- Collapsible navigation menu
- Optimized font sizes for readability
- Reduced animation complexity on low-power devices
- Viewport meta tag for proper scaling

## 🔍 SEO Implementation

### Meta Tags

```html
<meta name="description" content="Generate beautiful, personalized birthday wishes for your loved ones">
<meta name="keywords" content="birthday wishes, birthday messages, greeting cards, birthday quotes">
<meta name="robots" content="index, follow">
<meta name="author" content="Birthday Wishes">
```

### Open Graph (Social Sharing)

```html
<meta property="og:title" content="Birthday Wishes - Generate Perfect Birthday Messages">
<meta property="og:description" content="Create unique, personalized birthday wishes in seconds">
<meta property="og:image" content="/assets/images/og-image.png">
<meta property="og:url" content="https://yourdomain.com">
<meta property="og:type" content="website">
```

### JSON-LD Structured Data

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Birthday Wishes",
    "description": "Generate beautiful birthday wishes",
    "url": "https://yourdomain.com",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "All"
}
</script>
```

### robots.txt

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /ajax/
Disallow: /logs/
Sitemap: https://yourdomain.com/sitemap.xml
```

### sitemap.xml

Auto-generated or manual XML sitemap listing all public pages with priority and change frequency.

## 🚀 Deployment Guide

### Production Checklist

- [ ] Update `config.php` with production database credentials
- [ ] Set `display_errors = 0` in config
- [ ] Enable `session.cookie_secure = 1` (HTTPS only)
- [ ] Change default admin password
- [ ] Set up SSL certificate (Let's Encrypt recommended)
- [ ] Configure proper file permissions
- [ ] Enable gzip compression
- [ ] Set up caching headers
- [ ] Create database backup strategy
- [ ] Set up log rotation
- [ ] Configure error monitoring (optional)
- [ ] Add GDPR/privacy consent banner
- [ ] Test all features on production

### Docker Deployment

If `docker-compose.yml` is available:

```bash
docker-compose up -d
```

Configuration:
- PHP container with Apache/Nginx
- MySQL/MariaDB container
- Volume mounts for persistence
- Environment variables for configuration

### Continuous Deployment (Optional)

Example GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.0.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
```

### Performance Optimization

1. **Enable OPcache**:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
```

2. **Database Indexes**: Already configured in schema

3. **Static Asset Caching** (.htaccess):
```apache
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

4. **Gzip Compression**:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
</IfModule>
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Wish generation works for all 15 categories
- [ ] No repeat algorithm prevents duplicate sentences
- [ ] Name personalization works correctly
- [ ] Copy to clipboard functionality
- [ ] Web Share API on supported devices
- [ ] Print layout renders correctly
- [ ] Favorites save and load properly
- [ ] Dark/light mode toggle persists
- [ ] Animations (confetti, balloons) work smoothly
- [ ] Mobile responsive design
- [ ] Admin login/logout
- [ ] Admin dashboard statistics accurate
- [ ] Rate limiting activates after 30 requests/minute
- [ ] CSRF protection blocks invalid tokens
- [ ] SQL injection attempts blocked

### Automated Testing (Future Enhancement)

Consider implementing:
- PHPUnit for backend unit tests
- Selenium/Cypress for E2E testing
- Lighthouse for performance auditing

## 📝 Code Style & Contribution Guidelines

### PHP Coding Standards

Follow PSR-12 coding standards:

```php
<?php
/**
 * Function documentation block
 */
function exampleFunction($param1, $param2) {
    if ($param1 === null) {
        return false;
    }
    
    return $param1 . $param2;
}
```

**Key Rules**:
- Use 4 spaces for indentation
- Opening braces on same line for functions/classes
- Strict typing where possible (`declare(strict_types=1);`)
- Meaningful variable names
- Comment complex logic

### JavaScript Standards

ES6+ with modern practices:

```javascript
// Use const/let instead of var
const MAX_RETRIES = 3;
let attemptCount = 0;

// Arrow functions for callbacks
const processWish = (wish) => {
    return wish.trim();
};

// Async/await for promises
async function fetchWish() {
    try {
        const response = await fetch('/ajax/generate_wish.php');
        return await response.json();
    } catch (error) {
        console.error('Failed:', error);
    }
}
```

### CSS Standards

```css
/* BEM-like naming convention */
.wish-card { }
.wish-card__content { }
.wish-card__content--highlighted { }

/* Use CSS custom properties */
:root {
    --primary-color: #6366f1;
    --glass-bg: rgba(255, 255, 255, 0.1);
}

/* Mobile-first media queries */
.button { }
@media (min-width: 768px) {
    .button { }
}
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/new-category

# Commit with clear messages
git commit -m "feat: add romantic category with 100 sentences"

# Pull request process
git push origin feature/new-category
# Create PR on GitHub/GitLab
```

### Contributing

1. Fork the repository
2. Create feature branch
3. Make changes following code standards
4. Test thoroughly
5. Submit pull request with description
6. Code review by maintainer
7. Merge to main branch

## ⚠️ Known Limitations & Issues

### Current Limitations

1. **No User Registration**: Favorites tied to session/IP, lost on cookie clear
2. **Limited Languages**: English only (architecture supports i18n)
3. **No Email/SMS**: Cannot send wishes directly
4. **Single Image Upload**: No custom card creation
5. **Basic Analytics**: No advanced reporting or charts
6. **No API**: Internal AJAX only, no public REST API
7. **Session-Based Rate Limiting**: Resets on session clear

### Known Issues

| Issue | Severity | Workaround | Status |
|-------|----------|------------|--------|
| Confetti heavy on low-end devices | Low | Reduce particle count | Identified |
| Share API not supported on desktop Firefox | Low | Fallback to copy | Documented |
| Session timeout loses favorites | Medium | Implement localStorage backup | Planned |
| No full-text search for wishes | Low | Category filtering only | Backlog |

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Wish Generation | ✅ | ✅ | ✅ | ✅ |
| Confetti | ✅ 70+ | ✅ 68+ | ✅ 13+ | ✅ 79+ |
| Web Share API | ✅ | ❌ | ✅ | ✅ |
| Clipboard API | ✅ 66+ | ✅ 63+ | ✅ 13.1+ | ✅ 79+ |
| Dark Mode (auto) | ✅ 76+ | ✅ 67+ | ✅ 12.1+ | ✅ 79+ |

## 🚀 Future Enhancements

### Planned Features

1. **User Accounts**: Registration, login, persistent favorites
2. **Email Delivery**: Send wishes via email with custom templates
3. **SMS Integration**: Twilio integration for text messages
4. **Custom Cards**: Upload photos, create visual cards
5. **Scheduled Wishes**: Set reminders for future birthdays
6. **Multi-Language**: i18n support for global audience
7. **Social Login**: Google, Facebook authentication
8. **Advanced Analytics**: Charts, trends, insights
9. **Public API**: RESTful API for third-party integrations
10. **Mobile App**: React Native or Flutter app
11. **Voice Messages**: Text-to-speech audio wishes
12. **Video Greetings**: Short video message creation

### Technical Improvements

- [ ] Implement caching layer (Redis/Memcached)
- [ ] Add queue system for email sending
- [ ] Migrate to MVC framework (Laravel/Symfony)
- [ ] Add unit and integration tests
- [ ] Implement CI/CD pipeline
- [ ] Add monitoring (Sentry, New Relic)
- [ ] Optimize database queries with query profiling
- [ ] Add CDN integration for static assets
- [ ] Implement service worker for offline support
- [ ] Add A/B testing framework

### Content Expansion

- [ ] 50+ new categories (colleagues, teachers, neighbors)
- [ ] Occasion-based wishes (anniversary, graduation, wedding)
- [ ] Cultural/religious variations
- [ ] Age-specific messages (kids, teens, seniors)
- [ ] Profession-based wishes (doctors, engineers, artists)

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Birthday Wishes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Support & Contact

- **Documentation**: This README file
- **Issues**: GitHub Issues (if hosted on GitHub)
- **Email**: noreply@birthdaywishes.local (update in config)
- **Community Forum**: (To be implemented)

## 🙏 Acknowledgments

- Icons: FontAwesome / Material Icons
- Fonts: Google Fonts (Poppins, Inter)
- Inspiration: Various greeting card websites
- Community: Open-source contributors

---

**Built with ❤️ using PHP, MySQL, HTML5, CSS3, and Vanilla JavaScript**

*Last Updated: January 2024*
