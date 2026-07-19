<?php
/**
 * Birthday Wishes - Configuration File
 * 
 * Main configuration settings for the application
 * Database connection, site settings, and constants
 */

// Prevent direct access
if (!defined('APP_ROOT')) {
    define('APP_ROOT', dirname(__DIR__));
}

// ============================================
// Database Configuration
// ============================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'birthday_wishes');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// ============================================
// Site Configuration
// ============================================
define('SITE_NAME', 'Birthday Wishes');
define('SITE_URL', 'http://localhost/birthday-wishes');
define('SITE_EMAIL', 'noreply@birthdaywishes.local');
define('SITE_DESCRIPTION', 'Generate beautiful, personalized birthday wishes for your loved ones');

// ============================================
// Security Settings
// ============================================
define('CSRF_TOKEN_LENGTH', 32);
define('SESSION_LIFETIME', 3600); // 1 hour
define('MAX_REQUESTS_PER_MINUTE', 30); // Rate limiting

// ============================================
// File Paths
// ============================================
define('PATH_CONFIG', APP_ROOT . '/config');
define('PATH_INCLUDES', APP_ROOT . '/includes');
define('PATH_FUNCTIONS', APP_ROOT . '/functions');
define('PATH_AJAX', APP_ROOT . '/ajax');
define('PATH_ADMIN', APP_ROOT . '/admin');
define('PATH_DATA', APP_ROOT . '/data');
define('PATH_ASSETS', APP_ROOT . '/assets');

// ============================================
// Categories
// ============================================
$categories = [
    'general' => 'General',
    'friend' => 'Friend',
    'best_friend' => 'Best Friend',
    'brother' => 'Brother',
    'sister' => 'Sister',
    'mother' => 'Mother',
    'father' => 'Father',
    'wife' => 'Wife',
    'husband' => 'Husband',
    'son' => 'Son',
    'daughter' => 'Daughter',
    'funny' => 'Funny',
    'inspirational' => 'Inspirational',
    'emotional' => 'Emotional',
    'religious' => 'Religious'
];

define('CATEGORIES', $categories);

// ============================================
// Session Configuration
// ============================================
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 in production with HTTPS
session_name('BW_SESSION');

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ============================================
// Error Reporting (Disable in production)
// ============================================
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 in production
ini_set('log_errors', 1);
ini_set('error_log', APP_ROOT . '/logs/error.log');

// Create logs directory if it doesn't exist
if (!is_dir(APP_ROOT . '/logs')) {
    mkdir(APP_ROOT . '/logs', 0755, true);
}

// ============================================
// Timezone
// ============================================
date_default_timezone_set('UTC');

// ============================================
// PDO Connection
// ============================================
function getPDO() {
    static $pdo = null;
    
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die("Database connection failed. Please check configuration.");
        }
    }
    
    return $pdo;
}
