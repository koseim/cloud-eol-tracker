/**
 * Filters Module
 * Handles search, filtering, and sorting of EOL services
 */

const Filters = {
    /**
     * Search services by text query
     * @param {Array} services - Array of service objects
     * @param {string} query - Search query
     * @returns {Array} Filtered services
     */
    searchServices(services, query) {
        if (!query || query.trim() === '') {
            return services;
        }

        const lowerQuery = query.toLowerCase().trim();

        return services.filter(service => {
            const searchableText = [
                service.serviceName,
                service.vendor,
                service.description,
                service.category,
                ...(service.tags || [])
            ].join(' ').toLowerCase();

            return searchableText.includes(lowerQuery);
        });
    },

    /**
     * Filter services by vendor
     * @param {Array} services - Array of service objects
     * @param {string} vendor - Vendor ID
     * @returns {Array} Filtered services
     */
    filterByVendor(services, vendor) {
        if (!vendor || vendor === '') {
            return services;
        }

        return services.filter(service => service.vendor === vendor);
    },

    /**
     * Filter services by category
     * @param {Array} services - Array of service objects
     * @param {string} category - Category ID
     * @returns {Array} Filtered services
     */
    filterByCategory(services, category) {
        if (!category || category === '') {
            return services;
        }

        return services.filter(service => service.category === category);
    },

    /**
     * Filter services by EOL proximity
     * @param {Array} services - Array of service objects
     * @param {string} proximity - Proximity filter value
     * @returns {Array} Filtered services
     */
    filterByEOLProximity(services, proximity) {
        if (!proximity || proximity === '') {
            return services;
        }

        if (proximity === 'upcoming') {
            // Upcoming EOL only (exclude already EOL)
            return services.filter(service =>
                service.computed.daysUntilEOL !== null &&
                service.computed.daysUntilEOL >= 0
            );
        }

        if (proximity === 'past') {
            // Already EOL
            return services.filter(service =>
                service.computed.daysUntilEOL !== null &&
                service.computed.daysUntilEOL < 0
            );
        }

        // Filter by days
        const days = parseInt(proximity, 10);
        if (isNaN(days)) {
            return services;
        }

        return services.filter(service => {
            const daysUntil = service.computed.daysUntilEOL;
            return daysUntil !== null && daysUntil >= 0 && daysUntil <= days;
        });
    },

    /**
     * Sort services by various criteria
     * @param {Array} services - Array of service objects
     * @param {string} sortBy - Sort criteria
     * @returns {Array} Sorted services
     */
    sortServices(services, sortBy) {
        const sorted = [...services];

        switch (sortBy) {
            case 'eol-date-asc':
                // Soon first (ascending - nearest EOL first)
                return sorted.sort((a, b) => {
                    if (a.computed.daysUntilEOL === null) return 1;
                    if (b.computed.daysUntilEOL === null) return -1;
                    return a.computed.daysUntilEOL - b.computed.daysUntilEOL;
                });

            case 'eol-date-desc':
                // Latest first (descending - farthest EOL first)
                return sorted.sort((a, b) => {
                    if (a.computed.daysUntilEOL === null) return 1;
                    if (b.computed.daysUntilEOL === null) return -1;
                    return b.computed.daysUntilEOL - a.computed.daysUntilEOL;
                });

            case 'name-asc':
                // Service name A-Z
                return sorted.sort((a, b) =>
                    a.serviceName.localeCompare(b.serviceName)
                );

            case 'name-desc':
                // Service name Z-A
                return sorted.sort((a, b) =>
                    b.serviceName.localeCompare(a.serviceName)
                );

            case 'vendor-asc':
                // Vendor A-Z, then service name
                return sorted.sort((a, b) => {
                    const vendorCompare = a.vendor.localeCompare(b.vendor);
                    if (vendorCompare !== 0) return vendorCompare;
                    return a.serviceName.localeCompare(b.serviceName);
                });

            default:
                return sorted;
        }
    },

    /**
     * Apply all filters and sorting
     * @param {Array} services - Array of service objects
     * @param {Object} filters - Filter configuration
     * @returns {Array} Filtered and sorted services
     */
    applyFilters(services, filters) {
        let filtered = services;

        // Apply search
        if (filters.search) {
            filtered = this.searchServices(filtered, filters.search);
        }

        // Apply vendor filter
        if (filters.vendor) {
            filtered = this.filterByVendor(filtered, filters.vendor);
        }

        // Apply category filter
        if (filters.category) {
            filtered = this.filterByCategory(filtered, filters.category);
        }

        // Apply EOL proximity filter
        if (filters.eolProximity) {
            filtered = this.filterByEOLProximity(filtered, filters.eolProximity);
        }

        // Apply sorting
        if (filters.sort) {
            filtered = this.sortServices(filtered, filters.sort);
        }

        return filtered;
    },

    /**
     * Debounce function for search input
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Get unique vendors from services
     * @param {Array} services - Array of service objects
     * @returns {Array} Array of unique vendor names
     */
    getUniqueVendors(services) {
        const vendors = new Set(services.map(s => s.vendor));
        return Array.from(vendors).sort();
    },

    /**
     * Get unique categories from services
     * @param {Array} services - Array of service objects
     * @returns {Array} Array of unique category names
     */
    getUniqueCategories(services) {
        const categories = new Set(services.map(s => s.category));
        return Array.from(categories).sort();
    }
};

// Make Filters available globally
window.Filters = Filters;
