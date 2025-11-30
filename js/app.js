/**
 * Main Application Module
 * Handles application state, rendering, and user interactions
 */

const App = {
    // Application state
    state: {
        data: null,
        filteredData: [],
        filters: {
            search: '',
            vendor: '',
            category: '',
            eolProximity: 'upcoming' // Default: show only upcoming EOL
        },
        sort: 'eol-date-asc',
        view: 'cards' // 'cards' or 'table'
    },

    // DOM elements
    elements: {},

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHTML(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Initialize the application
     */
    async init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupLanguageListener();
        await this.loadData();
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            search: document.getElementById('search'),
            vendorFilter: document.getElementById('vendor-filter'),
            categoryFilter: document.getElementById('category-filter'),
            eolProximityFilter: document.getElementById('eol-proximity-filter'),
            sortBy: document.getElementById('sort-by'),
            toggleView: document.getElementById('toggle-view'),
            resultsContainer: document.getElementById('results-container'),
            resultCount: document.getElementById('result-count'),
            lastUpdated: document.getElementById('last-updated'),
            footerUpdateDate: document.getElementById('footer-update-date'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            empty: document.getElementById('empty')
        };
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search with debounce
        const debouncedSearch = Filters.debounce((value) => {
            this.state.filters.search = value;
            this.applyFiltersAndRender();
        }, CONFIG.DEBOUNCE_TIME);

        this.elements.search.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        // Filter changes
        this.elements.vendorFilter.addEventListener('change', (e) => {
            this.state.filters.vendor = e.target.value;
            this.applyFiltersAndRender();
        });

        this.elements.categoryFilter.addEventListener('change', (e) => {
            this.state.filters.category = e.target.value;
            this.applyFiltersAndRender();
        });

        this.elements.eolProximityFilter.addEventListener('change', (e) => {
            this.state.filters.eolProximity = e.target.value;
            this.applyFiltersAndRender();
        });

        // Sort changes
        this.elements.sortBy.addEventListener('change', (e) => {
            this.state.sort = e.target.value;
            this.applyFiltersAndRender();
        });

        // View toggle
        this.elements.toggleView.addEventListener('click', () => {
            this.toggleView();
        });

        // Language toggle
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                I18n.switchLanguage();
            });
        }
    },

    /**
     * Setup language change listener
     */
    setupLanguageListener() {
        window.addEventListener('languageChanged', () => {
            this.updateResultCount();
            this.updateLastUpdatedDate();
            this.updateViewToggleText();
            // Re-render cards/table to update language
            this.render();
        });
    },

    /**
     * Load data from JSON file
     */
    async loadData() {
        try {
            this.showLoading();
            this.state.data = await DataLoader.loadData();

            if (!DataLoader.validateData(this.state.data)) {
                throw new Error('Invalid data structure');
            }

            this.populateFilters();
            this.updateLastUpdatedDate();
            this.applyFiltersAndRender();
            this.hideLoading();

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError();
        }
    },

    /**
     * Populate filter dropdowns
     */
    populateFilters() {
        // Populate vendors
        this.state.data.vendors.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor.id;
            option.textContent = vendor.name;
            this.elements.vendorFilter.appendChild(option);
        });

        // Populate categories
        this.state.data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.icon} ${category.name}`;
            this.elements.categoryFilter.appendChild(option);
        });
    },

    /**
     * Apply filters and render results
     */
    applyFiltersAndRender() {
        if (!this.state.data) return;

        this.state.filteredData = Filters.applyFilters(
            this.state.data.services,
            {
                ...this.state.filters,
                sort: this.state.sort
            }
        );

        this.updateResultCount();
        this.render();
    },

    /**
     * Render results based on current view
     */
    render() {
        if (this.state.filteredData.length === 0) {
            this.showEmpty();
            return;
        }

        this.hideEmpty();
        this.hideError();

        if (this.state.view === 'cards') {
            this.renderCards();
        } else {
            this.renderTable();
        }
    },

    /**
     * Render card view
     */
    renderCards() {
        const cardsHTML = this.state.filteredData.map(service => this.createCardHTML(service)).join('');
        this.elements.resultsContainer.innerHTML = `<div class="cards-view">${cardsHTML}</div>`;
    },

    /**
     * Create HTML for a single card
     */
    createCardHTML(service) {
        const categoryInfo = this.state.data.categories.find(c => c.id === service.category);
        const categoryIcon = categoryInfo ? categoryInfo.icon : '';
        const categoryName = categoryInfo ? categoryInfo.name : service.category;

        // Check if past EOL
        const isPastEOL = service.computed.daysUntilEOL !== null && service.computed.daysUntilEOL < 0;
        const cardClass = isPastEOL ? 'card past-eol' : 'card';

        // Escape all user-generated content
        const escapedServiceName = this.escapeHTML(service.serviceName);
        const escapedVendor = this.escapeHTML(service.vendor);
        const escapedCategoryName = this.escapeHTML(categoryName);
        const escapedDescription = this.escapeHTML(service.description);
        const escapedOfficialUrl = this.escapeHTML(service.officialUrl);

        const alternativesHTML = service.alternatives && service.alternatives.length > 0
            ? `
                <div class="card-alternatives">
                    <p class="alternatives-title">${I18n.t('alternatives')}:</p>
                    <ul class="alternatives-list">
                        ${service.alternatives.map(alt => `
                            <li><a href="${this.escapeHTML(alt.url)}" target="_blank" rel="noopener">${this.escapeHTML(alt.serviceName)}</a></li>
                        `).join('')}
                    </ul>
                </div>
            `
            : '';

        return `
            <div class="${cardClass}">
                <div class="card-header">
                    <h3 class="card-title">${escapedServiceName}</h3>
                    <span class="card-vendor">${escapedVendor}</span>
                </div>

                <div class="card-meta">
                    <span class="card-category">${categoryIcon} ${escapedCategoryName}</span>
                    <span class="card-status status-${service.computed.status}">
                        ${I18n.getStatusLabel(service.computed.status)}
                    </span>
                </div>

                <p class="card-description">${escapedDescription}</p>

                <div class="card-dates">
                    <div class="card-date">
                        <span class="date-label">${I18n.t('eolDate')}:</span>
                        <span class="date-value">${I18n.formatDate(service.eolDate)}</span>
                    </div>
                    <div class="card-date">
                        <span class="date-label">${I18n.t('timeUntilEOL')}:</span>
                        <span class="date-value">${I18n.getTimeUntilEOL(service.computed.daysUntilEOL)}</span>
                    </div>
                </div>

                <div class="card-links">
                    <a href="${escapedOfficialUrl}" target="_blank" rel="noopener" class="card-link">
                        ${I18n.t('officialAnnouncement')} →
                    </a>
                </div>

                ${alternativesHTML}
            </div>
        `;
    },

    /**
     * Render table view
     */
    renderTable() {
        const rowsHTML = this.state.filteredData.map(service => this.createTableRowHTML(service)).join('');

        const tableHTML = `
            <div class="table-view">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>${I18n.t('vendor')}</th>
                            <th>${I18n.t('serviceName')}</th>
                            <th>${I18n.t('category')}</th>
                            <th>${I18n.t('eolDate')}</th>
                            <th>${I18n.t('status')}</th>
                            <th>${I18n.t('officialLink')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
            </div>
        `;

        this.elements.resultsContainer.innerHTML = tableHTML;
    },

    /**
     * Create HTML for a table row
     */
    createTableRowHTML(service) {
        const categoryInfo = this.state.data.categories.find(c => c.id === service.category);
        const categoryIcon = categoryInfo ? categoryInfo.icon : '';
        const categoryName = categoryInfo ? categoryInfo.name : service.category;

        // Check if past EOL
        const isPastEOL = service.computed.daysUntilEOL !== null && service.computed.daysUntilEOL < 0;
        const rowClass = isPastEOL ? 'past-eol' : '';

        // Escape all user-generated content
        const escapedVendor = this.escapeHTML(service.vendor);
        const escapedServiceName = this.escapeHTML(service.serviceName);
        const escapedCategoryName = this.escapeHTML(categoryName);
        const escapedOfficialUrl = this.escapeHTML(service.officialUrl);

        return `
            <tr class="${rowClass}">
                <td class="table-vendor">${escapedVendor}</td>
                <td class="table-service">${escapedServiceName}</td>
                <td class="table-category">${categoryIcon} ${escapedCategoryName}</td>
                <td class="table-date">${I18n.formatDate(service.eolDate)}</td>
                <td>
                    <span class="card-status status-${service.computed.status}">
                        ${I18n.getStatusLabel(service.computed.status)}
                    </span>
                </td>
                <td class="table-link">
                    <a href="${escapedOfficialUrl}" target="_blank" rel="noopener">${I18n.t('officialLink')} →</a>
                </td>
            </tr>
        `;
    },

    /**
     * Toggle between card and table view
     */
    toggleView() {
        this.state.view = this.state.view === 'cards' ? 'table' : 'cards';
        this.updateViewToggleText();
        this.render();
    },

    /**
     * Update view toggle button text
     */
    updateViewToggleText() {
        const viewText = this.state.view === 'cards' ? I18n.t('tableView') : I18n.t('cardView');
        const viewIcon = this.state.view === 'cards' ? '☰' : '▦';
        this.elements.toggleView.querySelector('.view-text').textContent = viewText;
        this.elements.toggleView.querySelector('.view-icon').textContent = viewIcon;
    },

    /**
     * Update result count display
     */
    updateResultCount() {
        const count = this.state.filteredData.length;
        const total = this.state.data.services.length;
        this.elements.resultCount.textContent = I18n.t('servicesCount', { count, total });
    },

    /**
     * Update last updated date
     */
    updateLastUpdatedDate() {
        const dateText = I18n.formatDate(this.state.data.lastUpdated);
        this.elements.lastUpdated.textContent = I18n.t('lastUpdated', { date: dateText });
        this.elements.footerUpdateDate.textContent = dateText;
    },

    /**
     * Show loading state
     */
    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.elements.error.classList.add('hidden');
        this.elements.empty.classList.add('hidden');
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        this.elements.loading.classList.add('hidden');
    },

    /**
     * Show error state
     */
    showError() {
        this.elements.loading.classList.add('hidden');
        this.elements.error.classList.remove('hidden');
        this.elements.empty.classList.add('hidden');
    },

    /**
     * Hide error state
     */
    hideError() {
        this.elements.error.classList.add('hidden');
    },

    /**
     * Show empty state
     */
    showEmpty() {
        this.elements.empty.classList.remove('hidden');
        this.elements.resultsContainer.innerHTML = '';
    },

    /**
     * Hide empty state
     */
    hideEmpty() {
        this.elements.empty.classList.add('hidden');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make App available globally
window.App = App;
