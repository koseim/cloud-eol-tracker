/**
 * Data Loader Module
 * Handles loading and processing of EOL data from JSON file
 */

const DataLoader = {
    /**
     * Load EOL data from JSON file with retry logic
     * @returns {Promise<Object>} Processed data object
     */
    async loadData() {
        // Check if online
        if (!navigator.onLine) {
            throw new Error('OFFLINE: No internet connection. Please check your network.');
        }

        // Try to load from cache first
        const cachedData = this.loadFromCache();
        if (cachedData) {
            console.log('Loading data from cache');
            return cachedData;
        }

        // Fetch from server with retry
        return await this.loadWithRetry();
    },

    /**
     * Load data from cache if available and not expired
     * @returns {Object|null} Cached data or null
     */
    loadFromCache() {
        try {
            const cached = localStorage.getItem(CONFIG.CACHE_KEY);
            const timestamp = localStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY);

            if (!cached || !timestamp) {
                return null;
            }

            const now = Date.now();
            const age = now - parseInt(timestamp, 10);

            if (age > CONFIG.CACHE_DURATION) {
                // Cache expired
                this.clearCache();
                return null;
            }

            return JSON.parse(cached);
        } catch (error) {
            console.warn('Failed to load from cache:', error);
            this.clearCache();
            return null;
        }
    },

    /**
     * Save data to cache
     * @param {Object} data - Data to cache
     */
    saveToCache(data) {
        try {
            localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CONFIG.CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (error) {
            console.warn('Failed to save to cache:', error);
        }
    },

    /**
     * Clear cache
     */
    clearCache() {
        try {
            localStorage.removeItem(CONFIG.CACHE_KEY);
            localStorage.removeItem(CONFIG.CACHE_TIMESTAMP_KEY);
        } catch (error) {
            console.warn('Failed to clear cache:', error);
        }
    },

    /**
     * Load data with exponential backoff retry
     * @param {number} attempt - Current attempt number
     * @returns {Promise<Object>} Processed data
     */
    async loadWithRetry(attempt = 1) {
        try {
            const response = await fetch(CONFIG.DATA_FILE_PATH);

            if (!response.ok) {
                const errorType = response.status >= 500 ? 'SERVER_ERROR' : 'CLIENT_ERROR';
                throw new Error(`${errorType}: HTTP ${response.status}`);
            }

            const data = await response.json();
            const processedData = this.processData(data);

            // Save to cache
            this.saveToCache(processedData);

            return processedData;

        } catch (error) {
            console.error(`Failed to load EOL data (attempt ${attempt}):`, error);

            // Check if we should retry
            if (attempt < CONFIG.RETRY_ATTEMPTS) {
                const delay = CONFIG.RETRY_DELAY * Math.pow(CONFIG.RETRY_BACKOFF_MULTIPLIER, attempt - 1);
                console.log(`Retrying in ${delay}ms...`);

                await new Promise(resolve => setTimeout(resolve, delay));
                return this.loadWithRetry(attempt + 1);
            }

            // All retries failed
            throw this.createUserFriendlyError(error);
        }
    },

    /**
     * Create user-friendly error message
     * @param {Error} error - Original error
     * @returns {Error} User-friendly error
     */
    createUserFriendlyError(error) {
        const message = error.message || '';

        if (message.includes('OFFLINE')) {
            return new Error('You are offline. Please check your internet connection.');
        } else if (message.includes('SERVER_ERROR')) {
            return new Error('Server error. Please try again later.');
        } else if (message.includes('CLIENT_ERROR')) {
            return new Error('Failed to load data. Please refresh the page.');
        } else if (message.includes('JSON')) {
            return new Error('Invalid data format. Please contact support.');
        } else {
            return new Error('Failed to load data. Please refresh the page or try again later.');
        }
    },

    /**
     * Process raw data and add computed fields
     * @param {Object} data - Raw data from JSON
     * @returns {Object} Processed data with computed fields
     */
    processData(data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Process each service
        const processedServices = data.services.map(service => {
            const eolDate = service.eolDate ? new Date(service.eolDate) : null;

            // Calculate days until EOL
            let daysUntilEOL = null;
            if (eolDate) {
                const timeDiff = eolDate - today;
                daysUntilEOL = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            }

            // Determine status
            let status = CONFIG.STATUS.ACTIVE;
            if (eolDate) {
                if (daysUntilEOL < 0) {
                    status = CONFIG.STATUS.EOL;
                } else if (daysUntilEOL <= CONFIG.STATUS_THRESHOLDS.DEPRECATED) {
                    status = CONFIG.STATUS.DEPRECATED;
                }
            }

            // Urgency level for color coding
            let urgency = 'low';
            if (status === CONFIG.STATUS.EOL) {
                urgency = 'critical';
            } else if (daysUntilEOL !== null) {
                if (daysUntilEOL <= CONFIG.STATUS_THRESHOLDS.HIGH_URGENCY) {
                    urgency = 'high';
                } else if (daysUntilEOL <= CONFIG.STATUS_THRESHOLDS.MEDIUM_URGENCY) {
                    urgency = 'medium';
                }
            }

            return {
                ...service,
                computed: {
                    eolDate: eolDate,
                    daysUntilEOL: daysUntilEOL,
                    status: status,
                    urgency: urgency
                }
            };
        });

        return {
            ...data,
            services: processedServices
        };
    },


    /**
     * Validate data structure
     * @param {Object} data - Data to validate
     * @returns {boolean} True if valid
     */
    validateData(data) {
        if (!data || typeof data !== 'object') {
            console.error('Invalid data: not an object');
            return false;
        }

        if (!Array.isArray(data.services)) {
            console.error('Invalid data: services is not an array');
            return false;
        }

        if (!Array.isArray(data.vendors)) {
            console.error('Invalid data: vendors is not an array');
            return false;
        }

        if (!Array.isArray(data.categories)) {
            console.error('Invalid data: categories is not an array');
            return false;
        }

        // Validate each service has required fields
        for (const service of data.services) {
            if (!service.id || !service.vendor || !service.serviceName || !service.category) {
                console.error('Invalid service: missing required fields', service);
                return false;
            }
        }

        return true;
    }
};

// Make DataLoader available globally
window.DataLoader = DataLoader;
