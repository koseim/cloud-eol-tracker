/**
 * Configuration Module
 * Centralized configuration constants and thresholds
 */

const CONFIG = {
    // Debounce settings
    DEBOUNCE_TIME: 300, // milliseconds

    // Viewport breakpoints
    VIEWPORT_BREAKPOINT_MOBILE: 768, // pixels
    VIEWPORT_BREAKPOINT_DESKTOP: 1024, // pixels

    // Status thresholds (in days)
    STATUS_THRESHOLDS: {
        DEPRECATED: 180, // EOL within 180 days = deprecated status
        HIGH_URGENCY: 30, // EOL within 30 days = high urgency
        MEDIUM_URGENCY: 90  // EOL within 90 days = medium urgency
    },

    // Status constants
    STATUS: {
        ACTIVE: 'active',
        DEPRECATED: 'deprecated',
        EOL: 'eol'
    },

    // Data settings
    DATA_FILE_PATH: 'data/eol-data.json',

    // Cache settings
    CACHE_KEY: 'eol-data-cache',
    CACHE_TIMESTAMP_KEY: 'eol-data-cache-timestamp',
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

    // Retry settings
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // milliseconds
    RETRY_BACKOFF_MULTIPLIER: 2
};

// Make CONFIG available globally
window.CONFIG = CONFIG;
