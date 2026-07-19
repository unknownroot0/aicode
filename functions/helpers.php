<?php
/**
 * Birthday Wishes - Helper Functions
 * 
 * Collection of reusable utility functions
 */

if (!defined('APP_ROOT')) {
    define('APP_ROOT', dirname(__DIR__));
}

require_once PATH_CONFIG . '/config.php';

/**
 * Generate CSRF Token
 */
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(CSRF_TOKEN_LENGTH));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF Token
 */
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Sanitize input data
 */
function sanitizeInput($data, $type = 'string') {
    if (is_array($data)) {
        return array_map(function($value) use ($type) {
            return sanitizeInput($value, $type);
        }, $data);
    }
    
    switch ($type) {
        case 'int':
            return filter_var($data, FILTER_SANITIZE_NUMBER_INT);
        case 'email':
            return filter_var($data, FILTER_SANITIZE_EMAIL);
        case 'url':
            return filter_var($data, FILTER_SANITIZE_URL);
        default:
            return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
}

/**
 * Validate email address
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate phone number (basic validation)
 */
function validatePhone($phone) {
    return preg_match('/^[\d\s\-\+\(\)]{10,20}$/', $phone);
}

/**
 * Get user's IP address
 */
function getUserIP() {
    $ipKeys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    
    foreach ($ipKeys as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = explode(',', $_SERVER[$key])[0];
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    
    return '0.0.0.0';
}

/**
 * Get browser name from user agent
 */
function getBrowser($userAgent) {
    $browsers = [
        'Chrome' => 'Chrome',
        'Firefox' => 'Firefox',
        'Safari' => 'Safari',
        'Edge' => 'Edge',
        'Opera' => 'Opera',
        'MSIE' => 'Internet Explorer',
        'Trident' => 'Internet Explorer'
    ];
    
    foreach ($browsers as $key => $name) {
        if (stripos($userAgent, $key) !== false) {
            return $name;
        }
    }
    
    return 'Unknown';
}

/**
 * Get operating system from user agent
 */
function getOS($userAgent) {
    $osList = [
        'Windows 10' => 'Windows NT 10.0',
        'Windows 8.1' => 'Windows NT 6.3',
        'Windows 8' => 'Windows NT 6.2',
        'Windows 7' => 'Windows NT 6.1',
        'Mac OS X' => 'Mac OS X',
        'Linux' => 'Linux',
        'Android' => 'Android',
        'iOS' => 'iPhone|iPad|iPod'
    ];
    
    foreach ($osList as $os => $pattern) {
        if (preg_match('/' . preg_quote($pattern, '/') . '/i', $userAgent)) {
            return $os;
        }
    }
    
    return 'Unknown';
}

/**
 * Get device type
 */
function getDeviceType($userAgent) {
    if (preg_match('/Mobile|Android|iPhone|iPad|iPod/i', $userAgent)) {
        return 'mobile';
    } elseif (preg_match('/Tablet|iPad/i', $userAgent)) {
        return 'tablet';
    }
    return 'desktop';
}

/**
 * Get language from headers
 */
function getLanguage() {
    if (!empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        return substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
    }
    return 'en';
}

/**
 * Get timezone from client or default
 */
function getTimezone() {
    return !empty($_SESSION['timezone']) ? $_SESSION['timezone'] : date_default_timezone_get();
}

/**
 * Rate limiting check
 */
function checkRateLimit($identifier = null) {
    $identifier = $identifier ?? getUserIP();
    $key = 'rate_limit_' . md5($identifier);
    
    $currentTime = time();
    $windowStart = $currentTime - 60; // 1 minute window
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = [];
    }
    
    // Clean old requests
    $_SESSION[$key] = array_filter($_SESSION[$key], function($timestamp) use ($windowStart) {
        return $timestamp > $windowStart;
    });
    
    // Check limit
    if (count($_SESSION[$key]) >= MAX_REQUESTS_PER_MINUTE) {
        return false;
    }
    
    // Record this request
    $_SESSION[$key][] = $currentTime;
    return true;
}

/**
 * Redirect with message
 */
function redirect($url, $message = null, $type = 'success') {
    if ($message) {
        $_SESSION['flash_message'] = $message;
        $_SESSION['flash_type'] = $type;
    }
    header("Location: " . $url);
    exit;
}

/**
 * Get flash message
 */
function getFlashMessage() {
    if (isset($_SESSION['flash_message'])) {
        $message = $_SESSION['flash_message'];
        $type = $_SESSION['flash_type'] ?? 'info';
        unset($_SESSION['flash_message'], $_SESSION['flash_type']);
        return ['message' => $message, 'type' => $type];
    }
    return null;
}

/**
 * JSON response helper
 */
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Error response helper
 */
function errorResponse($message, $status = 400) {
    jsonResponse(['success' => false, 'error' => $message], $status);
}

/**
 * Success response helper
 */
function successResponse($data = [], $message = 'Success') {
    jsonResponse(array_merge(['success' => true, 'message' => $message], $data));
}

/**
 * Log activity
 */
function logActivity($action, $details = []) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => getUserIP(),
        'action' => $action,
        'details' => $details
    ];
    
    $logFile = APP_ROOT . '/logs/activity.log';
    $logLine = json_encode($logEntry) . PHP_EOL;
    
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}

/**
 * Check if request is AJAX
 */
function isAjaxRequest() {
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

/**
 * Get referrer URL
 */
function getReferrer() {
    return $_SERVER['HTTP_REFERER'] ?? '';
}

/**
 * Format date for display
 */
function formatDate($date, $format = 'F j, Y g:i A') {
    return date($format, strtotime($date));
}

/**
 * Truncate text
 */
function truncateText($text, $length = 100, $suffix = '...') {
    if (strlen($text) <= $length) {
        return $text;
    }
    return substr($text, 0, $length) . $suffix;
}

/**
 * Generate unique ID
 */
function generateUniqueId() {
    return uniqid('bw_', true);
}
