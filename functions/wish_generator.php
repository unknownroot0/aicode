<?php
/**
 * Birthday Wishes - Wish Generation Engine
 * 
 * Core engine for generating unique birthday wishes
 * using sentence library system
 */

if (!defined('APP_ROOT')) {
    define('APP_ROOT', dirname(__DIR__));
}

require_once PATH_CONFIG . '/config.php';

class WishGenerator {
    
    private $category;
    private $name;
    private $usedSentences = [];
    private $sessionKey = 'used_sentences_';
    
    // Sentence parts structure
    private $parts = ['intro', 'body1', 'body2', 'body3', 'ending'];
    
    /**
     * Constructor
     */
    public function __construct($category = 'general', $name = null) {
        $this->category = strtolower($category);
        $this->name = $name;
        
        // Initialize session key for tracking used sentences
        if (!isset($_SESSION[$this->sessionKey . $this->category])) {
            $_SESSION[$this->sessionKey . $this->category] = [];
        }
        $this->usedSentences = &$_SESSION[$this->sessionKey . $this->category];
    }
    
    /**
     * Generate a complete wish
     */
    public function generate() {
        $wish = [];
        
        foreach ($this->parts as $part) {
            $sentence = $this->getSentence($part);
            if ($sentence) {
                $wish[] = $sentence;
            }
        }
        
        return $this->assembleWish($wish);
    }
    
    /**
     * Get a random sentence from a specific part
     */
    private function getSentence($part) {
        $sentences = $this->loadSentences($part);
        
        if (empty($sentences)) {
            return null;
        }
        
        // Filter out used sentences
        $available = array_diff($sentences, $this->usedSentences);
        
        // If all sentences used, reset and start fresh
        if (empty($available)) {
            $this->usedSentences = [];
            $available = $sentences;
        }
        
        // Pick random sentence
        $randomKey = array_rand($available);
        $sentence = $available[$randomKey];
        
        // Mark as used
        $this->usedSentences[] = $sentence;
        
        // Limit stored sentences to prevent memory issues
        if (count($this->usedSentences) > 500) {
            array_shift($this->usedSentences);
        }
        
        return $sentence;
    }
    
    /**
     * Load sentences from file
     */
    private function loadSentences($part) {
        $filePath = PATH_DATA . "/{$this->category}/{$part}.php";
        
        if (!file_exists($filePath)) {
            // Fallback to general category if specific category file doesn't exist
            $filePath = PATH_DATA . "/general/{$part}.php";
        }
        
        if (!file_exists($filePath)) {
            return [];
        }
        
        $sentences = include $filePath;
        
        if (!is_array($sentences)) {
            return [];
        }
        
        return $sentences;
    }
    
    /**
     * Assemble the wish from parts
     */
    private function assembleWish($parts) {
        $wish = implode(" ", $parts);
        
        // Personalize with name if provided
        if ($this->name) {
            $wish = str_replace('[Name]', $this->name, $wish);
            $wish = str_replace('[name]', $this->name, $wish);
        } else {
            $wish = str_replace('[Name], ', '', $wish);
            $wish = str_replace('[name], ', '', $wish);
            $wish = str_replace('[Name]', 'friend', $wish);
            $wish = str_replace('[name]', 'friend', $wish);
        }
        
        return trim($wish);
    }
    
    /**
     * Reset used sentences for this category
     */
    public function reset() {
        $this->usedSentences = [];
        $_SESSION[$this->sessionKey . $this->category] = [];
    }
    
    /**
     * Get available categories
     */
    public static function getCategories() {
        return CATEGORIES;
    }
    
    /**
     * Check if category exists
     */
    public static function categoryExists($category) {
        return isset(CATEGORIES[strtolower($category)]);
    }
}
